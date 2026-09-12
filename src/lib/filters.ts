import type { Catalog, Product } from "@/types/catalog";

/**
 * Filtros puros sobre productos. Sin estado, sin efectos secundarios.
 * Cada función responde una pregunta clara y devuelve booleano o array.
 */

export function normalizeSearchTerm(raw: string): string {
  return raw.trim().toLowerCase();
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
