import { ArrowLeft, Settings, Save, Check, Undo2, Redo2 } from 'lucide-react'
import { Badge } from '@/shared/ui'
import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import { useNavigateBack } from '@/shared/hooks/useNavigateBack'
import { useConstructorContext } from '../model/ConstructorContext'
import { useConstructorTopBar } from './useConstructorTopBar'
import './ConstructorTopBar.css'

export type ConstructorMode = 'editor' | 'preview'

export function ConstructorTopBar() {
  const handleBack = useNavigateBack('/profile/roadmaps')
  const {
    roadmap,
    mode,
    setMode,
    setIsSettingsOpen,
    saveCanvas,
    isSaving,
    lastSaved,
    isDirty,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useConstructorContext()

  const { saveStatusText } = useConstructorTopBar({ lastSaved, isSaving, isDirty })

  return (
    <header className="constructor-topbar">
      <div className="constructor-topbar-left">
        <button
          type="button"
          onClick={handleBack}
          className="constructor-topbar-back-btn"
          title="Назад"
          aria-label="Назад"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="constructor-topbar-divider" />

        <div className="constructor-topbar-title-box">
          <div className="constructor-topbar-title-row">
            <h1 className="constructor-topbar-title">
              {roadmap?.title || 'Без названия'}
            </h1>
            <Badge
              variant={roadmap?.visibility === 'PUBLISHED' ? 'success' : 'default'}
              className="cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsSettingsOpen(true)}
              title="Нажмите, чтобы изменить статус"
            >
              {roadmap?.visibility === 'PUBLISHED' ? 'Публичный' : 'Приватный'}
            </Badge>
          </div>
          <span className="constructor-topbar-status">
            {saveStatusText}
          </span>
        </div>
      </div>

      <div className="constructor-topbar-right">
        {mode === 'editor' && (
          <div className="constructor-topbar-history">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="constructor-topbar-icon-btn"
              title="Отменить (Ctrl+Z)"
              aria-label="Отменить (Ctrl+Z)"
            >
              <Undo2 size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="constructor-topbar-icon-btn"
              title="Повторить (Ctrl+Shift+Z)"
              aria-label="Повторить (Ctrl+Shift+Z)"
            >
              <Redo2 size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="constructor-mode-toggle">
          <button
            type="button"
            onClick={() => setMode('editor')}
            className={cn(
              'constructor-mode-btn',
              mode === 'editor'
                ? 'constructor-mode-btn--active'
                : 'constructor-mode-btn--inactive',
            )}
          >
            Редактор
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={cn(
              'constructor-mode-btn',
              mode === 'preview'
                ? 'constructor-mode-btn--active'
                : 'constructor-mode-btn--inactive',
            )}
          >
            Предпросмотр
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          className="text-(--color-text-muted)"
        >
          <Settings size={15} />
          Настройки
        </Button>

        <Button
          variant={isDirty ? 'primary' : 'outline'}
          size="sm"
          onClick={saveCanvas}
          disabled={isSaving}
        >
          {isSaving ? (
            'Сохранение...'
          ) : !isDirty ? (
            <>
              <Check size={15} className="text-(--color-success)" />
              Сохранено
            </>
          ) : (
            <>
              <Save size={15} />
              Сохранить
            </>
          )}
        </Button>
      </div>
    </header>
  )
}
