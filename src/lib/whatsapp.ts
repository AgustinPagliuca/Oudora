import type { CartSnapshot } from "@/types/catalog";
import { CONTACT, SITE_METADATA } from "@/constants/ui";
import { formatArs, formatPresentation } from "./format";

/**
 * Construye el mensaje de pedido para enviar por WhatsApp y la URL
 * de wa.me con el texto codificado. No envía nada por sí mismo:
 * el llamador abre la URL en una nueva pestaña.
 */

const ORDER_HEADER = `*Pedido ${SITE_METADATA.name}*`;
const ORDER_FOOTER = "¡Hola! Quiero hacer este pedido. ¿Confirmás disponibilidad y forma de pago?";

function buildLineText(line: CartSnapshot["lines"][number]): string {
  const presentation = formatPresentation(
    line.product.concentration,
    line.product.volumeMl,
  );
  return `${line.quantity}× ${line.brand.name} ${line.product.name} (${presentation}) — ${formatArs(line.lineTotal)}`;
}

export function buildWhatsAppMessage(snapshot: CartSnapshot): string {
  if (snapshot.lines.length === 0) {
    return "";
  }
  const itemsBlock = snapshot.lines.map(buildLineText).join("\n");
  return [
    ORDER_HEADER,
    "",
    itemsBlock,
    "",
    `*Total: ${formatArs(snapshot.total)}*`,
    "",
    ORDER_FOOTER,
  ].join("\n");
}

export function buildWhatsAppCheckoutUrl(snapshot: CartSnapshot): string | null {
  const message = buildWhatsAppMessage(snapshot);
  if (message.length === 0) return null;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CONTACT.whatsappE164}?text=${encoded}`;
}
