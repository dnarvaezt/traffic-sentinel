import iconv from "iconv-lite-umd"

/**
 * Limpia un string eliminando espacios dobles, espacios del inicio/fin y normalizando a UTF-8
 * @example cleanString("  hola   mundo  ") // "hola mundo"
 * @example cleanString("texto    con    espacios  ") // "texto con espacios"
 */
export const cleanString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ")
}

/**
 * Elimina todos los acentos, tildes y caracteres especiales del español
 * Convierte ñ → n, ü → u, y elimina todos los diacríticos mediante normalización Unicode
 * @example removeAccents("José María") // "Jose Maria"
 * @example removeAccents("Niño") // "Nino"
 * @example removeAccents("Teléfono") // "Telefono"
 * @example removeAccents("España") // "Espana"
 * @example removeAccents("áéíóúÁÉÍÓÚñÑüÜ") // "aeiouAEIOUnNuU"
 * @example removeAccents("ñoño pinzón") // "nono pinzon"
 */
export const removeAccents = (str: string): string => {
  if (typeof str !== "string") {
    return str
  }

  return str
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
}

/**
 * Codifica un string UTF-8 a ANSI (Windows-1252) con validación ultra-estricta
 * Garantiza 100% compatibilidad con Windows-1252 mediante:
 * - Eliminación de TODOS los acentos y caracteres especiales
 * - Eliminación de caracteres invisibles (zero-width, non-breaking spaces, etc.)
 * - Eliminación de caracteres de control C1 (\u0080-\u009F)
 * - Conversión de saltos de línea y caracteres de control a espacios
 * - Limpieza de espacios dobles, espacios al inicio/fin
 * - Validación carácter por carácter, eliminando cualquier carácter no válido
 * - Retorna string vacío si después de la limpieza no queda contenido válido
 * @example toAnsi("José María\n\n  ") // "Jose Maria"
 * @example toAnsi("Teléfono   Móvil") // "Telefono Movil"
 * @example toAnsi("España\r\nCafé") // "Espana Cafe"
 * @example toAnsi("Texto\u200Bcon\uFEFFinvisibles") // "Texto con invisibles"
 */
export const toAnsi = (str: string): string => {
  if (typeof str !== "string") {
    return str
  }

  // Paso 1: Validación temprana - si el string está vacío, retornar
  if (!str || str.trim().length === 0) {
    return ""
  }

  // Paso 2: Eliminar TODOS los acentos y caracteres especiales
  let cleaned = removeAccents(str)

  // Paso 3: Eliminar caracteres invisibles y problemáticos
  // Zero-width spaces, non-breaking spaces, caracteres de reemplazo Unicode
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF\uFFFD]/g, " ")
  // Convertir non-breaking space a espacio normal (válido en ANSI pero normalizamos)
  cleaned = cleaned.replace(/\u00A0/g, " ")
  // Eliminar caracteres nulos
  cleaned = cleaned.replace(/\0/g, "")
  // Eliminar caracteres de control C1 problemáticos (\u0080-\u009F)
  cleaned = cleaned.replace(/[\u0080-\u009F]/g, "")

  // Paso 4: Convertir saltos de línea y caracteres de control a espacios
  // \r\n primero para evitar doble reemplazo, luego individuales
  cleaned = cleaned.replace(/\r\n/g, " ")
  cleaned = cleaned.replace(/[\r\n\t\f\v]/g, " ")

  // Paso 5: Eliminar espacios dobles y múltiples, luego trim (inicio y fin)
  cleaned = cleaned.replace(/\s+/g, " ").trim()

  // Paso 6: Si después de la limpieza queda vacío, retornar string vacío
  if (cleaned.length === 0) {
    return ""
  }

  // Paso 7: Validar carácter por carácter, eliminando cualquier carácter no válido
  const result: string[] = []

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i]

    // Saltar espacios dobles que puedan quedar
    if (char === " " && result[result.length - 1] === " ") {
      continue
    }

    try {
      // Intentar codificar y decodificar el carácter individualmente
      const buffer = iconv.encode(char, "win1252")
      const decoded = iconv.decode(buffer, "win1252")

      // Solo mantener si el carácter se codifica/decodifica sin pérdida
      // y no es un carácter de reemplazo ('?')
      if (
        decoded === char &&
        !decoded.includes("?") &&
        char.charCodeAt(0) >= 32 &&
        char.charCodeAt(0) !== 127
      ) {
        result.push(char)
      }
      // Si el carácter no es válido, simplemente lo omitimos (no agregamos nada)
    } catch (_error) {}
  }

  const finalString = result.join("")

  // Paso 8: Si después de la validación queda vacío, retornar string vacío
  if (finalString.length === 0) {
    return ""
  }

  // Paso 9: Verificación final estricta - codificar y decodificar el resultado completo
  try {
    const finalBuffer = iconv.encode(finalString, "win1252")
    const finalDecoded = iconv.decode(finalBuffer, "win1252")

    // Si hay caracteres '?' o cualquier problema, limpiar de nuevo
    if (finalDecoded.includes("?") || finalDecoded !== finalString) {
      // Limpieza agresiva: solo mantener ASCII básico + espacios
      return finalString
        .replace(/[^\x20-\x7E\s]/g, "")
        .replace(/\s+/g, " ")
        .trim()
    }

    // Limpieza final de espacios múltiples por si acaso
    return finalDecoded.replace(/\s+/g, " ").trim()
  } catch (_error) {
    // Fallback ultra-estricto: solo ASCII básico
    return finalString
      .replace(/[^\x20-\x7E\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }
}

/**
 * Convierte un string a un slug URL-friendly
 * Elimina acentos, caracteres especiales, reemplaza espacios por guiones y convierte a minúsculas
 * @example toSlug("José María López") // "jose-maria-lopez"
 * @example toSlug("Teléfono Móvil") // "telefono-movil"
 * @example toSlug("Niño en 2024!") // "nino-en-2024"
 * @example toSlug("España - País") // "espana-pais"
 */
export const toSlug = (str: string): string => {
  return removeAccents(str)
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}
