/**
 * Controla el formulario de producto en /admin/productos/nuevo y /[id]:
 *
 *  1. Slug autogenerado desde el nombre (con debounce 300ms). El usuario
 *     puede editar el slug manualmente; en ese momento dejamos de sobrescribirlo.
 *  2. Tag input para notas olfativas. Enter o coma agrega; X borra.
 *     Cada tag mantiene un input hidden name="notes" para que el form lo
 *     envíe como un array al endpoint.
 *  3. Modal de confirmación al borrar (en modo edición).
 */

/**
 * Convierte un texto a slug:
 *  - minúsculas, sin tildes ni caracteres especiales
 *  - espacios y signos a guiones
 *  - colapsa guiones múltiples
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
  const nameInput = document.querySelector<HTMLInputElement>(
    "[data-product-name]",
  );
  const slugInput = document.querySelector<HTMLInputElement>(
    "[data-product-slug]",
  );
  if (nameInput === null || slugInput === null) return;

  // Si el slug ya tiene valor inicial (modo edición), no lo pisamos automáticamente.
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

function initTagInput(): void {
  const container = document.querySelector<HTMLDivElement>("[data-tag-input]");
  if (container === null) return;

  const tagList = container.querySelector<HTMLDivElement>("[data-tag-list]");
  const textInput = container.querySelector<HTMLInputElement>(
    "[data-tag-text-input]",
  );
  if (tagList === null || textInput === null) return;

  function addTag(rawValue: string): void {
    const value = rawValue.trim().toLowerCase();
    if (value === "") return;

    // No duplicados
    const existing = tagList!.querySelectorAll<HTMLElement>("[data-tag-value]");
    for (const tag of existing) {
      if (tag.dataset.tagValue === value) return;
    }

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.dataset.tagValue = value;

    const label = document.createTextNode(value);
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "tag-remove";
    removeBtn.dataset.tagRemove = "";
    removeBtn.setAttribute("aria-label", `Quitar ${value}`);
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => tag.remove());

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "notes";
    hidden.value = value;

    tag.appendChild(label);
    tag.appendChild(removeBtn);
    tag.appendChild(hidden);
    tagList!.appendChild(tag);
  }

  // Bind a los X de tags ya renderizados desde el server
  container
    .querySelectorAll<HTMLButtonElement>("[data-tag-remove]")
    .forEach((btn) => {
      btn.addEventListener("click", () => btn.closest(".tag")?.remove());
    });

  textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(textInput.value);
      textInput.value = "";
    } else if (event.key === "Backspace" && textInput.value === "") {
      // Borrar el último tag si el input está vacío
      const tags = tagList.querySelectorAll<HTMLElement>("[data-tag-value]");
      tags[tags.length - 1]?.remove();
    }
  });

  textInput.addEventListener("blur", () => {
    // Al perder foco, si quedó algo escrito lo convertimos en tag
    if (textInput.value.trim() !== "") {
      addTag(textInput.value);
      textInput.value = "";
    }
  });

  // Click en cualquier parte del contenedor enfoca el input
  container.addEventListener("click", (event) => {
    if (event.target === container || event.target === tagList) {
      textInput.focus();
    }
  });
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

  document
    .querySelectorAll<HTMLButtonElement>("[data-delete-trigger]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.productId;
        const name = btn.dataset.productName ?? "este producto";
        if (id === undefined) return;
        openModal(id, name);
      });
    });

  cancelBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.getAttribute("aria-hidden") === "false"
    ) {
      closeModal();
    }
  });
}

/**
 * Live preview de las etiquetas custom del producto.
 * Sincroniza el badge de "Vista previa" con el texto y color de cada slot.
 */
function initLabelPreviews(): void {
  const rows = document.querySelectorAll<HTMLElement>(".label-row");
  rows.forEach((row) => {
    const textInput = row.querySelector<HTMLInputElement>("[data-label-text-input]");
    const colorSelect = row.querySelector<HTMLSelectElement>("[data-label-color-select]");
    const preview = row.querySelector<HTMLElement>("[data-label-preview]");
    if (textInput === null || colorSelect === null || preview === null) return;

    const update = (): void => {
      const text = textInput.value.trim();
      preview.textContent = text === "" ? "Vista previa" : text;
      preview.classList.remove(
        "label-preview-dark",
        "label-preview-red",
        "label-preview-gold",
      );
      preview.classList.add(`label-preview-${colorSelect.value}`);
      preview.style.opacity = text === "" ? "0.4" : "1";
    };

    textInput.addEventListener("input", update);
    colorSelect.addEventListener("change", update);
    update();
  });
}

export function initProductFormController(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initSlugAutogen();
      initTagInput();
      initDeleteModal();
      initLabelPreviews();
    });
  } else {
    initSlugAutogen();
    initTagInput();
    initDeleteModal();
    initLabelPreviews();
  }
}
