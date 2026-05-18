import type { Brand, Catalog } from "@/types/catalog";
import { BRANDS as GENERATED_BRANDS } from "./catalog.generated";

/**
 * Marcas del catálogo. Los datos vienen sincronizados desde Supabase
 * vía `scripts/sync-catalog.mjs` que regenera `catalog.generated.ts`.
 *
 * Este archivo expone los helpers de acceso. El consumo desde el
 * resto del código no cambia.
 */
export const BRANDS: readonly Brand[] = GENERATED_BRANDS;

export const BRANDS_BY_ID: ReadonlyMap<string, Brand> = new Map(
  BRANDS.map((brand) => [brand.id, brand]),
);

export function getBrandById(brandId: string): Brand | undefined {
  return BRANDS_BY_ID.get(brandId);
}

export function getBrandsByCatalog(catalog: Catalog): readonly Brand[] {
  return BRANDS.filter((brand) => brand.catalog === catalog);
}
