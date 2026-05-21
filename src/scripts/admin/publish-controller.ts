/**
 * Controller del botón "Publicar cambios" en el topbar del admin.
 *
 * Flujo:
 *  1. Click en el botón → modal de confirmación
 *  2. Confirma → POST a /api/admin/publish
 *  3. Mientras espera respuesta: estado loading
 *  4. Respuesta ok: toast verde "Publicación iniciada"
 *  5. Respuesta error: alert con el motivo
 *
 * El botón queda en cooldown 60s tras un publish exitoso para evitar
 * que el cliente le dé muchos clicks seguidos y dispare builds en paralelo.
 */

const COOLDOWN_MS = 60_000;
const TOAST_DURATION_MS = 6_000;
const STORAGE_KEY = "oudora-admin:last-publish-ts";

function showToast(message: string, kind: "success" | "error" = "success"): void {
  // Reutilizar toast existente si ya hay uno
  const existing = document.querySelector("[data-publish-toast]");
  existing?.remove();

  const toast = document.createElement("div");
  toast.setAttribute("data-publish-toast", "");
  toast.dataset.kind = kind;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Force reflow + animate in
  void toast.offsetWidth;
  toast.dataset.visible = "true";

  setTimeout(() => {
    toast.dataset.visible = "false";
    setTimeout(() => toast.remove(), 250);
  }, TOAST_DURATION_MS);
}

function readLastPublishTime(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function writeLastPublishTime(ts: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(ts));
  } catch {
    // localStorage puede estar bloqueado en private mode; ignoramos
  }
}

function applyCooldownState(btn: HTMLButtonElement): void {
  const last = readLastPublishTime();
  const elapsed = Date.now() - last;

  if (elapsed >= COOLDOWN_MS) {
    btn.disabled = false;
    btn.dataset.cooldown = "false";
    return;
  }

  btn.disabled = true;
  btn.dataset.cooldown = "true";
  const remaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
  btn.title = `Esperá ${remaining}s antes de volver a publicar`;
  setTimeout(() => applyCooldownState(btn), 1000);
}

export function initPublishController(): void {
  const init = (): void => {
    const btn = document.querySelector<HTMLButtonElement>("[data-publish-btn]");
    const modal = document.querySelector<HTMLDivElement>("[data-publish-modal]");
    const confirmBtn = document.querySelector<HTMLButtonElement>(
      "[data-publish-confirm]",
    );
    const cancelBtn = document.querySelector<HTMLButtonElement>(
      "[data-publish-cancel]",
    );

    if (btn === null || modal === null || confirmBtn === null) return;

    applyCooldownState(btn);

    function openModal(): void {
      modal!.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal(): void {
      modal!.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      openModal();
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

    confirmBtn.addEventListener("click", async () => {
      confirmBtn.disabled = true;
      const originalText = confirmBtn.textContent ?? "Publicar";
      confirmBtn.textContent = "Publicando…";

      try {
        const response = await fetch("/api/admin/publish", { method: "POST" });
        const data = await response.json().catch(() => ({}));

        closeModal();

        if (response.ok && data.ok === true) {
          showToast(
            data.message ?? "Build iniciado en Vercel. Va a tardar 1-2 minutos.",
            "success",
          );
          writeLastPublishTime(Date.now());
          applyCooldownState(btn);
        } else {
          showToast(
            data.message ?? `No se pudo publicar (${response.status}).`,
            "error",
          );
        }
      } catch (err) {
        console.error("[publish] error:", err);
        closeModal();
        showToast("No se pudo conectar con el servidor.", "error");
      } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = originalText;
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
