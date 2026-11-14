import { useState, useEffect, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { RoadmapResponse } from '@/shared/types/api'
import { roadmapApi } from '../api/roadmap-api'

export function useRoadmapRating(
  roadmapId?: number,
  initialRating?: number | null,
) {
  const queryClient = useQueryClient()
  const [rating, setRating] = useState<number | null>(initialRating ?? null)

  useEffect(() => {
    if (initialRating !== undefined) {
      setRating(initialRating ?? null)
    }
  }, [initialRating])

  const mutation = useMutation({
    mutationFn: (score: number) => {
      if (!roadmapId) {
        return Promise.reject(new Error('roadmapId is required'))
      }
      return roadmapApi.rateRoadmap(roadmapId, score)
    },
    onSuccess: (data) => {
      setRating(data.currentUserRating ?? null)
      if (roadmapId) {
        const updateCache = (prev: RoadmapResponse | undefined) => {
          if (!prev) return prev
          return {
            ...prev,
            rating: data.averageRating,
            ratingsCount: data.ratingsCount,
            currentUserRating: data.currentUserRating ?? null,
          }
        }
        queryClient.setQueryData<RoadmapResponse>(['roadmap', roadmapId], updateCache)
        queryClient.setQueryData<RoadmapResponse>(['roadmap', String(roadmapId)], updateCache)

        queryClient.invalidateQueries({ queryKey: ['roadmaps'], exact: false, refetchType: 'none' })
      }
    },
  })

  const saveRating = useCallback(
    (score: number) => {
      setRating(score)
      mutation.mutate(score)
    },
    [mutation],
  )

  return {
    rating,
    saveRating,
    isSubmitting: mutation.isPending,
  }
}
