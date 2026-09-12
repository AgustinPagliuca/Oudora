export const prerender = false;

import type { APIRoute } from "astro";
import { parseReelForm } from "@/lib/reel-form";
import { redirectTo } from "@/lib/http";

const BUCKET = "reel-thumbnails";

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
  if (id === undefined) return redirectTo("/admin/reels");

  const parsed = parseReelForm(formData);
  if (!parsed.ok) {
    return redirectTo(`/admin/reels/${id}?error=${parsed.reason}`);
  }

  // Si el thumbnail cambió, borrar el viejo del storage
  const oldPath = formData.get("previous_thumbnail_path")?.toString().trim() ?? "";
  if (oldPath !== "" && oldPath !== parsed.data.thumbnail_path) {
    await locals.supabase.storage.from(BUCKET).remove([oldPath]);
  }

  const { error } = await locals.supabase
    .from("reels")
    .update(parsed.data)
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/reels/update] Error:", error);
    return redirectTo(`/admin/reels/${id}?error=server`);
  }

  return redirectTo("/admin/reels?updated=1");
}

async function handleDelete(
  context: Parameters<APIRoute>[0],
): Promise<Response> {
  const { locals, params } = context;
  const id = params.id;

  if (locals.user === null) return redirectTo("/admin/login");
  if (id === undefined) return redirectTo("/admin/reels");

  // Buscar el thumbnail_path para borrar la imagen del storage
  const { data: reel } = await locals.supabase
    .from("reels")
    .select("thumbnail_path")
    .eq("id", id)
    .maybeSingle();

  if (reel?.thumbnail_path !== undefined && reel.thumbnail_path !== "") {
    await locals.supabase.storage.from(BUCKET).remove([reel.thumbnail_path]);
  }

  const { error } = await locals.supabase
    .from("reels")
    .delete()
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/reels/delete] Error:", error);
    return redirectTo(`/admin/reels/${id}?error=server`);
  }

  return redirectTo("/admin/reels?deleted=1");
}
