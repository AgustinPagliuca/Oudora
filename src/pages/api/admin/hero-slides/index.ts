export const prerender = false;

import type { APIRoute } from "astro";
import { parseHeroSlideForm } from "@/lib/hero-slide-form";
import { redirectTo } from "@/lib/http";

export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.user === null) return redirectTo("/admin/login");

  const formData = await request.formData();
  const parsed = parseHeroSlideForm(formData);

  if (!parsed.ok) {
    return redirectTo(`/admin/hero/nuevo?error=${parsed.reason}`);
  }

  const newId = crypto.randomUUID();
  const { error } = await locals.supabase.from("hero_slides").insert({
    id: newId,
    ...parsed.data,
  });

  if (error !== null) {
    console.error("[admin/hero-slides] Error al crear:", error);
    return redirectTo("/admin/hero/nuevo?error=server");
  }

  return redirectTo(`/admin/hero/${newId}?created=1`);
};
