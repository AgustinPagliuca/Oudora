export const prerender = false;

import type { APIRoute } from "astro";
import { parseReelForm } from "@/lib/reel-form";
import { redirectTo } from "@/lib/http";

export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.user === null) return redirectTo("/admin/login");

  const formData = await request.formData();
  const parsed = parseReelForm(formData);

  if (!parsed.ok) {
    return redirectTo(`/admin/reels/nuevo?error=${parsed.reason}`);
  }

  const newId = crypto.randomUUID();
  const { error } = await locals.supabase.from("reels").insert({
    id: newId,
    ...parsed.data,
  });

  if (error !== null) {
    console.error("[admin/reels] Error al crear:", error);
    return redirectTo("/admin/reels/nuevo?error=server");
  }

  return redirectTo(`/admin/reels/${newId}?created=1`);
};
