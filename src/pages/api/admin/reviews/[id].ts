export const prerender = false;

import type { APIRoute } from "astro";
import { parseReviewForm } from "@/lib/review-form";

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
  if (id === undefined) return redirectTo("/admin/resenas");

  const parsed = parseReviewForm(formData);
  if (!parsed.ok) {
    return redirectTo(`/admin/resenas/${id}?error=${parsed.reason}`);
  }

  const { error } = await locals.supabase
    .from("reviews")
    .update(parsed.data)
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/reviews/update] Error:", error);
    return redirectTo(`/admin/resenas/${id}?error=server`);
  }

  return redirectTo("/admin/resenas?updated=1");
}

async function handleDelete(
  context: Parameters<APIRoute>[0],
): Promise<Response> {
  const { locals, params } = context;
  const id = params.id;

  if (locals.user === null) return redirectTo("/admin/login");
  if (id === undefined) return redirectTo("/admin/resenas");

  const { error } = await locals.supabase
    .from("reviews")
    .delete()
    .eq("id", id);

  if (error !== null) {
    console.error("[admin/reviews/delete] Error:", error);
    return redirectTo(`/admin/resenas/${id}?error=server`);
  }

  return redirectTo("/admin/resenas?deleted=1");
}
