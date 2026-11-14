import { User } from 'lucide-react'
import { Input, Button } from '@/shared/ui'

interface ProfilePersonalDataCardProps {
  name: string
  setName: (val: string) => void
  email: string
  setEmail: (val: string) => void
  onSave: () => void
  isLoading: boolean
}

export function ProfilePersonalDataCard({
  name,
  setName,
  email,
  setEmail,
  onSave,
  isLoading,
}: ProfilePersonalDataCardProps) {
  return (
    <section className="profile-settings-card">
      <div className="profile-card-header">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[2px] bg-[#f0f9ff] border border-[#bae6fd] flex items-center justify-center text-[#0284c7] shrink-0">
            <User size={15} />
          </div>
          <div>
            <h2 className="profile-settings-section-title">Личные данные</h2>
            <p className="profile-settings-card-subtitle">
              Управление отображаемым именем и контактной почтой
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          id="settings-name"
          label="Имя"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          autoComplete="name"
        />

        <div className="profile-settings-field">
          <label htmlFor="settings-email" className="profile-settings-label">
            Почта
          </label>
          <div className="profile-email-row">
            <Input
              id="settings-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              containerClassName="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onSave}
              disabled={isLoading}
              className="shrink-0"
            >
              Сменить почту
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
