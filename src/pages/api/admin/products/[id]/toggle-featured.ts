/**
 * POST /api/admin/products/[id]/toggle-featured
 *
 * Invierte el flag `featured` del producto. Para el botón de estrella
 * clickable en el listing. Mismo patrón que toggle-active.
 */
export const prerender = false;

import type { APIRoute } from "astro";

function redirectBack(request: Request, fallback: string): Response {
  const referer = request.headers.get("referer");
  const target = referer !== null && referer.length > 0 ? referer : fallback;
  return new Response(null, {
    status: 303,
    headers: { Location: target },
  });
}

export const POST: APIRoute = async ({ locals, params, request }) => {
  const id = params.id;
  if (locals.user === null) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/admin/login" },
    });
  }
  if (id === undefined) {
    return redirectBack(request, "/admin/productos");
  }

  const { data: current, error: readError } = await locals.supabase
    .from("products")
    .select("featured")
    .eq("id", id)
    .maybeSingle();

  if (readError !== null || current === null) {
    console.error("[admin/products/toggle-featured] No se pudo leer el producto:", readError);
    return redirectBack(request, "/admin/productos?error=server");
  }

  const newValue = current.featured === true ? false : true;

  const { error: updateError } = await locals.supabase
    .from("products")
    .update({ featured: newValue })
    .eq("id", id);

  if (updateError !== null) {
    console.error("[admin/products/toggle-featured] Error al actualizar:", updateError);
    return redirectBack(request, "/admin/productos?error=server");
  }

  return redirectBack(request, "/admin/productos?featured=1");
};
