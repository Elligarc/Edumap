import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { UserRoadmapCard } from './UserRoadmapCard'
import type { RoadmapResponse } from '@/shared/types/api'

describe('UserRoadmapCard', () => {
  const baseRoadmap: RoadmapResponse = {
    id: 42,
    title: 'Frontend-разработчик 2026',
    description: 'Описание трека',
    category: 'Frontend',
    difficulty: 'BEGINNER',
    visibility: 'PUBLISHED',
    price: 0,
    authorId: 1,
    nodesCount: 6,
    rating: 4.8,
    ratingsCount: 12,
    studentsCount: 25,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  }

  it('renders title, formatted nodes count, rating with count, and participants count', () => {
    render(
      <MemoryRouter>
        <UserRoadmapCard roadmap={baseRoadmap} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Frontend-разработчик 2026')).toBeInTheDocument()
    expect(screen.getByText('6 узлов')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('(12)')).toBeInTheDocument()
    expect(screen.getByText('25 участников')).toBeInTheDocument()

    expect(screen.queryByText(/Автор/i)).not.toBeInTheDocument()
    expect(screen.queryByText('99.0')).not.toBeInTheDocument()
  })

  it('renders rating without count if ratingsCount is 0 or undefined', () => {
    const roadmapNoRatingsCount: RoadmapResponse = {
      ...baseRoadmap,
      rating: 4.5,
      ratingsCount: 0,
      studentsCount: 1,
      nodesCount: 2,
    }

    render(
      <MemoryRouter>
        <UserRoadmapCard roadmap={roadmapNoRatingsCount} />
      </MemoryRouter>,
    )

    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument()
    expect(screen.getByText('1 участник')).toBeInTheDocument()
    expect(screen.getByText('2 узла')).toBeInTheDocument()
  })

  it('does not render rating block when rating is 0 or null', () => {
    const roadmapNoRating: RoadmapResponse = {
      ...baseRoadmap,
      rating: null,
      ratingsCount: 0,
      studentsCount: 0,
    }

    render(
      <MemoryRouter>
        <UserRoadmapCard roadmap={roadmapNoRating} />
      </MemoryRouter>,
    )

    expect(screen.queryByLabelText(/Оценка/i)).not.toBeInTheDocument()
    expect(screen.getByText('0 участников')).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(
      <MemoryRouter>
        <UserRoadmapCard roadmap={baseRoadmap} onDelete={onDelete} />
      </MemoryRouter>,
    )

    const deleteBtn = screen.getByTitle('Удалить карту')
    fireEvent.click(deleteBtn)

    expect(onDelete).toHaveBeenCalledWith(baseRoadmap)
  })
})
