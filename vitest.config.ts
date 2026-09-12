import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Tests unitarios sobre la lógica pura de src/lib/.
 * El alias @/ replica el de tsconfig.json para que los imports de los
 * tests sean idénticos a los del código de producción.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
