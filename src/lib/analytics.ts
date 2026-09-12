/**
 * Wrappers seguros sobre el dataLayer de Google Tag Manager.
 *
 * El contenedor de GTM se carga en el <head> vía GoogleTagManager.astro, y
 * desde su interfaz se decide qué tags disparan con cada evento (Meta Pixel,
 * GA4, etc.). Acá solo empujamos los eventos estándar de ecommerce.
 *
 * Si GTM todavía no cargó o un bloqueador lo frenó, el dataLayer igual existe
 * como array plano y los eventos quedan encolados sin romper nada.
 */

const CURRENCY = "ARS";

/** Item de ecommerce según la convención de GA4 / GTM. */
export interface AnalyticsItem {
  readonly item_id: string;
  readonly item_name: string;
  readonly item_brand?: string;
  readonly price: number;
  readonly quantity: number;
}

interface EcommercePayload {
  readonly currency: string;
  readonly value: number;
  readonly items: readonly AnalyticsItem[];
  readonly [key: string]: unknown;
}

interface DataLayerEntry {
  readonly event?: string;
  readonly ecommerce?: EcommercePayload | null;
}

interface WindowWithDataLayer extends Window {
  dataLayer?: DataLayerEntry[];
}

function pushEcommerce(event: string, ecommerce: EcommercePayload): void {
  if (typeof window === "undefined") return;
  const w = window as WindowWithDataLayer;
  // GTM crea el dataLayer al cargar, pero puede no haber llegado todavía:
  // lo inicializamos nosotros para no perder el evento.
  const dataLayer = (w.dataLayer ??= []);
  // Limpiar el ecommerce previo evita que GTM arrastre datos de un evento
  // al siguiente (recomendación oficial de GA4).
  dataLayer.push({ ecommerce: null });
  dataLayer.push({ event, ecommerce });
}

/** Cuando alguien agrega un producto al carrito. */
export function trackAddToCart(params: {
  contentName: string;
  contentId: string;
  brandName?: string;
  value: number;
  quantity: number;
}): void {
  const unitPrice = params.quantity > 0
    ? params.value / params.quantity
    : params.value;
  pushEcommerce("add_to_cart", {
    currency: CURRENCY,
    value: params.value,
    items: [
      {
        item_id: params.contentId,
        item_name: params.contentName,
        ...(params.brandName === undefined
          ? {}
          : { item_brand: params.brandName }),
        price: unitPrice,
        quantity: params.quantity,
      },
    ],
  });
}

/** Cuando alguien inicia el checkout (toca "Iniciar compra"). */
export function trackInitiateCheckout(params: {
  value: number;
  numItems: number;
  items?: readonly AnalyticsItem[];
}): void {
  pushEcommerce("begin_checkout", {
    currency: CURRENCY,
    value: params.value,
    items: params.items ?? [],
    num_items: params.numItems,
  });
}
