/**
 * Resultado de parsear un FormData del panel admin.
 *
 * Los seis módulos `*-form.ts` comparten esta forma: o devuelven el input
 * ya validado, o marcan que la validación falló. El motivo es siempre
 * "validation" porque el detalle por campo lo resuelve el HTML nativo;
 * acá solo defendemos el endpoint de un POST manipulado.
 */
export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "validation" };
