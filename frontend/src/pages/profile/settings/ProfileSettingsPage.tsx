import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui'
import { useProfileSettingsPage } from './useProfileSettingsPage'
import { ProfilePersonalDataCard } from './components/ProfilePersonalDataCard'
import { ProfilePasswordCard } from './components/ProfilePasswordCard'
import './ProfileSettingsPage.css'

export function ProfileSettingsPage() {
  const {
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
  } = useProfileSettingsPage()

  return (
    <div className="profile-settings-page">
      <div className="profile-settings-header">
        <div>
          <h1 className="profile-settings-title">Настройки</h1>
          <p className="profile-settings-subtitle">
            Управление параметрами аккаунта и безопасностью профиля
          </p>
        </div>

        <Button
          type="button"
          onClick={() => handleSaveProfile()}
          disabled={isProfileLoading}
          size="sm"
        >
          {isProfileLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Сохранение...</span>
            </>
          ) : (
            'Сохранить изменения'
          )}
        </Button>
      </div>

      <div className="profile-settings-section">
        {profileSuccess && (
          <div className="profile-alert--success">
            <CheckCircle2 size={15} className="shrink-0 text-[#059669]" />
            <span>Личные данные успешно обновлены</span>
          </div>
        )}

        {profileError && (
          <div className="profile-alert--error">
            <AlertCircle size={15} className="shrink-0 text-[#dc2626]" />
            <span>{profileError}</span>
          </div>
        )}

        <ProfilePersonalDataCard
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          onSave={() => handleSaveProfile()}
          isLoading={isProfileLoading}
        />

        <ProfilePasswordCard
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={handleChangePassword}
          isLoading={isPasswordLoading}
          success={passwordSuccess}
          error={passwordError}
        />
      </div>
    </div>
  )
}
