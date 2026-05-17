import type { Brand, Product } from "@/types/catalog";
import { BRANDS_BY_ID } from "@/data/brands";
import { PRODUCTS } from "@/data/products";
import { formatArs, formatPresentation } from "@/lib/format";
import { normalizeSearchTerm } from "@/lib/filters";

/**
 * Controlador del overlay de búsqueda global.
 *
 * - Construye un índice en memoria una sola vez al boot.
 * - Filtra en cada keystroke (sin debounce: el set es chico y el filtrado
 *   sobre arrays es instantáneo).
 * - Renderiza hasta MAX_RESULTS y un CTA al catálogo con `?q=` si hay más.
 */

interface SearchEntry {
  readonly product: Product;
  readonly brand: Brand;
  readonly haystack: string;
}

const MAX_RESULTS = 8;

function buildIndex(): readonly SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const product of PRODUCTS) {
    const brand = BRANDS_BY_ID.get(product.brandId);
    if (brand === undefined) continue;
    const haystack = [
      product.name,
      brand.name,
      product.concentration,
      ...(product.notes ?? []),
    ]
      .join(" ")
      .toLowerCase();
    entries.push({ product, brand, haystack });
  }
  return entries;
}

const INDEX = buildIndex();

function findMatches(term: string): {
  readonly visible: readonly SearchEntry[];
  readonly totalMatches: number;
} {
  const normalized = normalizeSearchTerm(term);
  if (normalized.length === 0) {
    return { visible: [], totalMatches: 0 };
  }
  const all: SearchEntry[] = [];
  for (const entry of INDEX) {
    if (entry.haystack.includes(normalized)) all.push(entry);
  }
  return {
    visible: all.slice(0, MAX_RESULTS),
    totalMatches: all.length,
  };
}

function setOverlayOpen(open: boolean): void {
  const overlay = document.querySelector<HTMLElement>("[data-search-overlay]");
  if (overlay === null) return;
  overlay.setAttribute("aria-hidden", open ? "false" : "true");
  document.body.style.overflow = open ? "hidden" : "";
  if (open) {
    const input = overlay.querySelector<HTMLInputElement>(
      "[data-search-overlay-input]",
    );
    setTimeout(() => input?.focus(), 50);
  }
}

function renderResults(term: string): void {
  const hint = document.querySelector<HTMLElement>("[data-search-overlay-hint]");
  const noResults = document.querySelector<HTMLElement>(
    "[data-search-overlay-no-results]",
  );
  const list = document.querySelector<HTMLUListElement>(
    "[data-search-overlay-results]",
  );
  const cta = document.querySelector<HTMLAnchorElement>(
    "[data-search-overlay-cta]",
  );
  const template = document.querySelector<HTMLTemplateElement>(
    "#search-result-template",
  );
  if (list === null || template === null || cta === null) return;

  const normalized = normalizeSearchTerm(term);

  if (normalized.length === 0) {
    if (hint !== null) hint.hidden = false;
    if (noResults !== null) noResults.hidden = true;
    list.hidden = true;
    list.innerHTML = "";
    cta.hidden = true;
    return;
  }

  const { visible, totalMatches } = findMatches(normalized);

  if (hint !== null) hint.hidden = true;

  if (totalMatches === 0) {
    if (noResults !== null) noResults.hidden = false;
    list.hidden = true;
    list.innerHTML = "";
    cta.hidden = true;
    return;
  }

  if (noResults !== null) noResults.hidden = true;
  list.hidden = false;
  list.innerHTML = "";

  for (const entry of visible) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const link = fragment.querySelector<HTMLAnchorElement>(
      "[data-result-href]",
    );
    const brandEl = fragment.querySelector<HTMLElement>("[data-result-brand]");
    const nameEl = fragment.querySelector<HTMLElement>("[data-result-name]");
    const metaEl = fragment.querySelector<HTMLElement>("[data-result-meta]");
    const priceEl = fragment.querySelector<HTMLElement>("[data-result-price]");

    if (link !== null) link.href = `/producto/${entry.product.slug}`;
    if (brandEl !== null) brandEl.textContent = entry.brand.name;
    if (nameEl !== null) nameEl.textContent = entry.product.name;
    if (metaEl !== null) {
      metaEl.textContent = formatPresentation(
        entry.product.concentration,
        entry.product.volumeMl,
      );
    }
    if (priceEl !== null) {
      priceEl.textContent = formatArs(entry.product.priceArs);
    }
    list.appendChild(fragment);
  }

  if (totalMatches > MAX_RESULTS) {
    cta.hidden = false;
    cta.href = `/catalogo?q=${encodeURIComponent(normalized)}`;
    cta.textContent = `Ver los ${totalMatches} resultados en el catálogo →`;
  } else {
    cta.hidden = true;
  }
}

export function initSearchController(): void {
  const overlay = document.querySelector<HTMLElement>("[data-search-overlay]");
  if (overlay === null) return;

  const input = overlay.querySelector<HTMLInputElement>(
    "[data-search-overlay-input]",
  );
  const closeBtn = overlay.querySelector<HTMLButtonElement>(
    "[data-search-overlay-close]",
  );
  const backdrop = overlay.querySelector<HTMLElement>(
    "[data-search-overlay-backdrop]",
  );

  document
    .querySelectorAll<HTMLButtonElement>("[data-search-trigger]")
    .forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        setOverlayOpen(true);
      });
    });

  closeBtn?.addEventListener("click", () => setOverlayOpen(false));
  backdrop?.addEventListener("click", () => setOverlayOpen(false));

  input?.addEventListener("input", () => {
    renderResults(input.value);
  });

  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const term = normalizeSearchTerm(input.value);
      if (term.length === 0) return;
      window.location.href = `/catalogo?q=${encodeURIComponent(term)}`;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      overlay.getAttribute("aria-hidden") === "false"
    ) {
      setOverlayOpen(false);
    }
  });
}
