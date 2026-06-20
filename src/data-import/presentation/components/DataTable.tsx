"use client"

import type { SchemaDefinition } from "../../domain/models/schema"
import type { ValidationError } from "../../domain/models/validation"
import type { GroupedData } from "../../domain/models/group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { AlertCircle, HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"

interface DataTableProps {
  schema: SchemaDefinition
  data: Record<string, any>[] | GroupedData[]
  errors?: ValidationError[]
}

export function DataTable({ schema, data, errors = [] }: DataTableProps) {
  const isGrouped = (data: any[]): data is GroupedData[] => {
    return data.length > 0 && "key" in data[0] && "rows" in data[0]
  }

  const renderRows = (rows: Record<string, any>[] | GroupedData[], depth = 0) => {
    if (isGrouped(rows)) {
      return rows.map((group) => (
        <>
          <TableRow key={group.key} className="bg-muted/30 font-medium">
            <TableCell colSpan={schema.columns.length} style={{ paddingLeft: `${depth * 20 + 16}px` }}>
              {group.key} ({group.rows.length})
            </TableCell>
          </TableRow>
          {group.subGroups
            ? renderRows(group.subGroups, depth + 1)
            : renderRows(group.rows, depth + 1)}
        </>
      ))
    }

    return rows.map((row, i) => {
      const rowId = row._rowId
      const rowErrors = rowId
        ? errors.filter((e) => e.rowId === rowId)
        : errors.filter((e) => e.row === i)
      const hasRowError = rowErrors.some((e) => !e.column)

      return (
        <TableRow key={rowId || i} className={hasRowError ? "bg-destructive/10" : ""}>
          {schema.columns.map((col) => {
            const cellError = rowErrors.find((e) => e.column === col.id || e.column === col.header)
            return (
              <TableCell
                key={col.id}
                className={cellError ? "text-destructive font-medium" : ""}
                style={{ textAlign: col.alignment || "left" }}
              >
                <div className="flex items-center gap-2 justify-inherit">
                  {row[col.id] ?? row[col.header]}
                  {cellError && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </TooltipTrigger>
                        <TooltipContent>{cellError.message}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
            )
          })}
        </TableRow>
      )
    })
  }

  return (
    <div className="rounded-md border overflow-auto max-h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            {schema.columns.map((col) => (
              <TableHead
                key={col.id}
                style={{
                  width: col.width,
                  textAlign: col.alignment || "left",
                }}
              >
                <div className="flex items-center gap-2 justify-inherit">
                  {col.header}
                  {col.tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>{col.tooltip}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={schema.columns.length} className="h-24 text-center">
                No hay datos para mostrar.
              </TableCell>
            </TableRow>
          ) : (
            renderRows(data)
          )}
        </TableBody>
      </Table>
    </div>
  )
}
