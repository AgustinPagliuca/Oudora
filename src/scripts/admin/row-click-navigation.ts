/**
 * Hace que cualquier <tr data-row-href="..."> sea clickable hacia esa URL.
 *
 * Reglas:
 *   - Click izquierdo sobre la fila (fuera de .actions y de elementos
 *     interactivos) → navegar en la misma pestaña.
 *   - Ctrl/Cmd + click → abrir en nueva pestaña.
 *   - Middle click → abrir en nueva pestaña.
 *   - Cualquier click dentro de .actions, sobre <button>, <a>, <input>,
 *     <select>, <textarea> o <form> → comportamiento default, no interceptamos.
 *
 * Pensado para listings de admin (productos, marcas) donde queremos que la
 * fila entera lleve al edit sin que se pierda el resto de los controles
 * inline (toggle, delete, etc.).
 */

function isInteractiveElement(el: Element): boolean {
  // Cualquier elemento interactivo nativo o cosa dentro de .actions
  // se considera "no clickable como navegación de fila".
  if (el.closest(".actions") !== null) return true;
  const tag = el.tagName;
  if (tag === "BUTTON" || tag === "A" || tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") {
    return true;
  }
  if (el.closest("button, a, input, select, textarea, form") !== null) return true;
  return false;
}

function getRowHref(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  if (isInteractiveElement(target)) return null;
  const row = target.closest<HTMLElement>("[data-row-href]");
  if (row === null) return null;
  const href = row.dataset.rowHref;
  return typeof href === "string" && href.length > 0 ? href : null;
}

export function initRowClickNavigation(): void {
  document.addEventListener("click", (event) => {
    const href = getRowHref(event.target);
    if (href === null) return;

    if (event.ctrlKey || event.metaKey) {
      window.open(href, "_blank", "noopener");
      return;
    }
    window.location.href = href;
  });

  // Soporte para middle click (botón 1). `auxclick` se dispara para los
  // botones que no son el principal (rueda, secundario).
  document.addEventListener("auxclick", (event) => {
    if (event.button !== 1) return;
    const href = getRowHref(event.target);
    if (href === null) return;
    event.preventDefault();
    window.open(href, "_blank", "noopener");
  });
}
