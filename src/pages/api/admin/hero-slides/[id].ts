export const prerender = false;

import type { APIRoute } from "astro";
import { parseHeroSlideForm } from "@/lib/hero-slide-form";

const BUCKET = "hero-slides";

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
  if (id === undefined) return redirectTo("/admin/hero");

  const parsed = parseHeroSlideForm(formData);
  if (!parsed.ok) {
    return redirectTo(`/admin/hero/${id}?error=${parsed.reason}`);
  }

  // Si cambió la imagen, borrar la vieja del storage
  const oldPath = formData.get("previous_image_path")?.toString().trim() ?? "";
  if (oldPath !== "" && oldPath !== parsed.data.image_path) {
    await locals.supabase.storage.from(BUCKET).remove([oldPath]);
  }

  const { error } = await locals.supabase
    .from("hero_slides")
    .update(parsed.data)
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/hero-slides/update] Error:", error);
    return redirectTo(`/admin/hero/${id}?error=server`);
  }

  return redirectTo("/admin/hero?updated=1");
}

async function handleDelete(
  context: Parameters<APIRoute>[0],
): Promise<Response> {
  const { locals, params } = context;
  const id = params.id;

  if (locals.user === null) return redirectTo("/admin/login");
  if (id === undefined) return redirectTo("/admin/hero");

  // Buscar la image_path para borrar del storage
  const { data: slide } = await locals.supabase
    .from("hero_slides")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  if (slide?.image_path !== undefined && slide.image_path !== "") {
    await locals.supabase.storage.from(BUCKET).remove([slide.image_path]);
  }

  const { error } = await locals.supabase
    .from("hero_slides")
    .delete()
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/hero-slides/delete] Error:", error);
    return redirectTo(`/admin/hero/${id}?error=server`);
  }

  return redirectTo("/admin/hero?deleted=1");
}
