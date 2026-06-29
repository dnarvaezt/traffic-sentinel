import { useCallback, useEffect, useRef, useState } from "react"
import type { ListOptions, PaginatedResult, Project, ProjectSortField, SortOrder } from "@/core"
import { createProjectRepository, type ProjectStore } from "@/core"

function createStore(): ProjectStore {
  return createProjectRepository()
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<ProjectSortField>("createdAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const storeRef = useRef<ProjectStore>(createStore())

  const loadProjects = useCallback(async () => {
    setLoading(true)
    try {
      const options: ListOptions = { page, pageSize, sortBy: sortField, sortOrder }
      if (search.trim()) options.search = search.trim()
      const result: PaginatedResult<Project> = await storeRef.current.list(options)
      setProjects(result.data)
      setTotal(result.total)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, sortField, sortOrder, search])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const debouncedRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    if (debouncedRef.current) clearTimeout(debouncedRef.current)
    debouncedRef.current = setTimeout(() => {
      setPage(1)
    }, 300)
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }, [])

  const handleSortChange = useCallback((field: ProjectSortField, order: SortOrder) => {
    setSortField(field)
    setSortOrder(order)
    setPage(1)
  }, [])

  const handleCreate = useCallback(
    async (name: string, description?: string) => {
      await storeRef.current.create(name, description)
      setPage(1)
      await loadProjects()
    },
    [loadProjects],
  )

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return {
    projects,
    total,
    totalPages,
    loading,
    search,
    page,
    pageSize,
    sortField,
    sortOrder,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleCreate,
  }
}
