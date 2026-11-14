import { useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roadmapApi } from '@/entities/roadmap'
import type { RoadmapCanvasResponse, RoadmapResponse, UpdateRoadmapRequest } from '@/shared/types/api'

export function useRoadmapConstructorPage() {
  const { id } = useParams<{ id: string }>()
  const roadmapId = Number(id)
  const queryClient = useQueryClient()

  const {
    data: roadmap,
    isLoading: isRoadmapLoading,
    error: roadmapError,
  } = useQuery({
    queryKey: ['roadmap', roadmapId],
    queryFn: () => roadmapApi.getRoadmapById(roadmapId),
    enabled: !isNaN(roadmapId),
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const {
    data: canvasData,
    isLoading: isCanvasLoading,
    error: canvasError,
    refetch: refetchCanvas,
  } = useQuery({
    queryKey: ['roadmap-canvas', roadmapId],
    queryFn: () => roadmapApi.getCanvas(roadmapId),
    enabled: !isNaN(roadmapId),
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const handleSaveSuccess = async (savedCanvas?: RoadmapCanvasResponse) => {
    if (savedCanvas) {
      queryClient.setQueryData(['roadmap-canvas', roadmapId], savedCanvas)
      queryClient.setQueryData(['roadmap', roadmapId], (old: RoadmapResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          nodesCount: savedCanvas.nodes.length,
          updatedAt: new Date().toISOString(),
        }
      })
    }
    queryClient.invalidateQueries({ queryKey: ['roadmaps'], exact: false, refetchType: 'none' })
  }

  const updateSettingsMutation = useMutation({
    mutationFn: (data: UpdateRoadmapRequest) => roadmapApi.updateRoadmap(roadmapId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['roadmap', roadmapId], updated)
      queryClient.invalidateQueries({ queryKey: ['roadmaps'], exact: false, refetchType: 'none' })
    },
  })

  return {
    roadmapId,
    roadmap,
    canvasData,
    refetchCanvas,
    handleSaveSuccess,
    isLoading: isRoadmapLoading || isCanvasLoading,
    error: roadmapError || canvasError,
    updateRoadmapSettings: (data: UpdateRoadmapRequest) => updateSettingsMutation.mutateAsync(data),
  }
}
