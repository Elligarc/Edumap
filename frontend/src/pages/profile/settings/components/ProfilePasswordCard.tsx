import type { FormEvent } from 'react'
import { KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Input, Button } from '@/shared/ui'

interface ProfilePasswordCardProps {
  currentPassword: string
  setCurrentPassword: (val: string) => void
  newPassword: string
  setNewPassword: (val: string) => void
  confirmPassword: string
  setConfirmPassword: (val: string) => void
  onSubmit: (e: FormEvent) => void
  isLoading: boolean
  success: boolean
  error: string | null
}

export function ProfilePasswordCard({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  isLoading,
  success,
  error,
}: ProfilePasswordCardProps) {
  return (
    <section className="profile-settings-card">
      <div className="profile-card-header">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[2px] bg-[#f0f9ff] border border-[#bae6fd] flex items-center justify-center text-[#0284c7] shrink-0">
            <KeyRound size={15} />
          </div>
          <div>
            <h2 className="profile-settings-section-title">Смена пароля</h2>
            <p className="profile-settings-card-subtitle">
              Безопасность учетной записи и аутентификация
            </p>
          </div>
        </div>

        {success && (
          <span className="profile-password-success">
            <CheckCircle2 size={13} />
            <span>Успешная смена пароля</span>
          </span>
        )}
      </div>

      {error && (
        <div className="profile-alert--error">
          <AlertCircle size={14} className="shrink-0 text-[#dc2626]" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          id="current-password"
          label="Текущий пароль"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Текущий пароль"
          autoComplete="current-password"
        />

        <Input
          id="new-password"
          label="Новый пароль"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Новый пароль (от 6 символов)"
          autoComplete="new-password"
        />

        <Input
          id="confirm-password"
          label="Повторите новый пароль"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Повторите новый пароль"
          autoComplete="new-password"
        />

        <div className="pt-1">
          <Button
            type="submit"
            disabled={isLoading}
            size="md"
            className="self-start"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Смена...</span>
              </>
            ) : (
              'Сменить пароль'
            )}
          </Button>
        </div>
      </form>
    </section>
  )
}
