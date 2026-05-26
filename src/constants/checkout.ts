/**
 * Constantes del flujo de checkout v1.0.
 * No hardcodeamos estos valores en componentes: cualquier cambio futuro
 * (sumar provincia, cambiar zona de retiro, agregar método) toca solo este archivo.
 */

/**
 * Punto de retiro. Por privacidad mostramos solo la zona, no la dirección exacta:
 * la dirección la coordina el vendedor con el comprador por WhatsApp.
 */
export const PICKUP_POINT = {
  city: "Santos Lugares",
  description: "Coordinamos horario y dirección por WhatsApp.",
} as const;

export type ShippingMethod = "retiro" | "domicilio";

export const SHIPPING_METHODS = {
  retiro: {
    id: "retiro",
    label: "Retiro en Santos Lugares",
    description: "Coordinamos horario por WhatsApp.",
    cost: "Sin cargo",
  },
  domicilio: {
    id: "domicilio",
    label: "Envío a domicilio",
    description: "A calcular según destino. Te lo confirmamos por WhatsApp.",
    cost: "A calcular",
  },
} as const;

/**
 * Provincias argentinas según ISO 3166-2:AR.
 * Si en el futuro vendés solo a algunas, filtrá acá.
 */
export const ARGENTINA_PROVINCES = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
] as const;

export type Province = (typeof ARGENTINA_PROVINCES)[number];

/**
 * Reglas de validación para campos del comprador.
 * Centralizadas para reutilizar en HTML (pattern, min/max length) y en JS.
 */
export const CHECKOUT_FIELD_RULES = {
  firstName: { minLength: 2, maxLength: 50, pattern: "^[A-Za-zÀ-ÿ\\s'\\-]+$" },
  lastName: { minLength: 2, maxLength: 50, pattern: "^[A-Za-zÀ-ÿ\\s'\\-]+$" },
  email: { maxLength: 120 },
  phone: { minDigits: 8, maxDigits: 15, pattern: "^[\\d\\s\\-\\(\\)\\+]{8,30}$" },
  dni: { minLength: 7, maxLength: 9, pattern: "^[0-9]{7,9}$" },
  street: { minLength: 4, maxLength: 120 },
  city: { minLength: 2, maxLength: 80, pattern: "^[A-Za-zÀ-ÿ0-9\\s'\\-\\.]+$" },
  postalCode: { minLength: 4, maxLength: 8, pattern: "^[A-Za-z0-9]{4,8}$" },
  notes: { maxLength: 280 },
} as const;
