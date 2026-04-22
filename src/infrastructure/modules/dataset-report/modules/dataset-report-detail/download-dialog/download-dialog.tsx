"use client"

import { Download } from "lucide-react"
import { useState } from "react"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/infrastructure/components/ui/dialog"
import { Label } from "@/infrastructure/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/infrastructure/components/ui/radio-group"

interface DownloadDialogProps {
  onDownload: (separator: string, useParsedData: boolean) => void
  useParsedData: boolean
  trigger?: React.ReactNode
}

const separatorOptions = [
  { value: ",", label: "Coma ( , )" },
  { value: ";", label: "Punto y coma ( ; )" },
  { value: "|", label: "Pipe ( | )" },
  { value: "\t", label: "Tabulador" },
]

export const DownloadDialog = ({ onDownload, useParsedData, trigger }: DownloadDialogProps) => {
  const [open, setOpen] = useState(false)
  const [selectedSeparator, setSelectedSeparator] = useState<string>(",")

  const handleDownload = () => {
    onDownload(selectedSeparator, useParsedData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Descargar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Descargar Dataset</DialogTitle>
          <DialogDescription>Selecciona el separador para el archivo CSV</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label className="mb-4 block">Separador</Label>
          <RadioGroup value={selectedSeparator} onValueChange={setSelectedSeparator}>
            {separatorOptions.map((option) => {
              const optionId = `separator-${option.value}`
              return (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={optionId} />
                  <Label htmlFor={optionId} className="cursor-pointer font-normal">
                    {option.label}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
