/**
 * Wrappers seguros sobre el Meta Pixel (window.fbq).
 *
 * El pixel se carga en el <head> vía MetaPixel.astro. Estos helpers no
 * fallan si fbq todavía no cargó o si un bloqueador de anuncios lo bloqueó:
 * simplemente no hacen nada. Así el sitio nunca se rompe por analytics.
 */

type FbqArgs =
  | [track: "track", event: string, params?: Record<string, unknown>]
  | [track: "trackCustom", event: string, params?: Record<string, unknown>];

interface WindowWithFbq extends Window {
  fbq?: (...args: FbqArgs) => void;
}

function track(
  event: string,
  params?: Record<string, unknown>,
): void {
  const w = window as WindowWithFbq;
  if (typeof w.fbq !== "function") return;
  w.fbq("track", event, params);
}

/** Cuando alguien agrega un producto al carrito. */
export function trackAddToCart(params: {
  contentName: string;
  contentId: string;
  value: number;
  quantity: number;
}): void {
  track("AddToCart", {
    content_name: params.contentName,
    content_ids: [params.contentId],
    content_type: "product",
    value: params.value,
    currency: "ARS",
    contents: [{ id: params.contentId, quantity: params.quantity }],
  });
}

/** Cuando alguien inicia el checkout (toca "Iniciar compra"). */
export function trackInitiateCheckout(params: {
  value: number;
  numItems: number;
}): void {
  track("InitiateCheckout", {
    value: params.value,
    currency: "ARS",
    num_items: params.numItems,
  });
}
