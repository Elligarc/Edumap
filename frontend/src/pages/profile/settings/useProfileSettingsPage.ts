import { useState, useCallback, useEffect, type FormEvent } from 'react'
import { userApi } from '@/shared/api/user-api'
import { useAuthStore } from '@/entities/session'
import { getErrorMessage } from '@/shared/lib/error-utils'

export function useProfileSettingsPage() {
  const { setUser } = useAuthStore()

  const initialUser = useAuthStore.getState().user
  const [name, setName] = useState(initialUser?.name || '')
  const [email, setEmail] = useState(initialUser?.email || '')
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const profile = await userApi.getProfile()
        if (isMounted) {
          setName(profile.name)
          setEmail(profile.email)
          const currentUser = useAuthStore.getState().user
          if (!currentUser || currentUser.name !== profile.name || currentUser.email !== profile.email) {
            setUser({ id: profile.id, name: profile.name, email: profile.email })
          }
        }
      } catch {
        if (isMounted) {
          const currentUser = useAuthStore.getState().user
          if (currentUser) {
            setName(currentUser.name)
            setEmail(currentUser.email)
          }
        }
      }
    }
    void loadData()
    return () => {
      isMounted = false
    }
  }, [setUser])

  const handleSaveProfile = useCallback(
    async (e?: FormEvent) => {
      if (e) e.preventDefault()
      setProfileError(null)
      setProfileSuccess(false)

      if (!name.trim() || !email.trim()) {
        setProfileError('Имя и электронная почта не могут быть пустыми')
        return
      }

      setIsProfileLoading(true)
      try {
        const updated = await userApi.updateProfile({
          name: name.trim(),
          email: email.trim(),
        })
        setName(updated.name)
        setEmail(updated.email)
        setUser({ id: updated.id, name: updated.name, email: updated.email })
        setProfileSuccess(true)
      } catch (err) {
        setProfileError(
          getErrorMessage(
            err,
            { EMAIL_ALREADY_EXISTS: 'Данный адрес электронной почты уже занят' },
            'Ошибка обновления профиля',
          ),
        )
      } finally {
        setIsProfileLoading(false)
      }
    },
    [name, email, setUser],
  )

  const handleChangePassword = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setPasswordError(null)
      setPasswordSuccess(false)

      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError('Заполните все поля смены пароля')
        return
      }

      if (newPassword.length < 6) {
        setPasswordError('Новый пароль должен содержать от 6 символов')
        return
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('Новые пароли не совпадают')
        return
      }

      setIsPasswordLoading(true)
      try {
        await userApi.changePassword({
          currentPassword,
          newPassword,
        })
        setPasswordSuccess(true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } catch (err) {
        setPasswordError(
          getErrorMessage(
            err,
            {
              INVALID_CURRENT_PASSWORD: 'Текущий пароль указан неверно',
              SAME_PASSWORD: 'Новый пароль не должен совпадать с текущим',
            },
            'Ошибка смены пароля',
          ),
        )
      } finally {
        setIsPasswordLoading(false)
      }
    },
    [currentPassword, newPassword, confirmPassword],
  )

  return {
    name,
    setName,
    email,
    setEmail,
    profileSuccess,
    profileError,
    isProfileLoading,
    handleSaveProfile,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordSuccess,
    passwordError,
    isPasswordLoading,
    handleChangePassword,
  }
}
