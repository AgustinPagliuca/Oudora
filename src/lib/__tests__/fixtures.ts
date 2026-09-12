import type { Brand, Product } from "@/types/catalog";

/**
 * Fixtures mínimos para los tests. Solo los campos obligatorios del tipo:
 * cada test sobreescribe lo que necesita vía el parámetro `overrides`.
 */

export function makeBrand(overrides: Partial<Brand> = {}): Brand {
  return {
    id: "brand-lattafa",
    slug: "lattafa",
    name: "Lattafa",
    catalog: "arabe",
    ...overrides,
  };
}

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "prod-asad",
    slug: "asad",
    brandId: "brand-lattafa",
    catalog: "arabe",
    name: "Asad",
    gender: "masculino",
    concentration: "EDP",
    volumeMl: 100,
    priceArs: 50000,
    stock: 10,
    ...overrides,
  };
}

/** Contexto que espera el constructor de CartStore. */
export function makeContext(
  products: readonly Product[],
  brands: readonly Brand[],
): {
  products: ReadonlyMap<string, Product>;
  brands: ReadonlyMap<string, Brand>;
} {
  return {
    products: new Map(products.map((p) => [p.id, p])),
    brands: new Map(brands.map((b) => [b.id, b])),
  };
}

/**
 * localStorage falso para el entorno node. CartStore lo detecta con
 * `typeof localStorage === "undefined"`, así que basta con definirlo
 * en globalThis para que el camino de persistencia se ejecute de verdad.
 */
export function installLocalStorage(): void {
  const store = new Map<string, string>();
  const mock = {
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      store.set(key, value);
    },
    removeItem: (key: string): void => {
      store.delete(key);
    },
    clear: (): void => {
      store.clear();
    },
    key: (index: number): string | null => [...store.keys()][index] ?? null,
    get length(): number {
      return store.size;
    },
  };
  (globalThis as { localStorage?: unknown }).localStorage = mock;
}

export function uninstallLocalStorage(): void {
  delete (globalThis as { localStorage?: unknown }).localStorage;
}
