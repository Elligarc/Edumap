import { createBrowserRouter, Navigate } from 'react-router'
import { RouteErrorPage } from './RouteErrorPage'
import { ProtectedRoute } from './ProtectedRoute'
import { CabinetLayout } from '@/pages/profile/layout/CabinetLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { HomePage } = await import('@/pages/home/HomePage')
      return { Component: HomePage }
    },
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/catalog',
    lazy: async () => {
      const { CatalogPage } = await import('@/pages/catalog/CatalogPage')
      return { Component: CatalogPage }
    },
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/login',
    lazy: async () => {
      const { LoginPage } = await import('@/pages/auth/login/LoginPage')
      return { Component: LoginPage }
    },
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/register',
    lazy: async () => {
      const { RegisterPage } = await import('@/pages/auth/register/RegisterPage')
      return { Component: RegisterPage }
    },
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <CabinetLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/profile/roadmaps" replace />,
      },
      {
        path: 'roadmaps',
        lazy: async () => {
          const { ProfileRoadmapsPage } = await import(
            '@/pages/profile/roadmaps/ProfileRoadmapsPage'
          )
          return { Component: ProfileRoadmapsPage }
        },
      },
      {
        path: 'settings',
        lazy: async () => {
          const { ProfileSettingsPage } = await import(
            '@/pages/profile/settings/ProfileSettingsPage'
          )
          return { Component: ProfileSettingsPage }
        },
      },
    ],
  },
  {
    path: '/roadmaps/:id',
    lazy: async () => {
      const { RoadmapViewerPage } = await import(
        '@/pages/roadmap-viewer/RoadmapViewerPage'
      )
      return { Component: RoadmapViewerPage }
    },
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/roadmaps/:id/edit',
    lazy: async () => {
      const { RoadmapConstructorPage } = await import(
        '@/pages/roadmap-constructor/RoadmapConstructorPage'
      )
      return {
        Component: () => (
          <ProtectedRoute>
            <RoadmapConstructorPage />
          </ProtectedRoute>
        ),
      }
    },
    errorElement: <RouteErrorPage />,
  },
  {
    path: '*',
    lazy: async () => {
      const { NotFoundPage } = await import('@/pages/not-found/NotFoundPage')
      return { Component: NotFoundPage }
    },
  },
])
