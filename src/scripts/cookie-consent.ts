/**
 * Banner de consentimiento de cookies.
 *
 * Reparto de responsabilidades:
 *   - GoogleTagManager.astro (inline en el <head>) define window.oudoraLoadGTM
 *     y lo ejecuta solo si ya había un "accepted" guardado. Eso cubre las
 *     visitas siguientes sin demora perceptible.
 *   - Este módulo (diferido) se ocupa de la UI: mostrar el banner cuando no
 *     hay decisión, guardarla, y llamar al loader en el momento de aceptar.
 *
 * Bloqueo total, no Consent Mode: si no hay "accepted", el contenedor de GTM
 * nunca se inyecta.
 */

import { COOKIE_CONSENT, type ConsentValue } from "@/constants/legal";

/** El loader lo define el script inline del <head>. */
interface WindowWithGtmLoader extends Window {
  oudoraLoadGTM?: () => void;
}

/** Clase en <html> mientras el banner está abierto (la usa el CSS del banner). */
const OPEN_CLASS = "cookie-banner-open";

/**
 * Lee la decisión guardada. Devuelve null si no hay ninguna, si el valor está
 * corrupto, o si localStorage no está disponible (modo privado, storage
 * bloqueado). En todos esos casos tratamos al visitante como "sin decidir".
 */
function readConsent(): ConsentValue | null {
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT.storageKey);
    if (stored === COOKIE_CONSENT.accepted) return COOKIE_CONSENT.accepted;
    if (stored === COOKIE_CONSENT.rejected) return COOKIE_CONSENT.rejected;
    return null;
  } catch {
    return null;
  }
}

/**
 * Guarda la decisión. Si el storage falla no rompemos el flujo: el banner se
 * cierra igual y la decisión vale para esta visita, pero volverá a preguntarse
 * en la próxima. Es el comportamiento correcto — sin poder recordar el "no",
 * lo honesto es volver a preguntar.
 */
function writeConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(COOKIE_CONSENT.storageKey, value);
  } catch {
    // Silencioso a propósito: no hay nada útil que mostrarle al visitante.
  }
}

function loadGtm(): void {
  const w = window as WindowWithGtmLoader;
  w.oudoraLoadGTM?.();
}

function showBanner(banner: HTMLElement): void {
  banner.hidden = false;
  document.documentElement.classList.add(OPEN_CLASS);
}

function hideBanner(banner: HTMLElement): void {
  banner.hidden = true;
  document.documentElement.classList.remove(OPEN_CLASS);
}

export function initCookieConsent(): void {
  const banner = document.querySelector<HTMLElement>("[data-cookie-banner]");
  if (banner === null) return;

  const acceptBtn = banner.querySelector<HTMLButtonElement>("[data-cookie-accept]");
  const rejectBtn = banner.querySelector<HTMLButtonElement>("[data-cookie-reject]");

  // "Configurar cookies" del footer (y cualquier otro disparador que se sume
  // con el mismo data-attribute).
  const openers = document.querySelectorAll<HTMLElement>("[data-cookie-settings]");
  openers.forEach((opener) => {
    opener.addEventListener("click", (event) => {
      event.preventDefault();
      showBanner(banner);
      banner.scrollIntoView({ block: "nearest" });
      acceptBtn?.focus();
    });
  });

  acceptBtn?.addEventListener("click", () => {
    writeConsent(COOKIE_CONSENT.accepted);
    hideBanner(banner);
    // Sin recargar: el contenedor se inyecta en caliente.
    loadGtm();
  });

  rejectBtn?.addEventListener("click", () => {
    const wasAccepted = readConsent() === COOKIE_CONSENT.accepted;
    writeConsent(COOKIE_CONSENT.rejected);
    hideBanner(banner);
    // Si venía de "accepted", GTM ya está inyectado en esta página y no hay
    // forma confiable de desmontarlo (dejó tags, cookies y listeners propios).
    // Recargar es la única garantía real de que deja de trackear.
    if (wasAccepted) {
      window.location.reload();
    }
  });

  // Primera visita o storage ilegible: preguntamos.
  if (readConsent() === null) {
    showBanner(banner);
  }
}
