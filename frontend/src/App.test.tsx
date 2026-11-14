import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { App } from './App'
import { useAuthStore } from '@/entities/session'

vi.mock('@/app/router/routes', () => ({
  router: {
    state: { location: { pathname: '/' } },
    subscribe: vi.fn(() => vi.fn()),
    navigate: vi.fn(),
    createHref: vi.fn(() => '/'),
  },
}))

vi.mock('react-router', () => ({
  RouterProvider: () => <div data-testid="router-provider-mock">Router Content</div>,
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('triggers initAuth on mount', () => {
    const initAuthSpy = vi.fn().mockResolvedValue(undefined)
    useAuthStore.setState({ initAuth: initAuthSpy })

    render(<App />)

    expect(initAuthSpy).toHaveBeenCalledTimes(1)
  })
})
