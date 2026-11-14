import { endpoints } from './endpoints'
import { httpClient } from './http-client'
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserProfileResponse,
} from '@/shared/types/api'

export const userApi = {
  getProfile(): Promise<UserProfileResponse> {
    return httpClient.get<UserProfileResponse>(endpoints.users.me())
  },

  updateProfile(payload: UpdateProfileRequest): Promise<UserProfileResponse> {
    return httpClient.patch<UserProfileResponse>(endpoints.users.me(), payload)
  },

  changePassword(payload: ChangePasswordRequest): Promise<void> {
    return httpClient.put<void>(endpoints.users.changePassword(), payload)
  },
}
