/**
 * Modelo de datos del catálogo de OUDORA.
 * Fuente única de verdad para tipos compartidos entre componentes,
 * datos y lógica de filtrado.
 */

export type Catalog = "arabe" | "disenador";

export type Gender = "femenino" | "masculino" | "unisex";

export type Concentration = "EDP" | "EDT" | "Extrait" | "Parfum";

export type StockStatus = "in_stock" | "low_stock" | "last_unit" | "out_of_stock";

export interface Brand {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly catalog: Catalog;
}

export interface ProductImage {
  readonly url: string;
  readonly position: number;
}

export interface Product {
  readonly id: string;
  readonly slug: string;
  readonly brandId: Brand["id"];
  readonly catalog: Catalog;
  readonly name: string;
  readonly gender: Gender;
  readonly concentration: Concentration;
  readonly volumeMl: number;
  readonly priceArs: number;
  readonly stock: number;
  readonly notes?: readonly string[];
  readonly description?: string;
  readonly imageUrl?: string;
  readonly images?: readonly ProductImage[];
  readonly featured?: boolean;
}

export interface CartItem {
  readonly productId: Product["id"];
  readonly quantity: number;
}

export interface CartLine {
  readonly product: Product;
  readonly brand: Brand;
  readonly quantity: number;
  readonly lineTotal: number;
}

export interface CartSnapshot {
  readonly lines: readonly CartLine[];
  readonly itemCount: number;
  readonly total: number;
}

export interface CatalogFilters {
  readonly catalog: Catalog;
  readonly brandIds: readonly string[];
  readonly genders: readonly Gender[];
  readonly searchTerm: string;
  readonly priceRange?: PriceRange;
}

export interface PriceRange {
  readonly min: number;
  readonly max: number;
}

export interface BrandWithCount extends Brand {
  readonly productCount: number;
}

export interface ProductsByBrand {
  readonly brand: Brand;
  readonly products: readonly Product[];
}

export interface Review {
  readonly id: string;
  readonly authorName: string;
  readonly body: string;
  readonly rating: number | null;
  readonly featured: boolean;
  readonly published: boolean;
  readonly sortOrder: number;
  readonly createdAt: string;
}

export interface Reel {
  readonly id: string;
  readonly title: string;
  readonly thumbnailUrl: string;
  readonly thumbnailPath: string;
  readonly instagramUrl: string;
  readonly duration: string | null;
  readonly sortOrder: number;
  readonly published: boolean;
  readonly createdAt: string;
}

export type AnnouncementIcon =
  | "truck"
  | "gift"
  | "percent"
  | "credit-card"
  | "star"
  | "clock"
  | "map-pin";

export interface Announcement {
  readonly id: string;
  readonly text: string;
  readonly icon: AnnouncementIcon | null;
  readonly sortOrder: number;
  readonly published: boolean;
  readonly createdAt: string;
}

export interface HeroSlide {
  readonly id: string;
  readonly overline: string | null;
  readonly title: string;
  readonly subtitle: string | null;
  readonly imageUrl: string;
  readonly imagePath: string;
  readonly ctaLabel: string | null;
  readonly ctaHref: string | null;
  readonly sortOrder: number;
  readonly published: boolean;
  readonly createdAt: string;
}
