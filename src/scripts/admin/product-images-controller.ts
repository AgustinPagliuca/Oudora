/**
 * Controller del panel de imágenes en el form de edición de producto.
 *
 * Responsabilidades:
 *  1. Procesar imágenes en el navegador (resize a max 1200px, convertir a WebP).
 *     Esto reduce el peso 60-80% sin perder calidad visible y descarga al server.
 *  2. Subir cada imagen al endpoint POST /api/admin/products/[id]/images.
 *  3. Permitir reordenar con drag & drop (PUT con el orden nuevo).
 *  4. Permitir borrar imágenes (DELETE).
 *  5. Reflejar todos los cambios en el DOM sin recargar la página.
 */

const MAX_DIMENSION = 1200;
const WEBP_QUALITY = 0.85;
const VALID_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

interface UploadedImage {
  id: string;
  url: string;
  position: number;
}

/** Cargar una imagen desde un File. Necesario para dibujarla en un canvas. */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });
}

/** Resize + WebP en el cliente. Devuelve un Blob listo para subir. */
async function processImage(file: File): Promise<Blob> {
  const img = await loadImage(file);

  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width >= height) {
      height = Math.round((height * MAX_DIMENSION) / width);
      width = MAX_DIMENSION;
    } else {
      width = Math.round((width * MAX_DIMENSION) / height);
      height = MAX_DIMENSION;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx === null) throw new Error("Canvas no disponible");
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob === null) reject(new Error("Conversión a WebP falló"));
        else resolve(blob);
      },
      "image/webp",
      WEBP_QUALITY,
    );
  });
}

function setFeedback(
  feedbackEl: HTMLElement,
  kind: "error" | "info",
  message: string,
): void {
  feedbackEl.dataset.kind = kind;
  feedbackEl.textContent = message;
  feedbackEl.hidden = false;
}

function clearFeedback(feedbackEl: HTMLElement): void {
  feedbackEl.hidden = true;
  feedbackEl.textContent = "";
}

function buildImageCard(
  image: UploadedImage,
  isFirst: boolean,
): HTMLDivElement {
  const card = document.createElement("div");
  card.className = "image-card";
  card.dataset.imageId = image.id;
  card.draggable = true;

  const img = document.createElement("img");
  img.src = image.url;
  img.loading = "lazy";
  img.alt = "";
  card.appendChild(img);

  if (isFirst) {
    const badge = document.createElement("span");
    badge.className = "image-badge";
    badge.textContent = "Portada";
    card.appendChild(badge);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "image-delete";
  deleteBtn.dataset.imageDelete = "";
  deleteBtn.setAttribute("aria-label", "Borrar imagen");
  deleteBtn.textContent = "×";
  card.appendChild(deleteBtn);

  return card;
}

function refreshPortadaBadges(grid: HTMLElement): void {
  const cards = grid.querySelectorAll<HTMLDivElement>(".image-card");
  cards.forEach((card, index) => {
    const existingBadge = card.querySelector(".image-badge");
    if (index === 0) {
      if (existingBadge === null) {
        const badge = document.createElement("span");
        badge.className = "image-badge";
        badge.textContent = "Portada";
        const firstImg = card.querySelector("img");
        if (firstImg !== null) firstImg.after(badge);
        else card.appendChild(badge);
      }
    } else {
      existingBadge?.remove();
    }
  });
}

export function initProductImagesController(): void {
  const init = (): void => {
    const panel = document.querySelector<HTMLElement>("[data-images-panel]");
    if (panel === null) return;

    const productId = panel.dataset.productId;
    const maxImages = parseInt(panel.dataset.maxImages ?? "4", 10);
    if (productId === undefined) return;

    const grid = panel.querySelector<HTMLDivElement>("[data-images-list]");
    const uploadZone = panel.querySelector<HTMLDivElement>("[data-upload-zone]");
    const uploadInput = panel.querySelector<HTMLInputElement>("[data-upload-input]");
    const uploadTrigger = panel.querySelector<HTMLButtonElement>("[data-upload-trigger]");
    const feedback = panel.querySelector<HTMLDivElement>("[data-images-feedback]");

    if (grid === null || feedback === null) return;

    const endpoint = `/api/admin/products/${productId}/images`;

    function currentImageCount(): number {
      return grid!.querySelectorAll(".image-card").length;
    }

    function maybeHideUploadZone(): void {
      if (uploadZone === null) return;
      const count = currentImageCount();
      const isFull = count >= maxImages;
      uploadZone.dataset.hidden = isFull ? "true" : "false";

      // Actualizar el contador de slots restantes
      const remainingEl = uploadZone.querySelector<HTMLElement>(
        "[data-remaining-slots]",
      );
      if (remainingEl !== null) {
        remainingEl.textContent = String(Math.max(0, maxImages - count));
      }
    }

    async function uploadFile(file: File): Promise<void> {
      if (!VALID_TYPES.has(file.type)) {
        setFeedback(feedback!, "error", `${file.name}: tipo de archivo no soportado.`);
        return;
      }
      if (currentImageCount() >= maxImages) {
        setFeedback(feedback!, "error", `Ya tenés el máximo de ${maxImages} imágenes.`);
        return;
      }

      clearFeedback(feedback!);
      uploadZone?.classList.add("is-uploading");
      setFeedback(feedback!, "info", `Procesando ${file.name}…`);

      try {
        const blob = await processImage(file);
        const formData = new FormData();
        formData.append("image", blob, "image.webp");

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          const errorMsg = describeError(error.error ?? response.statusText);
          setFeedback(feedback!, "error", errorMsg);
          return;
        }

        const image = (await response.json()) as UploadedImage;
        const isFirst = currentImageCount() === 0;
        const card = buildImageCard(image, isFirst);
        bindCardEvents(card);
        grid!.appendChild(card);

        clearFeedback(feedback!);
        maybeHideUploadZone();
      } catch (err) {
        console.error("[product-images] upload error:", err);
        setFeedback(feedback!, "error", "No se pudo procesar la imagen.");
      } finally {
        uploadZone?.classList.remove("is-uploading");
      }
    }

    function describeError(code: string): string {
      switch (code) {
        case "invalid_type":
          return "Formato no soportado. Usá JPG, PNG o WebP.";
        case "file_too_big":
          return "La imagen es muy pesada (máx 5MB).";
        case "max_images_reached":
          return `Ya tenés el máximo de ${maxImages} imágenes.`;
        case "upload_failed":
          return "Falló la subida al storage. Reintentá.";
        case "unauthorized":
          return "Tu sesión expiró. Recargá la página.";
        default:
          return "Error inesperado. Reintentá.";
      }
    }

    async function deleteImage(card: HTMLElement): Promise<void> {
      const imageId = card.dataset.imageId;
      if (imageId === undefined) return;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _method: "DELETE", imageId }),
      });

      if (!response.ok) {
        setFeedback(feedback!, "error", "No se pudo borrar la imagen.");
        return;
      }

      card.remove();
      refreshPortadaBadges(grid!);
      maybeHideUploadZone();
    }

    async function persistOrder(): Promise<void> {
      const ids = Array.from(
        grid!.querySelectorAll<HTMLElement>(".image-card"),
      ).map((card) => card.dataset.imageId);

      const validIds = ids.filter((id): id is string => typeof id === "string");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _method: "PUT", order: validIds }),
      });

      if (!response.ok) {
        setFeedback(feedback!, "error", "No se pudo guardar el orden.");
      } else {
        refreshPortadaBadges(grid!);
      }
    }

    // Drag & drop entre cards para reordenar
    let draggedCard: HTMLElement | null = null;

    function bindCardEvents(card: HTMLElement): void {
      const deleteBtn = card.querySelector<HTMLButtonElement>(
        "[data-image-delete]",
      );

      let confirmTimer: number | undefined;

      deleteBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (deleteBtn.dataset.confirming === "true") {
          // Segundo click: confirma
          window.clearTimeout(confirmTimer);
          deleteImage(card);
          return;
        }

        // Primer click: pone el botón en modo "confirma"
        deleteBtn.dataset.confirming = "true";
        deleteBtn.textContent = "Borrar";
        deleteBtn.setAttribute("title", "Volvé a clickear para confirmar");
        confirmTimer = window.setTimeout(() => {
          deleteBtn.dataset.confirming = "false";
          deleteBtn.textContent = "×";
          deleteBtn.setAttribute("title", "");
        }, 3000);
      });

      card.addEventListener("dragstart", (event) => {
        draggedCard = card;
        card.classList.add("is-dragging");
        if (event.dataTransfer !== null) {
          event.dataTransfer.effectAllowed = "move";
        }
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("is-dragging");
        grid!
          .querySelectorAll(".is-drop-target")
          .forEach((el) => el.classList.remove("is-drop-target"));
        draggedCard = null;
      });

      card.addEventListener("dragover", (event) => {
        event.preventDefault();
        if (draggedCard !== null && draggedCard !== card) {
          card.classList.add("is-drop-target");
        }
      });

      card.addEventListener("dragleave", () => {
        card.classList.remove("is-drop-target");
      });

      card.addEventListener("drop", (event) => {
        event.preventDefault();
        card.classList.remove("is-drop-target");
        if (draggedCard === null || draggedCard === card) return;

        // Insertar antes o después según posición del cursor
        const rect = card.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const dropBefore = event.clientX < midX;

        if (dropBefore) {
          card.before(draggedCard);
        } else {
          card.after(draggedCard);
        }

        persistOrder();
      });
    }

    // Bindings iniciales para las cards renderizadas server-side
    grid.querySelectorAll<HTMLElement>(".image-card").forEach(bindCardEvents);

    // Upload trigger desde el botón "elegí archivos"
    uploadTrigger?.addEventListener("click", (event) => {
      event.preventDefault();
      uploadInput?.click();
    });

    // Click en cualquier parte de la upload zone (que no sea el botón)
    uploadZone?.addEventListener("click", (event) => {
      if (event.target === uploadTrigger) return;
      uploadInput?.click();
    });

    // Archivo seleccionado via input
    uploadInput?.addEventListener("change", async (event) => {
      const input = event.target as HTMLInputElement;
      const files = input.files;
      if (files === null) return;
      for (const file of Array.from(files)) {
        await uploadFile(file);
      }
      input.value = ""; // permitir re-seleccionar el mismo archivo
    });

    // Drag & drop de archivos del SO sobre la upload zone
    uploadZone?.addEventListener("dragover", (event) => {
      event.preventDefault();
      uploadZone.classList.add("is-drop-target");
    });
    uploadZone?.addEventListener("dragleave", () => {
      uploadZone.classList.remove("is-drop-target");
    });
    uploadZone?.addEventListener("drop", async (event) => {
      event.preventDefault();
      uploadZone.classList.remove("is-drop-target");
      const files = event.dataTransfer?.files;
      if (files === undefined) return;
      for (const file of Array.from(files)) {
        await uploadFile(file);
      }
    });

    maybeHideUploadZone();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
