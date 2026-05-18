import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import { fileURLToPath } from "node:url";

const resolvePath = (relativePath) =>
  fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  site: "https://oudora.com.ar",
  // Hybrid: páginas estáticas por defecto, dinámicas con `export const prerender = false`.
  // Solo /admin/* y /api/* se renderizan en el servidor; el resto sigue siendo
  // HTML estático servido desde el CDN de Vercel sin overhead.
  output: "hybrid",
  adapter: vercel(),
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    resolve: {
      alias: {
        "@": resolvePath("./src"),
      },
    },
  },
});
