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
  vite: {
    resolve: {
      alias: {
        "@": resolvePath("./src"),
      },
    },
  },
});
