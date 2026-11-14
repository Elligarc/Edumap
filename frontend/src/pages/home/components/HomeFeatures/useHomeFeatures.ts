import { useNavigate } from 'react-router'
import { useAuthStore } from '@/entities/session'

export function useHomeFeatures() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const constructorDestination = isAuthenticated ? '/profile/roadmaps' : '/login'

  const handleConstructorClick = () => {
    navigate(constructorDestination)
  }

  return {
    isAuthenticated,
    constructorDestination,
    handleConstructorClick,
  }
}
