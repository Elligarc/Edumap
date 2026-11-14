import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProfileRoadmapsPage } from './ProfileRoadmapsPage'
import { roadmapApi } from '@/entities/roadmap'
import { progressApi } from '@/entities/progress'

vi.mock('@/entities/roadmap', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/roadmap')>()
  return {
    ...actual,
    roadmapApi: {
      getMyRoadmaps: vi.fn(),
      createRoadmap: vi.fn(),
      deleteRoadmap: vi.fn(),
    },
  }
})

vi.mock('@/entities/progress', () => ({
  progressApi: {
    getMyRoadmapsProgress: vi.fn(),
  },
}))

describe('ProfileRoadmapsPage', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
    vi.mocked(progressApi.getMyRoadmapsProgress).mockResolvedValue({
      inProgress: [
        {
          roadmapId: 2,
          title: 'Frontend Developer 2026',
          nodesCount: 42,
          completedNodesCount: 35,
          rating: 4.9,
          participantsCount: 11,
          progressPercent: 82,
          isCompleted: false,
        },
      ],
      completed: [
        {
          roadmapId: 3,
          title: 'Основы веб-разработки (HTML, CSS)',
          nodesCount: 18,
          completedNodesCount: 18,
          rating: 5.0,
          participantsCount: 28,
          progressPercent: 100,
          isCompleted: true,
        },
      ],
    })
  })

  it('renders roadmaps sections according to design', async () => {
    vi.mocked(roadmapApi.getMyRoadmaps).mockResolvedValue([
      {
        id: 1,
        title: 'Моя тестовая карта',
        description: 'Описание',
        category: 'Frontend',
        difficulty: 'BEGINNER',
        visibility: 'PRIVATE',
        price: 0,
        authorId: 1,
        nodesCount: 5,
        createdAt: '2026-10-28T00:00:00Z',
        updatedAt: '2026-10-28T00:00:00Z',
      },
    ])

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileRoadmapsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Дорожные карты')).toBeInTheDocument()
      expect(screen.getByText('Мои дорожные карты')).toBeInTheDocument()
      expect(screen.getByText('Моя тестовая карта')).toBeInTheDocument()
      expect(screen.getByText('В процессе прохождения')).toBeInTheDocument()
      expect(screen.getByText('Пройденные')).toBeInTheDocument()
      expect(screen.getByText('Frontend Developer 2026')).toBeInTheDocument()
      expect(screen.getByText('Основы веб-разработки (HTML, CSS)')).toBeInTheDocument()
    })
  })

  it('opens confirmation modal and deletes roadmap on confirm', async () => {
    vi.mocked(roadmapApi.getMyRoadmaps).mockResolvedValue([
      {
        id: 1,
        title: 'Моя тестовая карта',
        description: 'Описание',
        category: 'Frontend',
        difficulty: 'BEGINNER',
        visibility: 'PRIVATE',
        price: 0,
        authorId: 1,
        nodesCount: 5,
        createdAt: '2026-10-28T00:00:00Z',
        updatedAt: '2026-10-28T00:00:00Z',
      },
    ])
    vi.mocked(roadmapApi.deleteRoadmap).mockResolvedValue(undefined)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileRoadmapsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Моя тестовая карта')).toBeInTheDocument()
    })

    const deleteBtn = screen.getByTitle('Удалить карту')
    fireEvent.click(deleteBtn)

    expect(screen.getByText('Удаление дорожной карты')).toBeInTheDocument()
    expect(screen.getByText(/Вы уверены, что хотите удалить дорожную карту/)).toBeInTheDocument()

    const confirmBtn = screen.getByRole('button', { name: 'Удалить' })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(roadmapApi.deleteRoadmap).toHaveBeenCalledWith(1)
    })
  })
})
