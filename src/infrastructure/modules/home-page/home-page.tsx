"use client"

import { Database, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { StaticLayout } from "@/infrastructure/components"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/components/ui/card"
import { useHomePage } from "./home-page.hook"
import "./home-page.scss"

export const HomePage = () => {
  useHomePage()
  const router = useRouter()

  return (
    <StaticLayout>
      <div className="home-page">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl">Traffic Sentinel</CardTitle>
            <CardDescription className="text-lg">
              Gestiona y visualiza tus datasets CSV con facilidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="home-page__actions">
              <Card
                className="home-page__action-card"
                onClick={() => router.push("/dataset-report")}
              >
                <CardHeader>
                  <Database className="home-page__action-icon" size={32} />
                  <CardTitle>Ver Datasets</CardTitle>
                  <CardDescription>
                    Explora todos tus datasets almacenados en IndexedDB
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card
                className="home-page__action-card"
                onClick={() => router.push("/dataset-report/upload")}
              >
                <CardHeader>
                  <Upload className="home-page__action-icon" size={32} />
                  <CardTitle>Subir Dataset</CardTitle>
                  <CardDescription>Carga un nuevo archivo CSV a tu colección</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaticLayout>
  )
}
