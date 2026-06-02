// @ts-check
/**
 * Sync del catálogo desde Supabase a un archivo TypeScript autogenerado.
 *
 * - Lee SUPABASE_URL y SUPABASE_KEY del entorno (.env local o Vercel)
 * - Descarga marcas, productos, e imágenes asociadas
 * - Escribe src/data/catalog.generated.ts con constantes tipadas
 *
 * Se corre manualmente con `pnpm run sync` y automáticamente antes
 * de cada build de Vercel vía el hook `prebuild` en package.json.
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "[sync-catalog] Faltan SUPABASE_URL o SUPABASE_KEY en el entorno.\n" +
      "  Local: crear .env basado en .env.example\n" +
      "  Vercel: agregar las dos variables en Project Settings → Environment Variables",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * @typedef {Object} BrandRow
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} catalog
 * @property {boolean} [is_active]
 */

/**
 * @typedef {Object} ProductRow
 * @property {string} id
 * @property {string} slug
 * @property {string} brand_id
 * @property {string} catalog
 * @property {string} name
 * @property {string} gender
 * @property {string} concentration
 * @property {number} volume_ml
 * @property {number} price_ars
 * @property {number} stock
 * @property {string[] | null} notes
 * @property {string | null} [description]
 * @property {boolean | null} featured
 * @property {boolean} [is_active]
 * @property {string | null} image_url
 * @property {Array<{text: string, color: string}> | null} labels
 */

/**
 * @typedef {Object} ImageRow
 * @property {string} product_id
 * @property {string} url
 * @property {number} position
 */

/**
 * @typedef {Object} ReviewRow
 * @property {string} id
 * @property {string} author_name
 * @property {string} body
 * @property {number | null} rating
 * @property {boolean} featured
 * @property {boolean} published
 * @property {number} sort_order
 * @property {string} created_at
 */

/**
 * @typedef {Object} ReelRow
 * @property {string} id
 * @property {string} title
 * @property {string} thumbnail_url
 * @property {string} thumbnail_path
 * @property {string} instagram_url
 * @property {string | null} duration
 * @property {number} sort_order
 * @property {boolean} published
 * @property {string} created_at
 */

/**
 * @typedef {Object} AnnouncementRow
 * @property {string} id
 * @property {string} text
 * @property {string | null} icon
 * @property {number} sort_order
 * @property {boolean} published
 * @property {string} created_at
 */

/**
 * @typedef {Object} HeroSlideRow
 * @property {string} id
 * @property {string | null} overline
 * @property {string} title
 * @property {string | null} subtitle
 * @property {string} image_url
 * @property {string} image_path
 * @property {string | null} cta_label
 * @property {string | null} cta_href
 * @property {number} sort_order
 * @property {boolean} published
 * @property {string} created_at
 */

async function fetchBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("id, slug, name, catalog, is_active")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`brands: ${error.message}`);
  if (!data || data.length === 0) throw new Error("brands: la tabla vino vacía");
  return /** @type {BrandRow[]} */ (data);
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, brand_id, catalog, name, gender, concentration, volume_ml, price_ars, stock, notes, description, featured, is_active, image_url, labels",
    )
    .order("brand_id", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(`products: ${error.message}`);
  if (!data || data.length === 0) throw new Error("products: la tabla vino vacía");
  return /** @type {ProductRow[]} */ (data);
}

async function fetchImages() {
  const { data, error } = await supabase
    .from("product_images")
    .select("product_id, url, position")
    .order("position", { ascending: true });
  // La tabla puede no existir en projects viejos sin la migración; tolerante.
  if (error) {
    console.warn(`[sync-catalog] product_images no disponible: ${error.message}`);
    return /** @type {ImageRow[]} */ ([]);
  }
  return /** @type {ImageRow[]} */ (data ?? []);
}

async function fetchReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, author_name, body, rating, featured, published, sort_order, created_at")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.warn(`[sync-catalog] reviews no disponible: ${error.message}`);
    return [];
  }
  return data ?? [];
}

async function fetchReels() {
  const { data, error } = await supabase
    .from("reels")
    .select("id, title, thumbnail_url, thumbnail_path, instagram_url, duration, sort_order, published, created_at")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.warn(`[sync-catalog] reels no disponible: ${error.message}`);
    return [];
  }
  return data ?? [];
}

async function fetchAnnouncements() {
  const { data, error } = await supabase
    .from("announcements")
    .select("id, text, icon, sort_order, published, created_at")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.warn(`[sync-catalog] announcements no disponible: ${error.message}`);
    return [];
  }
  return data ?? [];
}

async function fetchHeroSlides() {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, overline, title, subtitle, image_url, image_path, cta_label, cta_href, sort_order, published, created_at")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.warn(`[sync-catalog] hero_slides no disponible: ${error.message}`);
    return [];
  }
  return data ?? [];
}

/**
 * Convierte snake_case de la DB a camelCase del modelo TS.
 * @param {ProductRow} row
 * @param {Map<string, {url: string, position: number}[]>} imagesByProduct
 */
function transformProduct(row, imagesByProduct) {
  const productImages = imagesByProduct.get(row.id) ?? [];
  const validLabels = Array.isArray(row.labels)
    ? row.labels
        .filter((l) => l && typeof l.text === "string" && l.text.trim().length > 0)
        .map((l) => ({
          text: l.text.trim(),
          color: ["dark", "red", "gold"].includes(l.color) ? l.color : "dark",
        }))
        .slice(0, 3)
    : [];
  return {
    id: row.id,
    slug: row.slug,
    brandId: row.brand_id,
    catalog: row.catalog,
    name: row.name,
    gender: row.gender,
    concentration: row.concentration,
    volumeMl: row.volume_ml,
    priceArs: row.price_ars,
    stock: row.stock,
    ...(Array.isArray(row.notes) && row.notes.length > 0
      ? { notes: row.notes }
      : {}),
    ...(typeof row.description === "string" && row.description.trim().length > 0
      ? { description: row.description.trim() }
      : {}),
    ...(row.featured ? { featured: true } : {}),
    ...(row.image_url ? { imageUrl: row.image_url } : {}),
    ...(productImages.length > 0 ? { images: productImages } : {}),
    ...(validLabels.length > 0 ? { labels: validLabels } : {}),
  };
}

/**
 * @param {BrandRow[]} brandsRaw
 * @param {ProductRow[]} productsRaw
 * @param {ImageRow[]} imagesRaw
 * @param {ReviewRow[]} [reviewsRaw]
 * @param {ReelRow[]} [reelsRaw]
 * @param {AnnouncementRow[]} [announcementsRaw]
 * @param {HeroSlideRow[]} [heroSlidesRaw]
 */
function buildOutput(brandsRaw, productsRaw, imagesRaw, reviewsRaw = [], reelsRaw = [], announcementsRaw = [], heroSlidesRaw = []) {
  // Filtrar marcas marcadas como ocultas (is_active = false). Si la columna no
  // existe todavía (proyecto pre-migración), `is_active` viene undefined y lo
  // tratamos como visible. Esto hace que la migración sea retro-compatible.
  const brandsActive = brandsRaw.filter((b) => b.is_active !== false);
  const activeBrandIds = new Set(brandsActive.map((b) => b.id));

  const brands = brandsActive.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    catalog: b.catalog,
  }));

  /** @type {Map<string, {url: string, position: number}[]>} */
  const imagesByProduct = new Map();
  for (const img of imagesRaw) {
    const existing = imagesByProduct.get(img.product_id);
    const bucket = existing ?? [];
    if (existing === undefined) {
      imagesByProduct.set(img.product_id, bucket);
    }
    bucket.push({
      url: img.url,
      position: img.position,
    });
  }

  // Productos: filtramos los marcados como ocultos Y los huérfanos cuya marca
  // quedó oculta. Si un cliente entra con bookmark a un producto oculto, le
  // dará 404 (la ruta no se genera). Es el comportamiento esperado.
  const productsActive = productsRaw.filter(
    (p) => p.is_active !== false && activeBrandIds.has(p.brand_id),
  );

  const products = productsActive.map((p) => transformProduct(p, imagesByProduct));

  const reviews = reviewsRaw.map((r) => ({
    id: r.id,
    authorName: r.author_name,
    body: r.body,
    rating: r.rating,
    featured: r.featured,
    published: r.published,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
  }));

  const reels = reelsRaw.map((r) => ({
    id: r.id,
    title: r.title,
    thumbnailUrl: r.thumbnail_url,
    thumbnailPath: r.thumbnail_path,
    instagramUrl: r.instagram_url,
    duration: r.duration,
    sortOrder: r.sort_order,
    published: r.published,
    createdAt: r.created_at,
  }));

  const announcements = announcementsRaw.map((a) => ({
    id: a.id,
    text: a.text,
    icon: a.icon,
    sortOrder: a.sort_order,
    published: a.published,
    createdAt: a.created_at,
  }));

  const heroSlides = heroSlidesRaw.map((h) => ({
    id: h.id,
    overline: h.overline,
    title: h.title,
    subtitle: h.subtitle,
    imageUrl: h.image_url,
    imagePath: h.image_path,
    ctaLabel: h.cta_label,
    ctaHref: h.cta_href,
    sortOrder: h.sort_order,
    published: h.published,
    createdAt: h.created_at,
  }));

  const generatedAt = new Date().toISOString();
  return {
    text: `// ════════════════════════════════════════════════════════════
//  ARCHIVO AUTOGENERADO · NO EDITAR A MANO
// ════════════════════════════════════════════════════════════
//
//  Generado por: scripts/sync-catalog.mjs
//  Fuente:       Supabase (brands, products, product_images, reviews, reels, announcements, hero_slides)
//  Última sync:  ${generatedAt}
//
//  Para regenerar: pnpm run sync
//
// ════════════════════════════════════════════════════════════

import type { Brand, Product, Review, Reel, Announcement, HeroSlide } from "@/types/catalog";

export const BRANDS: readonly Brand[] = ${JSON.stringify(brands, null, 2)};

export const PRODUCTS: readonly Product[] = ${JSON.stringify(products, null, 2)};

export const REVIEWS: readonly Review[] = ${JSON.stringify(reviews, null, 2)};

export const REELS: readonly Reel[] = ${JSON.stringify(reels, null, 2)};

export const ANNOUNCEMENTS: readonly Announcement[] = ${JSON.stringify(announcements, null, 2)};

export const HERO_SLIDES: readonly HeroSlide[] = ${JSON.stringify(heroSlides, null, 2)};
`,
    brands,
    products,
    imageCount: imagesRaw.length,
    reviewCount: reviews.length,
    reelCount: reels.length,
    announcementCount: announcements.length,
    heroSlideCount: heroSlides.length,
  };
}

async function main() {
  console.log("[sync-catalog] Descargando catálogo desde Supabase…");
  const [brandsRaw, productsRaw, imagesRaw, reviewsRaw, reelsRaw, announcementsRaw, heroSlidesRaw] = await Promise.all([
    fetchBrands(),
    fetchProducts(),
    fetchImages(),
    fetchReviews(),
    fetchReels(),
    fetchAnnouncements(),
    fetchHeroSlides(),
  ]);

  const { text, brands, products, imageCount, reviewCount, reelCount, announcementCount, heroSlideCount } = buildOutput(
    brandsRaw,
    productsRaw,
    imagesRaw,
    reviewsRaw,
    reelsRaw,
    announcementsRaw,
    heroSlidesRaw,
  );

  const brandIds = new Set(brands.map((b) => b.id));
  const orphans = products.filter((p) => !brandIds.has(p.brandId));
  if (orphans.length > 0) {
    throw new Error(
      `Productos sin marca válida: ${orphans.map((p) => p.id).join(", ")}`,
    );
  }

  const outputPath = resolve("src/data/catalog.generated.ts");
  writeFileSync(outputPath, text, "utf-8");

  const arabeCount = products.filter((p) => p.catalog === "arabe").length;
  const disenadorCount = products.filter(
    (p) => p.catalog === "disenador",
  ).length;
  const featuredCount = products.filter((p) => p.featured).length;
  const withImages = products.filter((p) => p.images !== undefined).length;

  console.log(`[sync-catalog] ✓ ${brands.length} marcas`);
  if (brandsRaw.length > brands.length) {
    console.log(`[sync-catalog]   ↳ ${brandsRaw.length - brands.length} marca(s) oculta(s) en admin: se omiten`);
  }
  console.log(
    `[sync-catalog] ✓ ${products.length} productos (${arabeCount} árabes, ${disenadorCount} diseñador, ${featuredCount} destacados)`,
  );
  if (productsRaw.length > products.length) {
    console.log(`[sync-catalog]   ↳ ${productsRaw.length - products.length} producto(s) oculto(s) o sin marca activa: se omiten`);
  }
  console.log(`[sync-catalog] ✓ ${imageCount} imágenes (${withImages} productos con foto)`);
  console.log(`[sync-catalog] ✓ ${reviewCount} reseñas publicadas`);
  console.log(`[sync-catalog] ✓ ${reelCount} reels publicados`);
  console.log(`[sync-catalog] ✓ ${announcementCount} avisos publicados`);
  console.log(`[sync-catalog] ✓ ${heroSlideCount} slides hero publicados`);
  console.log(`[sync-catalog] → ${outputPath}`);
}

main().catch((err) => {
  console.error("[sync-catalog] FALLÓ:", err.message);
  process.exit(1);
});
