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

export function getStockLabel(_stock: number): string | null {
  // Política de UX: el comprador no ve ninguna info de stock. Ni cantidades,
  // ni "última", ni "agotado". Si un producto está sin stock, el detalle
  // muestra un CTA para consultar por WhatsApp en lugar del botón habitual.
  // El stock real solo lo ve el vendedor en el panel admin.
  return null;
}
