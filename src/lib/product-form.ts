/**
 * Parseo y validación del form de producto. Compartido entre el endpoint
 * de creación (POST) y el de actualización (PUT) para mantener la lógica
 * de validación en un solo lugar.
 */

const VALID_CATALOGS = new Set(["arabe", "disenador"]);
const VALID_GENDERS = new Set(["femenino", "masculino", "unisex"]);
const VALID_CONCENTRATIONS = new Set(["EDP", "EDT", "Parfum", "Extrait"]);
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ProductInput {
  slug: string;
  brand_id: string;
  catalog: string;
  name: string;
  gender: string;
  concentration: string;
  volume_ml: number;
  price_ars: number;
  stock: number;
  notes: string[] | null;
  featured: boolean;
}

export type ParseResult =
  | { ok: true; data: ProductInput }
  | { ok: false; reason: "validation" };

function parseInt0(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

export function parseProductForm(formData: FormData): ParseResult {
  const slug = formData.get("slug")?.toString().trim().toLowerCase() ?? "";
  const brandId = formData.get("brand_id")?.toString().trim() ?? "";
  const catalog = formData.get("catalog")?.toString().trim() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const gender = formData.get("gender")?.toString().trim() ?? "";
  const concentration = formData.get("concentration")?.toString().trim() ?? "";
  const volumeMl = parseInt0(formData.get("volume_ml"));
  const priceArs = parseInt0(formData.get("price_ars"));
  const stock = parseInt0(formData.get("stock"));
  const notesRaw = formData
    .getAll("notes")
    .map((n) => n.toString().trim().toLowerCase())
    .filter((n) => n.length > 0);
  const notes = notesRaw.length > 0 ? Array.from(new Set(notesRaw)) : null;
  const featured = formData.get("featured") === "on";

  // Validaciones
  if (slug === "" || !SLUG_REGEX.test(slug)) return { ok: false, reason: "validation" };
  if (brandId === "") return { ok: false, reason: "validation" };
  if (!VALID_CATALOGS.has(catalog)) return { ok: false, reason: "validation" };
  if (name === "") return { ok: false, reason: "validation" };
  if (!VALID_GENDERS.has(gender)) return { ok: false, reason: "validation" };
  if (!VALID_CONCENTRATIONS.has(concentration))
    return { ok: false, reason: "validation" };
  if (volumeMl === null || volumeMl <= 0 || volumeMl > 1000)
    return { ok: false, reason: "validation" };
  if (priceArs === null || priceArs < 0)
    return { ok: false, reason: "validation" };
  if (stock === null || stock < 0) return { ok: false, reason: "validation" };

  return {
    ok: true,
    data: {
      slug,
      brand_id: brandId,
      catalog,
      name,
      gender,
      concentration,
      volume_ml: volumeMl,
      price_ars: priceArs,
      stock,
      notes,
      featured,
    },
  };
}

/**
 * Detecta si un error de Supabase es de unicidad de slug.
 * El código 23505 es "unique violation" en Postgres.
 */
export function isSlugTakenError(error: { code?: string; message?: string }): boolean {
  if (error.code === "23505") return true;
  if (error.message !== undefined && error.message.toLowerCase().includes("slug"))
    return true;
  return false;
}
