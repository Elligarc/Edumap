import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/entities/session'

interface ProtectedRouteProps {
  children?: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isInitialized, initAuth } = useAuthStore()

  useEffect(() => {
    if (!isInitialized) {
      void initAuth()
    }
  }, [isInitialized, initAuth])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3 text-[#64748B]">
          <Loader2 size={36} className="animate-spin text-[#0284c7]" />
          <span className="text-sm font-medium">Проверка авторизации...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children ? <>{children}</> : null
}
