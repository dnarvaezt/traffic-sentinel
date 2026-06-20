"use client"

import { ArrowUpDown, FileSpreadsheet, Pencil, Search, Star, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/core/project"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { Textarea } from "@/shared/components/ui/textarea"
import type { SortField } from "../hooks/use-project-detail"
import { SetupWizard } from "./SetupWizard"

interface DatasetsListProps {
  projectId: string
  filteredDatasets: Database[]
  allDatasets: Database[]
  searchQuery: string
  setSearchQuery: (v: string) => void
  uploading: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  sortField: SortField
  toggleSort: (field: SortField) => void
  handleToggleFavorite: (db: Database) => void
  renamingId: string | null
  renamingValue: string
  setRenamingValue: (v: string) => void
  startRename: (db: Database) => void
  commitRename: () => void
  cancelRename: () => void
  handleDeleteDataset: (db: Database) => void
  deleteConfirmOpen: boolean
  setDeleteConfirmOpen: (v: boolean) => void
  deletingDataset: Database | null
  confirmDelete: () => void
  datasetEditOpen: boolean
  setDatasetEditOpen: (v: boolean) => void
  datasetName: string
  setDatasetName: (v: string) => void
  datasetDescription: string
  setDatasetDescription: (v: string) => void
  openDatasetEdit: (db: Database) => void
  handleDatasetSave: () => void
  showWizard: boolean
  handleDismissWizard: () => void
  router: { push: (url: string) => void }
}

function SortHeader({
  field,
  label,
  sortField,
  toggleSort,
  className,
}: {
  field: SortField
  label: string
  sortField: SortField
  toggleSort: (field: SortField) => void
  className?: string
}) {
  const isActive = sortField === field
  return (
    <TableHead
      className={`cursor-pointer select-none ${className || ""}`}
      onClick={() => toggleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      </span>
    </TableHead>
  )
}

export function DatasetsList({
  projectId,
  filteredDatasets,
  allDatasets,
  searchQuery,
  setSearchQuery,
  uploading,
  fileInputRef,
  handleFileSelect,
  sortField,
  toggleSort,
  handleToggleFavorite,
  renamingId,
  renamingValue,
  setRenamingValue,
  startRename,
  commitRename,
  cancelRename,
  handleDeleteDataset,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  deletingDataset,
  confirmDelete,
  datasetEditOpen,
  setDatasetEditOpen,
  datasetName,
  setDatasetName,
  datasetDescription,
  setDatasetDescription,
  openDatasetEdit,
  handleDatasetSave,
  showWizard,
  handleDismissWizard,
  router,
}: DatasetsListProps) {
  return (
    <>
      {showWizard && (
        <SetupWizard
          hasDatasets={false}
          hasConfig={false}
          onNavigate={(tab: string) => router.push(`/projects/${projectId}?tab=${tab}`)}
          onOpenUpload={() => fileInputRef.current?.click()}
          onDismiss={handleDismissWizard}
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold shrink-0">Datasets</h2>
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer hover:bg-accent transition-colors text-sm shrink-0">
            {uploading ? (
              <Upload className="h-4 w-4 animate-pulse" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{uploading ? "Subiendo..." : "Subir CSV"}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {filteredDatasets.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">Fav</TableHead>
              <SortHeader
                field="name"
                label="Nombre"
                sortField={sortField}
                toggleSort={toggleSort}
              />
              <SortHeader
                field="rowCount"
                label="Filas"
                sortField={sortField}
                toggleSort={toggleSort}
              />
              <SortHeader
                field="columns"
                label="Columnas"
                sortField={sortField}
                toggleSort={toggleSort}
              />
              <SortHeader
                field="uploadedAt"
                label="Subido"
                sortField={sortField}
                toggleSort={toggleSort}
                className="text-right"
              />
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDatasets.map((db) => (
              <TableRow key={db.id}>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(db)}
                    className="flex items-center justify-center"
                  >
                    <Star
                      className={`h-4 w-4 ${db.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  </button>
                </TableCell>
                <TableCell className="font-medium">
                  {renamingId === db.id ? (
                    <Input
                      value={renamingValue}
                      onChange={(e) => setRenamingValue(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename()
                        if (e.key === "Escape") cancelRename()
                      }}
                      className="h-7 text-sm"
                      autoFocus
                    />
                  ) : (
                    <Link
                      href={`/projects/${projectId}/datasets/${db.id}`}
                      className="flex items-center gap-2 hover:text-primary"
                      onClick={(e) => {
                        if (e.altKey) {
                          e.preventDefault()
                          startRename(db)
                        }
                      }}
                    >
                      <FileSpreadsheet className="h-4 w-4 shrink-0" />
                      <span className="cursor-pointer" onDoubleClick={() => startRename(db)}>
                        {db.name}
                      </span>
                    </Link>
                  )}
                </TableCell>
                <TableCell>{db.rowCount?.toLocaleString() || 0}</TableCell>
                <TableCell>{db.columns?.length || 0}</TableCell>
                <TableCell className="text-right text-muted-foreground text-xs">
                  {db.uploadedAt ? new Date(db.uploadedAt).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openDatasetEdit(db)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteDataset(db)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : allDatasets.length > 0 && searchQuery ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No se encontraron datasets</p>
          <p className="text-xs">Prueba con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center space-y-4">
          <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Comienza con tu primer dataset</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Sube un archivo CSV para empezar a analizar tus datos.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-3 text-sm p-3 bg-muted rounded-lg w-full">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </span>
              <span>Sube un archivo CSV desde tu computadora</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 bg-muted rounded-lg w-full">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted-foreground text-background text-xs font-bold">
                2
              </span>
              <span className="text-muted-foreground">Configura las columnas en Configuración</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 bg-muted rounded-lg w-full">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted-foreground text-background text-xs font-bold">
                3
              </span>
              <span className="text-muted-foreground">Crea visualizaciones en el Dashboard</span>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:opacity-90 transition-opacity text-sm">
            <Upload className="h-4 w-4" />
            <span>Subir CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      )}

      <Dialog open={datasetEditOpen} onOpenChange={setDatasetEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Dataset</DialogTitle>
            <DialogDescription>Modifica los datos del dataset.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dataset-name">Nombre</Label>
              <Input
                id="dataset-name"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dataset-desc">Descripción</Label>
              <Textarea
                id="dataset-desc"
                value={datasetDescription}
                onChange={(e) => setDatasetDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDatasetEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDatasetSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Dataset</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar &quot;{deletingDataset?.name}&quot;?
              {deletingDataset?.rowCount
                ? ` Este dataset contiene ${deletingDataset.rowCount.toLocaleString()} filas.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
