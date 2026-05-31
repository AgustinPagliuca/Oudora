/**
 * Parseo y validación del form de producto. Compartido entre el endpoint
 * de creación (POST) y el de actualización (PUT) para mantener la lógica
 * de validación en un solo lugar.
 */

const VALID_CATALOGS = new Set(["arabe", "disenador"]);
const VALID_GENDERS = new Set(["femenino", "masculino", "unisex"]);
const VALID_CONCENTRATIONS = new Set(["EDP", "EDT", "Parfum", "Extrait"]);
const VALID_LABEL_COLORS = new Set(["dark", "red", "gold"]);
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_LABELS = 3;
const MAX_LABEL_TEXT_LENGTH = 20;

const MAX_DESCRIPTION_LENGTH = 2000;

export interface ProductLabelInput {
  text: string;
  color: string;
}

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
  notes: string[];
  description: string;
  featured: boolean;
  labels: ProductLabelInput[];
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

/**
 * Lee labels del FormData. El form envía pares label_text_N y label_color_N
 * para N = 0..MAX_LABELS-1. Slots con texto vacío se descartan.
 * Si algún slot tiene texto pero color inválido → falla la validación.
 */
function parseLabels(formData: FormData): ProductLabelInput[] | null {
  const labels: ProductLabelInput[] = [];
  for (let i = 0; i < MAX_LABELS; i++) {
    const text = formData.get(`label_text_${i}`)?.toString().trim() ?? "";
    const color = formData.get(`label_color_${i}`)?.toString().trim() ?? "dark";
    if (text === "") continue;
    if (text.length > MAX_LABEL_TEXT_LENGTH) return null;
    if (!VALID_LABEL_COLORS.has(color)) return null;
    labels.push({ text, color });
  }
  return labels;
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
  // Siempre array, nunca null: la columna `notes` en DB es text[] NOT NULL.
  // Un array vacío `[]` es perfectamente válido y no rompe el constraint.
  const notes = notesRaw.length > 0 ? Array.from(new Set(notesRaw)) : [];
  // Descripción opcional: si no se manda, queda string vacío (la columna en DB
  // debe tener `default ''` o ser nullable). Truncamos a MAX por seguridad.
  const description = (formData.get("description") ?? "")
    .toString()
    .trim()
    .slice(0, MAX_DESCRIPTION_LENGTH);
  const featured = formData.get("featured") === "on";
  const labels = parseLabels(formData);

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
  if (labels === null) return { ok: false, reason: "validation" };

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
      description,
      featured,
      labels,
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
