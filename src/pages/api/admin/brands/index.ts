export const prerender = false;

import type { APIRoute } from "astro";
import { parseBrandForm, isSlugTakenError } from "@/lib/brand-form";

function redirectTo(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.user === null) return redirectTo("/admin/login");

  const formData = await request.formData();
  const parsed = parseBrandForm(formData);

  if (!parsed.ok) {
    return redirectTo(`/admin/marcas/nueva?error=${parsed.reason}`);
  }

  const newId = crypto.randomUUID();
  const { error } = await locals.supabase.from("brands").insert({
    id: newId,
    ...parsed.data,
  });

  if (error !== null) {
    if (isSlugTakenError(error)) {
      return redirectTo("/admin/marcas/nueva?error=slug_taken");
    }
    console.error("[admin/brands] Error al crear:", error);
    return redirectTo("/admin/marcas/nueva?error=server");
  }

  // Después de crear, redirigir a edición (consistente con productos)
  return redirectTo(`/admin/marcas/${newId}?created=1`);
};
