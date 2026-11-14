import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roadmapApi } from '@/entities/roadmap'
import { progressApi } from '@/entities/progress'
import type {
  CreateRoadmapRequest,
  RoadmapResponse,
  MyRoadmapsProgressResponse,
} from '@/shared/types/api'

export function useProfileRoadmapsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [roadmapToDelete, setRoadmapToDelete] = useState<RoadmapResponse | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const {
    data: roadmaps = [],
    isLoading,
    error,
    refetch,
  } = useQuery<RoadmapResponse[]>({
    queryKey: ['roadmaps', 'my'],
    queryFn: () => roadmapApi.getMyRoadmaps(),
  })

  const {
    data: progressData,
    isLoading: isProgressLoading,
    error: progressQueryError,
    refetch: refetchProgress,
  } = useQuery<MyRoadmapsProgressResponse>({
    queryKey: ['progress', 'my-roadmaps'],
    queryFn: () => progressApi.getMyRoadmapsProgress(),
  })

  const createMutation = useMutation({
    mutationFn: (newRoadmap: CreateRoadmapRequest) => roadmapApi.createRoadmap(newRoadmap),
    onSuccess: (created) => {
      queryClient.setQueryData<RoadmapResponse[]>(['roadmaps', 'my'], (prev) =>
        prev ? [created, ...prev] : [created],
      )
      queryClient.invalidateQueries({ queryKey: ['roadmaps'], exact: false, refetchType: 'none' })
      setIsCreateOpen(false)
      navigate(`/roadmaps/${created.id}/edit`)
    },
    onError: (err) => {
      console.error('Ошибка создания дорожной карты:', err)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => roadmapApi.deleteRoadmap(id),
    onSuccess: (_, deletedId) => {
      const numId = Number(deletedId)
      queryClient.setQueryData<RoadmapResponse[]>(['roadmaps', 'my'], (prev) =>
        prev ? prev.filter((r) => r.id !== numId) : [],
      )
      queryClient.removeQueries({ queryKey: ['roadmap', numId] })
      queryClient.removeQueries({ queryKey: ['roadmap', String(numId)] })
      queryClient.removeQueries({ queryKey: ['roadmap-canvas', numId] })
      queryClient.removeQueries({ queryKey: ['roadmap-canvas', String(numId)] })

      queryClient.invalidateQueries({ queryKey: ['roadmaps'], exact: false, refetchType: 'none' })
      queryClient.invalidateQueries({ queryKey: ['progress', 'my-roadmaps'], exact: false, refetchType: 'none' })

      setRoadmapToDelete(null)
      setDeleteError(null)
    },
    onError: (err) => {
      console.error('Ошибка удаления дорожной карты:', err)
      setDeleteError('Не удалось удалить карту. Попробуйте позже.')
    },
  })

  const handleOpenCreate = useCallback(() => {
    setIsCreateOpen(true)
  }, [])

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false)
  }, [])

  const handleCreateSubmit = useCallback(
    async (payload: CreateRoadmapRequest) => {
      await createMutation.mutateAsync(payload)
    },
    [createMutation],
  )

  const handleOpenDelete = useCallback((roadmap: RoadmapResponse) => {
    setDeleteError(null)
    setRoadmapToDelete(roadmap)
  }, [])

  const handleCloseDelete = useCallback(() => {
    setRoadmapToDelete(null)
    setDeleteError(null)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!roadmapToDelete) return
    await deleteMutation.mutateAsync(roadmapToDelete.id)
  }, [roadmapToDelete, deleteMutation])

  const errorMessage = error ? 'Не удалось загрузить ваши дорожные карты' : null
  const progressErrorMessage = progressQueryError
    ? 'Не удалось загрузить прогресс обучения'
    : null

  return {
    roadmaps,
    isLoading,
    error: errorMessage,
    inProgressRoadmaps: progressData?.inProgress || [],
    completedRoadmaps: progressData?.completed || [],
    isProgressLoading,
    progressError: progressErrorMessage,
    isCreateOpen,
    handleOpenCreate,
    handleCloseCreate,
    handleCreateSubmit,
    roadmapToDelete,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    isDeleting: deleteMutation.isPending,
    deleteError,
    refetch,
    refetchProgress,
  }
}
