import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { RegisterPage } from './RegisterPage'
import { useAuthStore } from '@/entities/session'

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: true,
    })
  })

  it('renders registration form elements according to design with name field', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Регистрация' })).toBeInTheDocument()
    expect(screen.getByLabelText('Имя')).toBeInTheDocument()
    expect(screen.getByLabelText('Электронная почта')).toBeInTheDocument()
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument()
    expect(screen.getByLabelText('Повторно введите пароль...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument()
  })

  it('validates password mismatch', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'Иван' } })
    fireEvent.change(screen.getByLabelText('Электронная почта'), { target: { value: 'ivan@mail.ru' } })
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: 'pass123' } })
    fireEvent.change(screen.getByLabelText('Повторно введите пароль...'), { target: { value: 'pass456' } })

    fireEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }))

    await waitFor(() => {
      expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument()
    })
  })
})
