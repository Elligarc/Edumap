import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { HomeFeatures } from './HomeFeatures'
import { useAuthStore } from '@/entities/session'

describe('HomeFeatures', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: true,
    })
  })

  it('рендерит заголовок и все 3 карточки преимуществ', () => {
    render(
      <MemoryRouter>
        <HomeFeatures />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'Все, что нужно для освоения навыков' }),
    ).toBeInTheDocument()

    expect(screen.getByRole('heading', { level: 3, name: 'Визуальный редактор' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Командный трекинг' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Геймификация прогресса' })).toBeInTheDocument()
  })

  it('перенаправляет неавторизованного пользователя на страницу логина по кнопке перехода в конструктор', () => {
    useAuthStore.setState({ isAuthenticated: false })

    render(
      <MemoryRouter>
        <HomeFeatures />
      </MemoryRouter>,
    )

    const buttonLink = screen.getByTestId('go-to-constructor-btn')
    expect(buttonLink).toBeInTheDocument()
    expect(buttonLink).toHaveTextContent('Перейти в конструктор')
    expect(buttonLink).toHaveAttribute('href', '/login')
  })

  it('перенаправляет авторизованного пользователя в конструктор/мои карты по кнопке перехода в конструктор', () => {
    useAuthStore.setState({
      user: { id: 1, name: 'Иван', email: 'ivan@mail.ru' },
      accessToken: 'token',
      isAuthenticated: true,
      isInitialized: true,
    })

    render(
      <MemoryRouter>
        <HomeFeatures />
      </MemoryRouter>,
    )

    const buttonLink = screen.getByTestId('go-to-constructor-btn')
    expect(buttonLink).toBeInTheDocument()
    expect(buttonLink).toHaveAttribute('href', '/profile/roadmaps')
  })
})
