import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerClient } from "@/lib/supabase";

/**
 * Middleware global.
 *
 * En modo `hybrid`, Astro corre el middleware también para páginas estáticas
 * durante el build (para generarlas) y al servirlas (Vercel las sirve directo
 * del CDN, no pasan por middleware en runtime). Para no leer headers ni cookies
 * cuando no hay request real, evitamos crear el cliente Supabase salvo en
 * rutas que sí lo necesitan: /admin/* y /api/auth/*.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthApi = pathname.startsWith("/api/auth");

  // Páginas públicas estáticas: no tocamos cookies ni Supabase
  if (!isAdminRoute && !isAuthApi) {
    return next();
  }

  // Acá sí inicializamos el cliente con la sesión real
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

  // Cualquier otra ruta /admin sin sesión: redirigir al login
  if (isAdminRoute && !isLoginPage && user === null) {
    return context.redirect("/admin/login");
  }

  return next();
});
