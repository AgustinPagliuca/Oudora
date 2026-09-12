export const prerender = false;

import type { APIRoute } from "astro";
import { parseBrandForm, isSlugTakenError } from "@/lib/brand-form";
import { redirectTo } from "@/lib/http";

export const POST: APIRoute = async (context) => {
  const { request } = context;
  const formData = await request.clone().formData();
  const method = formData.get("_method")?.toString().toUpperCase();

  if (method === "DELETE") return handleDelete(context);
  return handleUpdate(context, formData);
};

async function handleUpdate(
  context: Parameters<APIRoute>[0],
  formData: FormData,
): Promise<Response> {
  const { locals, params } = context;
  const id = params.id;

  if (locals.user === null) return redirectTo("/admin/login");
  if (id === undefined) return redirectTo("/admin/marcas");

  const parsed = parseBrandForm(formData);
  if (!parsed.ok) {
    return redirectTo(`/admin/marcas/${id}?error=${parsed.reason}`);
  }

  const { error } = await locals.supabase
    .from("brands")
    .update(parsed.data)
    .eq("id", id);

  if (error !== null) {
    if (isSlugTakenError(error)) {
      return redirectTo(`/admin/marcas/${id}?error=slug_taken`);
    }
    console.error("[admin/brands/update] Error:", error);
    return redirectTo(`/admin/marcas/${id}?error=server`);
  }

  return redirectTo("/admin/marcas?updated=1");
}

async function handleDelete(
  context: Parameters<APIRoute>[0],
): Promise<Response> {
  const { locals, params } = context;
  const id = params.id;

  if (locals.user === null) return redirectTo("/admin/login");
  if (id === undefined) return redirectTo("/admin/marcas");

  // Validación: no se puede borrar si tiene productos asociados.
  // Verificamos antes del DELETE para evitar errores crípticos de FK.
  const { count } = await locals.supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("brand_id", id);

  if ((count ?? 0) > 0) {
    return redirectTo("/admin/marcas?error=has_products");
  }

  const { error } = await locals.supabase
    .from("brands")
    .delete()
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/brands/delete] Error:", error);
    return redirectTo(`/admin/marcas/${id}?error=server`);
  }

  return redirectTo("/admin/marcas?deleted=1");
}
