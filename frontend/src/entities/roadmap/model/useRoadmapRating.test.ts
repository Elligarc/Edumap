import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useRoadmapRating } from './useRoadmapRating'
import { roadmapApi } from '../api/roadmap-api'

vi.mock('../api/roadmap-api', () => ({
  roadmapApi: {
    rateRoadmap: vi.fn(),
    getRoadmapRating: vi.fn(),
  },
}))

describe('useRoadmapRating', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  )

  it('инициализирует оценку из переданного initialRating', () => {
    const { result } = renderHook(() => useRoadmapRating(1, 4), { wrapper })
    expect(result.current.rating).toBe(4)
  })

  it('отправляет оценку через API и обновляет локальное состояние', async () => {
    vi.mocked(roadmapApi.rateRoadmap).mockResolvedValueOnce({
      roadmapId: 1,
      averageRating: 4.8,
      ratingsCount: 10,
      currentUserRating: 5,
    })

    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useRoadmapRating(1, null), { wrapper })

    act(() => {
      result.current.saveRating(5)
    })

    await waitFor(() => {
      expect(result.current.rating).toBe(5)
    })

    expect(roadmapApi.rateRoadmap).toHaveBeenCalledWith(1, 5)
    expect(setQueryDataSpy).toHaveBeenCalledWith(['roadmap', 1], expect.any(Function))
    expect(setQueryDataSpy).toHaveBeenCalledWith(['roadmap', '1'], expect.any(Function))
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['roadmaps'],
      exact: false,
      refetchType: 'none',
    })
  })
})
