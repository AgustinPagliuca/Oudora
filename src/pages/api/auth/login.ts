export const prerender = false;

import type { APIRoute } from "astro";

const LOGIN_URL = "/admin/login";

function redirectWithError(message: string): Response {
  return new Response(null, {
    status: 303,
    headers: {
      Location: `${LOGIN_URL}?error=${encodeURIComponent(message)}`,
    },
  });
}

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (email === undefined || email.length === 0 || password === undefined || password.length === 0) {
    return redirectWithError("Completá email y contraseña.");
  }

  const { error } = await locals.supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error !== null) {
    // No exponer el motivo exacto (evita user enumeration). El error real
    // queda en los logs del servidor de Vercel si hace falta debuggear.
    console.warn("[login] Auth fallida:", error.message);
    return redirectWithError("Credenciales inválidas.");
  }

  return redirect("/admin", 303);
};
