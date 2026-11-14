import { useQuery } from '@tanstack/react-query'
import { roadmapApi } from '@/entities/roadmap'
import type { RoadmapResponse } from '@/shared/types/api'
import type { HomeMarketplaceCardProps } from './components/HomeMarketplace/HomeMarketplaceCard'

export function useHomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['home-official-roadmaps'],
    queryFn: () =>
      roadmapApi.getRoadmaps({
        size: 3,
        visibility: 'PUBLISHED',
        sort: 'id,asc',
      }),
  })

  const apiItems: RoadmapResponse[] = data?.items || data?.content || []

  const featuredRoadmaps: HomeMarketplaceCardProps[] = apiItems.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    difficulty: item.difficulty,
    price: item.price,
    authorName: item.authorName || 'YPD Team',
    nodesCount: item.nodesCount ?? 0,
    studentsCount: item.studentsCount ?? 128,
  }))

  return {
    featuredRoadmaps,
    isLoading,
  }
}
