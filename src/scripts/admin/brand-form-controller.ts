/**
 * Controla el formulario de marca en /admin/marcas/nueva y /[id]:
 *  1. Slug autogenerado desde el nombre con debounce.
 *  2. Modal de borrado disparado desde la zona peligrosa.
 */

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function initSlugAutogen(): void {
  const nameInput = document.querySelector<HTMLInputElement>("[data-brand-name]");
  const slugInput = document.querySelector<HTMLInputElement>("[data-brand-slug]");
  if (nameInput === null || slugInput === null) return;

  let userEditedSlug = slugInput.value.trim().length > 0;

  slugInput.addEventListener("input", () => {
    userEditedSlug = true;
  });

  let debounceId: number | undefined;
  nameInput.addEventListener("input", () => {
    if (userEditedSlug) return;
    window.clearTimeout(debounceId);
    debounceId = window.setTimeout(() => {
      slugInput.value = toSlug(nameInput.value);
    }, 300);
  });
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
      if (btn.disabled) return;
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

export function initBrandFormController(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initSlugAutogen();
      initDeleteModal();
    });
  } else {
    initSlugAutogen();
    initDeleteModal();
  }
}
