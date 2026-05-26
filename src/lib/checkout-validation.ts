import {
  ARGENTINA_PROVINCES,
  CHECKOUT_FIELD_RULES,
  type ShippingMethod,
} from "@/constants/checkout";

/**
 * Datos del comprador, ya validados.
 * Los campos opcionales (apellido, dirección, etc.) solo existen
 * cuando el shippingMethod es "domicilio".
 */
export interface BuyerData {
  readonly shippingMethod: ShippingMethod;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly phone: string;
  readonly dni: string;
  readonly street: string | null;
  readonly city: string | null;
  readonly postalCode: string | null;
  readonly province: string | null;
  readonly notes: string | null;
}

/**
 * Errores agrupados por campo. Las claves coinciden con los `name` del HTML
 * para que el controller pueda marcar cada input específico.
 */
export type ValidationErrors = Partial<Record<keyof BuyerData, string>>;

export type ValidationResult =
  | { readonly ok: true; readonly data: BuyerData }
  | { readonly ok: false; readonly errors: ValidationErrors };

const PROVINCE_SET: ReadonlySet<string> = new Set(ARGENTINA_PROVINCES);

/**
 * Cuenta solo dígitos. Útil para validar teléfono dejando que el usuario
 * use el formato que quiera (paréntesis, guiones, espacios).
 */
function digitCount(value: string): number {
  let count = 0;
  for (const char of value) {
    if (char >= "0" && char <= "9") {
      count += 1;
    }
  }
  return count;
}

function isValidEmail(value: string): boolean {
  // Validación pragmática: el patrón "official" RFC es demasiado permisivo
  // para errores comunes. Esto cubre 99% de casos válidos.
  const trimmed = value.trim();
  const hasAt = trimmed.includes("@");
  const parts = trimmed.split("@");
  const localOk = parts.length === 2 && parts[0].length >= 1 && parts[0].length <= 64;
  const domain = parts.length === 2 ? parts[1] : "";
  const domainOk = domain.includes(".") && domain.length >= 3 && !domain.startsWith(".") && !domain.endsWith(".");
  return hasAt && localOk && domainOk && trimmed.length <= CHECKOUT_FIELD_RULES.email.maxLength;
}

function matchesPattern(value: string, pattern: string): boolean {
  // El constructor de RegExp puede tirar si el patrón es inválido (no debería pasar
  // porque los patrones están hardcoded en constants, pero defendemos por las dudas).
  let regex: RegExp | null = null;
  try {
    regex = new RegExp(`^(?:${pattern})$`);
  } catch {
    regex = null;
  }
  return regex === null ? false : regex.test(value);
}

function validateLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * Toma un FormData del browser y devuelve los datos validados o un mapa de errores.
 * No usa early returns: recolecta TODOS los errores en una pasada para que el
 * usuario los vea juntos en lugar de uno a uno.
 */
export function validateCheckoutForm(formData: FormData): ValidationResult {
  const errors: ValidationErrors = {};

  const rawShipping = (formData.get("shippingMethod") ?? "").toString();
  const shippingMethod: ShippingMethod | null =
    rawShipping === "retiro" || rawShipping === "domicilio" ? rawShipping : null;
  if (shippingMethod === null) {
    errors.shippingMethod = "Elegí cómo querés recibir el pedido.";
  }

  const firstName = (formData.get("firstName") ?? "").toString().trim();
  const firstNameRule = CHECKOUT_FIELD_RULES.firstName;
  if (!validateLength(firstName, firstNameRule.minLength, firstNameRule.maxLength)) {
    errors.firstName = `Ingresá tu nombre (entre ${firstNameRule.minLength} y ${firstNameRule.maxLength} caracteres).`;
  } else if (!matchesPattern(firstName, firstNameRule.pattern)) {
    errors.firstName = "Solo letras, espacios, apóstrofes y guiones.";
  }

  const email = (formData.get("email") ?? "").toString().trim().toLowerCase();
  if (email.length === 0) {
    errors.email = "Ingresá tu email.";
  } else if (!isValidEmail(email)) {
    errors.email = "El email no parece válido.";
  }

  const phone = (formData.get("phone") ?? "").toString().trim();
  const phoneRule = CHECKOUT_FIELD_RULES.phone;
  if (phone.length === 0) {
    errors.phone = "Ingresá tu teléfono.";
  } else {
    const digits = digitCount(phone);
    if (digits < phoneRule.minDigits || digits > phoneRule.maxDigits) {
      errors.phone = `El teléfono debe tener entre ${phoneRule.minDigits} y ${phoneRule.maxDigits} dígitos.`;
    } else if (!matchesPattern(phone, phoneRule.pattern)) {
      errors.phone = "Solo números, espacios, guiones, paréntesis y +.";
    }
  }

  const dni = (formData.get("dni") ?? "").toString().trim();
  const dniRule = CHECKOUT_FIELD_RULES.dni;
  if (!matchesPattern(dni, dniRule.pattern)) {
    errors.dni = "Ingresá tu DNI (entre 7 y 9 dígitos, sin puntos).";
  }

  // Campos solo requeridos cuando el envío es a domicilio
  const isDomicilio = shippingMethod === "domicilio";
  let lastName: string | null = null;
  let street: string | null = null;
  let city: string | null = null;
  let postalCode: string | null = null;
  let province: string | null = null;

  if (isDomicilio) {
    const lastNameRaw = (formData.get("lastName") ?? "").toString().trim();
    const lastNameRule = CHECKOUT_FIELD_RULES.lastName;
    if (!validateLength(lastNameRaw, lastNameRule.minLength, lastNameRule.maxLength)) {
      errors.lastName = `Ingresá tu apellido (entre ${lastNameRule.minLength} y ${lastNameRule.maxLength} caracteres).`;
    } else if (!matchesPattern(lastNameRaw, lastNameRule.pattern)) {
      errors.lastName = "Solo letras, espacios, apóstrofes y guiones.";
    } else {
      lastName = lastNameRaw;
    }

    const streetRaw = (formData.get("street") ?? "").toString().trim();
    const streetRule = CHECKOUT_FIELD_RULES.street;
    if (!validateLength(streetRaw, streetRule.minLength, streetRule.maxLength)) {
      errors.street = "Ingresá la dirección completa (calle, número y piso/depto).";
    } else {
      street = streetRaw;
    }

    const cityRaw = (formData.get("city") ?? "").toString().trim();
    const cityRule = CHECKOUT_FIELD_RULES.city;
    if (!validateLength(cityRaw, cityRule.minLength, cityRule.maxLength)) {
      errors.city = "Ingresá la ciudad.";
    } else if (!matchesPattern(cityRaw, cityRule.pattern)) {
      errors.city = "La ciudad solo puede tener letras, números y signos comunes.";
    } else {
      city = cityRaw;
    }

    const postalCodeRaw = (formData.get("postalCode") ?? "").toString().trim().toUpperCase();
    const postalCodeRule = CHECKOUT_FIELD_RULES.postalCode;
    if (!matchesPattern(postalCodeRaw, postalCodeRule.pattern)) {
      errors.postalCode = "Ingresá el código postal (4 a 8 caracteres alfanuméricos).";
    } else {
      postalCode = postalCodeRaw;
    }

    const provinceRaw = (formData.get("province") ?? "").toString().trim();
    if (!PROVINCE_SET.has(provinceRaw)) {
      errors.province = "Elegí una provincia de la lista.";
    } else {
      province = provinceRaw;
    }
  }

  const notesRaw = (formData.get("notes") ?? "").toString().trim();
  let notes: string | null = null;
  if (notesRaw.length > CHECKOUT_FIELD_RULES.notes.maxLength) {
    errors.notes = `Las notas no pueden superar ${CHECKOUT_FIELD_RULES.notes.maxLength} caracteres.`;
  } else if (notesRaw.length > 0) {
    notes = notesRaw;
  }

  const hasErrors = Object.keys(errors).length > 0;
  return hasErrors
    ? { ok: false, errors }
    : {
        ok: true,
        data: {
          shippingMethod: shippingMethod as ShippingMethod,
          firstName,
          lastName,
          email,
          phone,
          dni,
          street,
          city,
          postalCode,
          province,
          notes,
        },
      };
}
