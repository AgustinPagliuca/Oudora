/**
 * Parseo y validación del form de slide del carrusel del hero.
 * La imagen se sube por separado al endpoint de upload.
 */

import type { ParseResult } from "@/lib/parse-result";

export interface HeroSlideInput {
  overline: string | null;
  title: string;
  subtitle: string | null;
  image_url: string;
  image_path: string;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
  published: boolean;
}

function parseIntOrNull(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

function nullIfEmpty(v: string): string | null {
  const trimmed = v.trim();
  return trimmed === "" ? null : trimmed;
}

export function parseHeroSlideForm(formData: FormData): ParseResult<HeroSlideInput> {
  const overline = nullIfEmpty(formData.get("overline")?.toString() ?? "");
  const title = formData.get("title")?.toString().trim() ?? "";
  const subtitle = nullIfEmpty(formData.get("subtitle")?.toString() ?? "");
  const imageUrl = formData.get("image_url")?.toString().trim() ?? "";
  const imagePath = formData.get("image_path")?.toString().trim() ?? "";
  const ctaLabel = nullIfEmpty(formData.get("cta_label")?.toString() ?? "");
  const ctaHref = nullIfEmpty(formData.get("cta_href")?.toString() ?? "");
  const published = formData.get("published") === "on";
  const sortOrderRaw = formData.get("sort_order");
  const sortOrder =
    sortOrderRaw === null || sortOrderRaw === ""
      ? 100
      : parseIntOrNull(sortOrderRaw) ?? 100;

  if (title === "" || title.length > 120) {
    return { ok: false, reason: "validation" };
  }
  if (overline !== null && overline.length > 80) {
    return { ok: false, reason: "validation" };
  }
  if (subtitle !== null && subtitle.length > 200) {
    return { ok: false, reason: "validation" };
  }
  if (imageUrl === "" || imagePath === "") {
    return { ok: false, reason: "validation" };
  }
  if (ctaLabel !== null && ctaLabel.length > 40) {
    return { ok: false, reason: "validation" };
  }
  // Si hay CTA, exigimos los dos campos (label y href) juntos
  if ((ctaLabel === null) !== (ctaHref === null)) {
    return { ok: false, reason: "validation" };
  }
  if (ctaHref !== null) {
    // Aceptamos paths internos (/) o URLs absolutas (http://, https://)
    const valid =
      ctaHref.startsWith("/") ||
      ctaHref.startsWith("http://") ||
      ctaHref.startsWith("https://");
    if (!valid || ctaHref.length > 500) {
      return { ok: false, reason: "validation" };
    }
  }
  if (sortOrder < 0 || sortOrder > 9999) {
    return { ok: false, reason: "validation" };
  }

  return {
    ok: true,
    data: {
      overline,
      title,
      subtitle,
      image_url: imageUrl,
      image_path: imagePath,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      sort_order: sortOrder,
      published,
    },
  };
}
