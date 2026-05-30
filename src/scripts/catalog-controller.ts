import type { Catalog, Gender } from "@/types/catalog";
import { DEFAULT_CATALOG } from "@/constants/ui";
import { normalizeSearchTerm } from "@/lib/filters";

/**
 * Controlador del catálogo en el navegador.
 *
 * Pattern: estado mínimo en memoria + lectura del DOM al inicializar.
 * Si los elementos esperados no existen (otra página), bail out limpio.
 */

interface ControllerState {
  catalog: Catalog;
  brandIds: Set<string>;
  genders: Set<Gender>;
  searchTerm: string;
  priceMin: number | null;
  priceMax: number | null;
}

const SEARCH_DEBOUNCE_MS = 150;
const PRICE_DEBOUNCE_MS = 250;
const SIDEBAR_OPEN_BODY_ATTR = "data-sidebar-open";

function getInitialState(): ControllerState {
  return {
    catalog: DEFAULT_CATALOG,
    brandIds: new Set(),
    genders: new Set(),
    searchTerm: "",
    priceMin: null,
    priceMax: null,
  };
}

function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay: number,
): (...args: TArgs) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: TArgs) => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

function getCardCatalog(card: HTMLElement): Catalog {
  const value = card.dataset.catalog;
  if (value === "arabe" || value === "disenador") return value;
  return DEFAULT_CATALOG;
}

function getCardGender(card: HTMLElement): Gender {
  const value = card.dataset.gender;
  if (value === "femenino" || value === "masculino" || value === "unisex") {
    return value;
  }
  return "unisex";
}

function getCardPrice(card: HTMLElement): number {
  const raw = card.dataset.price;
  if (raw === undefined) return 0;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function cardMatches(card: HTMLElement, state: ControllerState): boolean {
  if (getCardCatalog(card) !== state.catalog) return false;

  const cardBrand = card.dataset.brand ?? "";
  if (state.brandIds.size > 0 && !state.brandIds.has(cardBrand)) return false;

  const cardGender = getCardGender(card);
  if (state.genders.size > 0 && !state.genders.has(cardGender)) return false;

  const cardPrice = getCardPrice(card);
  if (state.priceMin !== null && cardPrice < state.priceMin) return false;
  if (state.priceMax !== null && cardPrice > state.priceMax) return false;

  if (state.searchTerm.length > 0) {
    const haystack = card.dataset.searchText ?? "";
    if (!haystack.includes(state.searchTerm)) return false;
  }

  return true;
}

function updateSectionVisibility(section: HTMLElement): void {
  const visibleCards = section.querySelectorAll<HTMLElement>(
    "[data-product-card]:not([data-hidden='true'])",
  );
  const hasVisibleProducts = visibleCards.length > 0;
  section.dataset.hidden = hasVisibleProducts ? "false" : "true";

  const counter = section.querySelector<HTMLElement>("[data-brand-count]");
  if (counter === null) return;
  const total = section.querySelectorAll<HTMLElement>(
    "[data-product-card]",
  ).length;
  if (hasVisibleProducts && visibleCards.length < total) {
    counter.textContent = `${visibleCards.length} de ${total}`;
  } else {
    counter.textContent = `${total} piezas`;
  }
}

function toggleBrandGroups(activeCatalog: Catalog): void {
  document
    .querySelectorAll<HTMLElement>("[data-catalog-group]")
    .forEach((group) => {
      const isActive = group.dataset.catalogGroup === activeCatalog;
      group.dataset.hidden = isActive ? "false" : "true";
    });
}

function resetBrandRows(): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-filter-brand]")
    .forEach((row) => {
      const isAll = row.dataset.filterBrand === "";
      row.classList.toggle("active", isAll);
      row.setAttribute("aria-pressed", isAll ? "true" : "false");
    });
}

function resetGenderChips(): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-filter-gender]")
    .forEach((chip) => {
      const isAll = chip.dataset.filterGender === "";
      chip.classList.toggle("active", isAll);
      chip.setAttribute("aria-pressed", isAll ? "true" : "false");
    });
}

function clearPriceInputs(): void {
  document
    .querySelectorAll<HTMLElement>("[data-price-slider]")
    .forEach((slider) => {
      const minInput = slider.querySelector<HTMLInputElement>(
        "[data-filter-price-min]",
      );
      const maxInput = slider.querySelector<HTMLInputElement>(
        "[data-filter-price-max]",
      );
      if (minInput !== null) {
        minInput.value = minInput.dataset.minBound ?? minInput.min;
      }
      if (maxInput !== null) {
        maxInput.value = maxInput.dataset.maxBound ?? maxInput.max;
      }
      updateSliderUI(slider);
    });
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function updateSliderUI(slider: HTMLElement): void {
  const minInput = slider.querySelector<HTMLInputElement>(
    "[data-filter-price-min]",
  );
  const maxInput = slider.querySelector<HTMLInputElement>(
    "[data-filter-price-max]",
  );
  const fill = slider.querySelector<HTMLElement>("[data-price-fill]");
  if (minInput === null || maxInput === null || fill === null) return;

  const lowerBound = Number.parseInt(minInput.dataset.minBound ?? "0", 10);
  const upperBound = Number.parseInt(maxInput.dataset.maxBound ?? "0", 10);
  const range = upperBound - lowerBound;
  if (range <= 0) return;

  const minValue = Number.parseInt(minInput.value, 10);
  const maxValue = Number.parseInt(maxInput.value, 10);

  const leftPct = ((minValue - lowerBound) / range) * 100;
  const rightPct = ((upperBound - maxValue) / range) * 100;
  fill.style.left = `${leftPct}%`;
  fill.style.right = `${rightPct}%`;

  // Cuando el thumb min está cerca del extremo derecho, elevamos su z-index
  // para que siga siendo agarrable.
  if (leftPct > 90) {
    minInput.dataset.thumbUp = "true";
  } else {
    delete minInput.dataset.thumbUp;
  }

  // Actualizar etiquetas
  const catalog = slider.dataset.catalog ?? "";
  const minDisplay = document.querySelector<HTMLElement>(
    `[data-price-display-min][data-catalog="${catalog}"]`,
  );
  const maxDisplay = document.querySelector<HTMLElement>(
    `[data-price-display-max][data-catalog="${catalog}"]`,
  );
  if (minDisplay !== null) minDisplay.textContent = formatPrice(minValue);
  if (maxDisplay !== null) maxDisplay.textContent = formatPrice(maxValue);
}

function clampSlider(slider: HTMLElement, changed: "min" | "max"): void {
  const minInput = slider.querySelector<HTMLInputElement>(
    "[data-filter-price-min]",
  );
  const maxInput = slider.querySelector<HTMLInputElement>(
    "[data-filter-price-max]",
  );
  if (minInput === null || maxInput === null) return;
  const minValue = Number.parseInt(minInput.value, 10);
  const maxValue = Number.parseInt(maxInput.value, 10);
  if (changed === "min" && minValue > maxValue) {
    minInput.value = String(maxValue);
  }
  if (changed === "max" && maxValue < minValue) {
    maxInput.value = String(minValue);
  }
}

function clearSearchInput(): void {
  const input = document.querySelector<HTMLInputElement>(
    "[data-filter-search]",
  );
  if (input !== null) input.value = "";
}

function readPriceInputs(state: ControllerState): void {
  const minInput = document.querySelector<HTMLInputElement>(
    `[data-filter-price-min][data-catalog="${state.catalog}"]`,
  );
  const maxInput = document.querySelector<HTMLInputElement>(
    `[data-filter-price-max][data-catalog="${state.catalog}"]`,
  );
  if (minInput === null || maxInput === null) {
    state.priceMin = null;
    state.priceMax = null;
    return;
  }

  const minValue = Number.parseInt(minInput.value, 10);
  const maxValue = Number.parseInt(maxInput.value, 10);
  const lowerBound = Number.parseInt(minInput.dataset.minBound ?? "0", 10);
  const upperBound = Number.parseInt(maxInput.dataset.maxBound ?? "0", 10);

  // Si el rango está en sus extremos, equivale a "sin filtro"
  state.priceMin = minValue > lowerBound ? minValue : null;
  state.priceMax = maxValue < upperBound ? maxValue : null;
}

function setupCatalogTabs(
  state: ControllerState,
  applyFilters: () => void,
): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>(
    "[data-catalog-tab]",
  );
  if (tabs.length === 0) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const value = tab.dataset.catalogTab;
      if (value !== "arabe" && value !== "disenador") return;
      state.catalog = value;
      state.brandIds.clear();
      state.priceMin = null;
      state.priceMax = null;
      tabs.forEach((other) => {
        const isActive = other === tab;
        other.classList.toggle("active", isActive);
        other.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      resetBrandRows();
      clearPriceInputs();
      toggleBrandGroups(state.catalog);
      applyFilters();
    });
  });
}

function setupBrandRows(
  state: ControllerState,
  applyFilters: () => void,
): void {
  const rows = document.querySelectorAll<HTMLButtonElement>(
    "[data-filter-brand]",
  );
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const brandId = row.dataset.filterBrand ?? "";
      const rowCatalog = row.dataset.catalog;
      if (rowCatalog !== state.catalog) return;
      if (brandId === "") {
        state.brandIds.clear();
      } else if (state.brandIds.has(brandId)) {
        state.brandIds.delete(brandId);
      } else {
        state.brandIds.add(brandId);
      }
      rows.forEach((other) => {
        if (other.dataset.catalog !== state.catalog) return;
        const otherId = other.dataset.filterBrand ?? "";
        const isActive =
          (otherId === "" && state.brandIds.size === 0) ||
          (otherId !== "" && state.brandIds.has(otherId));
        other.classList.toggle("active", isActive);
        other.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      applyFilters();
    });
  });
}

function setupGenderChips(
  state: ControllerState,
  applyFilters: () => void,
): void {
  const chips = document.querySelectorAll<HTMLButtonElement>(
    "[data-filter-gender]",
  );
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const value = chip.dataset.filterGender ?? "";
      if (value === "") {
        state.genders.clear();
      } else if (
        value === "femenino" ||
        value === "masculino" ||
        value === "unisex"
      ) {
        if (state.genders.has(value)) {
          state.genders.delete(value);
        } else {
          state.genders.add(value);
        }
      }
      chips.forEach((other) => {
        const otherValue = other.dataset.filterGender ?? "";
        const isActive =
          (otherValue === "" && state.genders.size === 0) ||
          (otherValue === "femenino" && state.genders.has("femenino")) ||
          (otherValue === "masculino" && state.genders.has("masculino")) ||
          (otherValue === "unisex" && state.genders.has("unisex"));
        other.classList.toggle("active", isActive);
        other.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      applyFilters();
    });
  });
}

function setupPriceInputs(
  state: ControllerState,
  applyFilters: () => void,
): void {
  const sliders = document.querySelectorAll<HTMLElement>(
    "[data-price-slider]",
  );
  if (sliders.length === 0) return;

  const debouncedRefresh = debounce(() => {
    readPriceInputs(state);
    applyFilters();
  }, PRICE_DEBOUNCE_MS);

  sliders.forEach((slider) => {
    const minInput = slider.querySelector<HTMLInputElement>(
      "[data-filter-price-min]",
    );
    const maxInput = slider.querySelector<HTMLInputElement>(
      "[data-filter-price-max]",
    );
    if (minInput === null || maxInput === null) return;

    const onMinChange = (): void => {
      clampSlider(slider, "min");
      updateSliderUI(slider);
      debouncedRefresh();
    };
    const onMaxChange = (): void => {
      clampSlider(slider, "max");
      updateSliderUI(slider);
      debouncedRefresh();
    };

    minInput.addEventListener("input", onMinChange);
    maxInput.addEventListener("input", onMaxChange);

    // Render inicial
    updateSliderUI(slider);
  });
}

function setupSearch(
  state: ControllerState,
  applyFilters: () => void,
): void {
  const input = document.querySelector<HTMLInputElement>(
    "[data-filter-search]",
  );
  if (input === null) return;
  const debouncedApply = debounce(applyFilters, SEARCH_DEBOUNCE_MS);
  input.addEventListener("input", () => {
    state.searchTerm = normalizeSearchTerm(input.value);
    debouncedApply();
  });

  // Si llegamos con ?q=... desde el overlay de búsqueda, precargar
  const params = new URLSearchParams(window.location.search);
  const queryParam = params.get("q");
  if (queryParam !== null && queryParam.trim().length > 0) {
    input.value = queryParam;
    state.searchTerm = normalizeSearchTerm(queryParam);
    input.focus({ preventScroll: false });
    // Limpiar el query string para que no quede ?q= colgando
    history.replaceState(null, "", window.location.pathname);
    return;
  }

  // Si llegamos con #search, solo autofocear (compatibilidad legacy)
  if (window.location.hash === "#search") {
    input.focus({ preventScroll: false });
    history.replaceState(null, "", window.location.pathname);
  }
}

function setupClearButton(
  state: ControllerState,
  applyFilters: () => void,
): void {
  const clearBtn = document.querySelector<HTMLButtonElement>(
    "[data-filter-clear]",
  );
  if (clearBtn === null) return;
  clearBtn.addEventListener("click", () => {
    state.brandIds.clear();
    state.genders.clear();
    state.searchTerm = "";
    state.priceMin = null;
    state.priceMax = null;
    resetBrandRows();
    resetGenderChips();
    clearSearchInput();
    clearPriceInputs();
    applyFilters();
  });
}

function setupSidebarMobile(): void {
  const sidebar = document.querySelector<HTMLElement>("[data-sidebar]");
  const toggleBtn = document.querySelector<HTMLButtonElement>(
    "[data-sidebar-toggle]",
  );
  const closeBtn = document.querySelector<HTMLButtonElement>(
    "[data-sidebar-close]",
  );
  const backdrop = document.querySelector<HTMLElement>(
    "[data-sidebar-backdrop]",
  );
  if (sidebar === null) return;

  const isOpen = (): boolean => sidebar.dataset.open === "true";

  const open = (): void => {
    sidebar.dataset.open = "true";
    document.body.setAttribute(SIDEBAR_OPEN_BODY_ATTR, "true");
    document.body.style.overflow = "hidden";
    toggleBtn?.setAttribute("aria-expanded", "true");
    toggleBtn?.setAttribute("aria-label", "Cerrar filtros");
  };
  const close = (): void => {
    sidebar.dataset.open = "false";
    document.body.removeAttribute(SIDEBAR_OPEN_BODY_ATTR);
    document.body.style.overflow = "";
    toggleBtn?.setAttribute("aria-expanded", "false");
    toggleBtn?.setAttribute("aria-label", "Abrir filtros");
  };

  toggleBtn?.addEventListener("click", () => {
    if (isOpen()) {
      close();
    } else {
      open();
    }
  });
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      close();
    }
  });

  // Auto-close si pasamos de mobile a desktop: el sidebar pasa a ser
  // permanente y no debería quedar el estado abierto colgado.
  const desktopQuery = window.matchMedia("(min-width: 921px)");
  const handleViewportChange = (event: MediaQueryListEvent | MediaQueryList): void => {
    if (event.matches) close();
  };
  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", handleViewportChange);
  }
}

function applyFilters(state: ControllerState): void {
  const cards = document.querySelectorAll<HTMLElement>("[data-product-card]");
  if (cards.length === 0) return;
  let visibleCount = 0;
  let totalInCatalog = 0;

  cards.forEach((card) => {
    if (getCardCatalog(card) === state.catalog) totalInCatalog += 1;
    const matches = cardMatches(card, state);
    card.dataset.hidden = matches ? "false" : "true";
    if (matches) visibleCount += 1;
  });

  document
    .querySelectorAll<HTMLElement>("[data-brand-section]")
    .forEach(updateSectionVisibility);

  const counter = document.querySelector<HTMLElement>("[data-result-count]");
  if (counter !== null) {
    if (totalInCatalog === 0) {
      counter.textContent = "Sin fragancias en este catálogo";
    } else if (visibleCount === totalInCatalog) {
      counter.textContent = `${totalInCatalog} fragancias`;
    } else {
      counter.textContent = `${visibleCount} de ${totalInCatalog} fragancias`;
    }
  }
}

/**
 * Sort de productos. Trabaja sobre las cards ya renderizadas, reordenando los
 * nodos DOM dentro de cada `.product-grid` (preservando el agrupamiento por
 * marca, que es una decisión visual fuerte del sitio).
 *
 * El orden "default" recupera el orden original — para eso guardamos un índice
 * en cada card al inicializar.
 */
type SortValue =
  | "default"
  | "price-asc"
  | "price-desc"
  | "featured"
  | "discount";

function snapshotOriginalOrder(): void {
  const cards = document.querySelectorAll<HTMLElement>("[data-product-card]");
  cards.forEach((card, index) => {
    if (card.dataset.originalIndex === undefined) {
      card.dataset.originalIndex = String(index);
    }
  });
  // Mismo snapshot para las secciones de marca, así "Por defecto" puede
  // restaurar tanto el orden de cards como el de marcas.
  const sections = document.querySelectorAll<HTMLElement>("[data-brand-section]");
  sections.forEach((section, index) => {
    if (section.dataset.originalSectionIndex === undefined) {
      section.dataset.originalSectionIndex = String(index);
    }
  });
}

function compareCards(a: HTMLElement, b: HTMLElement, sortBy: SortValue): number {
  if (sortBy === "default") {
    const ai = parseInt(a.dataset.originalIndex ?? "0", 10);
    const bi = parseInt(b.dataset.originalIndex ?? "0", 10);
    return ai - bi;
  }
  if (sortBy === "price-asc") {
    return parseInt(a.dataset.price ?? "0", 10) - parseInt(b.dataset.price ?? "0", 10);
  }
  if (sortBy === "price-desc") {
    return parseInt(b.dataset.price ?? "0", 10) - parseInt(a.dataset.price ?? "0", 10);
  }
  if (sortBy === "featured") {
    const af = a.dataset.featured === "true" ? 1 : 0;
    const bf = b.dataset.featured === "true" ? 1 : 0;
    return bf - af;
  }
  if (sortBy === "discount") {
    const ad = a.dataset.hasDiscount === "true" ? 1 : 0;
    const bd = b.dataset.hasDiscount === "true" ? 1 : 0;
    return bd - ad;
  }
  return 0;
}

/**
 * Devuelve el "valor" que se usa para ordenar una sección de marca según el
 * criterio. Lo computamos sobre todas las cards de la sección (visibles u
 * ocultas — un filtro aplicado podría cambiarlo, pero la semántica de "orden
 * de marcas" se mantiene estable y predecible si miramos todo el catálogo).
 */
function getBrandSectionSortKey(section: HTMLElement, sortBy: SortValue): number {
  if (sortBy === "default") {
    return parseInt(section.dataset.originalSectionIndex ?? "0", 10);
  }
  const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-product-card]"));
  if (cards.length === 0) return Number.MAX_SAFE_INTEGER;

  if (sortBy === "price-asc") {
    // El precio mínimo de la marca define su posición — barata primero
    let min = Number.MAX_SAFE_INTEGER;
    for (const c of cards) {
      const p = parseInt(c.dataset.price ?? "0", 10);
      if (p < min) min = p;
    }
    return min;
  }
  if (sortBy === "price-desc") {
    // El precio máximo de la marca define su posición — cara primero (negado)
    let max = 0;
    for (const c of cards) {
      const p = parseInt(c.dataset.price ?? "0", 10);
      if (p > max) max = p;
    }
    return -max;
  }
  if (sortBy === "featured") {
    // Marca con más destacados primero
    let count = 0;
    for (const c of cards) {
      if (c.dataset.featured === "true") count += 1;
    }
    return -count;
  }
  if (sortBy === "discount") {
    // Marca con más productos en descuento primero
    let count = 0;
    for (const c of cards) {
      if (c.dataset.hasDiscount === "true") count += 1;
    }
    return -count;
  }
  return 0;
}

function sortBrandSections(sortBy: SortValue): void {
  const container = document.querySelector<HTMLElement>(".catalog-content");
  if (container === null) return;
  const sections = Array.from(
    container.querySelectorAll<HTMLElement>("[data-brand-section]"),
  );
  // Decoramos con la posición original para tener un tiebreaker estable
  // (si dos marcas tienen el mismo precio max, mantiene el orden original).
  const decorated = sections.map((section, idx) => ({
    section,
    key: getBrandSectionSortKey(section, sortBy),
    originalIdx: idx,
  }));
  decorated.sort((a, b) => {
    if (a.key !== b.key) return a.key - b.key;
    return a.originalIdx - b.originalIdx;
  });
  for (const { section } of decorated) {
    container.appendChild(section);
  }
}

function applySort(sortBy: SortValue): void {
  // Primero reordenamos las secciones de marca según el criterio (las marcas
  // más caras/baratas/destacadas suben). Después ordenamos las cards dentro
  // de cada sección con el mismo criterio.
  sortBrandSections(sortBy);
  const sections = document.querySelectorAll<HTMLElement>("[data-brand-section]");
  sections.forEach((section) => {
    const grid = section.querySelector<HTMLElement>(".product-grid");
    if (grid === null) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-product-card]"));
    cards.sort((a, b) => compareCards(a, b, sortBy));
    for (const card of cards) {
      grid.appendChild(card);
    }
  });
}

function setSortMenuVisualState(sortBy: SortValue): void {
  // El label del botón es siempre "Filtrar y ordenar" — la opción elegida
  // se identifica visualmente por el checkmark dentro del panel.
  document
    .querySelectorAll<HTMLButtonElement>("[data-sort-value]")
    .forEach((option) => {
      const isActive = option.dataset.sortValue === sortBy;
      option.setAttribute("aria-selected", isActive ? "true" : "false");
    });
}

function closeSortPanel(): void {
  const panel = document.querySelector<HTMLElement>("[data-sort-panel]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-sort-toggle]");
  if (panel !== null) panel.hidden = true;
  if (toggle !== null) toggle.setAttribute("aria-expanded", "false");
}

function setupSortMenu(): void {
  const menu = document.querySelector<HTMLElement>("[data-sort-menu]");
  if (menu === null) return;
  const toggle = menu.querySelector<HTMLButtonElement>("[data-sort-toggle]");
  const panel = menu.querySelector<HTMLElement>("[data-sort-panel]");
  if (toggle === null || panel === null) return;

  // Snapshot del orden original antes del primer sort
  snapshotOriginalOrder();

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeSortPanel();
    } else {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }
  });

  menu.querySelectorAll<HTMLButtonElement>("[data-sort-value]").forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.sortValue;
      if (
        value === "default" ||
        value === "price-asc" ||
        value === "price-desc" ||
        value === "featured" ||
        value === "discount"
      ) {
        applySort(value);
        setSortMenuVisualState(value);
      }
      closeSortPanel();
    });
  });

  // Cerrar al click fuera o con ESC
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target as Node)) {
      closeSortPanel();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSortPanel();
    }
  });
}

export function initCatalogController(): void {
  if (document.querySelector("[data-sidebar]") === null) return;
  const state = getInitialState();
  const refresh = (): void => applyFilters(state);

  // Lee filtros iniciales desde el query string (ej: /catalogo?gender=femenino)
  const params = new URLSearchParams(window.location.search);
  const initialGender = params.get("gender");
  if (
    initialGender === "femenino" ||
    initialGender === "masculino" ||
    initialGender === "unisex"
  ) {
    state.genders.add(initialGender);
  }

  setupCatalogTabs(state, refresh);
  setupBrandRows(state, refresh);
  setupGenderChips(state, refresh);
  setupPriceInputs(state, refresh);
  setupSearch(state, refresh);
  setupClearButton(state, refresh);
  setupSidebarMobile();
  setupSortMenu();

  // Si vino con filtro de género preseteado, marca visualmente el chip activo
  if (state.genders.size > 0) {
    document
      .querySelectorAll<HTMLButtonElement>("[data-filter-gender]")
      .forEach((chip) => {
        const v = chip.dataset.filterGender ?? "";
        const isActive =
          (v === "femenino" && state.genders.has("femenino")) ||
          (v === "masculino" && state.genders.has("masculino")) ||
          (v === "unisex" && state.genders.has("unisex"));
        chip.classList.toggle("active", isActive);
        chip.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    // Quitar la marca de "Todos"
    document
      .querySelector<HTMLButtonElement>('[data-filter-gender=""]')
      ?.classList.remove("active");
  }

  refresh();
}
