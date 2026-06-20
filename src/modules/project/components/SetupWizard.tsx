"use client"

import { Check, ChevronRight, GripVertical, LayoutDashboard, Upload } from "lucide-react"
import { useMemo } from "react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"

interface SetupWizardProps {
  hasDatasets: boolean
  hasConfig: boolean
  onNavigate: (tab: string) => void
  onOpenUpload: () => void
  onDismiss: () => void
}

const STEPS = [
  {
    key: "configurar",
    icon: GripVertical,
    title: "Configurar columnas",
    description: "Define las columnas de tu dataset en la sección Configuración",
    action: "config",
  },
  {
    key: "subir",
    icon: Upload,
    title: "Subir CSV",
    description: "Carga un archivo CSV con tus datos",
    action: "upload",
  },
  {
    key: "dashboard",
    icon: LayoutDashboard,
    title: "Crear Dashboard",
    description: "Visualiza tus datos con gráficos y tablas",
    action: "dashboard",
  },
]

export function SetupWizard({
  hasDatasets,
  hasConfig,
  onNavigate,
  onOpenUpload,
  onDismiss,
}: SetupWizardProps) {
  const completedSteps = useMemo(() => {
    const done: string[] = []
    if (hasConfig) done.push("configurar")
    if (hasDatasets) done.push("subir")
    return done
  }, [hasConfig, hasDatasets])

  const allDone = completedSteps.length === STEPS.length

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {allDone ? "¡Todo listo!" : "Configuración inicial"}
          </CardTitle>
          {allDone ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-500">
              <Check className="h-3 w-3 mr-1" />
              Completado
            </Badge>
          ) : (
            <Badge variant="secondary">
              {completedSteps.length}/{STEPS.length} pasos
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {STEPS.map((step, i) => {
          const done = completedSteps.includes(step.key)
          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                done ? "bg-muted/50 border-green-200" : "bg-card"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                  done ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
                }`}
              >
                {done ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-bold">{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground truncate">{step.description}</p>
              </div>
              {!done && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (step.key === "subir") {
                      onOpenUpload()
                    } else {
                      onNavigate(step.action)
                    }
                  }}
                >
                  Ir
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          )
        })}
      </CardContent>
      {!allDone && (
        <CardFooter>
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onDismiss}>
            Omitir
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
