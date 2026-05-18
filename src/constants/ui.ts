/**
 * Etiquetas y opciones que aparecen en la UI.
 * Centralizar acá evita strings duplicados en componentes.
 */

import type { Catalog, Gender } from "@/types/catalog";

export const GENDER_LABELS: Readonly<Record<Gender, string>> = {
  femenino: "Femenino",
  masculino: "Masculino",
  unisex: "Unisex",
} as const;

export const GENDER_SHORT_LABELS: Readonly<Record<Gender, string>> = {
  femenino: "Fem.",
  masculino: "Masc.",
  unisex: "Unisex",
} as const;

export const GENDER_DESCRIPTIONS: Readonly<Record<Gender, string>> = {
  femenino: "Para ella",
  masculino: "Para él",
  unisex: "Para todes",
} as const;

export const ALL_GENDERS: readonly Gender[] = [
  "femenino",
  "masculino",
  "unisex",
] as const;

export const CATALOG_LABELS: Readonly<Record<Catalog, string>> = {
  arabe: "Perfumes árabes",
  disenador: "Perfumes de diseñador",
} as const;

export const CATALOG_SHORT_LABELS: Readonly<Record<Catalog, string>> = {
  arabe: "Árabes",
  disenador: "Diseñador",
} as const;

export const ALL_CATALOGS: readonly Catalog[] = ["arabe", "disenador"] as const;

export const DEFAULT_CATALOG: Catalog = "arabe";

export const LOW_STOCK_THRESHOLD = 3;
export const LAST_UNIT_THRESHOLD = 1;

export const SITE_METADATA = {
  name: "OUDORA",
  tagline: "L'essence d'arabie",
  description: "Perfumería en Buenos Aires: árabes y de diseñador",
  arabicAccent: "عُود · فاخر",
  location: "Buenos Aires, Argentina",
} as const;

/**
 * Datos de contacto. El número de WhatsApp se usa para el checkout
 * desde el carrito. Reemplazar por el real antes de ir a producción.
 */
export const CONTACT = {
  whatsappE164: "5491100000000",
  whatsappDisplay: "+54 9 11 0000-0000",
  instagram: "@oudora",
  instagramUrl: "https://instagram.com/oudora",
} as const;

/**
 * Crédito del estudio que desarrolló el sitio. Se muestra discretamente
 * al pie. Si el cliente quiere quitarlo, se centraliza acá.
 */
export const DEVELOPER_CREDIT = {
  label: "pagliuca.dev",
  url: "https://www.instagram.com/pagliuca.dev/",
} as const;

export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Marcas", href: "/marcas" },
  { label: "Contacto", href: "/contacto" },
] as const;
