import type {
  Catalog,
  CatalogFilters,
  Gender,
  Product,
} from "@/types/catalog";
import { DEFAULT_CATALOG } from "@/constants/ui";

/**
 * Filtros puros sobre productos. Sin estado, sin efectos secundarios.
 * Cada función responde una pregunta clara y devuelve booleano o array.
 */

export function normalizeSearchTerm(raw: string): string {
  return raw.trim().toLowerCase();
}

function productMatchesCatalog(product: Product, catalog: Catalog): boolean {
  return product.catalog === catalog;
}

function productMatchesBrand(
  product: Product,
  brandIds: readonly string[],
): boolean {
  if (brandIds.length === 0) return true;
  return brandIds.includes(product.brandId);
}

function productMatchesGender(
  product: Product,
  genders: readonly Gender[],
): boolean {
  if (genders.length === 0) return true;
  return genders.includes(product.gender);
}

function productMatchesPrice(
  product: Product,
  priceRange: CatalogFilters["priceRange"],
): boolean {
  if (priceRange === undefined) return true;
  return (
    product.priceArs >= priceRange.min && product.priceArs <= priceRange.max
  );
}

function productMatchesSearch(
  product: Product,
  brandName: string,
  normalizedTerm: string,
): boolean {
  if (normalizedTerm.length === 0) return true;
  const haystack = [
    product.name,
    brandName,
    product.concentration,
    ...(product.notes ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(normalizedTerm);
}

export interface ProductFilterContext {
  readonly brandName: string;
}

export function productMatchesFilters(
  product: Product,
  filters: CatalogFilters,
  context: ProductFilterContext,
): boolean {
  const normalizedTerm = normalizeSearchTerm(filters.searchTerm);
  return (
    productMatchesCatalog(product, filters.catalog) &&
    productMatchesBrand(product, filters.brandIds) &&
    productMatchesGender(product, filters.genders) &&
    productMatchesPrice(product, filters.priceRange) &&
    productMatchesSearch(product, context.brandName, normalizedTerm)
  );
}

export function getProductsByCatalog(
  products: readonly Product[],
  catalog: Catalog,
): readonly Product[] {
  return products.filter((p) => p.catalog === catalog);
}

export function getPriceRangeFor(
  products: readonly Product[],
): { min: number; max: number } {
  // Política de UX: el slider siempre arranca en 0 (psicológicamente más limpio
  // que un mínimo arbitrario como $118.000), y termina en un número redondo
  // múltiplo de 50.000 por encima del precio máximo real. Esto evita números
  // feos en los topes y deja un colchón si el catálogo crece levemente.
  if (products.length === 0) {
    return { min: 0, max: 50000 };
  }
  let actualMax = products[0]!.priceArs;
  for (const product of products) {
    if (product.priceArs > actualMax) actualMax = product.priceArs;
  }
  const STEP = 50000;
  const roundedMax = Math.max(STEP, Math.ceil(actualMax / STEP) * STEP);
  return { min: 0, max: roundedMax };
}

export const EMPTY_FILTERS: CatalogFilters = {
  catalog: DEFAULT_CATALOG,
  brandIds: [],
  genders: [],
  searchTerm: "",
};
