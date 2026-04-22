"use client"

import { Check } from "lucide-react"
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { List } from "react-window"
import { Button } from "@/infrastructure/components/ui/button"
import { Checkbox } from "@/infrastructure/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/infrastructure/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/infrastructure/components/ui/dialog"
import { Label } from "@/infrastructure/components/ui/label"
import { ScrollArea } from "@/infrastructure/components/ui/scroll-area"
import { Separator } from "@/infrastructure/components/ui/separator"
import type { DataGridProps } from "./data-grid.interface"
import "./data-grid.scss"

import type { RowComponentProps } from "react-window"

interface CustomRowProps {
  rows: string[][]
  headers: string[]
  columnWidth: number
}

type RowProps = RowComponentProps<CustomRowProps>

const cellStyleCache = new Map<number, React.CSSProperties>()

const getCellStyle = (columnWidth: number): React.CSSProperties => {
  if (!cellStyleCache.has(columnWidth)) {
    cellStyleCache.set(columnWidth, {
      width: columnWidth,
      minWidth: columnWidth,
    })
  }
  return cellStyleCache.get(columnWidth)!
}

const RowComponent = ({
  index,
  style,
  rows,
  headers,
  columnWidth,
}: RowProps): React.ReactElement => {
  const row = rows[index]

  if (!row) {
    return <div className="data-grid__row" style={style} />
  }

  const cellStyle = getCellStyle(columnWidth)

  return (
    <div className="data-grid__row" style={style}>
      {headers.map((_, colIndex: number) => (
        <div key={colIndex} className="data-grid__cell" style={cellStyle}>
          {row[colIndex] || ""}
        </div>
      ))}
    </div>
  )
}

const Row = memo(RowComponent, (prevProps, nextProps) => {
  if (prevProps.index !== nextProps.index) return false
  if (prevProps.style.top !== nextProps.style.top) return false
  if (prevProps.style.height !== nextProps.style.height) return false
  if (prevProps.columnWidth !== nextProps.columnWidth) return false

  const prevRow = prevProps.rows[prevProps.index]
  const nextRow = nextProps.rows[nextProps.index]
  if (prevRow !== nextRow) return false

  return true
})

Row.displayName = "DataGridRow"

const RowWrapper = (props: RowProps): React.ReactElement => {
  return <Row {...props} />
}

export interface DataGridRef {
  openColumnSelector: () => void
  closeColumnSelector: () => void
  getVisibleColumns: () => string[]
  setVisibleColumns: (columns: string[]) => void
}

const DataGridComponent = forwardRef<DataGridRef, DataGridProps>((args, ref) => {
  const { data } = args
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, _setIsLoading] = useState(false)
  const [error, _setError] = useState<string | null>(null)
  const [containerWidth, setContainerWidth] = useState(800)
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [visibleColumnsSet, setVisibleColumnsSet] = useState<Set<string>>(new Set())
  const [modalSelection, setModalSelection] = useState<Set<string>>(new Set())
  const initializedRef = useRef(false)

  const parsedData = useMemo(() => {
    if (!data || data.length === 0) return null

    const firstRow = data[0]

    if (Array.isArray(firstRow) && typeof firstRow[0] === "string") {
      const rows = data as string[][]
      if (rows.length === 0) return null
      const headers = rows[0] || []
      const dataRows = rows.slice(1)
      return { headers, rows: dataRows }
    } else if (typeof firstRow === "object" && firstRow !== null && !Array.isArray(firstRow)) {
      const headers = Object.keys(firstRow)
      if (headers.length === 0) return null
      const rows = (data as Record<string, any>[]).map((row) =>
        headers.map((header) => String(row[header] || "")),
      )
      return { headers, rows }
    }

    return null
  }, [data])

  // Inicializar columnas visibles cuando cambian los headers
  useEffect(() => {
    if (!parsedData) return

    setVisibleColumnsSet((prev) => {
      // Solo inicializar una vez
      if (!initializedRef.current || prev.size === 0) {
        initializedRef.current = true
        return new Set(parsedData.headers)
      }

      // Alinear set existente con nuevos headers (por si cambian)
      const next = new Set<string>()
      parsedData.headers.forEach((h) => {
        if (prev.has(h)) next.add(h)
      })
      if (next.size === 0) {
        for (const h of parsedData.headers) {
          next.add(h)
        }
      }
      return next
    })
  }, [parsedData])

  const visibleInfo = useMemo(() => {
    if (!parsedData) return { headers: [], indices: [] as number[] }
    const indices: number[] = []
    parsedData.headers.forEach((h, idx) => {
      if (visibleColumnsSet.has(h)) indices.push(idx)
    })
    const headers = indices.map((i) => parsedData.headers[i])
    return { headers, indices }
  }, [parsedData, visibleColumnsSet])

  const filteredRows = useMemo(() => {
    if (!parsedData) return [] as string[][]
    if (visibleInfo.indices.length === 0) return []
    return parsedData.rows.map((row) => visibleInfo.indices.map((i) => row[i] ?? ""))
  }, [parsedData, visibleInfo.indices])

  const gridData = useMemo(() => {
    if (!parsedData) return { headers: [], rows: [], columnWidth: 0 }
    const effectiveHeadersCount = Math.max(visibleInfo.headers.length, 1)
    const columnWidth = containerWidth / effectiveHeadersCount
    return {
      headers: visibleInfo.headers,
      rows: filteredRows,
      columnWidth: Math.max(columnWidth, 120),
    }
  }, [parsedData, containerWidth, visibleInfo.headers, filteredRows])

  const rowProps = useMemo(
    () => ({
      rows: gridData.rows,
      headers: gridData.headers,
      columnWidth: gridData.columnWidth,
    }),
    [gridData.rows, gridData.headers, gridData.columnWidth],
  )

  const headerCellStyle = useMemo(
    () => ({ width: gridData.columnWidth, minWidth: gridData.columnWidth }),
    [gridData.columnWidth],
  )

  const handleContainerResize = useCallback(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth
      if (width !== containerWidth) {
        setContainerWidth(width)
      }
    }
  }, [containerWidth])

  useEffect(() => {
    if (!containerRef.current) return

    handleContainerResize()

    const resizeObserver = new ResizeObserver(() => {
      handleContainerResize()
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [handleContainerResize])

  useImperativeHandle(
    ref,
    () => ({
      openColumnSelector: () => {
        if (parsedData) {
          setModalSelection(new Set(visibleColumnsSet))
        }
        setIsColumnModalOpen(true)
      },
      closeColumnSelector: () => setIsColumnModalOpen(false),
      getVisibleColumns: () => Array.from(visibleColumnsSet),
      setVisibleColumns: (columns: string[]) => {
        setVisibleColumnsSet(new Set(columns))
      },
    }),
    [visibleColumnsSet, parsedData],
  )

  const handleToggleHeader = useCallback((header: string) => {
    setModalSelection((prev) => {
      const next = new Set(prev)
      if (next.has(header)) next.delete(header)
      else next.add(header)
      return next
    })
  }, [])

  const handleApplySelection = useCallback(() => {
    setVisibleColumnsSet(new Set(modalSelection))
    setIsColumnModalOpen(false)
  }, [modalSelection])

  const handleCancelSelection = useCallback(() => {
    setIsColumnModalOpen(false)
  }, [])

  if (isLoading) {
    return (
      <div className="data-grid data-grid--loading">
        <div className="data-grid__loading-message">Cargando datos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="data-grid data-grid--error">
        <div className="data-grid__error-message">Error: {error}</div>
      </div>
    )
  }

  if (!gridData.headers.length || !gridData.rows.length) {
    return (
      <div className="data-grid data-grid--empty">
        <div className="data-grid__empty-message">No hay datos para mostrar</div>
      </div>
    )
  }

  const totalWidth = gridData.headers.length * gridData.columnWidth

  return (
    <div ref={containerRef} className="data-grid">
      <Dialog
        open={isColumnModalOpen}
        onOpenChange={(open) => {
          if (open) {
            if (parsedData) {
              setModalSelection(new Set(visibleColumnsSet))
            }
          }
          setIsColumnModalOpen(open)
        }}
      >
        <DialogContent aria-label="Selector de columnas">
          <DialogHeader>
            <DialogTitle>Seleccionar columnas</DialogTitle>
            <DialogDescription>Elige qué columnas deseas mostrar en la tabla.</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            {parsedData && (
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm">
                  <Checkbox
                    id="dg-col-master"
                    checked={
                      modalSelection.size === 0
                        ? false
                        : modalSelection.size === parsedData.headers.length
                          ? true
                          : ("indeterminate" as const)
                    }
                    onCheckedChange={(value) => {
                      setModalSelection((_prev) => {
                        const next = new Set<string>()
                        if (value === true) {
                          for (const h of parsedData.headers) {
                            next.add(h)
                          }
                          return next
                        }
                        return next
                      })
                    }}
                    aria-label="Alternar todas las columnas"
                  />
                  <Label htmlFor="dg-col-master" className="truncate">
                    Columnas
                  </Label>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!parsedData) return
                      setModalSelection(new Set(parsedData.headers))
                    }}
                  >
                    Mostrar todo
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setModalSelection(new Set())}>
                    Ocultar todo
                  </Button>
                </div>
              </div>
            )}
            <Command>
              <CommandInput placeholder="Buscar columna..." />
              <Separator className="my-2" />
              <ScrollArea className="max-h-96">
                <CommandList>
                  <CommandEmpty>No se encontraron columnas.</CommandEmpty>
                  <CommandGroup heading="Columnas">
                    {parsedData?.headers.map((header, index) => {
                      const key = `dg-col-${index}-${header}`
                      const selected = modalSelection.has(header)
                      return (
                        <CommandItem
                          key={key}
                          value={`${index} ${header}`.toLowerCase()}
                          onSelect={() => handleToggleHeader(header)}
                          aria-selected={selected}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className={`h-4 w-4 ${selected ? "opacity-100" : "opacity-0"}`} />
                          <span className="truncate" title={`índice ${index}`}>
                            {`${index} · ${header}`}
                          </span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </ScrollArea>
            </Command>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelSelection} size="sm">
              Cancelar
            </Button>
            <Button onClick={handleApplySelection} size="sm">
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="data-grid__header" style={{ width: totalWidth }}>
        {gridData.headers.map((header, index) => (
          <div
            key={index}
            className="data-grid__header-cell"
            style={headerCellStyle}
            title={`${header} · índice ${index}`}
          >
            {header}
          </div>
        ))}
      </div>
      <List
        defaultHeight={400}
        rowHeight={40}
        rowCount={gridData.rows.length}
        rowComponent={RowWrapper}
        rowProps={rowProps}
        overscanCount={3}
        className="data-grid__list"
        style={{ width: totalWidth }}
      />
    </div>
  )
})

DataGridComponent.displayName = "DataGrid"

export const DataGrid = DataGridComponent
