import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AppHeader } from './AppHeader'
import { useAuthStore } from '@/entities/session'

describe('AppHeader', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: true,
    })
  })

  it('renders login and register links when unauthenticated', () => {
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    )

    expect(screen.getByText('Войти')).toBeInTheDocument()
    expect(screen.getByText('Регистрация')).toBeInTheDocument()
    expect(screen.queryByText('12 дней')).not.toBeInTheDocument()
  })

  it('renders streak and user button when authenticated', () => {
    useAuthStore.setState({
      user: { id: 1, name: 'Олег', email: 'oleg@mail.ru' },
      accessToken: 'token',
      isAuthenticated: true,
      isInitialized: true,
    })

    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    )

    expect(screen.queryByText('Войти')).not.toBeInTheDocument()
    expect(screen.queryByText('Регистрация')).not.toBeInTheDocument()
    expect(screen.getByText('99 дней')).toBeInTheDocument()
    expect(screen.getByLabelText('Меню пользователя')).toBeInTheDocument()
  })

  it('renders skeleton placeholder while auth is not initialized', () => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: false,
    })

    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('app-header-skeleton')).toBeInTheDocument()
    expect(screen.queryByText('Войти')).not.toBeInTheDocument()
    expect(screen.queryByText('Регистрация')).not.toBeInTheDocument()
  })
})
