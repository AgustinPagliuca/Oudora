/**
 * Scroll-reveal: muestra elementos con fade + slide-up cuando entran al
 * viewport. Aplica a cualquier elemento con atributo `data-reveal`.
 *
 * Para stagger entre hijos de un mismo container, agregá `data-reveal-stagger`
 * al PADRE. Los hijos con `data-reveal` van a aparecer escalonados con un
 * delay incremental por orden.
 *
 * Respeta prefers-reduced-motion: si el usuario tiene esa preferencia activa,
 * todos los elementos aparecen inmediatamente sin animación.
 *
 * IntersectionObserver es de bajo costo (el browser lo maneja en su propio
 * thread), así que podemos observar todos los `[data-reveal]` sin penalty.
 */

const REVEAL_SELECTOR = "[data-reveal]";
const STAGGER_SELECTOR = "[data-reveal-stagger]";
const VISIBLE_CLASS = "is-revealed";
const STAGGER_STEP_MS = 80;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Para containers con `data-reveal-stagger`: calcula el delay de cada hijo
 * según su posición. Se hace al cargar (no al intersectar), así cuando el
 * container entre al viewport, los hijos ya tienen sus delays seteados.
 */
function setupStaggerDelays(): void {
  document.querySelectorAll<HTMLElement>(STAGGER_SELECTOR).forEach((container) => {
    const children = container.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
    children.forEach((child, index) => {
      // Solo setear si el child es hijo directo o nieto del stagger container.
      // Hijos lejanos pueden tener su propio timing.
      if (container.contains(child) && child.style.transitionDelay === "") {
        child.style.transitionDelay = `${index * STAGGER_STEP_MS}ms`;
      }
    });
  });
}

export function initScrollReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
  if (elements.length === 0) return;

  // Reduced motion: mostrar todo inmediatamente sin observar.
  if (prefersReducedMotion()) {
    elements.forEach((el) => el.classList.add(VISIBLE_CLASS));
    return;
  }

  setupStaggerDelays();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(VISIBLE_CLASS);
        // Una vez revelado, dejamos de observar — no necesitamos re-disparar.
        observer.unobserve(entry.target);
      });
    },
    {
      // Empezar a animar cuando el elemento esté a 60px del viewport — así
      // queda terminando de aparecer justo cuando el usuario lo está mirando.
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.05,
    },
  );

  elements.forEach((el) => observer.observe(el));
}
