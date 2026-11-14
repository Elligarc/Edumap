import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CatalogPage } from './CatalogPage'
import { roadmapApi } from '@/entities/roadmap'
import type { PageResponse, RoadmapResponse } from '@/shared/types/api'

vi.mock('@/entities/roadmap', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/roadmap')>()
  return {
    ...actual,
    roadmapApi: {
      ...actual.roadmapApi,
      getRoadmaps: vi.fn(),
    },
  }
})

const mockRoadmapsList: RoadmapResponse[] = [
  {
    id: 1,
    title: 'Frontend Developer',
    description: 'Изучение веб-разработки: HTML, CSS, JavaScript, React',
    category: 'Разработка',
    difficulty: 'BEGINNER',
    visibility: 'PUBLISHED',
    price: 0,
    authorId: 1,
    nodesCount: 15,
    rating: 4.8,
    ratingsCount: 25,
    studentsCount: 150,
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-11-06T10:00:00Z',
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    description: 'Интерфейсы, типографика, прототипы в Figma',
    category: 'Дизайн',
    difficulty: 'INTERMEDIATE',
    visibility: 'PUBLISHED',
    price: 0,
    authorId: 2,
    nodesCount: 20,
    rating: 4.9,
    ratingsCount: 12,
    studentsCount: 80,
    createdAt: '2026-10-02T10:00:00Z',
    updatedAt: '2026-11-06T10:00:00Z',
  },
]

function makePageResponse(content: RoadmapResponse[]): PageResponse<RoadmapResponse> {
  return {
    content,
    totalElements: content.length,
    totalPages: content.length > 0 ? 2 : 0,
    number: 0,
    size: 6,
  }
}

function renderCatalogPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/catalog']}>
        <CatalogPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('CatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollTo = vi.fn()
    vi.mocked(roadmapApi.getRoadmaps).mockResolvedValue(makePageResponse(mockRoadmapsList))
  })

  it('рендерит заголовок, поиск, категории, сайдбар и карточки из API', async () => {
    renderCatalogPage()

    expect(screen.getByText('Исследуйте дорожные карты')).toBeInTheDocument()
    expect(
      screen.getByText('Откройте для себя пути от сообщества для освоения любого навыка.')
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /поиск по каталогу/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Все категории' })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
      expect(screen.getByText('UI/UX Designer')).toBeInTheDocument()
    })
  })

  it('вызывает запрос поиска при отправке формы', async () => {
    renderCatalogPage()

    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    })

    const searchInput = screen.getByRole('textbox', { name: /поиск по каталогу/i })
    fireEvent.change(searchInput, { target: { value: 'Frontend' } })

    const searchButton = screen.getByRole('button', { name: 'Поиск' })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(roadmapApi.getRoadmaps).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Frontend' })
      )
    })
  })

  it('вызывает запрос с фильтром по категории при клике на чип', async () => {
    renderCatalogPage()

    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    })

    const designTab = screen.getByRole('tab', { name: 'Дизайн' })
    fireEvent.click(designTab)

    await waitFor(() => {
      expect(roadmapApi.getRoadmaps).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'Дизайн' })
      )
    })
  })

  it('отображает честный Empty State при пустом ответе бэкенда', async () => {
    vi.mocked(roadmapApi.getRoadmaps).mockResolvedValue(makePageResponse([]))

    renderCatalogPage()

    await waitFor(() => {
      expect(screen.getByTestId('catalog-empty-state')).toBeInTheDocument()
      expect(screen.getByText('Дорожные карты не найдены')).toBeInTheDocument()
    })
  })

  it('поддерживает переключение страниц пагинации', async () => {
    renderCatalogPage()

    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    })

    const page2Btn = screen.getByRole('button', { name: '2' })
    expect(page2Btn).toBeInTheDocument()

    fireEvent.click(page2Btn)

    await waitFor(() => {
      expect(roadmapApi.getRoadmaps).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1 })
      )
    })
  })

  it('запрашивает только публичные карты с visibility: PUBLISHED', async () => {
    renderCatalogPage()

    await waitFor(() => {
      expect(roadmapApi.getRoadmaps).toHaveBeenCalledWith(
        expect.objectContaining({ visibility: 'PUBLISHED' })
      )
    })
  })

  it('не отображает приватные карты в каталоге, даже если они вернулись в ответе API', async () => {
    const mixedList: RoadmapResponse[] = [
      {
        id: 10,
        title: 'Публичная карта',
        description: 'Должна быть видна',
        category: 'Разработка',
        difficulty: 'BEGINNER',
        visibility: 'PUBLISHED',
        price: 0,
        authorId: 1,
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: '2026-11-06T10:00:00Z',
      },
      {
        id: 11,
        title: 'Приватная карта',
        description: 'Не должна отображаться в каталоге',
        category: 'Разработка',
        difficulty: 'BEGINNER',
        visibility: 'PRIVATE',
        price: 0,
        authorId: 2,
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: '2026-11-06T10:00:00Z',
      },
    ]

    vi.mocked(roadmapApi.getRoadmaps).mockResolvedValue(makePageResponse(mixedList))

    renderCatalogPage()

    await waitFor(() => {
      expect(screen.getByText('Публичная карта')).toBeInTheDocument()
      expect(screen.queryByText('Приватная карта')).not.toBeInTheDocument()
    })
  })
})
