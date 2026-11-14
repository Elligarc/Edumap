import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/session'
import { RoadmapViewerWidget } from './RoadmapViewerWidget'

const mockNavigate = vi.fn()
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/entities/progress', () => ({
  progressApi: {
    getRoadmapProgress: vi.fn().mockResolvedValue({
      roadmapId: 1,
      isEnrolled: false,
      completedNodeIds: [],
    }),
    enroll: vi.fn().mockResolvedValue({
      roadmapId: 1,
      isEnrolled: true,
      completedNodeIds: [],
    }),
    unenroll: vi.fn().mockResolvedValue({
      roadmapId: 1,
      isEnrolled: false,
      completedNodeIds: [],
    }),
    toggleNode: vi.fn().mockResolvedValue({
      roadmapId: 1,
      isEnrolled: true,
      completedNodeIds: [10],
    }),
  },
}))

vi.mock('@/entities/roadmap', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/roadmap')>()
  return {
    ...actual,
    roadmapApi: {
      ...actual.roadmapApi,
      rateRoadmap: vi.fn().mockResolvedValue({
        roadmapId: 1,
        averageRating: 5.0,
        ratingsCount: 1,
        currentUserRating: 5,
      }),
    },
  }
})

function renderWidget(props: React.ComponentProps<typeof RoadmapViewerWidget>) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RoadmapViewerWidget {...props} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('RoadmapViewerWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
    })
  })

  it('рендерит заголовок карты, категорию, рейтинг и кнопку назад', () => {
    renderWidget({
      roadmap: {
        id: 1,
        title: 'Тестовая карта для просмотра',
        category: 'Backend',
        description: 'Тестовое описание карты',
        rating: 4.8,
        ratingsCount: 15,
      },
      canvasData: {
        roadmapId: 1,
        title: 'Тестовая карта для просмотра',
        nodes: [],
        edges: [],
        sections: [],
        texts: [],
      },
    })

    expect(screen.getByText('Тестовая карта для просмотра')).toBeInTheDocument()
    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByText('Тестовое описание карты')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('(15 оценок)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /назад к каталогу/i })).toBeInTheDocument()
  })

  it('перенаправляет неавторизованного пользователя на страницу авторизации при попытке добавить для прохождения', () => {
    useAuthStore.setState({ isAuthenticated: false })

    renderWidget({
      roadmap: { id: 1, title: 'Тестовая карта' },
      canvasData: { roadmapId: 1, title: 'Тестовая карта', nodes: [], edges: [], sections: [], texts: [] },
    })

    const enrollBtn = screen.getByTestId('roadmap-hero-enroll-btn')
    expect(enrollBtn).toHaveTextContent('Добавить для прохождения')

    fireEvent.click(enrollBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/login', expect.objectContaining({ state: expect.anything() }))
  })

  it('поддерживает переключение статуса добавления для прохождения для авторизованного пользователя', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: 1, name: 'Олег', email: 'oleg@test.com' },
    })

    renderWidget({
      roadmap: {
        id: 1,
        title: 'Тестовая карта',
      },
      canvasData: {
        roadmapId: 1,
        title: 'Тестовая карта',
        nodes: [],
        edges: [],
        sections: [],
        texts: [],
      },
    })

    const enrollBtn = screen.getByTestId('roadmap-hero-enroll-btn')
    expect(enrollBtn).toHaveTextContent('Добавить для прохождения')

    fireEvent.click(enrollBtn)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('перенаправляет неавторизованного пользователя на страницу авторизации при попытке оценить', () => {
    useAuthStore.setState({ isAuthenticated: false })

    renderWidget({
      roadmap: { id: 1, title: 'Тестовая карта' },
      canvasData: { roadmapId: 1, title: 'Тестовая карта', nodes: [], edges: [], sections: [], texts: [] },
    })

    const rateBtn = screen.getByTestId('roadmap-hero-rate-btn')
    fireEvent.click(rateBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/login', expect.objectContaining({ state: expect.anything() }))
    expect(screen.queryByRole('dialog', { name: /выбор оценки/i })).not.toBeInTheDocument()
  })

  it('открывает диалог выбора оценки для авторизованного пользователя', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: 1, name: 'Олег', email: 'oleg@test.com' },
    })

    renderWidget({
      roadmap: { id: 1, title: 'Тестовая карта' },
      canvasData: { roadmapId: 1, title: 'Тестовая карта', nodes: [], edges: [], sections: [], texts: [] },
    })

    const rateBtn = screen.getByTestId('roadmap-hero-rate-btn')
    fireEvent.click(rateBtn)

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog', { name: /выбор оценки/i })).toBeInTheDocument()

    const star5 = screen.getByRole('button', { name: 'Оценка 5' })
    fireEvent.click(star5)

    expect(screen.getByText('Ваша оценка: 5')).toBeInTheDocument()
  })

  it('не показывает плашку оценки для неавторизованного пользователя даже при наличии сохраненной оценки', () => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
    })

    renderWidget({
      roadmap: { id: 1, title: 'Тестовая карта', currentUserRating: 4 },
      canvasData: { roadmapId: 1, title: 'Тестовая карта', nodes: [], edges: [], sections: [], texts: [] },
    })

    expect(screen.queryByText(/ваша оценка/i)).not.toBeInTheDocument()
    expect(screen.getByText('Оценить')).toBeInTheDocument()
  })

  it('отображает средний рейтинг и количество оценок роадмапа из API', () => {
    renderWidget({
      roadmap: { id: 1, title: 'Тестовая карта', rating: 4.8, ratingsCount: 12 },
      canvasData: { roadmapId: 1, title: 'Тестовая карта', nodes: [], edges: [], sections: [], texts: [] },
    })

    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('(12 оценок)')).toBeInTheDocument()
  })

  it('отображает "Нет оценок" если у роадмапа отсутствует рейтинг', () => {
    renderWidget({
      roadmap: { id: 1, title: 'Тестовая карта', rating: null, ratingsCount: 0 },
      canvasData: { roadmapId: 1, title: 'Тестовая карта', nodes: [], edges: [], sections: [], texts: [] },
    })

    expect(screen.getByText('Нет оценок')).toBeInTheDocument()
  })

  it('успешно выбирает узел на холсте при клике и сбрасывает выбор при клике на свободную область', () => {
    const { container } = renderWidget({
      roadmap: { id: 1, title: 'Тестовая карта' },
      canvasData: {
        roadmapId: 1,
        title: 'Тестовая карта',
        nodes: [
          {
            id: 10,
            roadmapId: 1,
            title: 'Первый шаг обучения',
            description: 'Описание первого шага',
            type: 'START',
            required: true,
            positionX: 100,
            positionY: 100,
            parentNodeId: null,
            resources: [],
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
          },
        ],
        edges: [],
        sections: [],
        texts: [],
      },
    })

    const nodeTitle = screen.getByText('Первый шаг обучения')
    expect(nodeTitle).toBeInTheDocument()

    expect(screen.getByTestId('viewer-node-details-empty')).toBeInTheDocument()

    fireEvent.click(nodeTitle)

    expect(screen.queryByTestId('viewer-node-details-empty')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('viewer-node-details').length).toBe(2)

    const pane = container.querySelector('.react-flow__pane')
    expect(pane).toBeInTheDocument()
    if (pane) {
      fireEvent.click(pane)
    }

    expect(screen.getByTestId('viewer-node-details-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('viewer-node-details')).not.toBeInTheDocument()
  })

  it('перенаправляет неавторизованного пользователя на логин при попытке завершить шаг', () => {
    useAuthStore.setState({ isAuthenticated: false })

    renderWidget({
      roadmap: { id: 1, title: 'Тестовая карта' },
      canvasData: {
        roadmapId: 1,
        title: 'Тестовая карта',
        nodes: [
          {
            id: 10,
            roadmapId: 1,
            title: 'Первый шаг обучения',
            description: 'Описание первого шага',
            type: 'START',
            required: true,
            positionX: 100,
            positionY: 100,
            parentNodeId: null,
            resources: [],
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
          },
        ],
        edges: [],
        sections: [],
        texts: [],
      },
    })

    fireEvent.click(screen.getByText('Первый шаг обучения'))

    const completeBtn = screen.getAllByTestId('viewer-node-toggle-complete-btn')[0]
    expect(completeBtn).toBeInTheDocument()

    fireEvent.click(completeBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/login', expect.objectContaining({ state: expect.anything() }))
  })
})
