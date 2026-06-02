/**
 * POST /api/admin/brands/[id]/toggle-active
 *
 * Invierte el flag `is_active` de la marca. Para botones rápidos en el listing.
 *
 * Nota: ocultar una marca también oculta todos sus productos en el sitio
 * público (el sync filtra productos cuya marca es inactiva). El admin sigue
 * viendo los productos en su listing — esto solo afecta la tienda pública.
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
    return redirectBack(request, "/admin/marcas");
  }

  const { data: current, error: readError } = await locals.supabase
    .from("brands")
    .select("is_active")
    .eq("id", id)
    .maybeSingle();

  if (readError !== null || current === null) {
    console.error("[admin/brands/toggle] No se pudo leer la marca:", readError);
    return redirectBack(request, "/admin/marcas?error=server");
  }

  const newValue = current.is_active === false ? true : false;

  const { error: updateError } = await locals.supabase
    .from("brands")
    .update({ is_active: newValue })
    .eq("id", id);

  if (updateError !== null) {
    console.error("[admin/brands/toggle] Error al actualizar:", updateError);
    return redirectBack(request, "/admin/marcas?error=server");
  }

  return redirectBack(request, "/admin/marcas?toggled=1");
};
