/**
 * Parseo y validación del form de aviso (anuncio rotativo).
 */

import type { AnnouncementIcon } from "@/types/catalog";

export interface AnnouncementInput {
  text: string;
  icon: AnnouncementIcon | null;
  sort_order: number;
  published: boolean;
}

export type ParseResult =
  | { ok: true; data: AnnouncementInput }
  | { ok: false; reason: "validation" };

const VALID_ICONS = new Set<AnnouncementIcon>([
  "truck",
  "gift",
  "percent",
  "credit-card",
  "star",
  "clock",
  "map-pin",
]);

function parseIntOrNull(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

export function parseAnnouncementForm(formData: FormData): ParseResult {
  const text = formData.get("text")?.toString().trim() ?? "";
  const iconRaw = formData.get("icon")?.toString().trim() ?? "";
  const icon =
    iconRaw === "" ? null : VALID_ICONS.has(iconRaw as AnnouncementIcon)
      ? (iconRaw as AnnouncementIcon)
      : null;
  const published = formData.get("published") === "on";
  const sortOrderRaw = formData.get("sort_order");
  const sortOrder =
    sortOrderRaw === null || sortOrderRaw === ""
      ? 100
      : parseIntOrNull(sortOrderRaw) ?? 100;

  if (text === "" || text.length > 140) {
    return { ok: false, reason: "validation" };
  }
  if (sortOrder < 0 || sortOrder > 9999) {
    return { ok: false, reason: "validation" };
  }

  return {
    ok: true,
    data: {
      text,
      icon,
      sort_order: sortOrder,
      published,
    },
  };
}
