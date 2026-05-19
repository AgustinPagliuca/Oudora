export const prerender = false;

import type { APIRoute } from "astro";

const BUCKET = "product-images";
const MAX_IMAGES_PER_PRODUCT = 4;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB después de procesar en cliente
const ALLOWED_MIME_TYPES = new Set([
  "image/webp",
  "image/jpeg",
  "image/png",
  "image/avif",
]);

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Despachador. Los uploads vienen como POST con `multipart/form-data` (un
 * archivo). Las operaciones de reordenar y borrar las multiplexamos por
 * `_method` en JSON: `{_method: "PUT", order: [id1, id2, ...]}` o
 * `{_method: "DELETE", imageId: "..."}`.
 */
export const POST: APIRoute = async (context) => {
  const { request, locals, params } = context;
  const productId = params.id;

  if (locals.user === null) return jsonResponse({ error: "unauthorized" }, 401);
  if (productId === undefined)
    return jsonResponse({ error: "missing_product_id" }, 400);

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.startsWith("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    if (body._method === "DELETE") {
      return handleDelete(context, body as { imageId?: string });
    }
    if (body._method === "PUT") {
      return handleReorder(context, body as { order?: unknown });
    }
    return jsonResponse({ error: "unknown_method" }, 400);
  }

  return handleUpload(context);
};

async function handleUpload(
  context: Parameters<APIRoute>[0],
): Promise<Response> {
  const { request, locals, params } = context;
  const productId = params.id!;

  const formData = await request.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return jsonResponse({ error: "no_file" }, 400);
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return jsonResponse({ error: "invalid_type" }, 415);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return jsonResponse({ error: "file_too_big" }, 413);
  }

  // ¿Hay slots libres? Cuento las imágenes actuales del producto.
  const { count: existingCount } = await locals.supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if ((existingCount ?? 0) >= MAX_IMAGES_PER_PRODUCT) {
    return jsonResponse({ error: "max_images_reached" }, 409);
  }

  // Path único dentro de la carpeta del producto
  const extension = file.type === "image/webp" ? "webp" : file.type.split("/")[1] ?? "bin";
  const filename = `${crypto.randomUUID()}.${extension}`;
  const storagePath = `${productId}/${filename}`;

  // Upload al bucket
  const buffer = await file.arrayBuffer();
  const { error: uploadError } = await locals.supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError !== null) {
    console.error("[admin/images] upload error:", uploadError);
    return jsonResponse({ error: "upload_failed" }, 500);
  }

  // URL pública
  const {
    data: { publicUrl },
  } = locals.supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  // Registro en la tabla
  const nextPosition = existingCount ?? 0;
  const { data: imageRecord, error: insertError } = await locals.supabase
    .from("product_images")
    .insert({
      product_id: productId,
      url: publicUrl,
      storage_path: storagePath,
      position: nextPosition,
    })
    .select("id, url, position")
    .single();

  if (insertError !== null || imageRecord === null) {
    console.error("[admin/images] insert error:", insertError);
    // Rollback: borrar el archivo subido
    await locals.supabase.storage.from(BUCKET).remove([storagePath]);
    return jsonResponse({ error: "db_insert_failed" }, 500);
  }

  return jsonResponse({
    id: imageRecord.id,
    url: imageRecord.url,
    position: imageRecord.position,
  });
}

async function handleDelete(
  context: Parameters<APIRoute>[0],
  body: { imageId?: string },
): Promise<Response> {
  const { locals, params } = context;
  const productId = params.id!;
  const imageId = body.imageId;

  if (typeof imageId !== "string" || imageId === "") {
    return jsonResponse({ error: "missing_image_id" }, 400);
  }

  // Verificar que la imagen pertenece al producto (sanity check)
  const { data: image } = await locals.supabase
    .from("product_images")
    .select("storage_path, product_id")
    .eq("id", imageId)
    .maybeSingle();

  if (image === null || image.product_id !== productId) {
    return jsonResponse({ error: "not_found" }, 404);
  }

  // Borrar archivo del bucket
  const { error: storageError } = await locals.supabase.storage
    .from(BUCKET)
    .remove([image.storage_path]);
  if (storageError !== null) {
    console.error("[admin/images] storage delete:", storageError);
    // No abortamos: queremos borrar el registro igual aunque el archivo
    // haya quedado huérfano. Mejor un orfanato que un registro fantasma.
  }

  // Borrar registro
  const { error: dbError } = await locals.supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (dbError !== null) {
    console.error("[admin/images] db delete:", dbError);
    return jsonResponse({ error: "db_delete_failed" }, 500);
  }

  return jsonResponse({ ok: true });
}

async function handleReorder(
  context: Parameters<APIRoute>[0],
  body: { order?: unknown },
): Promise<Response> {
  const { locals, params } = context;
  const productId = params.id!;
  const order = body.order;

  if (!Array.isArray(order) || order.some((id) => typeof id !== "string")) {
    return jsonResponse({ error: "invalid_order" }, 400);
  }

  // Actualizar position de cada imagen según su índice en el array.
  // Hacemos updates en paralelo; cada uno valida que la imagen es del producto.
  const updates = (order as string[]).map((imageId, index) =>
    locals.supabase
      .from("product_images")
      .update({ position: index })
      .eq("id", imageId)
      .eq("product_id", productId),
  );

  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error !== null)?.error;

  if (firstError !== undefined && firstError !== null) {
    console.error("[admin/images] reorder error:", firstError);
    return jsonResponse({ error: "reorder_failed" }, 500);
  }

  return jsonResponse({ ok: true });
}
