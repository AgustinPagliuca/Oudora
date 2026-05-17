import type {
  Brand,
  BrandWithCount,
  Product,
  ProductsByBrand,
  StockStatus,
} from "@/types/catalog";
import {
  LAST_UNIT_THRESHOLD,
  LOW_STOCK_THRESHOLD,
} from "@/constants/ui";

/**
 * Operaciones de agrupación y conteo. Funciones puras.
 */

export function groupProductsByBrand(
  products: readonly Product[],
  brands: readonly Brand[],
): readonly ProductsByBrand[] {
  const result: ProductsByBrand[] = [];
  for (const brand of brands) {
    const matching = products.filter((p) => p.brandId === brand.id);
    if (matching.length > 0) {
      result.push({ brand, products: matching });
    }
  }
  return result;
}

export function countProductsByBrand(
  products: readonly Product[],
  brands: readonly Brand[],
): readonly BrandWithCount[] {
  return brands.map((brand) => ({
    ...brand,
    productCount: products.filter((p) => p.brandId === brand.id).length,
  }));
}

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out_of_stock";
  if (stock <= LAST_UNIT_THRESHOLD) return "last_unit";
  if (stock <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

export function getStockLabel(stock: number): string | null {
  const status = getStockStatus(stock);
  if (status === "last_unit") return "Última";
  if (status === "low_stock") return `${stock} disp.`;
  if (status === "out_of_stock") return "Agotado";
  return null;
}
