import { DashboardPage } from "@/modules/dashboard"
import { ProjectLayout } from "@/modules/project/components/ProjectLayout"

export default function Page({ params }: { params: { id: string } }) {
  return (
    <ProjectLayout>
      <DashboardPage projectId={params.id} />
    </ProjectLayout>
  )
}
