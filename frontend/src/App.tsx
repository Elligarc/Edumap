import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { AppProviders } from '@/app/providers/AppProviders'
import { router } from '@/app/router/routes'
import { useAuthStore } from '@/entities/session'

export function App() {
  const initAuth = useAuthStore((state) => state.initAuth)

  useEffect(() => {
    void initAuth()
  }, [initAuth])

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
