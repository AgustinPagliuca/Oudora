import { describe, expect, it } from "vitest";
import {
  buildWhatsAppFullCheckoutUrl,
  buildWhatsAppInquiryUrl,
} from "@/lib/whatsapp";
import type { BuyerData } from "@/lib/checkout-validation";
import type { CartSnapshot } from "@/types/catalog";
import { makeBrand, makeProduct } from "./fixtures";

// buildWhatsAppFullCheckoutMessage dejó de exportarse en la limpieza de
// código muerto: su salida se verifica a través de la URL que la envuelve.

const CONTACT_NUMBER = "5491166391969";

/** Decodifica el querystring `text=` de una URL de wa.me. */
function decodeMessage(url: string): string {
  const text = new URL(url).searchParams.get("text");
  if (text === null) throw new Error("la URL no tiene parámetro text");
  return text;
}

const buyerRetiro: BuyerData = {
  shippingMethod: "retiro",
  firstName: "Agustín",
  lastName: null,
  email: "agus@mail.com",
  phone: "1166391969",
  dni: "35123456",
  street: null,
  city: null,
  postalCode: null,
  province: null,
  notes: null,
};

const buyerDomicilio: BuyerData = {
  ...buyerRetiro,
  shippingMethod: "domicilio",
  lastName: "Pagliuca",
  street: "Av. Siempre Viva 742",
  city: "Santos Lugares",
  postalCode: "1676",
  province: "Buenos Aires",
};

const snapshotConItems: CartSnapshot = {
  lines: [
    {
      product: makeProduct({ id: "asad", name: "Asad", priceArs: 50000 }),
      brand: makeBrand({ name: "Lattafa" }),
      quantity: 2,
      lineTotal: 100000,
    },
  ],
  itemCount: 2,
  total: 100000,
};

const snapshotVacio: CartSnapshot = { lines: [], itemCount: 0, total: 0 };

describe("buildWhatsAppInquiryUrl", () => {
  it("arma una URL de wa.me al número de contacto", () => {
    const url = buildWhatsAppInquiryUrl("Lattafa", "Asad");
    expect(url.startsWith(`https://wa.me/${CONTACT_NUMBER}?text=`)).toBe(true);
  });

  it("incluye marca y producto en el mensaje", () => {
    const message = decodeMessage(buildWhatsAppInquiryUrl("Lattafa", "Asad"));
    expect(message).toContain("Lattafa");
    expect(message).toContain("Asad");
  });

  it("codifica el mensaje en el querystring", () => {
    const url = buildWhatsAppInquiryUrl("Armaf", "Club de Nuit");
    // Los espacios no pueden viajar crudos en la URL.
    expect(url).not.toContain("Club de Nuit");
    expect(decodeMessage(url)).toContain("Club de Nuit");
  });

  it("escapa correctamente caracteres especiales", () => {
    const message = decodeMessage(
      buildWhatsAppInquiryUrl("Maison Alhambra", "Jean Lowe Ombré & Co."),
    );
    expect(message).toContain("Jean Lowe Ombré & Co.");
  });

  it("produce una URL parseable", () => {
    expect(() => new URL(buildWhatsAppInquiryUrl("Lattafa", "Asad"))).not.toThrow();
  });
});

describe("buildWhatsAppFullCheckoutUrl", () => {
  it("devuelve null con el carrito vacío", () => {
    expect(buildWhatsAppFullCheckoutUrl(snapshotVacio, buyerRetiro)).toBeNull();
  });

  it("arma la URL cuando hay items", () => {
    const url = buildWhatsAppFullCheckoutUrl(snapshotConItems, buyerRetiro);
    expect(url).not.toBeNull();
    expect(url?.startsWith(`https://wa.me/${CONTACT_NUMBER}?text=`)).toBe(true);
  });

  it("incluye los items del carrito en el mensaje", () => {
    const url = buildWhatsAppFullCheckoutUrl(snapshotConItems, buyerRetiro);
    const message = decodeMessage(url ?? "");
    expect(message).toContain("Lattafa");
    expect(message).toContain("Asad");
    expect(message).toContain("2×");
  });

  it("incluye los datos del comprador", () => {
    const message = decodeMessage(
      buildWhatsAppFullCheckoutUrl(snapshotConItems, buyerRetiro) ?? "",
    );
    expect(message).toContain("Agustín");
    expect(message).toContain("35123456");
    expect(message).toContain("agus@mail.com");
    expect(message).toContain("1166391969");
  });

  it("menciona el retiro cuando el envío es retiro", () => {
    const message = decodeMessage(
      buildWhatsAppFullCheckoutUrl(snapshotConItems, buyerRetiro) ?? "",
    );
    expect(message).toContain("Santos Lugares");
    expect(message).toContain("horario de retiro");
  });

  it("incluye la dirección cuando el envío es a domicilio", () => {
    const message = decodeMessage(
      buildWhatsAppFullCheckoutUrl(snapshotConItems, buyerDomicilio) ?? "",
    );
    expect(message).toContain("Av. Siempre Viva 742");
    expect(message).toContain("Buenos Aires");
    expect(message).toContain("1676");
    expect(message).toContain("cotización de envío");
  });

  it("usa el apellido cuando está cargado", () => {
    const message = decodeMessage(
      buildWhatsAppFullCheckoutUrl(snapshotConItems, buyerDomicilio) ?? "",
    );
    expect(message).toContain("Agustín Pagliuca");
  });

  it("agrega las notas solo si existen", () => {
    const sinNotas = decodeMessage(
      buildWhatsAppFullCheckoutUrl(snapshotConItems, buyerRetiro) ?? "",
    );
    expect(sinNotas).not.toContain("Notas:");

    const conNotas = decodeMessage(
      buildWhatsAppFullCheckoutUrl(snapshotConItems, {
        ...buyerRetiro,
        notes: "Envolver para regalo",
      }) ?? "",
    );
    expect(conNotas).toContain("Envolver para regalo");
  });

  it("produce una URL parseable", () => {
    const url = buildWhatsAppFullCheckoutUrl(snapshotConItems, buyerDomicilio);
    expect(() => new URL(url ?? "")).not.toThrow();
  });
});
