import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import { fileURLToPath } from "node:url";

const resolvePath = (relativePath) =>
  fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  site: "https://oudora.com.ar",
  // En Astro 5 el modo "hybrid" se fusionó con "static": las páginas son
  // estáticas por defecto y se vuelven dinámicas con `export const prerender = false`.
  // Solo /admin/* y /api/* tienen ese flag; el resto sigue siendo estático.
  output: "static",
  adapter: vercel(),
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  // Astro 5 activó protección CSRF por defecto que en algunos setups con
  // Vercel rechaza POSTs same-origin legítimos. La seguridad real del flujo
  // de auth la maneja Supabase (cookies HttpOnly + SameSite=Lax + tokens de
  // sesión rotativos) y RLS a nivel base de datos.
  security: {
    checkOrigin: false,
  },
  vite: {
    resolve: {
      alias: {
        "@": resolvePath("./src"),
      },
    },
  },
});
