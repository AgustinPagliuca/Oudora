export const prerender = false;

import type { APIRoute } from "astro";
import { parseProductForm, isSlugTakenError } from "@/lib/product-form";

function redirectTo(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.user === null) return redirectTo("/admin/login");

  const formData = await request.formData();
  const parsed = parseProductForm(formData);

  if (!parsed.ok) {
    return redirectTo(`/admin/productos/nuevo?error=${parsed.reason}`);
  }

  // La columna `id` de la tabla products es NOT NULL y no tiene default
  // en la DB, así que la generamos acá. UUID v4 es compatible con
  // columnas de tipo `uuid` y de tipo `text`.
  // crypto.randomUUID() es global en Node 19+ y en cualquier runtime moderno.
  const { error } = await locals.supabase.from("products").insert({
    id: crypto.randomUUID(),
    ...parsed.data,
  });

  if (error !== null) {
    if (isSlugTakenError(error)) {
      return redirectTo("/admin/productos/nuevo?error=slug_taken");
    }
    console.error("[admin/products] Error al crear:", error);
    return redirectTo("/admin/productos/nuevo?error=server");
  }

  return redirectTo("/admin/productos?created=1");
};
