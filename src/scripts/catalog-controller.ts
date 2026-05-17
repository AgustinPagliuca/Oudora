import type { Catalog, Gender } from "@/types/catalog";
import { DEFAULT_CATALOG } from "@/constants/ui";
import { normalizeSearchTerm } from "@/lib/filters";

/**
 * Controlador del catálogo en el navegador.
 *
 * Lee atributos `data-*` ya renderizados desde el servidor y aplica
 * `data-hidden` sobre cards y secciones según el estado de filtros.
 *
 * Pattern: estado mínimo en memoria, sin frameworks. Si el DOM no tiene
 * los elementos esperados (porque estamos en otra página), bail out limpio.
 */

interface ControllerState {
  catalog: Catalog;
  brandIds: Set<string>;
  genders: Set<Gender>;
  searchTerm: string;
}

const SEARCH_DEBOUNCE_MS = 150;

function getInitialState(): ControllerState {
  return {
    catalog: DEFAULT_CATALOG,
    brandIds: new Set(),
    genders: new Set(),
    searchTerm: "",
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

function cardMatches(card: HTMLElement, state: ControllerState): boolean {
  if (getCardCatalog(card) !== state.catalog) return false;

  const cardBrand = card.dataset.brand ?? "";
  if (state.brandIds.size > 0 && !state.brandIds.has(cardBrand)) return false;

  const cardGender = getCardGender(card);
  if (state.genders.size > 0 && !state.genders.has(cardGender)) return false;

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

function clearSearchInput(): void {
  const input = document.querySelector<HTMLInputElement>(
    "[data-filter-search]",
  );
  if (input !== null) input.value = "";
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
      tabs.forEach((other) => {
        const isActive = other === tab;
        other.classList.toggle("active", isActive);
        other.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      resetBrandRows();
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
    resetBrandRows();
    resetGenderChips();
    clearSearchInput();
    applyFilters();
  });
}

function setupSidebarMobile(): void {
  const sidebar = document.querySelector<HTMLElement>("[data-sidebar]");
  const openBtn = document.querySelector<HTMLButtonElement>(
    "[data-sidebar-toggle]",
  );
  const closeBtn = document.querySelector<HTMLButtonElement>(
    "[data-sidebar-close]",
  );
  if (sidebar === null) return;

  openBtn?.addEventListener("click", () => {
    sidebar.dataset.open = "true";
  });
  closeBtn?.addEventListener("click", () => {
    sidebar.dataset.open = "false";
  });
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

export function initCatalogController(): void {
  if (document.querySelector("[data-sidebar]") === null) return;
  const state = getInitialState();
  const refresh = (): void => applyFilters(state);

  setupCatalogTabs(state, refresh);
  setupBrandRows(state, refresh);
  setupGenderChips(state, refresh);
  setupSearch(state, refresh);
  setupClearButton(state, refresh);
  setupSidebarMobile();

  refresh();
}
