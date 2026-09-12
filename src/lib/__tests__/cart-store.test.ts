import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CartStore } from "@/lib/cart-store";
import {
  installLocalStorage,
  makeBrand,
  makeContext,
  makeProduct,
  uninstallLocalStorage,
} from "./fixtures";

const brand = makeBrand({ id: "brand-lattafa", name: "Lattafa" });
const asad = makeProduct({ id: "asad", priceArs: 50000, stock: 10 });
const khamrah = makeProduct({ id: "khamrah", priceArs: 30000, stock: 4 });
const escaso = makeProduct({ id: "escaso", priceArs: 20000, stock: 2 });
const agotado = makeProduct({ id: "agotado", priceArs: 15000, stock: 0 });

function newStore(): CartStore {
  return new CartStore(
    makeContext([asad, khamrah, escaso, agotado], [brand]),
  );
}

beforeEach(() => {
  installLocalStorage();
});

afterEach(() => {
  uninstallLocalStorage();
});

describe("addItem", () => {
  it("agrega un producto al carrito", () => {
    const snapshot = newStore().addItem("asad");
    expect(snapshot.lines).toHaveLength(1);
    expect(snapshot.lines[0]?.product.id).toBe("asad");
    expect(snapshot.lines[0]?.quantity).toBe(1);
    expect(snapshot.lines[0]?.brand.name).toBe("Lattafa");
  });

  it("suma la cantidad al agregar el mismo producto dos veces", () => {
    const store = newStore();
    store.addItem("asad");
    const snapshot = store.addItem("asad");
    expect(snapshot.lines).toHaveLength(1);
    expect(snapshot.lines[0]?.quantity).toBe(2);
  });

  it("respeta la cantidad explícita", () => {
    const snapshot = newStore().addItem("asad", 3);
    expect(snapshot.lines[0]?.quantity).toBe(3);
  });

  it("mantiene líneas separadas para productos distintos", () => {
    const store = newStore();
    store.addItem("asad");
    const snapshot = store.addItem("khamrah");
    expect(snapshot.lines).toHaveLength(2);
  });

  it("calcula lineTotal como precio × cantidad", () => {
    const snapshot = newStore().addItem("asad", 3);
    expect(snapshot.lines[0]?.lineTotal).toBe(150000);
  });
});

describe("clampToStock", () => {
  it("no deja agregar más unidades que el stock disponible", () => {
    const snapshot = newStore().addItem("escaso", 10);
    expect(snapshot.lines[0]?.quantity).toBe(2);
  });

  it("clampea también al acumular entre dos addItem", () => {
    const store = newStore();
    store.addItem("escaso", 1);
    const snapshot = store.addItem("escaso", 5);
    expect(snapshot.lines[0]?.quantity).toBe(2);
  });

  it("no agrega un producto sin stock", () => {
    const snapshot = newStore().addItem("agotado");
    expect(snapshot.lines).toHaveLength(0);
  });

  it("clampea en setQuantity", () => {
    const store = newStore();
    store.addItem("escaso", 1);
    const snapshot = store.setQuantity("escaso", 99);
    expect(snapshot.lines[0]?.quantity).toBe(2);
  });
});

describe("producto ausente del contexto", () => {
  it("ignora la línea en el snapshot", () => {
    const snapshot = newStore().addItem("fantasma");
    expect(snapshot.lines).toHaveLength(0);
    expect(snapshot.itemCount).toBe(0);
    expect(snapshot.total).toBe(0);
  });

  it("ignora la línea si falta la marca del producto", () => {
    // El producto existe, pero su brandId no está en el mapa de marcas.
    const huerfano = makeProduct({ id: "huerfano", brandId: "brand-inexistente" });
    const store = new CartStore(makeContext([huerfano], []));
    const snapshot = store.addItem("huerfano");
    expect(snapshot.lines).toHaveLength(0);
  });

  it("no rompe el resto del carrito", () => {
    const store = newStore();
    store.addItem("asad", 2);
    const snapshot = store.addItem("fantasma");
    expect(snapshot.lines).toHaveLength(1);
    expect(snapshot.total).toBe(100000);
  });
});

describe("setQuantity", () => {
  it("reemplaza la cantidad de una línea existente", () => {
    const store = newStore();
    store.addItem("asad", 1);
    const snapshot = store.setQuantity("asad", 4);
    expect(snapshot.lines[0]?.quantity).toBe(4);
  });

  it("remueve la línea cuando la cantidad es 0", () => {
    const store = newStore();
    store.addItem("asad");
    expect(store.setQuantity("asad", 0).lines).toHaveLength(0);
  });

  it("remueve la línea cuando la cantidad es negativa", () => {
    const store = newStore();
    store.addItem("asad");
    expect(store.setQuantity("asad", -5).lines).toHaveLength(0);
  });

  it("no agrega el producto si no estaba en el carrito", () => {
    const snapshot = newStore().setQuantity("asad", 3);
    expect(snapshot.lines).toHaveLength(0);
  });
});

describe("removeItem", () => {
  it("elimina solo el producto indicado", () => {
    const store = newStore();
    store.addItem("asad");
    store.addItem("khamrah");
    const snapshot = store.removeItem("asad");
    expect(snapshot.lines).toHaveLength(1);
    expect(snapshot.lines[0]?.product.id).toBe("khamrah");
  });

  it("es inocuo si el producto no está en el carrito", () => {
    const store = newStore();
    store.addItem("asad");
    expect(store.removeItem("khamrah").lines).toHaveLength(1);
  });
});

describe("clear", () => {
  it("vacía el carrito por completo", () => {
    const store = newStore();
    store.addItem("asad", 2);
    store.addItem("khamrah", 3);
    const snapshot = store.clear();
    expect(snapshot.lines).toHaveLength(0);
    expect(snapshot.itemCount).toBe(0);
    expect(snapshot.total).toBe(0);
  });
});

describe("getSnapshot", () => {
  it("calcula total e itemCount sumando todas las líneas", () => {
    const store = newStore();
    store.addItem("asad", 2); // 2 × 50000 = 100000
    store.addItem("khamrah", 3); // 3 × 30000 = 90000
    const snapshot = store.getSnapshot();
    expect(snapshot.itemCount).toBe(5);
    expect(snapshot.total).toBe(190000);
  });

  it("devuelve un carrito vacío en ceros", () => {
    expect(newStore().getSnapshot()).toEqual({
      lines: [],
      itemCount: 0,
      total: 0,
    });
  });

  it("refleja el estado actual tras varias operaciones", () => {
    const store = newStore();
    store.addItem("asad", 2);
    store.setQuantity("asad", 1);
    store.addItem("khamrah", 1);
    store.removeItem("khamrah");
    const snapshot = store.getSnapshot();
    expect(snapshot.itemCount).toBe(1);
    expect(snapshot.total).toBe(50000);
  });
});

describe("persistencia en localStorage", () => {
  it("restaura el carrito en una instancia nueva", () => {
    newStore().addItem("asad", 2);
    // Una instancia nueva lee el mismo localStorage en su constructor.
    expect(newStore().getSnapshot().itemCount).toBe(2);
  });

  it("persiste el vaciado del carrito", () => {
    const store = newStore();
    store.addItem("asad", 2);
    store.clear();
    expect(newStore().getSnapshot().lines).toHaveLength(0);
  });

  it("ignora contenido corrupto en localStorage", () => {
    localStorage.setItem("oudora.cart.v1", "{ no es json válido");
    expect(newStore().getSnapshot().lines).toHaveLength(0);
  });

  it("descarta entradas con forma inválida", () => {
    localStorage.setItem(
      "oudora.cart.v1",
      JSON.stringify([{ productId: "asad", quantity: 2 }, { roto: true }]),
    );
    const snapshot = newStore().getSnapshot();
    expect(snapshot.lines).toHaveLength(1);
    expect(snapshot.itemCount).toBe(2);
  });
});
