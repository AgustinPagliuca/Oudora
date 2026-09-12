/**
 * Helpers de respuesta HTTP compartidos por los endpoints del admin.
 */

/**
 * Redirección See Other (303) tras un POST/PUT/DELETE.
 *
 * 303 es el status correcto para el patrón POST-redirect-GET: fuerza al
 * browser a seguir con GET en lugar de repetir el método original, así
 * un refresh no reenvía el form.
 */
export function redirectTo(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}
