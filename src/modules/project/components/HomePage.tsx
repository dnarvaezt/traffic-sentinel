"use client"

import {
  BarChart3,
  ChevronDown,
  Database,
  FileSpreadsheet,
  FolderOpen,
  Plus,
  Table2,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { useProjectStore } from "../hooks/use-project-store"

export function HomePage() {
  const { projects } = useProjectStore()
  const [mounted, setMounted] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = {
    projects: projects.length,
    datasets: projects.reduce((acc, p) => acc + (p.databases?.length || 0), 0),
    totalRows: projects.reduce(
      (acc, p) => acc + p.databases.reduce((dbAcc, d) => dbAcc + (d.rowCount || 0), 0),
      0,
    ),
    totalColumns: projects.reduce((acc, p) => acc + (p.schema?.columns?.length || 0), 0),
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {projects.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Proyectos</h2>
              <Link href="/projects">
                <Button variant="outline" size="sm">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Ver todos
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 10).map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="h-5 w-5 text-muted-foreground shrink-0" />
                        <div>
                          <CardTitle className="text-base">{project.name}</CardTitle>
                          <CardDescription>
                            {project.databases?.length || 0} dataset
                            {(project.databases?.length || 0) !== 1 ? "s" : ""} &middot;{" "}
                            {new Date(project.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedId === project.id ? "rotate-180" : ""
                        }`}
                      />
                    </CardHeader>
                  </button>
                  {expandedId === project.id && (
                    <CardContent className="pt-0 pb-3 px-4">
                      {project.databases && project.databases.length > 0 ? (
                        <div className="space-y-1.5 ml-8">
                          {project.databases.map((db) => (
                            <Link
                              key={db.id}
                              href={`/projects/${project.id}/datasets/${db.id}`}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors"
                            >
                              <Table2 className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{db.name}</span>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {db.rowCount?.toLocaleString()} filas
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground ml-8">Sin datasets cargados</p>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">InsightHub</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                InsightHub te permite analizar tus datos, visualizar m&eacute;tricas y crear
                dashboards interactivos. Comienza creando un proyecto y cargando tus datos.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-left">
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-primary/10 mt-0.5">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Carga CSV</p>
                    <p className="text-xs text-muted-foreground">
                      Importa datos desde archivos CSV
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-primary/10 mt-0.5">
                    <Table2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Define schemas</p>
                    <p className="text-xs text-muted-foreground">
                      Configura columnas, tipos y validaciones
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-primary/10 mt-0.5">
                    <BarChart3 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Visualiza datos</p>
                    <p className="text-xs text-muted-foreground">
                      Gr&aacute;ficos, tablas y m&eacute;tricas en dashboards
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-primary/10 mt-0.5">
                    <Database className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Genera reportes</p>
                    <p className="text-xs text-muted-foreground">Exporta informes en PDF y XLSX</p>
                  </div>
                </div>
              </div>
              <Link href="/projects">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Crear primer proyecto
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
