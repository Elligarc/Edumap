import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { LoginPage } from './LoginPage'
import { useAuthStore } from '@/entities/session'

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: true,
    })
  })

  it('renders login form elements according to design', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Вход в аккаунт' })).toBeInTheDocument()
    expect(screen.getByLabelText('Электронная почта')).toBeInTheDocument()
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
    expect(screen.getByText('Восстановление пароля')).toBeInTheDocument()
  })

  it('shows error when fields are empty', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Войти' }))

    await waitFor(() => {
      expect(screen.getByText('Пожалуйста, заполните все поля')).toBeInTheDocument()
    })
  })

  it('opens recovery modal when clicking password recovery link', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Восстановление пароля'))
    expect(screen.getByText(/Функция восстановления пароля временно находится в разработке/)).toBeInTheDocument()
  })
})
