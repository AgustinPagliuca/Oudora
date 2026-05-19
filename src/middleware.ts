import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerClient } from "@/lib/supabase";

/**
 * Middleware global.
 *
 * En modo `static`, Astro corre el middleware también para páginas estáticas
 * durante el build (para generarlas) y al servirlas (Vercel las sirve directo
 * del CDN, no pasan por middleware en runtime). Para no leer headers ni cookies
 * cuando no hay request real, evitamos crear el cliente Supabase salvo en
 * rutas que sí lo necesitan.
 *
 * Rutas que pasan por acá:
 *  - /admin/*       → páginas del panel (auth requerida, salvo /admin/login)
 *  - /api/admin/*   → endpoints del panel (auth requerida, devuelven 401)
 *  - /api/auth/*    → login y logout (no requieren sesión previa)
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

  // Usuario ya logueado entrando al login: redirigir al dashboard
  if (isLoginPage && user !== null) {
    return context.redirect("/admin");
  }

  // Página /admin sin sesión: redirigir al login (no aplica a /admin/login)
  if (isAdminPage && !isLoginPage && user === null) {
    return context.redirect("/admin/login");
  }

  // Endpoint API admin sin sesión: 401 (no redirect, los endpoints no muestran páginas)
  if (isAdminApi && user === null) {
    return new Response("Unauthorized", { status: 401 });
  }

  return next();
});
