import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  roadmapApi,
  DEFAULT_CATALOG_FILTERS,
  CATALOG_CATEGORIES,
  type CatalogFiltersState,
  type CatalogRoadmap,
} from '@/entities/roadmap'
import type { RoadmapResponse } from '@/shared/types/api'

const PAGE_SIZE = 6

const THEMES: CatalogRoadmap['gradientTheme'][] = [
  'blue',
  'indigo',
  'purple',
  'emerald',
  'amber',
  'rose',
]

function toCatalogRoadmap(item: RoadmapResponse): CatalogRoadmap {
  const themeIndex = Math.abs(item.id) % THEMES.length
  const isPaid = Boolean(item.price && item.price > 0)
  const isOfficial = Boolean(
    item.authorName?.toLowerCase().includes('команда') ||
      item.authorName?.toLowerCase().includes('ypd') ||
      item.authorName?.toLowerCase().includes('демо автор') ||
      item.authorId === 1,
  )

  return {
    id: String(item.id),
    title: item.title,
    description: item.description || 'Описание отсутствует',
    category: item.category || 'Разработка',
    difficulty: item.difficulty || 'BEGINNER',
    price: isPaid ? 'PAID' : 'FREE',
    priceValue: item.price ?? 0,
    authorType: isOfficial ? 'OFFICIAL' : 'COMMUNITY',
    authorName: item.authorName || (item.authorId ? `Автор #${item.authorId}` : 'Сообщество'),
    stepsCount: item.nodesCount || 0,
    studentsCount: item.studentsCount ?? 0,
    rating: typeof item.rating === 'number' ? Math.round(item.rating * 10) / 10 : 0,
    ratingsCount: item.ratingsCount ?? 0,
    isOfficial,
    gradientTheme: THEMES[themeIndex],
    updatedAt: item.updatedAt ? item.updatedAt.slice(0, 10) : '',
  }
}

export function useCatalogPage() {
  const [filters, setFilters] = useState<CatalogFiltersState>(DEFAULT_CATALOG_FILTERS)
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: currentPage - 1, // Spring Data 0-indexed
      size: PAGE_SIZE,
      visibility: 'PUBLISHED',
    }

    if (filters.search.trim()) {
      params.search = filters.search.trim()
    }

    if (filters.category !== 'Все категории') {
      params.category = filters.category
    }

    if (filters.difficulty !== 'ALL') {
      params.difficulty = filters.difficulty
    }

    if (filters.sortBy === 'newest') {
      params.sort = 'createdAt,desc'
    } else if (filters.sortBy === 'title') {
      params.sort = 'title,asc'
    } else {
      params.sort = 'id,desc'
    }

    return params
  }, [filters, currentPage])

  const { data, isLoading } = useQuery({
    queryKey: ['catalog-roadmaps', queryParams],
    queryFn: () => roadmapApi.getRoadmaps(queryParams),
    staleTime: 5_000,
  })

  const roadmaps = useMemo(() => {
    const rawList: RoadmapResponse[] = data?.content || data?.items || []
    let list = rawList
      .filter((item) => item.visibility !== 'PRIVATE')
      .map(toCatalogRoadmap)

    if (filters.price !== 'ALL') {
      list = list.filter((r) => r.price === filters.price)
    }

    if (filters.authorType !== 'ALL') {
      list = list.filter((r) => r.authorType === filters.authorType)
    }

    return list
  }, [data, filters.price, filters.authorType])

  const totalCount = data?.totalElements ?? roadmaps.length
  const totalPages = Math.max(1, data?.totalPages ?? 1)

  const handleSearchChange = (val: string) => {
    setSearchInput(val)
  }

  const handleSearchSubmit = () => {
    setFilters((prev) => ({ ...prev, search: searchInput }))
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category }))
    setCurrentPage(1)
  }

  const handleFilterChange = <K extends keyof CatalogFiltersState>(
    key: K,
    value: CatalogFiltersState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleSortChange = (sortBy: CatalogFiltersState['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }))
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setFilters(DEFAULT_CATALOG_FILTERS)
    setSearchInput('')
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 300, behavior: 'smooth' })
    }
  }

  return {
    filters,
    searchInput,
    categories: CATALOG_CATEGORIES,
    roadmaps,
    totalCount,
    currentPage,
    totalPages,
    isLoading,
    handleSearchChange,
    handleSearchSubmit,
    handleCategoryChange,
    handleFilterChange,
    handleSortChange,
    handleResetFilters,
    handlePageChange,
  }
}
