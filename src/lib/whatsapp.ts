import type { CartSnapshot } from "@/types/catalog";
import { CONTACT, SITE_METADATA } from "@/constants/ui";
import { PICKUP_POINT, SHIPPING_METHODS } from "@/constants/checkout";
import type { BuyerData } from "@/lib/checkout-validation";
import { formatArs, formatPresentation } from "./format";

/**
 * Construye el mensaje + URL de wa.me para finalizar un pedido por WhatsApp.
 * Lo usa el checkout-controller al cerrar la compra. No envía nada por sí mismo:
 * el llamador abre la URL en una nueva pestaña.
 */

const ORDER_HEADER = `*Pedido ${SITE_METADATA.name}*`;

function buildLineText(line: CartSnapshot["lines"][number]): string {
  const presentation = formatPresentation(
    line.product.concentration,
    line.product.volumeMl,
  );
  return `${line.quantity}× ${line.brand.name} ${line.product.name} (${presentation}) — ${formatArs(line.lineTotal)}`;
}

/**
 * Mensaje completo del checkout v1.0: items + datos del comprador formateados
 * para que el vendedor confirme stock, cotice envío (si aplica) y mande link de MP.
 */
export function buildWhatsAppFullCheckoutMessage(
  snapshot: CartSnapshot,
  buyer: BuyerData,
): string {
  const itemsBlock = snapshot.lines.map(buildLineText).join("\n");
  const shippingMethodLabel = SHIPPING_METHODS[buyer.shippingMethod].label;

  const fullName = buyer.lastName === null
    ? buyer.firstName
    : `${buyer.firstName} ${buyer.lastName}`;

  const shippingBlock = buyer.shippingMethod === "retiro"
    ? [
        "*Envío:* Retiro en " + PICKUP_POINT.city,
        `(${PICKUP_POINT.description})`,
      ]
    : [
        `*Envío:* ${shippingMethodLabel}`,
        buyer.street ?? "",
        [buyer.city, buyer.postalCode, buyer.province].filter((v) => v !== null && v.length > 0).join(" · "),
      ].filter((line) => line.length > 0);

  const contactBlock = [
    `*${fullName}* · DNI ${buyer.dni}`,
    `Tel: ${buyer.phone}`,
    `Email: ${buyer.email}`,
  ];

  const notesBlock = buyer.notes === null
    ? []
    : ["", `_Notas:_ ${buyer.notes}`];

  const closingLine = buyer.shippingMethod === "retiro"
    ? "¿Me confirmás stock, horario de retiro y forma de pago?"
    : "¿Me confirmás stock, cotización de envío y forma de pago?";

  return [
    ORDER_HEADER,
    "",
    itemsBlock,
    "",
    `*Subtotal: ${formatArs(snapshot.total)}*`,
    "",
    ...shippingBlock,
    "",
    ...contactBlock,
    ...notesBlock,
    "",
    closingLine,
  ].join("\n");
}

export function buildWhatsAppFullCheckoutUrl(
  snapshot: CartSnapshot,
  buyer: BuyerData,
): string | null {
  if (snapshot.lines.length === 0) {
    return null;
  }
  const message = buildWhatsAppFullCheckoutMessage(snapshot, buyer);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CONTACT.whatsappE164}?text=${encoded}`;
}

/**
 * URL de wa.me para consultar disponibilidad de un producto puntual.
 * Lo usa el detalle de producto cuando stock = 0, en reemplazo del
 * botón "Sin stock" que filtraba info de inventario al cliente.
 *
 * El vendedor recibe un mensaje con el producto identificable para que
 * pueda confirmarle a la persona si tiene/cuándo va a tener stock.
 */
export function buildWhatsAppInquiryUrl(
  brandName: string,
  productName: string,
): string {
  const message = `Hola, me interesa la fragancia *${brandName} ${productName}*. ¿Tenés disponibilidad?`;
  return `https://wa.me/${CONTACT.whatsappE164}?text=${encodeURIComponent(message)}`;
}
