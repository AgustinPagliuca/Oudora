import { describe, expect, it } from "vitest";
import { formatArs, formatPresentation } from "@/lib/format";

/**
 * formatArs usa Intl.NumberFormat('es-AR'), cuyo output varía entre runtimes
 * (Node puede usar U+00A0 como separador y distinto orden del símbolo).
 * Por eso testeamos propiedades del string, nunca el string literal.
 */

/** Extrae solo los dígitos, ignorando símbolos y separadores de miles. */
function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

describe("formatArs", () => {
  it("conserva todos los dígitos del monto", () => {
    expect(digitsOf(formatArs(75000))).toBe("75000");
    expect(digitsOf(formatArs(1234567))).toBe("1234567");
    expect(digitsOf(formatArs(0))).toBe("0");
  });

  it("incluye el símbolo de peso", () => {
    expect(formatArs(50000)).toContain("$");
  });

  it("no muestra decimales", () => {
    // Ni ",00" ni ".00" al final, sea cual sea el separador del locale.
    expect(formatArs(50000)).not.toMatch(/[.,]\d{2}$/);
    expect(formatArs(1999.99)).not.toMatch(/[.,]\d{2}$/);
  });

  it("redondea los decimales en lugar de truncarlos", () => {
    expect(digitsOf(formatArs(1999.99))).toBe("2000");
    expect(digitsOf(formatArs(1999.4))).toBe("1999");
  });

  it("agrupa los miles con algún separador", () => {
    // 75000 -> "75" + separador + "000": el string es más largo que los dígitos.
    const formatted = formatArs(75000);
    expect(formatted.length).toBeGreaterThan(digitsOf(formatted).length + 1);
  });

  it("maneja montos negativos conservando el signo", () => {
    expect(formatArs(-50000)).toMatch(/-/);
    expect(digitsOf(formatArs(-50000))).toBe("50000");
  });
});

describe("formatPresentation", () => {
  it("combina concentración y volumen", () => {
    expect(formatPresentation("EDP", 100)).toBe("EDP · 100 ml");
  });

  it("formatea el volumen con la unidad ml", () => {
    // formatVolume es privada (quedó sin exportar tras la limpieza de código
    // muerto), así que se testea a través de su único consumidor público.
    expect(formatPresentation("EDT", 50)).toContain("50 ml");
    expect(formatPresentation("Extrait", 30)).toContain("30 ml");
  });

  it("usa el separador · entre ambas partes", () => {
    expect(formatPresentation("Parfum", 75).split(" · ")).toHaveLength(2);
  });
});
