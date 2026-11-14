import { create } from 'zustand'
import { authApi } from '@/shared/api/auth-api'
import { userApi } from '@/shared/api/user-api'
import { setAccessToken, setUnauthorizedHandler } from '@/shared/api/http-client'
import type { LoginRequest, RegisterRequest, UserSummary } from '@/shared/types/api'

export interface AuthState {
  user: UserSummary | null
  accessToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  login: (payload: LoginRequest) => Promise<void>
  register: (payload: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<string | null>
  initAuth: () => Promise<void>
  setUser: (user: UserSummary) => void
}

export function extractUserFromToken(token: string): UserSummary | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decoded =
      typeof atob === 'function'
        ? atob(base64)
        : Buffer.from(base64, 'base64').toString('binary')
    const json = decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    const payload = JSON.parse(json) as { sub?: string; email?: string; name?: string }
    if (payload.sub && payload.email) {
      return {
        id: Number(payload.sub),
        name: payload.name || '',
        email: payload.email,
      }
    }
    return null
  } catch {
    return null
  }
}

function applyAuthSuccess(
  set: (state: Partial<AuthState>) => void,
  user: UserSummary,
  accessToken: string,
) {
  setAccessToken(accessToken)
  set({
    user,
    accessToken,
    isAuthenticated: true,
    isInitialized: true,
  })
}

function clearAuthSession(set: (state: Partial<AuthState>) => void) {
  setAccessToken(null)
  set({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isInitialized: true,
  })
}

let activeRefreshPromise: Promise<string | null> | null = null

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,

  setUser: (user: UserSummary) => set({ user }),

  login: async (payload: LoginRequest) => {
    const response = await authApi.login(payload)
    applyAuthSuccess(set, response.user, response.accessToken)
  },

  register: async (payload: RegisterRequest) => {
    const response = await authApi.register(payload)
    applyAuthSuccess(set, response.user, response.accessToken)
  },

  refresh: async () => {
    if (activeRefreshPromise) {
      return activeRefreshPromise
    }

    activeRefreshPromise = (async () => {
      try {
        const response = await authApi.refresh()
        setAccessToken(response.accessToken)

        let user = get().user
        if (!user) {
          user = extractUserFromToken(response.accessToken)
        }
        if (!user) {
          try {
            const profile = await userApi.getProfile()
            user = { id: profile.id, name: profile.name, email: profile.email }
          } catch {
          }
        }

        applyAuthSuccess(set, user || { id: 0, name: '', email: '' }, response.accessToken)
        return response.accessToken
      } catch {
        clearAuthSession(set)
        return null
      } finally {
        activeRefreshPromise = null
      }
    })()

    return activeRefreshPromise
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      clearAuthSession(set)
    }
  },

  initAuth: async () => {
    if (get().isInitialized) return
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search)
        if (params.has('dev_auth')) {
          await get().login({ email: 'author@mail.ru', password: '123' })
          return
        }
      } catch {
      }
    }
    await get().refresh()
  },
}))

setUnauthorizedHandler(async () => {
  return useAuthStore.getState().refresh()
})
