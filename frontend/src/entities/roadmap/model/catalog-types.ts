
export type RoadmapDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type RoadmapPrice = 'FREE' | 'PAID'
export type RoadmapAuthorType = 'OFFICIAL' | 'COMMUNITY'

export interface CatalogRoadmap {
  id: string
  title: string
  description: string
  category: string
  difficulty: RoadmapDifficulty
  price: RoadmapPrice
  priceValue?: number | null
  authorType: RoadmapAuthorType
  authorName: string
  stepsCount: number
  studentsCount: number
  rating: number
  ratingsCount?: number
  isOfficial: boolean
  gradientTheme: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'indigo'
  updatedAt: string
}

export interface CatalogFiltersState {
  search: string
  category: string
  difficulty: RoadmapDifficulty | 'ALL'
  price: RoadmapPrice | 'ALL'
  authorType: RoadmapAuthorType | 'ALL'
  sortBy: 'popular' | 'newest' | 'title'
}

export const CATALOG_CATEGORIES = [
  'Все категории',
  'Разработка',
  'Дизайн',
  'Маркетинг',
  'Бизнес',
  'Data Science',
  'Soft Skills',
] as const

export const DEFAULT_CATALOG_FILTERS: CatalogFiltersState = {
  search: '',
  category: 'Все категории',
  difficulty: 'ALL',
  price: 'ALL',
  authorType: 'ALL',
  sortBy: 'popular',
}
