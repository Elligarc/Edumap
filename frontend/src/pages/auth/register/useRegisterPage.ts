import { useState, useCallback, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/entities/session'
import { getErrorMessage } from '@/shared/lib/error-utils'

export function useRegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setError(null)

      if (!name.trim() || !email.trim() || !password || !confirmPassword) {
        setError('Пожалуйста, заполните все поля')
        return
      }

      if (password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов')
        return
      }

      if (password !== confirmPassword) {
        setError('Пароли не совпадают')
        return
      }

      setIsLoading(true)
      try {
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
        })
        navigate('/profile/roadmaps', { replace: true })
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            { EMAIL_ALREADY_EXISTS: 'Пользователь с такой электронной почтой уже зарегистрирован' },
            'Ошибка регистрации',
          ),
        )
      } finally {
        setIsLoading(false)
      }
    },
    [name, email, password, confirmPassword, register, navigate],
  )

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  }
}
