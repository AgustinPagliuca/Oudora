export const prerender = false;

import type { APIRoute } from "astro";
import { parseReviewForm } from "@/lib/review-form";

function redirectTo(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.user === null) return redirectTo("/admin/login");

  const formData = await request.formData();
  const parsed = parseReviewForm(formData);

  if (!parsed.ok) {
    return redirectTo(`/admin/resenas/nueva?error=${parsed.reason}`);
  }

  const newId = crypto.randomUUID();
  const { error } = await locals.supabase.from("reviews").insert({
    id: newId,
    ...parsed.data,
  });

  if (error !== null) {
    console.error("[admin/reviews] Error al crear:", error);
    return redirectTo("/admin/resenas/nueva?error=server");
  }

  return redirectTo(`/admin/resenas/${newId}?created=1`);
};
