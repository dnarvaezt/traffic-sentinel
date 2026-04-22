import Papa from "papaparse"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type Dataset, DatasetProvider, DatasetRepositoryIndexedDB } from "@/application/domain"
import { toAnsi } from "@/application/utils"

export interface DatasetMetadata {
  id: string
  filename?: string
  createdAt: number
  rowCount: number
}

export type ErrorType = "invalid_file" | "upload_error" | null

interface DatasetStoreState {
  isLoading: boolean
  error: string | null
  errorType: ErrorType
  datasets: Dataset[]
  datasetsMetadata: DatasetMetadata[]
  uploadedFileName: string | null
}

interface DatasetStoreActions {
  uploadCsv: (file: File) => Promise<void>
  loadDatasets: () => Promise<void>
  loadDatasetsMetadata: () => Promise<void>
  loadDatasetById: (id: string) => Promise<void>
  deleteDataset: (id: string) => Promise<void>
  clearError: () => void
  clearUploadedFileName: () => void
  reset: () => void
}

type DatasetStore = DatasetStoreState & DatasetStoreActions

const initializeRepository = () => {
  const repository = new DatasetRepositoryIndexedDB()
  DatasetProvider.setRepository(repository)
  return repository
}

export const useDatasetStore = create<DatasetStore>()(
  persist(
    (set) => ({
      isLoading: false,
      error: null,
      errorType: null,
      datasets: [],
      datasetsMetadata: [],
      uploadedFileName: null,

      uploadCsv: async (file: File) => {
        if (!file.name.endsWith(".csv")) {
          set({
            isLoading: false,
            error: "El archivo debe tener extensión .csv",
            errorType: "invalid_file",
          })
          return
        }

        set({ isLoading: true, error: null, errorType: null })
        try {
          const repository = initializeRepository()

          Papa.parse<Dataset[number]>(file, {
            complete: async (results) => {
              const rawDataset: Dataset = results.data as Dataset
              const cleanedDataset: Dataset = rawDataset.map((row) =>
                row.map((cell) => toAnsi(cell)),
              )
              await repository.save(cleanedDataset, file.name)
              const metadata = await repository.getAllMetadata()
              set({
                isLoading: false,
                uploadedFileName: file.name,
                datasetsMetadata: metadata,
                error: null,
                errorType: null,
              })
            },
            error: (parseError) => {
              const message =
                parseError && typeof parseError === "object" && "message" in parseError
                  ? String(parseError.message)
                  : "Failed to parse CSV"
              set({
                isLoading: false,
                error: message,
                errorType: "upload_error",
              })
            },
            skipEmptyLines: true,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to upload CSV"
          set({
            isLoading: false,
            error: errorMessage,
            errorType: "upload_error",
          })
        }
      },

      loadDatasets: async () => {
        set({ isLoading: true, error: null })
        try {
          const repository = initializeRepository()
          const datasets = await repository.getAll()
          set({ isLoading: false, datasets })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load datasets"
          set({ isLoading: false, error: errorMessage })
        }
      },

      loadDatasetsMetadata: async () => {
        set({ isLoading: true, error: null })
        try {
          const repository = initializeRepository()
          const metadata = await repository.getAllMetadata()
          set({ isLoading: false, datasetsMetadata: metadata })
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load datasets metadata"
          set({ isLoading: false, error: errorMessage })
        }
      },

      loadDatasetById: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const repository = initializeRepository()
          const dataset = await repository.getById(id)
          if (dataset) {
            set({ isLoading: false, datasets: [dataset] })
          } else {
            set({ isLoading: false, error: "Dataset no encontrado" })
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load dataset"
          set({ isLoading: false, error: errorMessage })
        }
      },

      deleteDataset: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const repository = initializeRepository()
          await repository.delete(id)
          const metadata = await repository.getAllMetadata()
          set({ isLoading: false, datasetsMetadata: metadata })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete dataset"
          set({ isLoading: false, error: errorMessage })
        }
      },

      clearError: () => set({ error: null, errorType: null }),

      clearUploadedFileName: () => set({ uploadedFileName: null }),

      reset: () =>
        set({
          isLoading: false,
          error: null,
          errorType: null,
          datasets: [],
          datasetsMetadata: [],
          uploadedFileName: null,
        }),
    }),
    {
      name: "dataset-storage",
      partialize: (state) => ({
        uploadedFileName: state.uploadedFileName,
      }),
    },
  ),
)
