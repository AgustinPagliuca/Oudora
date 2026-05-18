// @ts-check
/**
 * Sync del catálogo desde Supabase a un archivo TypeScript autogenerado.
 *
 * - Lee SUPABASE_URL y SUPABASE_KEY del entorno (.env local o Vercel)
 * - Descarga marcas y productos respetando el orden
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
 * @property {boolean | null} featured
 * @property {string | null} image_url
 */

async function fetchBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("id, slug, name, catalog")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`brands: ${error.message}`);
  if (!data || data.length === 0) throw new Error("brands: la tabla vino vacía");
  return /** @type {BrandRow[]} */ (data);
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, brand_id, catalog, name, gender, concentration, volume_ml, price_ars, stock, notes, featured, image_url",
    )
    .order("brand_id", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(`products: ${error.message}`);
  if (!data || data.length === 0) throw new Error("products: la tabla vino vacía");
  return /** @type {ProductRow[]} */ (data);
}

/**
 * Convierte snake_case de la DB a camelCase del modelo TS.
 * @param {ProductRow} row
 */
function transformProduct(row) {
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
    ...(row.featured ? { featured: true } : {}),
    ...(row.image_url ? { imageUrl: row.image_url } : {}),
  };
}

/**
 * @param {BrandRow[]} brandsRaw
 * @param {ProductRow[]} productsRaw
 */
function buildOutput(brandsRaw, productsRaw) {
  const brands = brandsRaw.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    catalog: b.catalog,
  }));
  const products = productsRaw.map(transformProduct);
  const generatedAt = new Date().toISOString();
  return {
    text: `// ════════════════════════════════════════════════════════════
//  ARCHIVO AUTOGENERADO · NO EDITAR A MANO
// ════════════════════════════════════════════════════════════
//
//  Generado por: scripts/sync-catalog.mjs
//  Fuente:       Supabase (tabla public.brands y public.products)
//  Última sync:  ${generatedAt}
//
//  Para regenerar: pnpm run sync
//
// ════════════════════════════════════════════════════════════

import type { Brand, Product } from "@/types/catalog";

export const BRANDS: readonly Brand[] = ${JSON.stringify(brands, null, 2)};

export const PRODUCTS: readonly Product[] = ${JSON.stringify(products, null, 2)};
`,
    brands,
    products,
  };
}

async function main() {
  console.log("[sync-catalog] Descargando catálogo desde Supabase…");
  const [brandsRaw, productsRaw] = await Promise.all([
    fetchBrands(),
    fetchProducts(),
  ]);

  const { text, brands, products } = buildOutput(brandsRaw, productsRaw);

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

  console.log(`[sync-catalog] ✓ ${brands.length} marcas`);
  console.log(
    `[sync-catalog] ✓ ${products.length} productos (${arabeCount} árabes, ${disenadorCount} diseñador, ${featuredCount} destacados)`,
  );
  console.log(`[sync-catalog] → ${outputPath}`);
}

main().catch((err) => {
  console.error("[sync-catalog] FALLÓ:", err.message);
  process.exit(1);
});
