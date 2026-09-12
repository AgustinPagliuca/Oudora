import { describe, expect, it } from "vitest";
import { validateCheckoutForm } from "@/lib/checkout-validation";

/**
 * Campos mínimos de un pedido con retiro. Para "domicilio" hacen falta
 * además lastName, street, city, postalCode y province.
 */
const VALID_RETIRO = {
  shippingMethod: "retiro",
  firstName: "Agustín",
  email: "agus@mail.com",
  phone: "1166391969",
  dni: "35123456",
};

const VALID_DOMICILIO_EXTRA = {
  lastName: "Pagliuca",
  street: "Av. Siempre Viva 742",
  city: "Santos Lugares",
  postalCode: "1676",
  province: "Buenos Aires",
};

function buildFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

describe("retiro", () => {
  it("acepta un formulario válido con los campos mínimos", () => {
    const result = validateCheckoutForm(buildFormData(VALID_RETIRO));
    expect(result.ok).toBe(true);
  });

  it("no exige los campos de dirección", () => {
    const result = validateCheckoutForm(buildFormData(VALID_RETIRO));
    if (!result.ok) throw new Error("se esperaba un formulario válido");
    expect(result.data.street).toBeNull();
    expect(result.data.city).toBeNull();
    expect(result.data.province).toBeNull();
    expect(result.data.postalCode).toBeNull();
    expect(result.data.lastName).toBeNull();
  });

  it("normaliza el email a minúsculas y sin espacios", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, email: "  AGUS@Mail.COM  " }),
    );
    if (!result.ok) throw new Error("se esperaba un formulario válido");
    expect(result.data.email).toBe("agus@mail.com");
  });

  it("deja notes en null cuando viene vacío", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, notes: "   " }),
    );
    if (!result.ok) throw new Error("se esperaba un formulario válido");
    expect(result.data.notes).toBeNull();
  });

  it("conserva las notas cuando se completan", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, notes: "Regalo para mi vieja" }),
    );
    if (!result.ok) throw new Error("se esperaba un formulario válido");
    expect(result.data.notes).toBe("Regalo para mi vieja");
  });
});

describe("domicilio", () => {
  it("acepta un formulario completo", () => {
    const result = validateCheckoutForm(
      buildFormData({
        ...VALID_RETIRO,
        ...VALID_DOMICILIO_EXTRA,
        shippingMethod: "domicilio",
      }),
    );
    expect(result.ok).toBe(true);
  });

  it("exige los campos de dirección cuando faltan", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, shippingMethod: "domicilio" }),
    );
    if (result.ok) throw new Error("se esperaban errores de dirección");
    expect(result.errors.lastName).toBeDefined();
    expect(result.errors.street).toBeDefined();
    expect(result.errors.city).toBeDefined();
    expect(result.errors.postalCode).toBeDefined();
    expect(result.errors.province).toBeDefined();
  });

  it("devuelve los datos de dirección cuando son válidos", () => {
    const result = validateCheckoutForm(
      buildFormData({
        ...VALID_RETIRO,
        ...VALID_DOMICILIO_EXTRA,
        shippingMethod: "domicilio",
      }),
    );
    if (!result.ok) throw new Error("se esperaba un formulario válido");
    expect(result.data.lastName).toBe("Pagliuca");
    expect(result.data.city).toBe("Santos Lugares");
    expect(result.data.province).toBe("Buenos Aires");
  });

  it("normaliza el código postal a mayúsculas", () => {
    const result = validateCheckoutForm(
      buildFormData({
        ...VALID_RETIRO,
        ...VALID_DOMICILIO_EXTRA,
        shippingMethod: "domicilio",
        postalCode: "b1676abc",
      }),
    );
    if (!result.ok) throw new Error("se esperaba un formulario válido");
    expect(result.data.postalCode).toBe("B1676ABC");
  });
});

describe("errores por campo", () => {
  it("rechaza un email inválido", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, email: "agus@mail" }),
    );
    if (result.ok) throw new Error("se esperaba un error de email");
    expect(result.errors.email).toBeDefined();
    expect(result.errors.phone).toBeUndefined();
  });

  it("rechaza un email vacío", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, email: "" }),
    );
    if (result.ok) throw new Error("se esperaba un error de email");
    expect(result.errors.email).toBeDefined();
  });

  it("rechaza un teléfono con pocos dígitos", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, phone: "1234" }),
    );
    if (result.ok) throw new Error("se esperaba un error de teléfono");
    expect(result.errors.phone).toBeDefined();
  });

  it("acepta un teléfono con separadores comunes", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, phone: "(011) 6639-1969" }),
    );
    expect(result.ok).toBe(true);
  });

  it("rechaza un DNI con puntos", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, dni: "35.123.456" }),
    );
    if (result.ok) throw new Error("se esperaba un error de DNI");
    expect(result.errors.dni).toBeDefined();
  });

  it("rechaza un DNI demasiado corto", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, dni: "123" }),
    );
    if (result.ok) throw new Error("se esperaba un error de DNI");
    expect(result.errors.dni).toBeDefined();
  });

  it("rechaza una provincia fuera de la lista", () => {
    const result = validateCheckoutForm(
      buildFormData({
        ...VALID_RETIRO,
        ...VALID_DOMICILIO_EXTRA,
        shippingMethod: "domicilio",
        province: "Montevideo",
      }),
    );
    if (result.ok) throw new Error("se esperaba un error de provincia");
    expect(result.errors.province).toBeDefined();
  });

  it("rechaza un método de envío desconocido", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, shippingMethod: "drone" }),
    );
    if (result.ok) throw new Error("se esperaba un error de envío");
    expect(result.errors.shippingMethod).toBeDefined();
  });

  it("rechaza un nombre demasiado corto", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, firstName: "A" }),
    );
    if (result.ok) throw new Error("se esperaba un error de nombre");
    expect(result.errors.firstName).toBeDefined();
  });

  it("rechaza un nombre con dígitos", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, firstName: "Agus7" }),
    );
    if (result.ok) throw new Error("se esperaba un error de nombre");
    expect(result.errors.firstName).toBeDefined();
  });

  it("rechaza notas que superan el máximo", () => {
    const result = validateCheckoutForm(
      buildFormData({ ...VALID_RETIRO, notes: "x".repeat(281) }),
    );
    if (result.ok) throw new Error("se esperaba un error de notas");
    expect(result.errors.notes).toBeDefined();
  });
});

describe("recolección de errores", () => {
  it("junta todos los errores en una sola pasada", () => {
    const result = validateCheckoutForm(
      buildFormData({
        shippingMethod: "retiro",
        firstName: "",
        email: "no-es-un-email",
        phone: "1",
        dni: "abc",
      }),
    );
    if (result.ok) throw new Error("se esperaban múltiples errores");
    expect(Object.keys(result.errors).sort()).toEqual([
      "dni",
      "email",
      "firstName",
      "phone",
    ]);
  });

  it("no devuelve datos cuando el formulario viene vacío", () => {
    const result = validateCheckoutForm(buildFormData({}));
    if (result.ok) throw new Error("se esperaban errores");
    expect(Object.keys(result.errors).length).toBeGreaterThan(0);
  });
});
