export const prerender = false;

import type { APIRoute } from "astro";

interface PublishResponse {
  ok: boolean;
  error?: string;
  message?: string;
}

function jsonResponse(body: PublishResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Dispara un build nuevo de Vercel llamando a un Deploy Hook configurado
 * como env var. El hook es una URL única generada en Vercel → Settings →
 * Git → Deploy Hooks que, al recibir un POST, genera un build de la branch
 * configurada (main) sin necesidad de un push de git.
 *
 * Mantenemos la URL en env var (no en el repo) porque cualquiera con esa
 * URL puede disparar builds de tu proyecto.
 */
export const POST: APIRoute = async ({ locals }) => {
  if (locals.user === null) {
    return jsonResponse({ ok: false, error: "unauthorized" }, 401);
  }

  const hookUrl = import.meta.env.VERCEL_DEPLOY_HOOK_URL;
  if (typeof hookUrl !== "string" || hookUrl === "") {
    return jsonResponse(
      {
        ok: false,
        error: "not_configured",
        message:
          "El deploy hook de Vercel no está configurado. Agregar VERCEL_DEPLOY_HOOK_URL en las env vars.",
      },
      503,
    );
  }

  try {
    const response = await fetch(hookUrl, { method: "POST" });

    if (!response.ok) {
      const text = await response.text();
      console.error("[admin/publish] Hook rechazado:", response.status, text);
      return jsonResponse(
        {
          ok: false,
          error: "hook_failed",
          message: `Vercel rechazó el hook (HTTP ${response.status}).`,
        },
        502,
      );
    }

    return jsonResponse({
      ok: true,
      message: "Build iniciado en Vercel. Va a tardar 1-2 minutos en estar disponible en el sitio público.",
    });
  } catch (err) {
    console.error("[admin/publish] Error de red:", err);
    return jsonResponse(
      {
        ok: false,
        error: "network_error",
        message: "No se pudo contactar a Vercel. Reintentá en un momento.",
      },
      503,
    );
  }
};
