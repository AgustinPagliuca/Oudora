import { BRANDS, PRODUCTS } from "@/data/catalog.generated";
import { CartStore } from "@/lib/cart-store";
import { formatArs, formatPresentation } from "@/lib/format";
import {
  validateCheckoutForm,
  type BuyerData,
  type ValidationErrors,
} from "@/lib/checkout-validation";
import { buildWhatsAppFullCheckoutUrl } from "@/lib/whatsapp";
import {
  PICKUP_POINT,
  SHIPPING_METHODS,
  type ShippingMethod,
} from "@/constants/checkout";
import type { CartSnapshot } from "@/types/catalog";

/**
 * Controller del checkout v1.0.
 *
 * Responsabilidades:
 *   - Cargar el cart desde localStorage al montar la página
 *   - Mostrar empty state si el cart vino vacío (con link al catálogo)
 *   - Navegar entre los 3 steps validando antes de avanzar
 *   - Alternar campos visibles según el método de envío (retiro / domicilio)
 *   - Renderizar el resumen del paso 3 en vivo con los datos del form
 *   - Al submit: validar todo, construir el link de wa.me y abrirlo
 *
 * Patrón de validación: NO usa early returns. Cada paso colecta todos los
 * errores en una pasada y se los presenta al usuario junto.
 */

type StepNumber = 1 | 2 | 3;

interface CheckoutContext {
  readonly cart: CartStore;
  readonly form: HTMLFormElement;
  readonly stepperItems: NodeListOf<HTMLElement>;
  readonly stepSections: NodeListOf<HTMLElement>;
  readonly emptyCart: HTMLElement;
  currentStep: StepNumber;
  shippingMethod: ShippingMethod | null;
}

function buildCart(): CartStore {
  const productsMap = new Map(PRODUCTS.map((p) => [p.id, p]));
  const brandsMap = new Map(BRANDS.map((b) => [b.id, b]));
  return new CartStore({ products: productsMap, brands: brandsMap });
}

function getSnapshot(cart: CartStore): CartSnapshot {
  return cart.getSnapshot();
}

function showEmptyState(ctx: CheckoutContext): void {
  ctx.emptyCart.hidden = false;
  ctx.form.hidden = true;
  const stepper = document.querySelector<HTMLElement>("[data-stepper]");
  if (stepper !== null) stepper.style.display = "none";
}

function updateStepperVisual(ctx: CheckoutContext): void {
  ctx.stepperItems.forEach((item) => {
    const stepStr = item.dataset.stepperItem ?? "1";
    const stepNum = parseInt(stepStr, 10);
    let state = "";
    if (stepNum === ctx.currentStep) {
      state = "active";
      item.setAttribute("aria-current", "step");
    } else {
      item.removeAttribute("aria-current");
      if (stepNum < ctx.currentStep) {
        state = "done";
      }
    }
    if (state === "") {
      delete item.dataset.state;
    } else {
      item.dataset.state = state;
    }
  });
}

function showStep(ctx: CheckoutContext, step: StepNumber): void {
  ctx.currentStep = step;
  ctx.stepSections.forEach((section) => {
    const sectionStep = parseInt(section.dataset.step ?? "0", 10);
    section.hidden = sectionStep !== step;
  });
  updateStepperVisual(ctx);
  // Scroll suave hacia el top al cambiar de paso
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyShippingMethodVisibility(ctx: CheckoutContext, method: ShippingMethod): void {
  ctx.shippingMethod = method;

  // Toggle de campos exclusivos de domicilio
  const domicilioFields = document.querySelectorAll<HTMLElement>("[data-only-domicilio]");
  domicilioFields.forEach((field) => {
    field.hidden = method !== "domicilio";
  });

  // Toggle de bloques de contexto (los textos explicativos en el paso 2)
  const contextRetiro = document.querySelector<HTMLElement>("[data-shipping-context-retiro]");
  const contextDomicilio = document.querySelector<HTMLElement>("[data-shipping-context-domicilio]");
  if (contextRetiro !== null) contextRetiro.hidden = method !== "retiro";
  if (contextDomicilio !== null) contextDomicilio.hidden = method !== "domicilio";

  // Aplicar/quitar el atributo `required` en los inputs según corresponda.
  // Esto hace que la validación nativa del browser refleje correctamente
  // el método elegido en cada momento.
  const domicilioInputs = document.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
    "[data-required-domicilio]",
  );
  domicilioInputs.forEach((input) => {
    if (method === "domicilio") {
      input.setAttribute("required", "");
    } else {
      input.removeAttribute("required");
      // Limpiamos errores visuales que pudieran haber quedado
      input.removeAttribute("data-invalid");
    }
  });
}

function clearAllErrors(): void {
  const errorEls = document.querySelectorAll<HTMLElement>("[data-error-for]");
  errorEls.forEach((el) => {
    el.hidden = true;
    el.textContent = "";
  });
  const invalidInputs = document.querySelectorAll<HTMLElement>("[data-invalid]");
  invalidInputs.forEach((input) => {
    input.removeAttribute("data-invalid");
  });
}

function paintErrors(errors: ValidationErrors): void {
  let firstErrorField: string | null = null;
  for (const [field, message] of Object.entries(errors)) {
    const errorEl = document.querySelector<HTMLElement>(
      `[data-error-for="${field}"]`,
    );
    if (errorEl !== null && typeof message === "string") {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
    const inputEl = document.querySelector<HTMLInputElement | HTMLSelectElement>(
      `[name="${field}"]`,
    );
    if (inputEl !== null) {
      inputEl.setAttribute("data-invalid", "true");
      if (firstErrorField === null) {
        firstErrorField = field;
      }
    }
  }
  // Foco al primer campo con error
  if (firstErrorField !== null) {
    const focusEl = document.querySelector<HTMLInputElement>(
      `[name="${firstErrorField}"]`,
    );
    if (focusEl !== null) {
      focusEl.focus();
      focusEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

/**
 * Valida el step 1: solo verifica que haya un método de envío elegido.
 * No tira early return: setea el error si falta y devuelve un boolean.
 */
function validateStep1(ctx: CheckoutContext): boolean {
  clearAllErrors();
  const radios = document.querySelectorAll<HTMLInputElement>(
    "[name='shippingMethod']",
  );
  let selected: ShippingMethod | null = null;
  radios.forEach((r) => {
    if (r.checked && (r.value === "retiro" || r.value === "domicilio")) {
      selected = r.value;
    }
  });

  const chosen: ShippingMethod | null = selected;
  const valid = chosen !== null;
  if (!valid) {
    const errorEl = document.querySelector<HTMLElement>(
      "[data-error-for='shippingMethod']",
    );
    if (errorEl !== null) {
      errorEl.textContent = "Elegí cómo querés recibir el pedido.";
      errorEl.hidden = false;
    }
  } else if (chosen !== null) {
    applyShippingMethodVisibility(ctx, chosen);
  }
  return valid;
}

/**
 * Valida el step 2: pasa el form completo por el validador.
 * Aunque el form esté usando required nativo, validamos de nuevo en JS
 * porque queremos mensajes en español, agrupar errores y manejar
 * campos condicionales (los de domicilio).
 */
function validateStep2(ctx: CheckoutContext): boolean {
  clearAllErrors();
  const formData = new FormData(ctx.form);
  const result = validateCheckoutForm(formData);

  if (!result.ok) {
    paintErrors(result.errors);
    return false;
  }
  return true;
}

function buildSummaryLineHtml(line: CartSnapshot["lines"][number]): string {
  const presentation = formatPresentation(line.product.concentration, line.product.volumeMl);
  // Texto plano dentro de textContent (lo escapa el browser) — no concatenamos HTML
  return ""
    + "<span>"
    + escapeHtml(line.brand.name) + " · " + escapeHtml(line.product.name) + " · " + escapeHtml(presentation)
    + "<span class=\"summary-line-qty\">×" + line.quantity + "</span>"
    + "</span>"
    + "<span>" + escapeHtml(formatArs(line.lineTotal)) + "</span>";
}

/**
 * Escape HTML para evitar XSS al inyectar texto en innerHTML.
 * Aunque los datos vienen del catálogo (controlado), defendemos por las dudas.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSummary(ctx: CheckoutContext, buyer: BuyerData): void {
  const snapshot = getSnapshot(ctx.cart);

  // ── Productos
  const linesUl = document.querySelector<HTMLUListElement>("[data-summary-lines]");
  if (linesUl !== null) {
    linesUl.innerHTML = "";
    for (const line of snapshot.lines) {
      const li = document.createElement("li");
      li.innerHTML = buildSummaryLineHtml(line);
      linesUl.appendChild(li);
    }
  }

  // ── Totales
  const subtotalEl = document.querySelector<HTMLElement>("[data-summary-subtotal]");
  if (subtotalEl !== null) {
    subtotalEl.textContent = formatArs(snapshot.total);
  }

  const shippingLabelEl = document.querySelector<HTMLElement>("[data-summary-shipping-label]");
  const shippingCostEl = document.querySelector<HTMLElement>("[data-summary-shipping-cost]");
  const isDomicilio = buyer.shippingMethod === "domicilio";

  if (shippingLabelEl !== null) {
    shippingLabelEl.textContent = isDomicilio && buyer.postalCode !== null
      ? `Envío a ${buyer.city ?? ""} (${buyer.postalCode})`
      : `Envío · ${SHIPPING_METHODS[buyer.shippingMethod].label}`;
  }
  if (shippingCostEl !== null) {
    shippingCostEl.textContent = isDomicilio ? "A calcular" : "Sin cargo";
    shippingCostEl.style.fontStyle = isDomicilio ? "italic" : "normal";
    shippingCostEl.style.color = isDomicilio
      ? "var(--color-text-muted)"
      : "var(--color-gold-light)";
  }

  const totalEl = document.querySelector<HTMLElement>("[data-summary-total]");
  const totalNoteEl = document.querySelector<HTMLElement>("[data-summary-total-note]");
  if (totalEl !== null) {
    totalEl.textContent = formatArs(snapshot.total);
  }
  if (totalNoteEl !== null) {
    totalNoteEl.hidden = !isDomicilio;
  }

  // ── Datos del comprador
  const buyerDl = document.querySelector<HTMLElement>("[data-summary-buyer]");
  if (buyerDl !== null) {
    const fullName = buyer.lastName === null
      ? buyer.firstName
      : `${buyer.firstName} ${buyer.lastName}`;
    const addressLines: string[] = [];
    if (buyer.street !== null) addressLines.push(buyer.street);
    const cityLine = [buyer.city, buyer.postalCode, buyer.province]
      .filter((v) => v !== null && v.length > 0)
      .join(" · ");
    if (cityLine.length > 0) addressLines.push(cityLine);

    const pairs: Array<[string, string]> = [
      ["Nombre", fullName],
      ["DNI", buyer.dni],
      ["Email", buyer.email],
      ["Teléfono", buyer.phone],
      ["Envío", isDomicilio ? "A domicilio" : `Retiro en ${PICKUP_POINT.city}`],
    ];
    if (addressLines.length > 0) {
      pairs.push(["Dirección", addressLines.join("\n")]);
    }
    if (buyer.notes !== null) {
      pairs.push(["Notas", buyer.notes]);
    }

    buyerDl.innerHTML = "";
    for (const [label, value] of pairs) {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.style.whiteSpace = "pre-line";
      dd.textContent = value;
      buyerDl.appendChild(dt);
      buyerDl.appendChild(dd);
    }
  }
}

function showSuccessState(ctx: CheckoutContext, whatsappUrl: string): void {
  const successEl = document.querySelector<HTMLElement>("[data-success]");
  const stepper = document.querySelector<HTMLElement>("[data-stepper]");

  // Ocultamos el form y el stepper
  ctx.form.hidden = true;
  if (stepper !== null) {
    stepper.style.display = "none";
  }
  if (successEl !== null) {
    successEl.hidden = false;
  }

  // Hidratamos el link de fallback con el mismo URL de WhatsApp por si el
  // popup-blocker del browser haya impedido la apertura automática.
  const fallbackLink = document.querySelector<HTMLAnchorElement>(
    "[data-success-fallback]",
  );
  if (fallbackLink !== null) {
    fallbackLink.setAttribute("href", whatsappUrl);
    fallbackLink.setAttribute("target", "_blank");
    fallbackLink.setAttribute("rel", "noopener noreferrer");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Aceptación de la Política de Privacidad y los Términos y Condiciones. La base
 * legal del tratamiento de los datos del pedido es contractual, así que este
 * checkbox registra únicamente la aceptación de esos dos documentos.
 *
 * Vive solo en el paso 3, así que no puede validarse en `validateCheckoutForm`:
 * ese validador también corre en el paso 2, donde todavía no se mostró.
 * Devuelve true si está tildado.
 */
function validateLegalAcceptance(): boolean {
  const checkbox = document.querySelector<HTMLInputElement>("#legalAccept");
  const errorEl = document.querySelector<HTMLElement>(
    "[data-error-for='legalAccept']",
  );
  const wrapper = checkbox?.closest<HTMLElement>(".consent") ?? null;

  if (checkbox !== null && checkbox.checked) {
    if (errorEl !== null) {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }
    wrapper?.removeAttribute("data-invalid");
    return true;
  }

  if (errorEl !== null) {
    errorEl.textContent =
      "Necesitamos que aceptes la Política de Privacidad y los Términos y Condiciones para continuar.";
    errorEl.hidden = false;
  }
  wrapper?.setAttribute("data-invalid", "true");
  checkbox?.focus();
  checkbox?.scrollIntoView({ behavior: "smooth", block: "center" });
  return false;
}

function handleSubmit(event: SubmitEvent, ctx: CheckoutContext): void {
  event.preventDefault();
  // Validamos todo de nuevo por las dudas (no confiamos en que el step 2 esté ok)
  const formData = new FormData(ctx.form);
  const result = validateCheckoutForm(formData);
  if (!result.ok) {
    paintErrors(result.errors);
    showStep(ctx, 2);
    return;
  }

  // Después de los campos: si no aceptó los documentos legales no seguimos, y
  // nos quedamos en el paso 3 (el checkbox está acá, no en el 2).
  if (!validateLegalAcceptance()) {
    return;
  }

  const snapshot = getSnapshot(ctx.cart);
  if (snapshot.lines.length === 0) {
    showEmptyState(ctx);
    return;
  }

  const url = buildWhatsAppFullCheckoutUrl(snapshot, result.data);
  if (url === null) {
    showEmptyState(ctx);
    return;
  }

  // Abrir wa.me en una pestaña nueva — en mobile abre la app directamente.
  // `noopener,noreferrer` por seguridad (el destino no recibe window.opener).
  window.open(url, "_blank", "noopener,noreferrer");

  // Vaciamos el carrito: el flujo del cliente quedó "cerrado" desde nuestro lado.
  // Si por algún motivo el cliente no envía el mensaje, igual conserva el link
  // de fallback en la pantalla de éxito.
  ctx.cart.clear();

  showSuccessState(ctx, url);
}

function bindNavigation(ctx: CheckoutContext): void {
  // Botones "Continuar" (paso siguiente)
  const nextBtns = document.querySelectorAll<HTMLButtonElement>("[data-step-next]");
  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetStep = parseInt(btn.dataset.stepNext ?? "0", 10);
      const isStep1 = ctx.currentStep === 1 && targetStep === 2;
      const isStep2 = ctx.currentStep === 2 && targetStep === 3;

      let canAdvance = false;
      if (isStep1) {
        canAdvance = validateStep1(ctx);
      } else if (isStep2) {
        canAdvance = validateStep2(ctx);
        if (canAdvance) {
          const result = validateCheckoutForm(new FormData(ctx.form));
          if (result.ok) {
            renderSummary(ctx, result.data);
          }
        }
      }

      if (canAdvance) {
        showStep(ctx, targetStep as StepNumber);
      }
    });
  });

  // Botones "Atrás" (paso anterior)
  const backBtns = document.querySelectorAll<HTMLButtonElement>("[data-step-back]");
  backBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetStep = parseInt(btn.dataset.stepBack ?? "0", 10);
      showStep(ctx, targetStep as StepNumber);
    });
  });

  // Radio buttons de método de envío: actualizan visibilidad en vivo
  const shippingInputs = document.querySelectorAll<HTMLInputElement>(
    "[data-shipping-input]",
  );
  shippingInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked && (input.value === "retiro" || input.value === "domicilio")) {
        applyShippingMethodVisibility(ctx, input.value);
      }
    });
  });

  // Submit del form
  ctx.form.addEventListener("submit", (e) => handleSubmit(e, ctx));

  // Limpieza de error visual al volver a tipear en un input inválido
  const inputs = ctx.form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    "input, select, textarea",
  );
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.dataset.invalid === "true") {
        input.removeAttribute("data-invalid");
        const name = input.getAttribute("name");
        if (name !== null) {
          const errorEl = document.querySelector<HTMLElement>(
            `[data-error-for="${name}"]`,
          );
          if (errorEl !== null) {
            errorEl.hidden = true;
            errorEl.textContent = "";
          }
        }
      }
    });
  });
}

export function initCheckoutController(): void {
  const run = (): void => {
    const form = document.querySelector<HTMLFormElement>("[data-checkout-form]");
    const stepperItems = document.querySelectorAll<HTMLElement>("[data-stepper-item]");
    const stepSections = document.querySelectorAll<HTMLElement>("[data-step]");
    const emptyCart = document.querySelector<HTMLElement>("[data-empty-cart]");

    if (form === null || emptyCart === null) {
      console.error("[checkout] Missing required DOM elements");
      return;
    }

    const cart = buildCart();
    const ctx: CheckoutContext = {
      cart,
      form,
      stepperItems,
      stepSections,
      emptyCart,
      currentStep: 1,
      shippingMethod: null,
    };

    // Cart vacío → mostramos empty state y no enganchamos handlers
    const snapshot = getSnapshot(cart);
    if (snapshot.lines.length === 0) {
      showEmptyState(ctx);
      return;
    }

    bindNavigation(ctx);
    showStep(ctx, 1);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
}
