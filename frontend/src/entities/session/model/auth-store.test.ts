import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore, extractUserFromToken } from './auth-store'
import { authApi } from '@/shared/api/auth-api'
import { getAccessToken, setAccessToken } from '@/shared/api/http-client'

vi.mock('@/shared/api/auth-api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
  },
}))

vi.mock('@/shared/api/user-api', () => ({
  userApi: {
    getProfile: vi.fn(),
  },
}))

function createMockJwt(userId: number, email: string, name: string): string {
  const payload = { sub: String(userId), email, name }
  const base64Url = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `header.${base64Url}.signature`
}

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setAccessToken(null)
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: false,
    })
  })

  it('should authenticate user on successful login', async () => {
    const mockAuthResponse = {
      user: { id: 1, name: 'Олег', email: 'oleg@mail.ru' },
      accessToken: 'token-123',
    }
    vi.mocked(authApi.login).mockResolvedValue(mockAuthResponse)

    await useAuthStore.getState().login({ email: 'oleg@mail.ru', password: 'password' })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(mockAuthResponse.user)
    expect(state.accessToken).toBe('token-123')
    expect(getAccessToken()).toBe('token-123')
  })

  it('should authenticate user on successful register', async () => {
    const mockAuthResponse = {
      user: { id: 2, name: 'Иван', email: 'ivan@mail.ru' },
      accessToken: 'token-456',
    }
    vi.mocked(authApi.register).mockResolvedValue(mockAuthResponse)

    await useAuthStore.getState().register({
      name: 'Иван',
      email: 'ivan@mail.ru',
      password: 'password',
    })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(mockAuthResponse.user)
    expect(state.accessToken).toBe('token-456')
  })

  it('should clear authentication on logout', async () => {
    useAuthStore.setState({
      user: { id: 1, name: 'Олег', email: 'oleg@mail.ru' },
      accessToken: 'token-123',
      isAuthenticated: true,
      isInitialized: true,
    })
    vi.mocked(authApi.logout).mockResolvedValue()

    await useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(getAccessToken()).toBeNull()
  })

  describe('extractUserFromToken', () => {
    it('correctly extracts user with cyrillic name', () => {
      const token = createMockJwt(10, 'sergey@mail.ru', 'Сергей Петров')
      const user = extractUserFromToken(token)
      expect(user).toEqual({
        id: 10,
        email: 'sergey@mail.ru',
        name: 'Сергей Петров',
      })
    })

    it('returns null for malformed token', () => {
      expect(extractUserFromToken('invalid-token')).toBeNull()
      expect(extractUserFromToken('')).toBeNull()
    })
  })

  describe('refresh and initAuth', () => {
    it('restores session from refresh token and decodes user', async () => {
      const mockToken = createMockJwt(5, 'anna@mail.ru', 'Анна')
      vi.mocked(authApi.refresh).mockResolvedValue({ accessToken: mockToken })

      const token = await useAuthStore.getState().refresh()

      expect(token).toBe(mockToken)
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.isInitialized).toBe(true)
      expect(state.user).toEqual({
        id: 5,
        email: 'anna@mail.ru',
        name: 'Анна',
      })
      expect(getAccessToken()).toBe(mockToken)
    })

    it('deduplicates concurrent refresh calls into single request', async () => {
      const mockToken = createMockJwt(7, 'igor@mail.ru', 'Игорь')
      vi.mocked(authApi.refresh).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ accessToken: mockToken }), 20)),
      )

      const [res1, res2] = await Promise.all([
        useAuthStore.getState().refresh(),
        useAuthStore.getState().refresh(),
      ])

      expect(res1).toBe(mockToken)
      expect(res2).toBe(mockToken)
      expect(authApi.refresh).toHaveBeenCalledTimes(1)
    })

    it('clears session on refresh failure', async () => {
      vi.mocked(authApi.refresh).mockRejectedValue(new Error('Unauthorized'))

      const token = await useAuthStore.getState().refresh()

      expect(token).toBeNull()
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isInitialized).toBe(true)
      expect(state.user).toBeNull()
      expect(state.accessToken).toBeNull()
      expect(getAccessToken()).toBeNull()
    })

    it('initAuth triggers refresh only if not initialized', async () => {
      const mockToken = createMockJwt(1, 'user@test.ru', 'User')
      vi.mocked(authApi.refresh).mockResolvedValue({ accessToken: mockToken })

      await useAuthStore.getState().initAuth()
      expect(authApi.refresh).toHaveBeenCalledTimes(1)

      await useAuthStore.getState().initAuth()
      expect(authApi.refresh).toHaveBeenCalledTimes(1)
    })
  })
})
