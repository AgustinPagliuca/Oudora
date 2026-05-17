import type { CartSnapshot } from "@/types/catalog";
import { BRANDS_BY_ID } from "@/data/brands";
import { PRODUCTS } from "@/data/products";
import { CartStore } from "@/lib/cart-store";
import { formatArs, formatPresentation } from "@/lib/format";
import { buildWhatsAppCheckoutUrl } from "@/lib/whatsapp";

/**
 * Controlador del carrito.
 *
 *  - Construye un CartStore con índices de productos y marcas.
 *  - Conecta botones "Agregar" de las cards.
 *  - Renderiza el drawer cuando cambia el estado del carrito.
 *  - Genera el link de WhatsApp con el mensaje del pedido al checkout.
 */

const PRODUCTS_BY_ID: ReadonlyMap<string, (typeof PRODUCTS)[number]> = new Map(
  PRODUCTS.map((product) => [product.id, product]),
);

function setDrawerOpen(open: boolean): void {
  const drawer = document.querySelector<HTMLElement>("[data-cart-drawer]");
  if (drawer === null) return;
  drawer.setAttribute("aria-hidden", open ? "false" : "true");
  document.body.style.overflow = open ? "hidden" : "";
  resetClearConfirmation();
}

const CLEAR_CONFIRM_LABEL = "Confirmar vaciado";
const CLEAR_DEFAULT_LABEL = "Vaciar carrito";
const CLEAR_CONFIRM_TIMEOUT_MS = 4000;
let clearConfirmTimeoutId: ReturnType<typeof setTimeout> | null = null;

function enterClearConfirmation(button: HTMLButtonElement): void {
  button.dataset.confirming = "true";
  const label = button.querySelector<HTMLElement>("[data-cart-clear-label]");
  if (label !== null) label.textContent = CLEAR_CONFIRM_LABEL;
  if (clearConfirmTimeoutId !== null) clearTimeout(clearConfirmTimeoutId);
  clearConfirmTimeoutId = setTimeout(() => {
    resetClearConfirmation();
  }, CLEAR_CONFIRM_TIMEOUT_MS);
}

function resetClearConfirmation(): void {
  if (clearConfirmTimeoutId !== null) {
    clearTimeout(clearConfirmTimeoutId);
    clearConfirmTimeoutId = null;
  }
  const button = document.querySelector<HTMLButtonElement>(
    "[data-cart-clear]",
  );
  if (button !== null) button.dataset.confirming = "false";
  const label = document.querySelector<HTMLElement>("[data-cart-clear-label]");
  if (label !== null) label.textContent = CLEAR_DEFAULT_LABEL;
}

function updateCartCount(snapshot: CartSnapshot): void {
  const badge = document.querySelector<HTMLElement>("[data-cart-count]");
  if (badge === null) return;
  if (snapshot.itemCount > 0) {
    badge.textContent = String(snapshot.itemCount);
    badge.hidden = false;
  } else {
    badge.textContent = "0";
    badge.hidden = true;
  }
}

function renderEmptyState(isEmpty: boolean): void {
  const empty = document.querySelector<HTMLElement>("[data-cart-empty]");
  const list = document.querySelector<HTMLElement>("[data-cart-lines]");
  const footer = document.querySelector<HTMLElement>("[data-cart-footer]");
  if (empty !== null) empty.hidden = !isEmpty;
  if (list !== null) list.hidden = isEmpty;
  if (footer !== null) footer.hidden = isEmpty;
}

function renderCartLines(snapshot: CartSnapshot, store: CartStore): void {
  const list = document.querySelector<HTMLUListElement>("[data-cart-lines]");
  const template = document.querySelector<HTMLTemplateElement>(
    "#cart-line-template",
  );
  if (list === null || template === null) return;

  list.innerHTML = "";

  for (const line of snapshot.lines) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const li = fragment.querySelector<HTMLLIElement>(".cart-line");
    if (li === null) continue;

    li.dataset.productId = line.product.id;

    const brandEl = li.querySelector<HTMLElement>("[data-line-brand]");
    const nameEl = li.querySelector<HTMLElement>("[data-line-name]");
    const presEl = li.querySelector<HTMLElement>("[data-line-pres]");
    const qtyEl = li.querySelector<HTMLElement>("[data-line-qty]");
    const totalEl = li.querySelector<HTMLElement>("[data-line-total]");
    const decreaseBtn = li.querySelector<HTMLButtonElement>(
      "[data-line-decrease]",
    );
    const increaseBtn = li.querySelector<HTMLButtonElement>(
      "[data-line-increase]",
    );
    const removeBtn = li.querySelector<HTMLButtonElement>("[data-line-remove]");

    if (brandEl !== null) brandEl.textContent = line.brand.name;
    if (nameEl !== null) nameEl.textContent = line.product.name;
    if (presEl !== null) {
      presEl.textContent = formatPresentation(
        line.product.concentration,
        line.product.volumeMl,
      );
    }
    if (qtyEl !== null) qtyEl.textContent = String(line.quantity);
    if (totalEl !== null) totalEl.textContent = formatArs(line.lineTotal);

    decreaseBtn?.addEventListener("click", () => {
      store.setQuantity(line.product.id, line.quantity - 1);
    });
    increaseBtn?.addEventListener("click", () => {
      store.setQuantity(line.product.id, line.quantity + 1);
    });
    removeBtn?.addEventListener("click", () => {
      store.removeItem(line.product.id);
    });

    list.appendChild(li);
  }
}

function renderTotal(snapshot: CartSnapshot): void {
  const totalEl = document.querySelector<HTMLElement>("[data-cart-total]");
  if (totalEl !== null) totalEl.textContent = formatArs(snapshot.total);
}

function renderCheckoutLink(snapshot: CartSnapshot): void {
  const link = document.querySelector<HTMLAnchorElement>(
    "[data-cart-checkout]",
  );
  if (link === null) return;
  const url = buildWhatsAppCheckoutUrl(snapshot);
  if (url === null) {
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
  } else {
    link.setAttribute("href", url);
    link.removeAttribute("aria-disabled");
  }
}

function renderCart(snapshot: CartSnapshot, store: CartStore): void {
  updateCartCount(snapshot);
  renderEmptyState(snapshot.lines.length === 0);
  renderCartLines(snapshot, store);
  renderTotal(snapshot);
  renderCheckoutLink(snapshot);
}

function setupAddToCartButtons(store: CartStore): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-add-to-cart]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.dataset.productId;
        if (productId === undefined || productId.length === 0) return;
        if (!PRODUCTS_BY_ID.has(productId)) return;
        store.addItem(productId, 1);
        setDrawerOpen(true);
      });
    });
}

function setupDrawerControls(store: CartStore): void {
  document
    .querySelector<HTMLButtonElement>("[data-cart-button]")
    ?.addEventListener("click", () => setDrawerOpen(true));

  document
    .querySelector<HTMLButtonElement>("[data-cart-close]")
    ?.addEventListener("click", () => setDrawerOpen(false));

  document
    .querySelector<HTMLElement>("[data-cart-backdrop]")
    ?.addEventListener("click", () => setDrawerOpen(false));

  document
    .querySelector<HTMLButtonElement>("[data-cart-continue]")
    ?.addEventListener("click", () => setDrawerOpen(false));

  document
    .querySelector<HTMLButtonElement>("[data-cart-clear]")
    ?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (!(button instanceof HTMLButtonElement)) return;
      const isConfirming = button.dataset.confirming === "true";
      if (isConfirming) {
        store.clear();
        resetClearConfirmation();
        return;
      }
      enterClearConfirmation(button);
    });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setDrawerOpen(false);
    }
  });
}

export function initCartController(): void {
  const store = new CartStore({
    products: PRODUCTS_BY_ID,
    brands: BRANDS_BY_ID,
  });

  setupAddToCartButtons(store);
  setupDrawerControls(store);

  store.subscribe((snapshot) => renderCart(snapshot, store));

  // Render inicial con el estado persistido en localStorage
  renderCart(store.getSnapshot(), store);
}
