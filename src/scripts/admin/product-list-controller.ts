/**
 * Controla el listado de productos en /admin/productos:
 *
 *  1. Buscador instantáneo (filtra rows por texto sin pegada al server).
 *  2. Filtros de catálogo y género (combinables con la búsqueda).
 *  3. Modal de confirmación de borrado: al apretar el botón borrar de un
 *     producto, abre el modal con el nombre y dispara DELETE al confirmar.
 *
 * Toda la inicialización pasa por initProductListController() para que
 * el script en la página solo tenga que importarlo y llamarlo.
 */

interface FilterState {
  q: string;
  catalog: string;
  gender: string;
}

function applyFilters(state: FilterState): void {
  const rows = document.querySelectorAll<HTMLTableRowElement>(
    "[data-product-row]",
  );
  const emptyRow = document.querySelector<HTMLTableRowElement>(
    "[data-empty-row]",
  );

  let visibleCount = 0;
  const qLower = state.q.trim().toLowerCase();

  rows.forEach((row) => {
    const rowCatalog = row.dataset.catalog ?? "";
    const rowGender = row.dataset.gender ?? "";
    const rowText = row.dataset.searchText ?? "";

    const matchesQ = qLower === "" || rowText.includes(qLower);
    const matchesCatalog = state.catalog === "" || rowCatalog === state.catalog;
    const matchesGender = state.gender === "" || rowGender === state.gender;

    const visible = matchesQ && matchesCatalog && matchesGender;
    row.dataset.hidden = visible ? "false" : "true";
    if (visible) visibleCount++;
  });

  if (emptyRow !== null) {
    emptyRow.hidden = visibleCount > 0;
  }
}

function initFilters(): void {
  const container = document.querySelector("[data-product-filters]");
  if (container === null) return;

  const qInput = container.querySelector<HTMLInputElement>("[data-filter-q]");
  const catalogSelect = container.querySelector<HTMLSelectElement>(
    "[data-filter-catalog]",
  );
  const genderSelect = container.querySelector<HTMLSelectElement>(
    "[data-filter-gender]",
  );

  function currentState(): FilterState {
    return {
      q: qInput?.value ?? "",
      catalog: catalogSelect?.value ?? "",
      gender: genderSelect?.value ?? "",
    };
  }

  const run = (): void => applyFilters(currentState());

  qInput?.addEventListener("input", run);
  catalogSelect?.addEventListener("change", run);
  genderSelect?.addEventListener("change", run);
}

function initDeleteModal(): void {
  const modal = document.querySelector<HTMLDivElement>("[data-delete-modal]");
  const form = document.querySelector<HTMLFormElement>("[data-delete-form]");
  const nameTarget = document.querySelector<HTMLElement>(
    "[data-delete-product-name]",
  );
  const cancelBtn = document.querySelector<HTMLButtonElement>(
    "[data-delete-cancel]",
  );

  if (modal === null || form === null) return;

  function openModal(productId: string, productName: string): void {
    if (nameTarget !== null) nameTarget.textContent = productName;
    form!.action = `/api/admin/products/${productId}`;
    modal!.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(): void {
    modal!.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll<HTMLButtonElement>("[data-delete-trigger]").forEach(
    (btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.productId;
        const name = btn.dataset.productName ?? "este producto";
        if (id === undefined) return;
        openModal(id, name);
      });
    },
  );

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

export function initProductListController(): void {
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
