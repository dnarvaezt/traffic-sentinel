"use client"

import { ChevronDown, ChevronRight, Database, FolderTree, Table2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { loadDatabaseData } from "@/core/dataset"
import { groupDataService } from "@/data-import/application/group-data/group-data.service"
import type { ColumnDefinition } from "@/data-import/domain/models/column"
import type { GroupDefinition, GroupedData } from "@/data-import/domain/models/group"
import { Badge } from "@/shared/components/ui/badge"

const PREVIEW_LIMIT = 1000

function getGroupName(
  groupDef: GroupDefinition,
  columns: ColumnDefinition[],
  _depth: number,
): string {
  if (groupDef.label) return groupDef.label
  const col = columns.find((c) => c.id === groupDef.columnId)
  return col?.header || groupDef.columnId
}

function GroupTreeNode({
  node,
  depth,
  groupDefs,
  columns,
}: {
  node: GroupedData
  depth: number
  groupDefs: GroupDefinition[]
  columns: ColumnDefinition[]
}) {
  const [collapsed, setCollapsed] = useState(false)
  const groupName = getGroupName(
    groupDefs[depth] || groupDefs[groupDefs.length - 1],
    columns,
    depth,
  )
  const hasChildren = (node.subGroups?.length ?? 0) > 0
  const directChildrenCount = hasChildren ? node.subGroups!.length : node.rows.length
  const showTruncated = directChildrenCount > 50 && !collapsed

  return (
    <div>
      <button
        type="button"
        className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-accent transition-colors text-sm"
        onClick={() => setCollapsed(!collapsed)}
      >
        {hasChildren ? (
          collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <span className="font-medium">{groupName}:</span>
        <span className="text-muted-foreground truncate">{node.key}</span>
        <Badge variant="secondary" className="text-[10px] ml-auto shrink-0">
          {node.rows.length}
        </Badge>
      </button>
      {!collapsed && (
        <div className="ml-4 border-l pl-2">
          {hasChildren &&
            (showTruncated
              ? node
                  .subGroups!.slice(0, 50)
                  .map((sg, i) => (
                    <GroupTreeNode
                      key={`${sg.key}-${i}`}
                      node={sg}
                      depth={depth + 1}
                      groupDefs={groupDefs}
                      columns={columns}
                    />
                  ))
              : node.subGroups!.map((sg, i) => (
                  <GroupTreeNode
                    key={`${sg.key}-${i}`}
                    node={sg}
                    depth={depth + 1}
                    groupDefs={groupDefs}
                    columns={columns}
                  />
                )))}
          {showTruncated && (
            <p className="text-xs text-muted-foreground px-2 py-1">
              +{directChildrenCount - 50} más
            </p>
          )}
          {!hasChildren && depth < groupDefs.length && (
            <p className="text-xs text-muted-foreground px-2 py-1">
              Sin subgrupos — {node.rows.length} registros
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function GroupsPreview({
  groups,
  columns,
  datasetId,
}: {
  groups: GroupDefinition[]
  columns: ColumnDefinition[]
  datasetId: string | null
}) {
  const [rawData, setRawData] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!datasetId) {
      setRawData([])
      return
    }
    setLoading(true)
    loadDatabaseData(datasetId)
      .then((record) => {
        setRawData(record?.data || [])
      })
      .finally(() => setLoading(false))
  }, [datasetId])

  const previewData = useMemo(() => rawData.slice(0, PREVIEW_LIMIT), [rawData])

  const groupedData = useMemo(
    () =>
      groups.length > 0 ? (groupDataService.execute(previewData, groups) as GroupedData[]) : null,
    [previewData, groups],
  )

  const isTruncated = rawData.length > PREVIEW_LIMIT
  const allColumns = useMemo(
    () => (previewData.length > 0 ? Object.keys(previewData[0]) : []),
    [previewData],
  )
  const groupNames = useMemo(
    () => groups.map((g, i) => getGroupName(g, columns, i)),
    [groups, columns],
  )

  if (!datasetId) {
    return (
      <div className="border rounded-lg p-8 text-center space-y-2">
        <Database className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Selecciona un dataset para ver la vista previa
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-sm text-muted-foreground">Cargando datos...</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          {groups.length > 0 ? (
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Table2 className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">
            {groups.length > 0 ? "Vista agrupada" : "Vista plana"}
          </span>
          <span className="text-xs text-muted-foreground">
            ({previewData.length} registros
            {isTruncated && ` de ${rawData.length}`})
          </span>
        </div>
        {groups.length > 0 && (
          <div className="flex gap-1">
            {groupNames.map((name, i) => (
              <Badge key={i} variant="outline" className="text-[10px]">
                {name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {isTruncated && (
        <div className="px-4 py-1.5 bg-yellow-50 dark:bg-yellow-950 border-b">
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Mostrando preview de los primeros {PREVIEW_LIMIT.toLocaleString()} registros.
          </p>
        </div>
      )}

      <div className="p-2 max-h-[600px] overflow-y-auto">
        {groups.length === 0 ? (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                {allColumns.map((col) => (
                  <th key={col} className="text-left px-2 py-1 font-medium text-muted-foreground">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-accent/50">
                  {allColumns.map((col) => (
                    <td key={col} className="px-2 py-1 truncate max-w-[200px]">
                      {String(row[col] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="space-y-0.5">
            {groupedData && groupedData.length > 0 ? (
              groupedData.map((node, i) => (
                <GroupTreeNode
                  key={`${node.key}-${i}`}
                  node={node}
                  depth={0}
                  groupDefs={groups}
                  columns={columns}
                />
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">
                Sin datos para mostrar
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
