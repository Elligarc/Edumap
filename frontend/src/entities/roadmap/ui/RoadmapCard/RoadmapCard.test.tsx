import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { RoadmapCard } from './RoadmapCard'
import type { CatalogRoadmap } from '../../model/catalog-types'

const testRoadmap: CatalogRoadmap = {
  id: 'test-map',
  title: 'Тестовый Роадмап',
  description: 'Подробное описание роадмапа для тестирования',
  category: 'Разработка',
  difficulty: 'INTERMEDIATE',
  price: 'FREE',
  priceValue: 0,
  authorType: 'OFFICIAL',
  authorName: 'YPD Team',
  stepsCount: 42,
  studentsCount: 1500,
  rating: 4.9,
  ratingsCount: 84,
  isOfficial: true,
  gradientTheme: 'blue',
  updatedAt: '2026-11-06',
}

describe('RoadmapCard', () => {
  it('корректно отображает название, описание, категорию, рейтинг, учащихся и сложность', () => {
    render(
      <MemoryRouter>
        <RoadmapCard roadmap={testRoadmap} />
      </MemoryRouter>
    )

    expect(screen.getByText('Тестовый Роадмап')).toBeInTheDocument()
    expect(screen.getByText('Подробное описание роадмапа для тестирования')).toBeInTheDocument()
    expect(screen.getByText('Разработка')).toBeInTheDocument()
    expect(screen.getByText('Официальный')).toBeInTheDocument()
    expect(screen.getByText('42 тем')).toBeInTheDocument()
    expect(screen.getByText('4.9')).toBeInTheDocument()
    expect(screen.getByText('(84)')).toBeInTheDocument()
    expect(screen.getByText(/1.*500 учащихся/)).toBeInTheDocument()
    expect(screen.getByText('Средний')).toBeInTheDocument()
    expect(screen.getByText('Бесплатно')).toBeInTheDocument()
  })

  it('отображает конкретную цену из БД для платных роадмапов и скрывает официальный бейдж', () => {
    const communityRoadmap: CatalogRoadmap = {
      ...testRoadmap,
      isOfficial: false,
      price: 'PAID',
      priceValue: 499,
      difficulty: 'BEGINNER',
    }

    render(
      <MemoryRouter>
        <RoadmapCard roadmap={communityRoadmap} />
      </MemoryRouter>
    )

    expect(screen.queryByText('Официальный')).not.toBeInTheDocument()
    expect(screen.getByText('499 ₽')).toBeInTheDocument()
    expect(screen.getByText('Легкий')).toBeInTheDocument()
  })
})
