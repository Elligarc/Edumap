import { endpoints } from './endpoints'
import { httpClient } from './http-client'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  TokenRefreshResponse,
} from '@/shared/types/api'

export const authApi = {
  register(payload: RegisterRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>(endpoints.auth.register(), payload)
  },

  login(payload: LoginRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>(endpoints.auth.login(), payload)
  },

  refresh(): Promise<TokenRefreshResponse> {
    return httpClient.post<TokenRefreshResponse>(endpoints.auth.refresh())
  },

  logout(): Promise<void> {
    return httpClient.post<void>(endpoints.auth.logout())
  },
}
