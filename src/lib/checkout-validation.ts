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

/** Lee un campo del FormData ya recortado. */
function readField(formData: FormData, name: string): string {
  return (formData.get(name) ?? "").toString().trim();
}

/**
 * Validadores por campo. Cada uno devuelve el mensaje de error o null si
 * el valor es aceptable, sin conocer el resto del formulario.
 */

function validateShippingMethod(raw: string): string | null {
  return raw === "retiro" || raw === "domicilio"
    ? null
    : "Elegí cómo querés recibir el pedido.";
}

function validateFirstName(value: string): string | null {
  const rule = CHECKOUT_FIELD_RULES.firstName;
  if (!validateLength(value, rule.minLength, rule.maxLength)) {
    return `Ingresá tu nombre (entre ${rule.minLength} y ${rule.maxLength} caracteres).`;
  }
  if (!matchesPattern(value, rule.pattern)) {
    return "Solo letras, espacios, apóstrofes y guiones.";
  }
  return null;
}

function validateLastName(value: string): string | null {
  const rule = CHECKOUT_FIELD_RULES.lastName;
  if (!validateLength(value, rule.minLength, rule.maxLength)) {
    return `Ingresá tu apellido (entre ${rule.minLength} y ${rule.maxLength} caracteres).`;
  }
  if (!matchesPattern(value, rule.pattern)) {
    return "Solo letras, espacios, apóstrofes y guiones.";
  }
  return null;
}

function validateEmail(value: string): string | null {
  if (value.length === 0) {
    return "Ingresá tu email.";
  }
  if (!isValidEmail(value)) {
    return "El email no parece válido.";
  }
  return null;
}

function validatePhone(value: string): string | null {
  const rule = CHECKOUT_FIELD_RULES.phone;
  if (value.length === 0) {
    return "Ingresá tu teléfono.";
  }
  const digits = digitCount(value);
  if (digits < rule.minDigits || digits > rule.maxDigits) {
    return `El teléfono debe tener entre ${rule.minDigits} y ${rule.maxDigits} dígitos.`;
  }
  if (!matchesPattern(value, rule.pattern)) {
    return "Solo números, espacios, guiones, paréntesis y +.";
  }
  return null;
}

function validateDni(value: string): string | null {
  return matchesPattern(value, CHECKOUT_FIELD_RULES.dni.pattern)
    ? null
    : "Ingresá tu DNI (entre 7 y 9 dígitos, sin puntos).";
}

function validateStreet(value: string): string | null {
  const rule = CHECKOUT_FIELD_RULES.street;
  return validateLength(value, rule.minLength, rule.maxLength)
    ? null
    : "Ingresá la dirección completa (calle, número y piso/depto).";
}

function validateCity(value: string): string | null {
  const rule = CHECKOUT_FIELD_RULES.city;
  if (!validateLength(value, rule.minLength, rule.maxLength)) {
    return "Ingresá la ciudad.";
  }
  if (!matchesPattern(value, rule.pattern)) {
    return "La ciudad solo puede tener letras, números y signos comunes.";
  }
  return null;
}

function validatePostalCode(value: string): string | null {
  return matchesPattern(value, CHECKOUT_FIELD_RULES.postalCode.pattern)
    ? null
    : "Ingresá el código postal (4 a 8 caracteres alfanuméricos).";
}

function validateProvince(value: string): string | null {
  return PROVINCE_SET.has(value) ? null : "Elegí una provincia de la lista.";
}

function validateNotes(value: string): string | null {
  const { maxLength } = CHECKOUT_FIELD_RULES.notes;
  return value.length > maxLength
    ? `Las notas no pueden superar ${maxLength} caracteres.`
    : null;
}

/** Campos que solo se exigen cuando el envío es a domicilio. */
type ShippingFields = Pick<
  BuyerData,
  "lastName" | "street" | "city" | "postalCode" | "province"
>;

const EMPTY_SHIPPING_FIELDS: ShippingFields = {
  lastName: null,
  street: null,
  city: null,
  postalCode: null,
  province: null,
};

/**
 * Valida el bloque de domicilio. Cada campo queda en null si falló su
 * validación, de modo que BuyerData nunca lleve un valor no validado.
 */
function validateShippingFields(
  formData: FormData,
  errors: ValidationErrors,
): ShippingFields {
  const lastName = readField(formData, "lastName");
  errors.lastName = validateLastName(lastName) ?? undefined;

  const street = readField(formData, "street");
  errors.street = validateStreet(street) ?? undefined;

  const city = readField(formData, "city");
  errors.city = validateCity(city) ?? undefined;

  const postalCode = readField(formData, "postalCode").toUpperCase();
  errors.postalCode = validatePostalCode(postalCode) ?? undefined;

  const province = readField(formData, "province");
  errors.province = validateProvince(province) ?? undefined;

  return {
    lastName: errors.lastName === undefined ? lastName : null,
    street: errors.street === undefined ? street : null,
    city: errors.city === undefined ? city : null,
    postalCode: errors.postalCode === undefined ? postalCode : null,
    province: errors.province === undefined ? province : null,
  };
}

/** Descarta las claves en undefined que dejan los validadores sin error. */
function compactErrors(errors: ValidationErrors): ValidationErrors {
  const compacted: ValidationErrors = {};
  for (const [field, message] of Object.entries(errors)) {
    if (message !== undefined) {
      compacted[field as keyof BuyerData] = message;
    }
  }
  return compacted;
}

/**
 * Toma un FormData del browser y devuelve los datos validados o un mapa de errores.
 * No usa early returns: recolecta TODOS los errores en una pasada para que el
 * usuario los vea juntos en lugar de uno a uno.
 */
export function validateCheckoutForm(formData: FormData): ValidationResult {
  const raw: ValidationErrors = {};

  const rawShipping = (formData.get("shippingMethod") ?? "").toString();
  raw.shippingMethod = validateShippingMethod(rawShipping) ?? undefined;
  const shippingMethod = rawShipping as ShippingMethod;

  const firstName = readField(formData, "firstName");
  raw.firstName = validateFirstName(firstName) ?? undefined;

  const email = readField(formData, "email").toLowerCase();
  raw.email = validateEmail(email) ?? undefined;

  const phone = readField(formData, "phone");
  raw.phone = validatePhone(phone) ?? undefined;

  const dni = readField(formData, "dni");
  raw.dni = validateDni(dni) ?? undefined;

  const shippingFields = rawShipping === "domicilio"
    ? validateShippingFields(formData, raw)
    : EMPTY_SHIPPING_FIELDS;

  const notesRaw = readField(formData, "notes");
  raw.notes = validateNotes(notesRaw) ?? undefined;
  const notes = raw.notes === undefined && notesRaw.length > 0 ? notesRaw : null;

  const errors = compactErrors(raw);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  // El orden de los campos replica el de BuyerData: es observable al
  // serializar el objeto, así que se mantiene explícito.
  return {
    ok: true,
    data: {
      shippingMethod,
      firstName,
      lastName: shippingFields.lastName,
      email,
      phone,
      dni,
      street: shippingFields.street,
      city: shippingFields.city,
      postalCode: shippingFields.postalCode,
      province: shippingFields.province,
      notes,
    },
  };
}
