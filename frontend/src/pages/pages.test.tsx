import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { HomePage } from '@/pages/home/HomePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

describe('страницы приложения', () => {
  it('HomePage отображает заголовок каталога', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Освойте любой навык с визуальными дорожными картами.',
    )
    expect(screen.getByText('Исследуйте маркетплейс')).toBeInTheDocument()
    expect(screen.getByText('Все, что нужно для освоения навыков')).toBeInTheDocument()
  })

  it('NotFoundPage сообщает о ненайденной странице', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Страница не найдена')
    expect(screen.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/')
  })
})
