import Papa from "papaparse"

export interface CSVParseResult {
  data: Record<string, any>[]
  headers: string[]
}

export async function parseCSV(file: File): Promise<CSVParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically converts numbers/booleans
      complete: (results) => {
        resolve({
          data: results.data as Record<string, any>[],
          headers: results.meta.fields || [],
        })
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}
