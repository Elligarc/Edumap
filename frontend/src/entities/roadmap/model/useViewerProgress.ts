import { useState, useEffect, useCallback, useMemo, useContext } from 'react'
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientContext,
} from '@tanstack/react-query'
import type { Node } from '@xyflow/react'
import { progressApi } from '@/entities/progress'
import { useAuthStore } from '@/entities/session'

export interface ViewerProgressStats {
  total: number
  completed: number
  percentage: number
}

const fallbackQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

export function useViewerProgress(roadmapId: number | string, nodes: Node[] = []) {
  const contextQueryClient = useContext(QueryClientContext)
  const queryClient = contextQueryClient || fallbackQueryClient
  const hasQueryProvider = Boolean(contextQueryClient)

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const numericRoadmapId = Number(roadmapId)

  const { data: progressData, isLoading } = useQuery(
    {
      queryKey: ['progress', roadmapId],
      queryFn: () => progressApi.getRoadmapProgress(roadmapId),
      enabled:
        Boolean(roadmapId) &&
        !isNaN(numericRoadmapId) &&
        isAuthenticated &&
        hasQueryProvider,
      staleTime: 1000 * 60,
    },
    queryClient,
  )

  const enrollMutation = useMutation(
    {
      mutationFn: async (shouldEnroll: boolean) => {
        if (shouldEnroll) {
          return await progressApi.enroll(roadmapId)
        } else {
          return await progressApi.unenroll(roadmapId)
        }
      },
      onSuccess: (data) => {
        queryClient.setQueryData(['progress', roadmapId], data)
        queryClient.invalidateQueries({
          queryKey: ['progress', 'my-roadmaps'],
          exact: false,
          refetchType: 'none',
        })
      },
      onError: (err) => {
        console.error('Ошибка изменения записи на дорожную карту:', err)
      },
    },
    queryClient,
  )

  const toggleNodeMutation = useMutation(
    {
      mutationFn: async (rawNodeId: string) => {
        const parsedId = Number(rawNodeId.replace(/^node-/, ''))
        if (isNaN(parsedId)) {
          throw new Error(`Некорректный ID узла: ${rawNodeId}`)
        }
        return await progressApi.toggleNode(roadmapId, parsedId)
      },
      onSuccess: (data) => {
        queryClient.setQueryData(['progress', roadmapId], data)
        queryClient.invalidateQueries({
          queryKey: ['progress', 'my-roadmaps'],
          exact: false,
          refetchType: 'none',
        })
      },
      onError: (err) => {
        console.error('Ошибка переключения статуса узла:', err)
      },
    },
    queryClient,
  )

  const isEnrolled = useMemo(() => {
    if (isAuthenticated && progressData) {
      return Boolean(progressData.isEnrolled)
    }
    return false
  }, [isAuthenticated, progressData])

  const completedIds = useMemo(() => {
    if (isAuthenticated && progressData?.completedNodeIds) {
      return progressData.completedNodeIds.map((id) => `node-${id}`)
    }
    return []
  }, [isAuthenticated, progressData])

  const toggleEnroll = useCallback(async () => {
    if (!isAuthenticated || !hasQueryProvider || isNaN(numericRoadmapId)) {
      return
    }
    const nextEnrolled = !isEnrolled
    await enrollMutation.mutateAsync(nextEnrolled)
  }, [
    isEnrolled,
    isAuthenticated,
    hasQueryProvider,
    numericRoadmapId,
    enrollMutation,
  ])

  const toggleComplete = useCallback(
    async (rawNodeId: string) => {
      if (!isAuthenticated || !hasQueryProvider || isNaN(numericRoadmapId)) {
        return
      }
      await toggleNodeMutation.mutateAsync(rawNodeId)
    },
    [isAuthenticated, hasQueryProvider, numericRoadmapId, toggleNodeMutation],
  )

  const stats = useMemo<ViewerProgressStats>(() => {
    const roadmapNodes = nodes.filter((n) => n.id.startsWith('node-'))
    const total = roadmapNodes.length
    if (total === 0) return { total: 0, completed: 0, percentage: 0 }

    const completed = roadmapNodes.filter((n) => completedIds.includes(n.id)).length
    const percentage = Math.round((completed / total) * 100)

    return { total, completed, percentage }
  }, [nodes, completedIds])

  return {
    isEnrolled,
    isEnrolling: enrollMutation.isPending,
    toggleEnroll,
    completedIds,
    toggleComplete,
    stats,
    isLoading,
  }
}
