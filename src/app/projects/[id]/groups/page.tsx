"use client"

import { GroupsPage } from "@/modules/groups"
import { ProjectLayout } from "@/modules/project/components/ProjectLayout"

export default function GroupsRoute() {
  return (
    <ProjectLayout>
      <GroupsPage />
    </ProjectLayout>
  )
}
