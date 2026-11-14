import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { roadmapApi } from '@/entities/roadmap'
import { useAuthStore } from '@/entities/session'
import { HttpError } from '@/shared/api'

export function useRoadmapViewerPage() {
  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)
  const isNumeric = !isNaN(numericId)
  const navigate = useNavigate()

  const user = useAuthStore((s) => s.user)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  const {
    data: roadmap,
    isLoading: isRoadmapLoading,
    error: roadmapError,
  } = useQuery({
    queryKey: ['roadmap', numericId],
    queryFn: () => roadmapApi.getRoadmapById(numericId),
    enabled: isNumeric,
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
  })

  const isCheckingPrivateAuth = Boolean(
    roadmap &&
      roadmap.visibility === 'PRIVATE' &&
      !isInitialized,
  )

  const isPrivateStranger = Boolean(
    roadmap &&
      roadmap.visibility === 'PRIVATE' &&
      isInitialized &&
      (!user || user.id !== roadmap.authorId),
  )

  const isAccessDeniedError = Boolean(
    roadmapError instanceof HttpError &&
      (roadmapError.status === 403 || roadmapError.status === 401),
  )

  useEffect(() => {
    if (isAccessDeniedError) {
      navigate('/', { replace: true })
      return
    }

    if (isInitialized && isPrivateStranger) {
      navigate('/', { replace: true })
    }
  }, [isInitialized, isPrivateStranger, isAccessDeniedError, navigate])

  const shouldBlockCanvas = isPrivateStranger || isCheckingPrivateAuth || isAccessDeniedError

  const {
    data: canvasData,
    isLoading: isCanvasLoading,
    error: canvasError,
  } = useQuery({
    queryKey: ['roadmap-canvas', numericId],
    queryFn: () => roadmapApi.getCanvas(numericId),
    enabled: isNumeric && !shouldBlockCanvas,
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
  })

  const isLoading =
    (isNumeric ? isRoadmapLoading || isCanvasLoading : false) || isCheckingPrivateAuth
  const error = !isNumeric
    ? new Error('Некорректный идентификатор дорожной карты')
    : roadmapError || canvasError

  const isHidden = isPrivateStranger || isCheckingPrivateAuth || isAccessDeniedError

  return {
    roadmap: isHidden ? null : roadmap || null,
    canvasData: isHidden ? null : canvasData || null,
    isLoading,
    error: isHidden ? null : error,
  }
}
