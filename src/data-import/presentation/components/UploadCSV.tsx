"use client"

import { FileText, Upload, X } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "@/shared/components/ui/button"

interface UploadCSVProps {
  onFileUpload: (file: File) => void
  onReplaceFile: () => void
  file: File | null
  loading?: boolean
}

export function UploadCSV({ onFileUpload, onReplaceFile, file, loading }: UploadCSVProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "text/csv") {
      onFileUpload(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileUpload(selectedFile)
    }
  }

  if (file) {
    return (
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
        <FileText className="h-8 w-8 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReplaceFile} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Reemplazar
        </Button>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-12 transition-colors
        flex flex-col items-center justify-center gap-4
        ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="p-4 rounded-full bg-primary/10">
        <Upload className="h-8 w-8 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium">Arrastra tu archivo CSV aquí</p>
        <p className="text-sm text-muted-foreground">
          o haz clic para seleccionar uno desde tu equipo
        </p>
      </div>
      <Button variant="outline" className="mt-2">
        Seleccionar archivo
      </Button>
    </div>
  )
}
