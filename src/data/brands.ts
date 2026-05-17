import type { Brand, Catalog } from "@/types/catalog";

/**
 * Marcas del catálogo. Cada nueva marca se agrega acá.
 * El orden afecta la presentación por defecto en cada catálogo.
 */
export const BRANDS: readonly Brand[] = [
  // ─── Perfumería árabe ──────────────────────────────────────
  { id: "lattafa", slug: "lattafa", name: "Lattafa", catalog: "arabe" },
  { id: "maison-alhambra", slug: "maison-alhambra", name: "Maison Alhambra", catalog: "arabe" },
  { id: "armaf", slug: "armaf", name: "Armaf", catalog: "arabe" },
  { id: "al-haramain", slug: "al-haramain", name: "Al Haramain", catalog: "arabe" },
  { id: "rasasi", slug: "rasasi", name: "Rasasi", catalog: "arabe" },
  { id: "afnan", slug: "afnan", name: "Afnan", catalog: "arabe" },

  // ─── Perfumería de diseñador ───────────────────────────────
  { id: "dior", slug: "dior", name: "Dior", catalog: "disenador" },
  { id: "chanel", slug: "chanel", name: "Chanel", catalog: "disenador" },
  { id: "ysl", slug: "ysl", name: "Yves Saint Laurent", catalog: "disenador" },
  { id: "carolina-herrera", slug: "carolina-herrera", name: "Carolina Herrera", catalog: "disenador" },
  { id: "paco-rabanne", slug: "paco-rabanne", name: "Paco Rabanne", catalog: "disenador" },
  { id: "versace", slug: "versace", name: "Versace", catalog: "disenador" },
  { id: "jean-paul-gaultier", slug: "jean-paul-gaultier", name: "Jean Paul Gaultier", catalog: "disenador" },
  { id: "tom-ford", slug: "tom-ford", name: "Tom Ford", catalog: "disenador" },
] as const;

export const BRANDS_BY_ID: ReadonlyMap<string, Brand> = new Map(
  BRANDS.map((brand) => [brand.id, brand]),
);

export function getBrandById(brandId: string): Brand | undefined {
  return BRANDS_BY_ID.get(brandId);
}

export function getBrandsByCatalog(catalog: Catalog): readonly Brand[] {
  return BRANDS.filter((brand) => brand.catalog === catalog);
}
