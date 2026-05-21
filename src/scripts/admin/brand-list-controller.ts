/**
 * Controla el listado de marcas en /admin/marcas:
 *  1. Buscador instantáneo + filtro por catálogo
 *  2. Modal de confirmación de borrado (solo se abre si la marca puede borrarse)
 */

interface FilterState {
  q: string;
  catalog: string;
}

function applyFilters(state: FilterState): void {
  const rows = document.querySelectorAll<HTMLTableRowElement>("[data-brand-row]");
  const emptyRow = document.querySelector<HTMLTableRowElement>("[data-empty-row]");

  let visibleCount = 0;
  const qLower = state.q.trim().toLowerCase();

  rows.forEach((row) => {
    const rowCatalog = row.dataset.catalog ?? "";
    const rowText = row.dataset.searchText ?? "";

    const matchesQ = qLower === "" || rowText.includes(qLower);
    const matchesCatalog = state.catalog === "" || rowCatalog === state.catalog;
    const visible = matchesQ && matchesCatalog;
    row.dataset.hidden = visible ? "false" : "true";
    if (visible) visibleCount++;
  });

  if (emptyRow !== null) {
    emptyRow.hidden = visibleCount > 0;
  }
}

function initFilters(): void {
  const container = document.querySelector("[data-brand-filters]");
  if (container === null) return;

  const qInput = container.querySelector<HTMLInputElement>("[data-filter-q]");
  const catalogSelect = container.querySelector<HTMLSelectElement>("[data-filter-catalog]");

  function currentState(): FilterState {
    return {
      q: qInput?.value ?? "",
      catalog: catalogSelect?.value ?? "",
    };
  }

  const run = (): void => applyFilters(currentState());

  qInput?.addEventListener("input", run);
  catalogSelect?.addEventListener("change", run);
}

function initDeleteModal(): void {
  const modal = document.querySelector<HTMLDivElement>("[data-delete-modal]");
  const form = document.querySelector<HTMLFormElement>("[data-delete-form]");
  const nameTarget = document.querySelector<HTMLElement>("[data-delete-brand-name]");
  const cancelBtn = document.querySelector<HTMLButtonElement>("[data-delete-cancel]");

  if (modal === null || form === null) return;

  function openModal(brandId: string, brandName: string): void {
    if (nameTarget !== null) nameTarget.textContent = brandName;
    form!.action = `/api/admin/brands/${brandId}`;
    modal!.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(): void {
    modal!.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll<HTMLButtonElement>("[data-delete-trigger]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // No abrir el modal si la marca no se puede borrar (tiene productos)
      if (btn.dataset.canDelete === "false") return;
      const id = btn.dataset.brandId;
      const name = btn.dataset.brandName ?? "esta marca";
      if (id === undefined) return;
      openModal(id, name);
    });
  });

  cancelBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });
}

export function initBrandListController(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initFilters();
      initDeleteModal();
    });
  } else {
    initFilters();
    initDeleteModal();
  }
}
