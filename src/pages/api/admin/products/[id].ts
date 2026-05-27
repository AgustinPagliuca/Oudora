export const prerender = false;

import type { APIRoute } from "astro";
import { parseProductForm, isSlugTakenError } from "@/lib/product-form";

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

  // Separamos labels del resto: si la columna `labels` no existe (porque
  // la migración SQL no se corrió todavía), el update principal sigue
  // funcionando. Después intentamos persistir labels en un update
  // independiente que puede fallar sin romper el guardado.
  const { labels, ...mainData } = parsed.data;

  const { error: mainError } = await locals.supabase
    .from("products")
    .update(mainData)
    .eq("id", id);

  if (mainError !== null) {
    if (isSlugTakenError(mainError)) {
      return redirectTo(`/admin/productos/${id}?error=slug_taken`);
    }
    console.error("[admin/products/update] Error principal:", mainError);
    return redirectTo(`/admin/productos/${id}?error=server`);
  }

  // Intento secundario: persistir labels. Si la columna no existe, log y seguimos.
  const { error: labelsError } = await locals.supabase
    .from("products")
    .update({ labels })
    .eq("id", id);

  if (labelsError !== null) {
    console.warn(
      "[admin/products/update] No se pudieron guardar las etiquetas (¿migración SQL pendiente?):",
      labelsError.message,
    );
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

  const { error } = await locals.supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/products/delete] Error:", error);
    return redirectTo(`/admin/productos/${id}?error=server`);
  }

  return redirectTo("/admin/productos?deleted=1");
}
