export const prerender = false;

import type { APIRoute } from "astro";
import { parseProductForm, isSlugTakenError } from "@/lib/product-form";

// Nombre del bucket de Storage para imágenes de producto.
// (mismo valor que el handler de upload en `./[id]/images.ts`)
const STORAGE_BUCKET = "product-images";

function redirectTo(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

/**
 * Despachador: los forms HTML solo soportan GET y POST. Usamos un hidden
 * input `_method=PUT` o `_method=DELETE` para indicar la operación real.
 * Si el método no viene, asumimos PUT (caso del form de edición).
 */
export const POST: APIRoute = async (context) => {
  const { request } = context;
  const formData = await request.clone().formData();
  const method = formData.get("_method")?.toString().toUpperCase();

  if (method === "DELETE") return handleDelete(context, formData);
  return handleUpdate(context, formData);
};

async function handleUpdate(
  context: Parameters<APIRoute>[0],
  formData: FormData,
): Promise<Response> {
  const { locals, params } = context;
  const id = params.id;

  if (locals.user === null) return redirectTo("/admin/login");
  if (id === undefined) return redirectTo("/admin/productos");

  const parsed = parseProductForm(formData);
  if (!parsed.ok) {
    return redirectTo(`/admin/productos/${id}?error=${parsed.reason}`);
  }

  const { error } = await locals.supabase
    .from("products")
    .update(parsed.data)
    .eq("id", id);

  if (error !== null) {
    if (isSlugTakenError(error)) {
      return redirectTo(`/admin/productos/${id}?error=slug_taken`);
    }
    console.error("[admin/products/update] Error:", error);
    return redirectTo(`/admin/productos/${id}?error=server`);
  }

  return redirectTo("/admin/productos?updated=1");
}

async function handleDelete(
  context: Parameters<APIRoute>[0],
  _formData: FormData,
): Promise<Response> {
  const { locals, params } = context;
  const id = params.id;

  if (locals.user === null) return redirectTo("/admin/login");
  if (id === undefined) return redirectTo("/admin/productos");

  // Cascade manual:
  // El FK `product_images.product_id` → `products.id` no tiene ON DELETE
  // CASCADE en el schema. Si intentamos borrar el producto sin sacar primero
  // sus filas de `product_images`, Postgres lo bloquea con error de constraint.
  // Por eso aquí limpiamos en este orden:
  //   1) Bajamos los paths de Storage de las imágenes del producto
  //   2) Borramos los archivos del bucket (best-effort: si falla, log y seguimos)
  //   3) Borramos las filas de `product_images` (esto libera el FK)
  //   4) Borramos el producto
  const { data: imagesData } = await locals.supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", id);

  const storagePaths = (imagesData ?? [])
    .map((img: { storage_path: string | null }) => img.storage_path)
    .filter((path): path is string => typeof path === "string" && path.length > 0);

  if (storagePaths.length > 0) {
    const { error: storageError } = await locals.supabase.storage
      .from(STORAGE_BUCKET)
      .remove(storagePaths);
    if (storageError !== null) {
      // No es bloqueante: los archivos quedan huérfanos en el bucket pero el
      // producto se puede borrar igual. Loggeamos para limpieza manual futura.
      console.warn(
        "[admin/products/delete] Limpieza de Storage falló:",
        storageError.message,
      );
    }
  }

  const { error: imagesError } = await locals.supabase
    .from("product_images")
    .delete()
    .eq("product_id", id);

  if (imagesError !== null) {
    console.error(
      "[admin/products/delete] Error al borrar product_images:",
      imagesError,
    );
    return redirectTo(`/admin/productos/${id}?error=server`);
  }

  const { error } = await locals.supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/products/delete] Error al borrar producto:", error);
    return redirectTo(`/admin/productos/${id}?error=server`);
  }

  return redirectTo("/admin/productos?deleted=1");
}
