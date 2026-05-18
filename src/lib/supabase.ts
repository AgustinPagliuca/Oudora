import {
  createServerClient,
  parseCookieHeader,
  type CookieOptions,
} from "@supabase/ssr";
import type { AstroCookies } from "astro";

/**
 * Crea un cliente de Supabase para Server-Side Rendering.
 *
 * Maneja la lectura/escritura de cookies de sesión vía la API de Astro.
 * Cada request recibe su propio cliente para no compartir estado entre
 * usuarios distintos (importante en serverless).
 */
export function createSupabaseServerClient(
  cookies: AstroCookies,
  request: Request,
) {
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL y SUPABASE_KEY son requeridas. Configurar en .env (local) o Vercel.",
    );
  }

  return createServerClient(url, key, {
    cookies: {
      getAll(): { name: string; value: string }[] {
        const header = request.headers.get("Cookie") ?? "";
        return parseCookieHeader(header).map((c) => ({
          name: c.name,
          value: c.value ?? "",
        }));
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options: CookieOptions;
        }[],
      ): void {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options);
        });
      },
    },
  });
}
