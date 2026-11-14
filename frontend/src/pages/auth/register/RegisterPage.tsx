import { Link } from 'react-router'
import { Loader2 } from 'lucide-react'
import { AppHeader } from '@/widgets/app-header'
import { AppFooter } from '@/widgets/app-footer'
import { useRegisterPage } from './useRegisterPage'
import '../login/LoginPage.css'
import './RegisterPage.css'

export function RegisterPage() {
  const {
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
  } = useRegisterPage()

  return (
    <div className="register-page">
      <AppHeader />

      <main className="register-page-main">
        <div className="register-page-card">
          <h1 className="register-page-title">Регистрация</h1>

          {error && <div className="auth-error-alert mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="register-page-form" noValidate>
            <div className="auth-field-group">
              <label htmlFor="reg-name" className="auth-field-label">
                Имя
              </label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                required
                className="auth-field-input"
                autoComplete="name"
              />
            </div>

            <div className="auth-field-group">
              <label htmlFor="reg-email" className="auth-field-label">
                Электронная почта
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="auth-field-input"
                autoComplete="email"
              />
            </div>

            <div className="auth-field-group">
              <label htmlFor="reg-password" className="auth-field-label">
                Пароль
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль..."
                required
                className="auth-field-input"
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field-group">
              <label htmlFor="reg-confirm-password" className="auth-field-label">
                Повторно введите пароль...
              </label>
              <input
                id="reg-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторно введите пароль..."
                required
                className="auth-field-input"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Регистрация...</span>
                </>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </form>

          <div className="auth-footer-links">
            <span>
              Уже есть аккаунт?{' '}
              <Link to="/login" className="auth-footer-link">
                Войти
              </Link>
            </span>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
