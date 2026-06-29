"use client"

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  CheckSquare,
  ChevronDown,
  Hash,
  Link2,
  Mail,
  Search,
  Text,
  X,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { ColumnDefinition, FilterItem, SortDefinition } from "@/core/project"

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface DataTableProps {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  filters?: FilterItem[]
  sorts?: SortDefinition[]
  onFiltersChange?: (filters: FilterItem[]) => void
  onSortsChange?: (sorts: SortDefinition[]) => void
  pageSize?: number
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const TYPE_ICON: Record<string, React.ReactNode> = {
  string: <Text className="h-3 w-3" />,
  number: <Hash className="h-3 w-3" />,
  date: <Calendar className="h-3 w-3" />,
  boolean: <CheckSquare className="h-3 w-3" />,
  email: <Mail className="h-3 w-3" />,
  url: <Link2 className="h-3 w-3" />,
}

function formatCell(value: unknown, type: string): string {
  if (value === null || value === undefined || value === "") return ""
  if (type === "boolean") return value ? "✓" : "✗"
  return String(value)
}

const MIN_COL_WIDTH = 80
const DEFAULT_COL_WIDTH = 180

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export function DataTable({
  data,
  columns,
  filters = [],
  sorts = [],
  onFiltersChange,
  onSortsChange,
  pageSize = 50,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [colWidths, setColWidths] = useState<Record<string, number>>({})
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [searchCol, setSearchCol] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const resizingRef = useRef<{ colId: string; startX: number; startW: number } | null>(null)

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
  const pageData = data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  /* ── Close menu on outside click ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  /* ── Focus search input when opened ── */
  useEffect(() => {
    if (searchCol) setTimeout(() => searchInputRef.current?.focus(), 40)
  }, [searchCol])

  /* ── Column resize ── */
  const startResize = useCallback(
    (e: React.MouseEvent, colId: string) => {
      e.preventDefault()
      e.stopPropagation()
      const startW = colWidths[colId] ?? DEFAULT_COL_WIDTH
      resizingRef.current = { colId, startX: e.clientX, startW }

      function onMove(ev: MouseEvent) {
        if (!resizingRef.current) return
        const delta = ev.clientX - resizingRef.current.startX
        const newW = Math.max(MIN_COL_WIDTH, resizingRef.current.startW + delta)
        setColWidths((prev) => ({ ...prev, [resizingRef.current!.colId]: newW }))
      }
      function onUp() {
        resizingRef.current = null
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
      }
      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    },
    [colWidths],
  )

  /* ── Sort helpers ── */
  function getSortDir(colId: string) {
    return sorts.find((s) => s.columnId === colId)?.direction ?? null
  }

  function toggleSort(colId: string) {
    if (!onSortsChange) return
    const current = getSortDir(colId)
    if (!current) {
      onSortsChange([{ id: crypto.randomUUID(), columnId: colId, direction: "asc" }])
    } else if (current === "asc") {
      onSortsChange([{ id: crypto.randomUUID(), columnId: colId, direction: "desc" }])
    } else {
      onSortsChange(sorts.filter((s) => s.columnId !== colId))
    }
    setCurrentPage(0)
    setOpenMenu(null)
  }

  /* ── Filter helpers ── */
  function getQuickFilter(colId: string) {
    return String(
      filters.find((f) => f.columnId === colId && f.operator === "contains")?.value ?? "",
    )
  }

  function setQuickFilter(colId: string, value: string) {
    if (!onFiltersChange) return
    const without = filters.filter((f) => !(f.columnId === colId && f.operator === "contains"))
    onFiltersChange(
      value
        ? [...without, { id: `qs-${colId}`, columnId: colId, operator: "contains" as const, value }]
        : without,
    )
    setCurrentPage(0)
  }

  /* ── Row number column width ── */
  const rowNumWidth = String(data.length).length * 8 + 24

  return (
    <div className="notion-table-root">
      {/* Scroll container */}
      <div className="notion-table-scroll">
        <table className="notion-table">
          {/* ── Col sizing ── */}
          <colgroup>
            <col style={{ width: rowNumWidth, minWidth: rowNumWidth }} />
            {columns.map((col) => (
              <col key={col.id} style={{ width: colWidths[col.id] ?? DEFAULT_COL_WIDTH }} />
            ))}
          </colgroup>

          {/* ── Header ── */}
          <thead>
            <tr className="notion-header-row">
              {/* Row-number cell */}
              <th className="notion-th notion-th-rownum" />

              {columns.map((col) => {
                const sortDir = getSortDir(col.id)
                const hasFilter = getQuickFilter(col.id).length > 0
                const isMenuOpen = openMenu === col.id
                const isSearchOpen = searchCol === col.id

                return (
                  <th key={col.id} className="notion-th" style={{ position: "relative" }}>
                    {/* Header content */}
                    <div className="notion-th-inner">
                      <button
                        type="button"
                        className="notion-col-label"
                        onClick={() => setOpenMenu(isMenuOpen ? null : col.id)}
                      >
                        <span className="notion-col-type-icon">
                          {TYPE_ICON[col.type] ?? <Text className="h-3 w-3" />}
                        </span>
                        <span className="notion-col-name">{col.tooltip || col.header}</span>
                        {sortDir === "asc" && <ArrowUp className="h-3 w-3 notion-sort-icon" />}
                        {sortDir === "desc" && <ArrowDown className="h-3 w-3 notion-sort-icon" />}
                        {hasFilter && !sortDir && (
                          <span
                            className="notion-filter-dot"
                            role="img"
                            aria-label="Filtro activo"
                          />
                        )}
                        <ChevronDown className="h-3 w-3 notion-chevron" />
                      </button>
                    </div>

                    {/* Column menu */}
                    {isMenuOpen && (
                      <div ref={menuRef} className="notion-col-menu">
                        <button
                          type="button"
                          className="notion-menu-item"
                          onClick={() => toggleSort(col.id)}
                        >
                          {sortDir === "asc" ? (
                            <ArrowDown className="h-3.5 w-3.5" />
                          ) : sortDir === "desc" ? (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUp className="h-3.5 w-3.5" />
                          )}
                          {!sortDir
                            ? "Ordenar A → Z"
                            : sortDir === "asc"
                              ? "Ordenar Z → A"
                              : "Quitar orden"}
                        </button>
                        <button
                          type="button"
                          className="notion-menu-item"
                          onClick={() => {
                            setSearchCol(isSearchOpen ? null : col.id)
                            setOpenMenu(null)
                          }}
                        >
                          <Search className="h-3.5 w-3.5" />
                          {isSearchOpen ? "Cerrar búsqueda" : "Buscar en columna"}
                        </button>
                        {hasFilter && (
                          <button
                            type="button"
                            className="notion-menu-item notion-menu-item-danger"
                            onClick={() => {
                              setQuickFilter(col.id, "")
                              setOpenMenu(null)
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                            Limpiar filtro
                          </button>
                        )}
                      </div>
                    )}

                    {/* Inline search bar */}
                    {isSearchOpen && (
                      <div className="notion-inline-search">
                        <Search className="h-3.5 w-3.5 notion-inline-search-icon" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          className="notion-inline-search-input"
                          placeholder="Buscar…"
                          value={getQuickFilter(col.id)}
                          onChange={(e) => setQuickFilter(col.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              setQuickFilter(col.id, "")
                              setSearchCol(null)
                            }
                          }}
                        />
                        {getQuickFilter(col.id) && (
                          <button
                            type="button"
                            className="notion-inline-clear"
                            onClick={() => setQuickFilter(col.id, "")}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Resize handle */}
                    <div
                      className="notion-resize-handle"
                      onMouseDown={(e) => startResize(e, col.id)}
                    />
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="notion-empty">
                  Sin resultados
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <tr key={i} className="notion-row">
                  <td className="notion-td notion-td-rownum">{currentPage * pageSize + i + 1}</td>
                  {columns.map((col) => (
                    <td key={col.id} className="notion-td">
                      <span className="notion-cell-text">
                        {formatCell(row[col.header], col.type)}
                      </span>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="notion-pagination">
        <span className="notion-pagination-info">
          {data.length === 0
            ? "Sin registros"
            : `${currentPage * pageSize + 1}–${Math.min((currentPage + 1) * pageSize, data.length)} de ${data.length.toLocaleString()} filas`}
        </span>
        <div className="notion-pagination-controls">
          <button
            type="button"
            className="notion-page-btn"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            ←
          </button>
          <span className="notion-page-indicator">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="notion-page-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            →
          </button>
        </div>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        .notion-table-root {
          display: flex;
          flex-direction: column;
          height: 100%;
          font-size: 13px;
          font-family: inherit;
        }

        .notion-table-scroll {
          flex: 1;
          overflow: auto;
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          position: relative;
        }

        .notion-table {
          width: max-content;
          min-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        /* ── Header ── */
        .notion-header-row {
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .notion-th {
          background: hsl(var(--muted) / 0.6);
          backdrop-filter: blur(6px);
          border-bottom: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border) / 0.5);
          padding: 0;
          vertical-align: top;
          font-weight: 500;
          color: hsl(var(--muted-foreground));
          user-select: none;
        }
        .notion-th:last-child {
          border-right: none;
        }
        .notion-th-rownum {
          background: hsl(var(--muted) / 0.6);
          border-right: 1px solid hsl(var(--border) / 0.5);
          width: 40px;
          min-width: 40px;
        }

        .notion-th-inner {
          position: relative;
        }

        .notion-col-label {
          display: flex;
          align-items: center;
          gap: 5px;
          width: 100%;
          padding: 8px 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: inherit;
          font: inherit;
          font-size: 12px;
          font-weight: 500;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
        }
        .notion-col-label:hover {
          background: hsl(var(--accent) / 0.5);
          color: hsl(var(--foreground));
        }

        .notion-col-type-icon {
          opacity: 0.6;
          flex-shrink: 0;
        }
        .notion-col-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .notion-sort-icon {
          flex-shrink: 0;
          color: hsl(var(--primary));
        }
        .notion-chevron {
          flex-shrink: 0;
          opacity: 0;
          transition: opacity 0.1s;
        }
        .notion-col-label:hover .notion-chevron {
          opacity: 0.6;
        }
        .notion-filter-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: hsl(var(--primary));
          flex-shrink: 0;
        }

        /* ── Column menu ── */
        .notion-col-menu {
          position: absolute;
          top: calc(100% + 2px);
          left: 0;
          z-index: 100;
          background: hsl(var(--popover));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          box-shadow: 0 8px 24px hsl(0 0% 0% / 0.12);
          min-width: 180px;
          padding: 4px;
          animation: notion-menu-in 0.12s ease;
        }
        @keyframes notion-menu-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .notion-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 6px 10px;
          background: transparent;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          color: hsl(var(--foreground));
          font-size: 13px;
          text-align: left;
        }
        .notion-menu-item:hover {
          background: hsl(var(--accent));
        }
        .notion-menu-item-danger {
          color: hsl(var(--destructive));
        }
        .notion-menu-item-danger:hover {
          background: hsl(var(--destructive) / 0.1);
        }

        /* ── Inline search ── */
        .notion-inline-search {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-top: 1px solid hsl(var(--border) / 0.6);
          background: hsl(var(--background));
        }
        .notion-inline-search-icon {
          flex-shrink: 0;
          color: hsl(var(--muted-foreground));
        }
        .notion-inline-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 12px;
          color: hsl(var(--foreground));
          padding: 2px 0;
        }
        .notion-inline-search-input::placeholder {
          color: hsl(var(--muted-foreground));
        }
        .notion-inline-clear {
          background: transparent;
          border: none;
          cursor: pointer;
          color: hsl(var(--muted-foreground));
          padding: 1px;
          border-radius: 3px;
          display: flex;
          align-items: center;
        }
        .notion-inline-clear:hover {
          color: hsl(var(--foreground));
          background: hsl(var(--accent));
        }

        /* ── Resize handle ── */
        .notion-resize-handle {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          cursor: col-resize;
          z-index: 10;
        }
        .notion-resize-handle:hover,
        .notion-resize-handle:active {
          background: hsl(var(--primary) / 0.4);
        }

        /* ── Row number column ── */
        .notion-td-rownum {
          color: hsl(var(--muted-foreground));
          font-size: 11px;
          text-align: right;
          padding-right: 8px;
          background: hsl(var(--muted) / 0.2);
          border-right: 1px solid hsl(var(--border) / 0.5);
          user-select: none;
          white-space: nowrap;
        }

        /* ── Body rows ── */
        .notion-row {
          border-bottom: 1px solid hsl(var(--border) / 0.5);
          transition: background 0.08s;
        }
        .notion-row:last-child {
          border-bottom: none;
        }
        .notion-row:hover {
          background: hsl(var(--accent) / 0.4);
        }

        .notion-td {
          padding: 0 10px;
          height: 36px;
          border-right: 1px solid hsl(var(--border) / 0.3);
          vertical-align: middle;
          max-width: 0; /* forces truncation with table-layout:fixed */
        }
        .notion-td:last-child {
          border-right: none;
        }

        .notion-cell-text {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          color: hsl(var(--foreground));
        }

        .notion-empty {
          text-align: center;
          padding: 48px 16px;
          color: hsl(var(--muted-foreground));
          font-size: 13px;
        }

        /* ── Pagination ── */
        .notion-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          font-size: 12px;
          color: hsl(var(--muted-foreground));
        }
        .notion-pagination-info {}
        .notion-pagination-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .notion-page-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
          font-size: 13px;
          color: hsl(var(--foreground));
          transition: background 0.1s;
        }
        .notion-page-btn:hover:not(:disabled) {
          background: hsl(var(--accent));
        }
        .notion-page-btn:disabled {
          opacity: 0.35;
          cursor: default;
        }
        .notion-page-indicator {
          font-size: 12px;
          min-width: 48px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
