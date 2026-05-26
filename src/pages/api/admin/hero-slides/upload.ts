export const prerender = false;

import type { APIRoute } from "astro";

const BUCKET = "hero-slides";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.user === null) {
    return jsonResponse({ ok: false, error: "unauthorized" }, 401);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ ok: false, error: "bad_request" }, 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonResponse({ ok: false, error: "no_file" }, 400);
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return jsonResponse(
      { ok: false, error: "invalid_type", message: "Solo se permiten JPG, PNG o WebP." },
      400,
    );
  }

  if (file.size > MAX_SIZE) {
    return jsonResponse(
      { ok: false, error: "too_large", message: "La imagen supera los 5 MB." },
      400,
    );
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `slides/${fileName}`;

  const { error: uploadError } = await locals.supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError !== null) {
    console.error("[admin/hero-slides/upload] upload error:", uploadError);
    return jsonResponse(
      { ok: false, error: "upload_failed", message: uploadError.message },
      500,
    );
  }

  const { data } = locals.supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return jsonResponse({
    ok: true,
    url: data.publicUrl,
    path: storagePath,
  });
};
