"use client"

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { ColumnDefinition } from "@/core/data-import/domain/models/column"
import type { GroupDefinition } from "@/core/data-import/domain/models/group"
import { useProjectStore } from "@/modules/project/hooks/use-project-store"
import { Badge } from "@/shared/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { GroupsPreview } from "./groups-preview"

function GroupDropZone({
  groups,
  columns,
  onRemove,
  onLabelChange,
}: {
  groups: GroupDefinition[]
  columns: ColumnDefinition[]
  onRemove: (columnId: string) => void
  onLabelChange: (columnId: string, label: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "group-drop-zone" })

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Niveles de agrupación</h3>
      <div
        ref={setNodeRef}
        className={`min-h-[120px] rounded-lg border-2 border-dashed p-3 space-y-2 transition-colors ${
          isOver
            ? "border-primary bg-primary/5"
            : groups.length === 0
              ? "border-muted-foreground/30"
              : "border-primary/30"
        }`}
      >
        {groups.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            Arrastra columnas aquí para agrupar
          </p>
        ) : (
          <SortableContext
            items={groups.map((g) => g.columnId)}
            strategy={verticalListSortingStrategy}
          >
            {groups.map((g, i) => (
              <SortableGroupLevel
                key={g.columnId}
                group={g}
                index={i}
                columns={columns}
                onRemove={() => onRemove(g.columnId)}
                onLabelChange={(label) => onLabelChange(g.columnId, label)}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  )
}

function SortableGroupLevel({
  group,
  index,
  columns,
  onRemove,
  onLabelChange,
}: {
  group: GroupDefinition
  index: number
  columns: ColumnDefinition[]
  onRemove: () => void
  onLabelChange: (label: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.columnId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const col = columns.find((c) => c.id === group.columnId)
  const displayName = group.label || col?.header || group.columnId

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded-lg border bg-card"
    >
      <button type="button" className="cursor-grab touch-none" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <Badge variant="secondary" className="shrink-0 text-[10px]">
        Nivel {index + 1}
      </Badge>
      <span className="text-sm font-medium truncate flex-1">{displayName}</span>
      <input
        className="h-6 text-xs border-b border-transparent hover:border-border focus:border-border bg-transparent outline-none w-24"
        placeholder="Nombre visible (opcional)"
        value={group.label || ""}
        onChange={(e) => onLabelChange(e.target.value)}
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function DraggableColumn({
  column,
  isUsed,
  isDragging,
}: {
  column: ColumnDefinition
  isUsed: boolean
  isDragging?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging: isDraggingActive,
  } = useDraggable({
    id: column.id,
    data: { column },
    disabled: isUsed,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
        isUsed
          ? "bg-muted/50 border-dashed text-muted-foreground cursor-not-allowed opacity-50"
          : "bg-card hover:bg-accent cursor-grab active:cursor-grabbing"
      } ${isDragging || isDraggingActive ? "opacity-50 shadow-lg" : ""}`}
    >
      <span className="font-medium truncate flex-1">{column.header}</span>
      <Badge variant="outline" className="text-[10px] shrink-0">
        {column.type}
      </Badge>
      {isUsed && <span className="text-[10px]">en uso</span>}
    </div>
  )
}

export function GroupsPage() {
  const params = useParams()
  const projectId = params.id as string
  const { getProject, updateConfig } = useProjectStore()
  const project = getProject(projectId)

  const columns = project?.config?.columns || []
  const groups = project?.config?.groups || []
  const databases = project?.databases || []

  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (databases.length > 0 && !activeDatasetId) {
      setActiveDatasetId(databases[0].id)
    }
  }, [databases, activeDatasetId])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const usedColumnIds = useMemo(() => new Set(groups.map((g) => g.columnId)), [groups])
  const availableColumns = useMemo(
    () => columns.filter((c) => !usedColumnIds.has(c.id)),
    [columns, usedColumnIds],
  )

  const activeColumn = useMemo(
    () => (activeId ? columns.find((c) => c.id === activeId) : null),
    [activeId, columns],
  )

  const persist = useCallback(
    (updatedGroups: GroupDefinition[]) => {
      updateConfig(projectId, { ...project!.config, groups: updatedGroups })
    },
    [projectId, project, updateConfig],
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const draggedId = active.id as string

    const isNewGroup = availableColumns.some((c) => c.id === draggedId)

    if (isNewGroup) {
      if (usedColumnIds.has(draggedId)) return
      persist([...groups, { columnId: draggedId }])
      return
    }

    if (over.id === "group-drop-zone") return

    const oldIndex = groups.findIndex((g) => g.columnId === draggedId)
    const newIndex = groups.findIndex((g) => g.columnId === (over.id as string))
    if (oldIndex === -1 || newIndex === -1) return

    const updated = [...groups]
    const [moved] = updated.splice(oldIndex, 1)
    updated.splice(newIndex, 0, moved)
    persist(updated)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  function removeLevel(columnId: string) {
    persist(groups.filter((g) => g.columnId !== columnId))
  }

  function handleLabelChange(columnId: string, label: string) {
    persist(groups.map((g) => (g.columnId === columnId ? { ...g, label: label || undefined } : g)))
  }

  if (columns.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          No hay columnas definidas. Define columnas en la configuración del proyecto para crear
          agrupaciones.
        </p>
      </div>
    )
  }

  const _activeDataset = databases.find((d) => d.id === activeDatasetId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agrupaciones</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Arrastra columnas para agrupar datos, como en Notion.
          </p>
        </div>
        {databases.length > 0 && (
          <Select value={activeDatasetId || ""} onValueChange={(v) => setActiveDatasetId(v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar dataset" />
            </SelectTrigger>
            <SelectContent>
              {databases.map((db) => (
                <SelectItem key={db.id} value={db.id}>
                  {db.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Columnas disponibles</h3>
              <div className="space-y-1.5 min-h-[100px]">
                {availableColumns.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center border rounded-lg">
                    Todas las columnas están en uso
                  </p>
                ) : (
                  availableColumns.map((col) => (
                    <DraggableColumn
                      key={col.id}
                      column={col}
                      isUsed={false}
                      isDragging={activeId === col.id}
                    />
                  ))
                )}
              </div>
            </div>

            <GroupDropZone
              groups={groups}
              columns={columns}
              onRemove={removeLevel}
              onLabelChange={handleLabelChange}
            />
          </div>

          <DragOverlay>
            {activeColumn ? (
              <DraggableColumn column={activeColumn} isUsed={false} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>

        <GroupsPreview groups={groups} columns={columns} datasetId={activeDatasetId} />
      </div>
    </div>
  )
}
