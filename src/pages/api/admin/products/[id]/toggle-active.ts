/**
 * POST /api/admin/products/[id]/toggle-active
 *
 * Invierte el flag `is_active` del producto. Pensado para botones rápidos en
 * el listing — no requiere mandar el resto de los campos.
 *
 * Redirige al `Referer` para preservar filtros activos (ej. ?show=hidden).
 * Si no hay Referer, cae al listing general.
 */
export const prerender = false;

import type { APIRoute } from "astro";
import { redirectTo } from "@/lib/http";

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
    return redirectTo("/admin/login");
  }
  if (id === undefined) {
    return redirectBack(request, "/admin/productos");
  }

  // Leemos el estado actual para invertirlo. Maybe-single evita errores
  // si el id no existe (devuelve data=null sin tirar).
  const { data: current, error: readError } = await locals.supabase
    .from("products")
    .select("is_active")
    .eq("id", id)
    .maybeSingle();

  if (readError !== null || current === null) {
    console.error("[admin/products/toggle] No se pudo leer el producto:", readError);
    return redirectBack(request, "/admin/productos?error=server");
  }

  const newValue = current.is_active === false ? true : false;

  const { error: updateError } = await locals.supabase
    .from("products")
    .update({ is_active: newValue })
    .eq("id", id);

  if (updateError !== null) {
    console.error("[admin/products/toggle] Error al actualizar:", updateError);
    return redirectBack(request, "/admin/productos?error=server");
  }

  return redirectBack(request, "/admin/productos?toggled=1");
};
