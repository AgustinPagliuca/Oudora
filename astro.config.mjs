import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

const resolvePath = (relativePath) =>
  fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  site: "https://oudora.com.ar",
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
