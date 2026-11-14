import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { ConstructorProvider } from '@/features/roadmap-constructor'
import { RoadmapEditorWidget } from './RoadmapEditorWidget'

describe('RoadmapEditorWidget', () => {
  it('рендерит панель инструментов, холст и правый сайдбар свойств в режиме редактора', () => {
    const { container } = render(
      <MemoryRouter>
        <ConstructorProvider
          roadmapId={1}
          roadmap={{ id: 1, title: 'Тестовая карта' }}
        >
          <RoadmapEditorWidget />
        </ConstructorProvider>
      </MemoryRouter>,
    )

    const toolbar = container.querySelector('.constructor-toolbar')
    expect(toolbar).toBeInTheDocument()

    const canvas = container.querySelector('.constructor-canvas')
    expect(canvas).toBeInTheDocument()

    const sidebar = container.querySelector('.roadmap-editor-sidebar')
    expect(sidebar).toBeInTheDocument()
    expect(screen.getByText('Элемент не выбран')).toBeInTheDocument()
  })

  it('кнопка назад в шапке конструктора доступна как кнопка возврата', () => {
    const { container } = render(
      <MemoryRouter>
        <ConstructorProvider
          roadmapId={1}
          roadmap={{ id: 1, title: 'Тестовая карта' }}
        >
          <RoadmapEditorWidget />
        </ConstructorProvider>
      </MemoryRouter>,
    )

    const backButton = container.querySelector('.constructor-topbar-back-btn')
    expect(backButton).toBeInTheDocument()
    expect(backButton?.tagName).toBe('BUTTON')
    expect(backButton).toHaveAttribute('title', 'Назад')
  })
})
