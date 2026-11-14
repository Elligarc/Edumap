import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { CabinetLayout } from './CabinetLayout'
import { useAuthStore } from '@/entities/session'

describe('CabinetLayout', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: 1, name: 'Олег', email: 'oleg@mail.ru' },
      accessToken: 'token',
      isAuthenticated: true,
      isInitialized: true,
    })
  })

  it('renders sidebar with user info and navigation tabs', () => {
    render(
      <MemoryRouter initialEntries={['/profile/roadmaps']}>
        <CabinetLayout>
          <div>Cabinet Content</div>
        </CabinetLayout>
      </MemoryRouter>,
    )

    expect(screen.getByText('Олег')).toBeInTheDocument()
    expect(screen.getByText('oleg@mail.ru')).toBeInTheDocument()
    expect(screen.getByText('Мои карты')).toBeInTheDocument()
    expect(screen.getByText('Настройки')).toBeInTheDocument()
    expect(screen.getByText('Cabinet Content')).toBeInTheDocument()
  })

  it('opens stub modal when clicking stub nav items', () => {
    render(
      <MemoryRouter initialEntries={['/profile/roadmaps']}>
        <CabinetLayout>
          <div>Cabinet Content</div>
        </CabinetLayout>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Команды'))
    expect(screen.getByText(/Раздел «Команды» находится в активной разработке/)).toBeInTheDocument()
  })
})
