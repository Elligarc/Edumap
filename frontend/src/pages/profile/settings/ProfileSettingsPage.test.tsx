import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { ProfileSettingsPage } from './ProfileSettingsPage'
import { userApi } from '@/shared/api/user-api'
import { useAuthStore } from '@/entities/session'

vi.mock('@/shared/api/user-api', () => ({
  userApi: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
  },
}))

describe('ProfileSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: { id: 1, name: 'Олег', email: 'oleg@mail.ru' },
      accessToken: 'token',
      isAuthenticated: true,
      isInitialized: true,
    })
  })

  it('renders settings fields and password change section', async () => {
    vi.mocked(userApi.getProfile).mockResolvedValue({
      id: 1,
      name: 'Олег',
      email: 'oleg@mail.ru',
      createdAt: '2026-10-28T00:00:00Z',
    })

    render(
      <MemoryRouter>
        <ProfileSettingsPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Настройки' })).toBeInTheDocument()
      expect(screen.getByText('Личные данные')).toBeInTheDocument()
      expect(screen.getByLabelText('Имя')).toHaveValue('Олег')
      expect(screen.getByLabelText('Почта')).toHaveValue('oleg@mail.ru')
      expect(screen.getByText('Смена пароля')).toBeInTheDocument()
      expect(screen.getByLabelText('Текущий пароль')).toBeInTheDocument()
      expect(screen.getByLabelText('Новый пароль')).toBeInTheDocument()
      expect(screen.getByLabelText('Повторите новый пароль')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Сменить пароль' })).toBeInTheDocument()
    })
  })

  it('updates profile personal data successfully', async () => {
    vi.mocked(userApi.getProfile).mockResolvedValue({
      id: 1,
      name: 'Олег',
      email: 'oleg@mail.ru',
      createdAt: '2026-10-28T00:00:00Z',
    })
    vi.mocked(userApi.updateProfile).mockResolvedValue({
      id: 1,
      name: 'Иван',
      email: 'ivan@mail.ru',
      createdAt: '2026-10-28T00:00:00Z',
    })

    render(
      <MemoryRouter>
        <ProfileSettingsPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Имя')).toHaveValue('Олег')
    })

    fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'Иван' } })
    fireEvent.change(screen.getByLabelText('Почта'), { target: { value: 'ivan@mail.ru' } })

    fireEvent.click(screen.getByRole('button', { name: 'Сохранить изменения' }))

    await waitFor(() => {
      expect(userApi.updateProfile).toHaveBeenCalledWith({
        name: 'Иван',
        email: 'ivan@mail.ru',
      })
      expect(screen.getByText('Личные данные успешно обновлены')).toBeInTheDocument()
    })
  })

  it('submits password change successfully', async () => {
    vi.mocked(userApi.getProfile).mockResolvedValue({
      id: 1,
      name: 'Олег',
      email: 'oleg@mail.ru',
      createdAt: '2026-10-28T00:00:00Z',
    })
    vi.mocked(userApi.changePassword).mockResolvedValue(undefined)

    render(
      <MemoryRouter>
        <ProfileSettingsPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Текущий пароль')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Текущий пароль'), { target: { value: 'oldpass123' } })
    fireEvent.change(screen.getByLabelText('Новый пароль'), { target: { value: 'newpass123' } })
    fireEvent.change(screen.getByLabelText('Повторите новый пароль'), { target: { value: 'newpass123' } })

    fireEvent.click(screen.getByRole('button', { name: 'Сменить пароль' }))

    await waitFor(() => {
      expect(userApi.changePassword).toHaveBeenCalledWith({
        currentPassword: 'oldpass123',
        newPassword: 'newpass123',
      })
      expect(screen.getByText('Успешная смена пароля')).toBeInTheDocument()
    })
  })
})
