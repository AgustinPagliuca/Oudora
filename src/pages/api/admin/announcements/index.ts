export const prerender = false;

import type { APIRoute } from "astro";
import { parseAnnouncementForm } from "@/lib/announcement-form";
import { redirectTo } from "@/lib/http";

export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.user === null) return redirectTo("/admin/login");

  const formData = await request.formData();
  const parsed = parseAnnouncementForm(formData);

  if (!parsed.ok) {
    return redirectTo(`/admin/avisos/nuevo?error=${parsed.reason}`);
  }

  const newId = crypto.randomUUID();
  const { error } = await locals.supabase.from("announcements").insert({
    id: newId,
    ...parsed.data,
  });

  if (error !== null) {
    console.error("[admin/announcements] Error al crear:", error);
    return redirectTo("/admin/avisos/nuevo?error=server");
  }

  return redirectTo(`/admin/avisos/${newId}?created=1`);
};
