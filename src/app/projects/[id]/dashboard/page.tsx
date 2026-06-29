import { DashboardPage } from "@/modules/dashboard"
import { ProjectLayout } from "@/modules/project/components/ProjectLayout"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <ProjectLayout>
      <DashboardPage projectId={id} />
    </ProjectLayout>
  )
}
