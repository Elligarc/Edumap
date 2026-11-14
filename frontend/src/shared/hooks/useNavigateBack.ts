import { useCallback } from 'react'
import { useNavigate } from 'react-router'

export function useNavigateBack(fallbackPath = '/profile/roadmaps') {
  const navigate = useNavigate()

  return useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(fallbackPath)
    }
  }, [navigate, fallbackPath])
}
