import type { Product } from "@/types/catalog";
import { PRODUCTS as GENERATED_PRODUCTS } from "./catalog.generated";

/**
 * Productos del catálogo. Los datos vienen sincronizados desde Supabase
 * vía `scripts/sync-catalog.mjs` que regenera `catalog.generated.ts`.
 *
 * Para agregar o modificar productos:
 *  1. Hacelo desde el panel admin (cuando esté implementado) o desde
 *     el Table Editor de Supabase.
 *  2. Corré `pnpm run sync` localmente para refrescar el archivo
 *     autogenerado (o esperá al próximo deploy de Vercel, que lo
 *     hace automático).
 */
export const PRODUCTS: readonly Product[] = GENERATED_PRODUCTS;
