export const prerender = false;

import type { APIRoute } from "astro";
import { parseAnnouncementForm } from "@/lib/announcement-form";

function redirectTo(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

export const POST: APIRoute = async (context) => {
  const { request } = context;
  const formData = await request.clone().formData();
  const method = formData.get("_method")?.toString().toUpperCase();

  if (method === "DELETE") return handleDelete(context);
  return handleUpdate(context, formData);
};

async function handleUpdate(
  context: Parameters<APIRoute>[0],
  formData: FormData,
): Promise<Response> {
  const { locals, params } = context;
  const id = params.id;

  if (locals.user === null) return redirectTo("/admin/login");
  if (id === undefined) return redirectTo("/admin/avisos");

  const parsed = parseAnnouncementForm(formData);
  if (!parsed.ok) {
    return redirectTo(`/admin/avisos/${id}?error=${parsed.reason}`);
  }

  const { error } = await locals.supabase
    .from("announcements")
    .update(parsed.data)
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/announcements/update] Error:", error);
    return redirectTo(`/admin/avisos/${id}?error=server`);
  }

  return redirectTo("/admin/avisos?updated=1");
}

async function handleDelete(
  context: Parameters<APIRoute>[0],
): Promise<Response> {
  const { locals, params } = context;
  const id = params.id;

  if (locals.user === null) return redirectTo("/admin/login");
  if (id === undefined) return redirectTo("/admin/avisos");

  const { error } = await locals.supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/announcements/delete] Error:", error);
    return redirectTo(`/admin/avisos/${id}?error=server`);
  }

  return redirectTo("/admin/avisos?deleted=1");
}
