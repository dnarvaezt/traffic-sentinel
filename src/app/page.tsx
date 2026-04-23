"use client"

import { BarChart3, Database, FileSpreadsheet, FolderOpen, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useProjectStore } from "@/application/stores/project-store"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/components/ui/card"

export default function HomePage() {
  const { projects } = useProjectStore()
  const [mounted, setMounted] = useState(false)

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

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Traffic Sentinel</h1>
          <p className="text-lg text-muted-foreground">
            Análisis y visualización de datos de tráfico vehicular
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projects}</div>
              <p className="text-xs text-muted-foreground">creados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Datasets</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.datasets}</div>
              <p className="text-xs text-muted-foreground">cargados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filas</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRows.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">registros totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Columnas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalColumns}</div>
              <p className="text-xs text-muted-foreground">definidas en schema</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Proyectos Recientes</CardTitle>
              <CardDescription>Tus últimos proyectos</CardDescription>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                        <div className="flex items-center gap-3">
                          <FolderOpen className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {project.databases?.length || 0} datasets
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay proyectos creados</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comenzar</CardTitle>
              <CardDescription>Acciones rápidas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/projects">
                <Button className="w-full justify-start">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Ver proyectos
                </Button>
              </Link>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Traffic Sentinel</strong> te permite analizar datos de tráfico vehicular,
                  visualizar métricas y crear dashboards interactivos.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Carga archivos CSV con datos de tráfico</li>
                  <li>Define un schema para tus columnas</li>
                  <li>Explora y filtra tus datos</li>
                  <li>Crea visualizaciones personalizadas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
