/**
 * Parseo y validación del form de reseña. Compartido entre los endpoints
 * de creación (POST) y actualización (PUT).
 */

export interface ReviewInput {
  author_name: string;
  body: string;
  rating: number | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

export type ParseResult =
  | { ok: true; data: ReviewInput }
  | { ok: false; reason: "validation" };

function parseIntOrNull(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

export function parseReviewForm(formData: FormData): ParseResult {
  const authorName = formData.get("author_name")?.toString().trim() ?? "";
  const body = formData.get("body")?.toString().trim() ?? "";
  const ratingRaw = formData.get("rating");
  const rating = ratingRaw === null || ratingRaw === "" ? null : parseIntOrNull(ratingRaw);
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const sortOrderRaw = formData.get("sort_order");
  const sortOrder =
    sortOrderRaw === null || sortOrderRaw === ""
      ? 100
      : parseIntOrNull(sortOrderRaw) ?? 100;

  if (authorName === "" || authorName.length > 100) {
    return { ok: false, reason: "validation" };
  }
  if (body === "" || body.length > 2000) {
    return { ok: false, reason: "validation" };
  }
  if (rating !== null && (rating < 1 || rating > 5)) {
    return { ok: false, reason: "validation" };
  }
  if (sortOrder < 0 || sortOrder > 9999) {
    return { ok: false, reason: "validation" };
  }

  return {
    ok: true,
    data: {
      author_name: authorName,
      body,
      rating,
      featured,
      published,
      sort_order: sortOrder,
    },
  };
}
