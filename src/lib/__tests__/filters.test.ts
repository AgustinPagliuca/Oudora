import { describe, expect, it } from "vitest";
import {
  getPriceRangeFor,
  getProductsByCatalog,
  normalizeSearchTerm,
} from "@/lib/filters";
import { makeProduct } from "./fixtures";

// productMatchesFilters / EMPTY_FILTERS ya no existen: se eliminaron en la
// limpieza de código muerto, así que acá solo se cubre lo que sigue exportado.

describe("normalizeSearchTerm", () => {
  it("recorta espacios y pasa a minúsculas", () => {
    expect(normalizeSearchTerm("  Asad  ")).toBe("asad");
    expect(normalizeSearchTerm("LATTAFA")).toBe("lattafa");
  });

  it("devuelve string vacío cuando solo hay espacios", () => {
    expect(normalizeSearchTerm("   ")).toBe("");
    expect(normalizeSearchTerm("")).toBe("");
  });

  it("conserva los espacios internos", () => {
    expect(normalizeSearchTerm("  Khamrah Qahwa ")).toBe("khamrah qahwa");
  });
});

describe("getProductsByCatalog", () => {
  const arabe1 = makeProduct({ id: "a1", catalog: "arabe" });
  const arabe2 = makeProduct({ id: "a2", catalog: "arabe" });
  const disenador = makeProduct({ id: "d1", catalog: "disenador" });
  const all = [arabe1, disenador, arabe2];

  it("devuelve solo los productos del catálogo pedido", () => {
    expect(getProductsByCatalog(all, "arabe")).toEqual([arabe1, arabe2]);
    expect(getProductsByCatalog(all, "disenador")).toEqual([disenador]);
  });

  it("devuelve array vacío si ninguno coincide", () => {
    expect(getProductsByCatalog([disenador], "arabe")).toEqual([]);
    expect(getProductsByCatalog([], "arabe")).toEqual([]);
  });

  it("no muta el array original", () => {
    const input = [...all];
    getProductsByCatalog(input, "arabe");
    expect(input).toEqual(all);
  });
});

describe("getPriceRangeFor", () => {
  it("siempre arranca el mínimo en 0", () => {
    const range = getPriceRangeFor([makeProduct({ priceArs: 118000 })]);
    expect(range.min).toBe(0);
  });

  it("usa el rango por defecto con catálogo vacío", () => {
    expect(getPriceRangeFor([])).toEqual({ min: 0, max: 50000 });
  });

  it("redondea el máximo hacia arriba al múltiplo de 50.000", () => {
    expect(getPriceRangeFor([makeProduct({ priceArs: 75000 })]).max).toBe(100000);
    expect(getPriceRangeFor([makeProduct({ priceArs: 118000 })]).max).toBe(150000);
    expect(getPriceRangeFor([makeProduct({ priceArs: 1 })]).max).toBe(50000);
  });

  it("no infla un máximo que ya es múltiplo exacto de 50.000", () => {
    expect(getPriceRangeFor([makeProduct({ priceArs: 100000 })]).max).toBe(100000);
  });

  it("toma el precio más alto del catálogo, esté donde esté", () => {
    const products = [
      makeProduct({ id: "p1", priceArs: 30000 }),
      makeProduct({ id: "p2", priceArs: 260000 }),
      makeProduct({ id: "p3", priceArs: 90000 }),
    ];
    expect(getPriceRangeFor(products).max).toBe(300000);
  });

  it("nunca devuelve un máximo por debajo del paso mínimo", () => {
    expect(getPriceRangeFor([makeProduct({ priceArs: 0 })]).max).toBe(50000);
  });
});
