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

  const newId = crypto.randomUUID();
  const { error } = await locals.supabase.from("products").insert({
    id: newId,
    ...parsed.data,
  });

  if (error !== null) {
    if (isSlugTakenError(error)) {
      return redirectTo("/admin/productos/nuevo?error=slug_taken");
    }
    console.error("[admin/products] Error al crear:", error);
    return redirectTo("/admin/productos/nuevo?error=server");
  }

  // En lugar de mandar al listado, vamos al form de edición para que el
  // cliente pueda subir las imágenes. Esto sigue el patrón de Shopify/Etsy:
  // primero los datos textuales, después el contenido visual.
  return redirectTo(`/admin/productos/${newId}?created=1`);
};
