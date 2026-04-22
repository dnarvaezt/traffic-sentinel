import iconv from "iconv-lite-umd"
import type { Dataset } from "@/application/domain"
import { toAnsi } from "@/application/utils"
/**
 * Convierte un Dataset a formato CSV con el separador especificado
 * @param dataset - El dataset a convertir
 * @param separator - Separador para el CSV (por defecto ',')
 * @returns String en formato CSV sin saltos de línea al final
 */
export const datasetToCsv = (dataset: Dataset, separator: string = "|"): string => {
  const csvRows = dataset.map((row) => {
    const escapedCells = row.map((cell) => {
      // Limpiar la celda con toAnsi para garantizar compatibilidad ANSI
      const cellStr = toAnsi(String(cell))
      // Si contiene el separador, comillas o saltos de línea, encerrar en comillas
      if (cellStr.includes(separator) || cellStr.includes('"') || cellStr.includes("\n")) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    })
    return escapedCells.join(separator)
  })
  // Unir todas las filas sin salto de línea al final
  return csvRows.join("\r\n")
}

/**
 * Remueve el BOM (Byte Order Mark) si está presente al inicio del array de bytes
 * @param bytes - Array de bytes
 * @returns Uint8Array sin BOM
 */
const removeBom = (bytes: Uint8Array): Uint8Array => {
  // UTF-8 BOM: EF BB BF
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return bytes.slice(3)
  }
  // UTF-16 LE BOM: FF FE
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return bytes.slice(2)
  }
  // UTF-16 BE BOM: FE FF
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return bytes.slice(2)
  }
  return bytes
}

/**
 * Convierte un string UTF-8 a codificación WINDOWS-1252 (ANSI) usando iconv-lite-umd
 * Garantiza que el resultado no contenga BOM
 * @param text - Texto en UTF-8
 * @returns Uint8Array con los bytes en WINDOWS-1252 sin BOM
 */
const utf8ToWindows1252 = (text: string): Uint8Array => {
  const buffer = iconv.encode(text, "win1252")
  // iconv-lite-umd devuelve un Buffer que es compatible con Uint8Array
  // Convertir a Uint8Array estándar para compatibilidad con Blob
  const encoded = new Uint8Array(buffer)
  // Asegurar que no hay BOM (win1252 no usa BOM, pero verificamos por seguridad)
  return removeBom(encoded)
}

/**
 * Descarga un Dataset como archivo CSV con codificación WINDOWS-1252
 * El archivo generado no contiene BOM (Byte Order Mark)
 * @param dataset - El dataset a descargar
 * @param filename - Nombre del archivo sin extensión (se agregará .txt)
 * @param separator - Separador para el CSV (por defecto ',')
 * @param suffix - Sufijo a agregar al nombre del archivo ('-original' o '-transform')
 */
export const downloadDatasetAsCsv = (
  dataset: Dataset,
  filename: string,
  separator: string = "|",
  suffix: "original" | "transform" = "original",
): void => {
  const csvContent = datasetToCsv(dataset, separator)

  // Obtener el nombre base sin extensión si la tiene
  const baseName = filename.replace(/\.(csv|txt)$/i, "")
  const fullFilename = `${baseName}-${suffix}.txt`

  // Convertir a WINDOWS-1252 (sin BOM garantizado)
  const encodedContent = utf8ToWindows1252(csvContent)

  // Crear Blob con tipo MIME para texto plano
  // Crear una copia del Uint8Array para asegurar tipos correctos compatibles con Blob
  const blobData = new Uint8Array(encodedContent.length)
  blobData.set(encodedContent)

  const blob = new Blob([blobData], { type: "text/plain;charset=windows-1252" })

  // Crear URL del blob
  const url = URL.createObjectURL(blob)

  // Crear elemento <a> temporal para descargar
  const link = document.createElement("a")
  link.href = url
  link.download = fullFilename
  document.body.appendChild(link)
  link.click()

  // Limpiar
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
