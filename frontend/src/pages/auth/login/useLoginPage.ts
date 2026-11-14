import { useState, useCallback, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuthStore } from '@/entities/session'
import { getErrorMessage } from '@/shared/lib/error-utils'

export function useLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false)

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setError(null)

      if (!email.trim() || !password.trim()) {
        setError('Пожалуйста, заполните все поля')
        return
      }

      setIsLoading(true)
      try {
        await login({ email: email.trim(), password })
        const targetPath = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/profile/roadmaps'
        navigate(targetPath, { replace: true })
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            { INVALID_CREDENTIALS: 'Неверный адрес электронной почты или пароль' },
            'Ошибка авторизации',
          ),
        )
      } finally {
        setIsLoading(false)
      }
    },
    [email, password, login, location.state, navigate],
  )

  const handleOpenRecovery = useCallback(() => {
    setIsRecoveryOpen(true)
  }, [])

  const handleCloseRecovery = useCallback(() => {
    setIsRecoveryOpen(false)
  }, [])

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    isRecoveryOpen,
    handleSubmit,
    handleOpenRecovery,
    handleCloseRecovery,
  }
}
