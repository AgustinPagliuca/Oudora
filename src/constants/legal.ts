/**
 * Datos del responsable legal del emprendimiento y links a los documentos
 * legales del sitio. Centralizados acá para que un cambio de contacto legal
 * no obligue a tocar las tres páginas.
 */

export const LEGAL = {
  responsable: "Nicolás Agustín López Giorello",
  email: "nicklopezgiorello@gmail.com",
  localidad: "Santos Lugares, Provincia de Buenos Aires, Argentina",
  lastUpdated: "12 de septiembre de 2026",
} as const;

export const LEGAL_LINKS = [
  { label: "Privacidad", href: "/privacidad" },
  { label: "Términos", href: "/terminos" },
  { label: "Cookies", href: "/cookies" },
] as const;

/**
 * Consentimiento de cookies. La clave y los valores viven acá porque los leen
 * dos lugares que no comparten bundle:
 *   - GoogleTagManager.astro, en un <script is:inline> del <head> (recibe estos
 *     valores por define:vars, porque un script inline no puede importar).
 *   - scripts/cookie-consent.ts, que los importa normalmente.
 * Una sola fuente de verdad evita que se desincronicen y GTM quede cargando
 * contra una clave que el banner ya no escribe.
 */
export const COOKIE_CONSENT = {
  storageKey: "oudora_cookie_consent",
  accepted: "accepted",
  rejected: "rejected",
} as const;

export type ConsentValue =
  | typeof COOKIE_CONSENT.accepted
  | typeof COOKIE_CONSENT.rejected;
