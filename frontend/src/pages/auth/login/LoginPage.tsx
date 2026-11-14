import { Link } from 'react-router'
import { Loader2, Info } from 'lucide-react'
import { AppHeader } from '@/widgets/app-header'
import { AppFooter } from '@/widgets/app-footer'
import { Modal } from '@/shared/ui'
import { Button } from '@/shared/ui'
import { useLoginPage } from './useLoginPage'
import './LoginPage.css'

export function LoginPage() {
  const {
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
  } = useLoginPage()

  return (
    <div className="auth-page">
      <AppHeader />

      <main className="auth-page-main">
        <div className="auth-page-card">
          <h1 className="auth-page-title">Вход в аккаунт</h1>

          {error && <div className="auth-error-alert mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-page-form" noValidate>
            <div className="auth-field-group">
              <label htmlFor="login-email" className="auth-field-label">
                Электронная почта
              </label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className="auth-field-label">
                Пароль
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль..."
                required
                className="auth-field-input"
                autoComplete="current-password"
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
                  <span>Вход...</span>
                </>
              ) : (
                'Войти'
              )}
            </button>
          </form>

          <div className="auth-footer-links">
            <span>
              Нет аккаунта?{' '}
              <Link to="/register" className="auth-footer-link">
                Регистрация
              </Link>
            </span>

            <button
              type="button"
              onClick={handleOpenRecovery}
              className="auth-footer-sublink"
            >
              Восстановление пароля
            </button>
          </div>
        </div>
      </main>

      <AppFooter />

      <Modal
        isOpen={isRecoveryOpen}
        onClose={handleCloseRecovery}
        title="Восстановление пароля"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-start gap-3 p-3 bg-(--color-primary-light) text-(--color-text) rounded-(--radius-sm) border border-sky-200 text-xs">
            <Info size={18} className="shrink-0 text-(--color-primary) mt-0.5" />
            <span>
              Функция восстановления пароля временно находится в разработке. Отправка кодов сброса на электронную почту станет доступна в следующем обновлении.
            </span>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleCloseRecovery} size="sm">
              Понятно
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
