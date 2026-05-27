import type {
  Brand,
  CartItem,
  CartLine,
  CartSnapshot,
  Product,
} from "@/types/catalog";

/**
 * Almacenamiento del carrito en el navegador.
 *
 * Diseño:
 *  - El estado se persiste en localStorage bajo una sola clave.
 *  - Se serializa solo {productId, quantity}: nada de joins ni precios.
 *    Los precios se recalculan al render usando el catálogo actual.
 *  - Suscripciones por evento: cualquier consumidor (Nav, drawer) escucha
 *    el evento "oudora:cart-changed" y vuelve a renderizar.
 *
 * Esto evita estado duplicado, mantiene una sola fuente de verdad
 * y deja preparada la migración futura a Supabase: los métodos
 * `getItems`, `addItem`, etc. son la interfaz pública estable.
 */

const STORAGE_KEY = "oudora.cart.v1";
const CHANGE_EVENT = "oudora:cart-changed";
const MAX_QUANTITY_PER_ITEM = 99;

type Listener = (snapshot: CartSnapshot) => void;

interface ResolveContext {
  readonly products: ReadonlyMap<string, Product>;
  readonly brands: ReadonlyMap<string, Brand>;
}

function readRawItems(): CartItem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

function isValidCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.productId === "string" &&
    typeof candidate.quantity === "number" &&
    Number.isFinite(candidate.quantity) &&
    candidate.quantity > 0
  );
}

function writeRawItems(items: readonly CartItem[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity < 1) return 1;
  if (quantity > MAX_QUANTITY_PER_ITEM) return MAX_QUANTITY_PER_ITEM;
  return Math.floor(quantity);
}

function resolveSnapshot(
  items: readonly CartItem[],
  context: ResolveContext,
): CartSnapshot {
  const lines: CartLine[] = [];
  let total = 0;
  let itemCount = 0;

  for (const item of items) {
    const product = context.products.get(item.productId);
    if (product === undefined) continue;
    const brand = context.brands.get(product.brandId);
    if (brand === undefined) continue;
    const quantity = clampQuantity(item.quantity);
    const lineTotal = product.priceArs * quantity;
    lines.push({ product, brand, quantity, lineTotal });
    total += lineTotal;
    itemCount += quantity;
  }

  return { lines, itemCount, total };
}

function dispatchChange(snapshot: CartSnapshot): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CartSnapshot>(CHANGE_EVENT, { detail: snapshot }),
  );
}

export class CartStore {
  private items: CartItem[];
  private readonly context: ResolveContext;

  constructor(context: ResolveContext) {
    this.context = context;
    this.items = readRawItems();
  }

  getSnapshot(): CartSnapshot {
    return resolveSnapshot(this.items, this.context);
  }

  /**
   * Clampea una cantidad solicitada al stock disponible del producto.
   * Si el producto no se conoce (raro: el catálogo cambió), devolvemos
   * la cantidad tal cual y dejamos que el resolver del snapshot la marque
   * como "fuera de stock" o ignore la línea. Si el stock es 0, devuelve 0
   * (el caller debe decidir si remover la línea).
   */
  private clampToStock(productId: string, quantity: number): number {
    const product = this.context.products.get(productId);
    if (product === undefined) {
      return quantity;
    }
    if (product.stock <= 0) {
      return 0;
    }
    return Math.min(quantity, product.stock);
  }

  addItem(productId: string, quantity = 1): CartSnapshot {
    const safeQuantity = clampQuantity(quantity);
    const existingIndex = this.items.findIndex(
      (item) => item.productId === productId,
    );
    if (existingIndex >= 0) {
      const previous = this.items[existingIndex];
      if (previous !== undefined) {
        const desired = clampQuantity(previous.quantity + safeQuantity);
        const clamped = this.clampToStock(productId, desired);
        if (clamped <= 0) {
          // Producto sin stock: removemos la línea para mantener el carrito consistente
          this.items = this.items.filter((_, idx) => idx !== existingIndex);
        } else {
          const merged: CartItem = {
            productId: previous.productId,
            quantity: clamped,
          };
          this.items = this.items.map((item, index) =>
            index === existingIndex ? merged : item,
          );
        }
      }
    } else {
      const clamped = this.clampToStock(productId, safeQuantity);
      if (clamped > 0) {
        this.items = [...this.items, { productId, quantity: clamped }];
      }
    }
    return this.persistAndNotify();
  }

  setQuantity(productId: string, quantity: number): CartSnapshot {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    const clamped = this.clampToStock(productId, clampQuantity(quantity));
    if (clamped <= 0) {
      return this.removeItem(productId);
    }
    this.items = this.items.map((item) =>
      item.productId === productId
        ? { productId, quantity: clamped }
        : item,
    );
    return this.persistAndNotify();
  }

  removeItem(productId: string): CartSnapshot {
    this.items = this.items.filter((item) => item.productId !== productId);
    return this.persistAndNotify();
  }

  clear(): CartSnapshot {
    this.items = [];
    return this.persistAndNotify();
  }

  subscribe(listener: Listener): () => void {
    if (typeof window === "undefined") {
      return () => undefined;
    }
    const handler = (event: Event): void => {
      const custom = event as CustomEvent<CartSnapshot>;
      listener(custom.detail);
    };
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }

  private persistAndNotify(): CartSnapshot {
    writeRawItems(this.items);
    const snapshot = this.getSnapshot();
    dispatchChange(snapshot);
    return snapshot;
  }
}
