/**
 * Parseo y validación del form de reel.
 * El thumbnail se sube por separado a un endpoint dedicado de upload.
 */

export interface ReelInput {
  title: string;
  thumbnail_url: string;
  thumbnail_path: string;
  instagram_url: string;
  duration: string | null;
  sort_order: number;
  published: boolean;
}

export type ParseResult =
  | { ok: true; data: ReelInput }
  | { ok: false; reason: "validation" };

function parseIntOrNull(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

const INSTAGRAM_URL_REGEX = /^https?:\/\/(www\.)?instagram\.com\/.+/i;

export function parseReelForm(formData: FormData): ParseResult {
  const title = formData.get("title")?.toString().trim() ?? "";
  const thumbnailUrl = formData.get("thumbnail_url")?.toString().trim() ?? "";
  const thumbnailPath = formData.get("thumbnail_path")?.toString().trim() ?? "";
  const instagramUrl = formData.get("instagram_url")?.toString().trim() ?? "";
  const durationRaw = formData.get("duration")?.toString().trim() ?? "";
  const duration = durationRaw === "" ? null : durationRaw;
  const published = formData.get("published") === "on";
  const sortOrderRaw = formData.get("sort_order");
  const sortOrder =
    sortOrderRaw === null || sortOrderRaw === ""
      ? 100
      : parseIntOrNull(sortOrderRaw) ?? 100;

  if (title === "" || title.length > 80) {
    return { ok: false, reason: "validation" };
  }
  if (thumbnailUrl === "" || thumbnailPath === "") {
    return { ok: false, reason: "validation" };
  }
  if (!INSTAGRAM_URL_REGEX.test(instagramUrl)) {
    return { ok: false, reason: "validation" };
  }
  if (duration !== null && duration.length > 20) {
    return { ok: false, reason: "validation" };
  }
  if (sortOrder < 0 || sortOrder > 9999) {
    return { ok: false, reason: "validation" };
  }

  return {
    ok: true,
    data: {
      title,
      thumbnail_url: thumbnailUrl,
      thumbnail_path: thumbnailPath,
      instagram_url: instagramUrl,
      duration,
      sort_order: sortOrder,
      published,
    },
  };
}
