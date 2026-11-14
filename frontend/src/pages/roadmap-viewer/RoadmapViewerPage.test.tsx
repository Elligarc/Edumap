import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RoadmapViewerPage } from './RoadmapViewerPage'
import { roadmapApi } from '@/entities/roadmap'
import { useAuthStore } from '@/entities/session'
import { HttpError } from '@/shared/api'
import type { RoadmapCanvasResponse, RoadmapResponse } from '@/shared/types/api'

vi.mock('@/entities/roadmap', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/roadmap')>()
  return {
    ...actual,
    roadmapApi: {
      ...actual.roadmapApi,
      getRoadmapById: vi.fn(),
      getCanvas: vi.fn(),
    },
  }
})

const mockRoadmap: RoadmapResponse = {
  id: 59,
  title: 'Java Backend Roadmap',
  description: 'Подробный путь изучения Java и Spring Boot',
  category: 'Разработка',
  difficulty: 'INTERMEDIATE',
  visibility: 'PUBLISHED',
  price: 0,
  authorId: 1,
  nodesCount: 5,
  createdAt: '2026-10-01T10:00:00Z',
  updatedAt: '2026-11-06T10:00:00Z',
}

const mockCanvas: RoadmapCanvasResponse = {
  roadmapId: 59,
  title: 'Java Backend Roadmap',
  sections: [],
  nodes: [],
  texts: [],
  edges: [],
}

function renderPage(initialEntry = '/roadmaps/59') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
          <Route path="/roadmaps/:id" element={<RoadmapViewerPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('RoadmapViewerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollTo = vi.fn()
    useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false, isInitialized: true })
    vi.mocked(roadmapApi.getRoadmapById).mockResolvedValue(mockRoadmap)
    vi.mocked(roadmapApi.getCanvas).mockResolvedValue(mockCanvas)
  })

  it('рендерит шапку, Hero роадмапы, холст и подвал для роадмапы с бэкенда', async () => {
    renderPage('/roadmaps/59')

    await waitFor(() => {
      expect(screen.getByText('Java Backend Roadmap')).toBeInTheDocument()
      expect(screen.getByText('Подробный путь изучения Java и Spring Boot')).toBeInTheDocument()
      expect(screen.getByTestId('roadmap-hero-progress-card')).toBeInTheDocument()
      expect(screen.getByTestId('roadmap-viewer-widget')).toBeInTheDocument()
    })
    expect(screen.queryByText('Редактировать')).not.toBeInTheDocument()
  })

  it('отображает экран ошибки при неудачной загрузке карты', async () => {
    vi.mocked(roadmapApi.getRoadmapById).mockRejectedValue(new Error('Карта не найдена'))

    renderPage('/roadmaps/999')

    await waitFor(() => {
      expect(screen.getByTestId('roadmap-viewer-error')).toBeInTheDocument()
      expect(screen.getByText('Не удалось загрузить дорожную карту')).toBeInTheDocument()
    })
  })

  it('перенаправляет на главную страницу, если карта PRIVATE и пользователь не авторизован', async () => {
    const privateRoadmap: RoadmapResponse = {
      ...mockRoadmap,
      visibility: 'PRIVATE',
      authorId: 10,
    }
    vi.mocked(roadmapApi.getRoadmapById).mockResolvedValue(privateRoadmap)

    renderPage('/roadmaps/59')

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      expect(screen.queryByText('Java Backend Roadmap')).not.toBeInTheDocument()
    })
  })

  it('перенаправляет на главную страницу, если карта PRIVATE и пользователь авторизован, но чужой', async () => {
    useAuthStore.setState({
      user: { id: 99, name: 'Stranger', email: 'stranger@example.com' },
      isAuthenticated: true,
      isInitialized: true,
    })

    const privateRoadmap: RoadmapResponse = {
      ...mockRoadmap,
      visibility: 'PRIVATE',
      authorId: 10,
    }
    vi.mocked(roadmapApi.getRoadmapById).mockResolvedValue(privateRoadmap)

    renderPage('/roadmaps/59')

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      expect(screen.queryByText('Java Backend Roadmap')).not.toBeInTheDocument()
    })
  })

  it('перенаправляет на главную страницу при 403 Forbidden ошибке от API', async () => {
    vi.mocked(roadmapApi.getRoadmapById).mockRejectedValue(
      new HttpError(403, 'ROADMAP_ACCESS_DENIED', 'Доступ ограничен')
    )

    renderPage('/roadmaps/59')

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })

  it('позволяет автору открывать и просматривать свою карту со статусом PRIVATE', async () => {
    useAuthStore.setState({
      user: { id: 10, name: 'Author', email: 'author@example.com' },
      isAuthenticated: true,
      isInitialized: true,
    })

    const privateRoadmap: RoadmapResponse = {
      ...mockRoadmap,
      visibility: 'PRIVATE',
      authorId: 10,
    }
    vi.mocked(roadmapApi.getRoadmapById).mockResolvedValue(privateRoadmap)

    renderPage('/roadmaps/59')

    await waitFor(() => {
      expect(screen.getByText('Java Backend Roadmap')).toBeInTheDocument()
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument()
    })
  })
})
