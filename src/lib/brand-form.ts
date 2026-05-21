/**
 * Parseo y validación del form de marca. Compartido entre los endpoints
 * de creación (POST) y actualización (PUT).
 */

const VALID_CATALOGS = new Set(["arabe", "disenador"]);
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface BrandInput {
  slug: string;
  name: string;
  catalog: string;
  sort_order: number;
}

export type ParseResult =
  | { ok: true; data: BrandInput }
  | { ok: false; reason: "validation" };

function parseInt0(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

export function parseBrandForm(formData: FormData): ParseResult {
  const slug = formData.get("slug")?.toString().trim().toLowerCase() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const catalog = formData.get("catalog")?.toString().trim() ?? "";
  const sortOrderRaw = formData.get("sort_order");
  const sortOrder =
    sortOrderRaw === null || sortOrderRaw === ""
      ? 100
      : parseInt0(sortOrderRaw) ?? 100;

  if (slug === "" || !SLUG_REGEX.test(slug)) {
    return { ok: false, reason: "validation" };
  }
  if (name === "") return { ok: false, reason: "validation" };
  if (!VALID_CATALOGS.has(catalog)) return { ok: false, reason: "validation" };
  if (sortOrder < 0 || sortOrder > 9999) {
    return { ok: false, reason: "validation" };
  }

  return {
    ok: true,
    data: { slug, name, catalog, sort_order: sortOrder },
  };
}

export function isSlugTakenError(error: {
  code?: string;
  message?: string;
}): boolean {
  if (error.code === "23505") return true;
  if (
    error.message !== undefined &&
    error.message.toLowerCase().includes("slug")
  ) {
    return true;
  }
  return false;
}
