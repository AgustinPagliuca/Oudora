import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerClient } from "@/lib/supabase";

/**
 * Middleware global.
 *
 * Solo procesa rutas que necesiten cliente de Supabase y/o gating de auth:
 *  - /admin/*       → páginas del panel (auth requerida, salvo /admin/login)
 *  - /api/admin/*   → endpoints del panel (auth requerida, devuelven 401)
 *  - /api/auth/*    → login y logout (no requieren sesión previa)
 *
 * Para esas rutas también seteamos `Cache-Control: no-store` en la response,
 * para evitar que el navegador (o Vercel) sirva HTML viejo cuando el usuario
 * recién modificó datos en Supabase.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAuthApi = pathname.startsWith("/api/auth");

  // Páginas públicas estáticas: no tocamos cookies ni Supabase
  if (!isAdminPage && !isAdminApi && !isAuthApi) {
    return next();
  }

  const supabase = createSupabaseServerClient(context.cookies, context.request);
  context.locals.supabase = supabase;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  context.locals.user = user;

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage && user !== null) {
    return context.redirect("/admin");
  }

  if (isAdminPage && !isLoginPage && user === null) {
    return context.redirect("/admin/login");
  }

  if (isAdminApi && user === null) {
    return new Response("Unauthorized", { status: 401 });
  }

  const response = await next();

  // Forzar contenido fresco en todas las rutas del admin para que el cliente
  // siempre vea el estado real de Supabase (sin que el navegador cachee el
  // HTML SSR de un request anterior).
  if (isAdminPage || isAdminApi) {
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
  }

  return response;
});
