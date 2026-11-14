import { Copy, Check } from 'lucide-react'
import { Modal } from '@/shared/ui'
import { Input } from '@/shared/ui'
import { Textarea } from '@/shared/ui'
import { Select } from '@/shared/ui'
import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import type { RoadmapResponse, RoadmapVisibility } from '@/shared/types/api'
import {
  CATEGORY_OPTIONS,
  VISIBILITY_OPTIONS,
  useRoadmapSettingsForm,
  type RoadmapFormData,
  type UseRoadmapSettingsFormProps,
} from './useRoadmapSettingsModal'
import './RoadmapSettingsModal.css'

export interface RoadmapSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Partial<RoadmapResponse> | null
  onSubmit: (data: RoadmapFormData) => Promise<unknown> | void
  isCreating?: boolean
}

export function RoadmapSettingsModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isCreating = false,
}: RoadmapSettingsModalProps) {
  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCreating ? 'Новая дорожная карта' : 'Настройки дорожной карты'}
    >
      <RoadmapSettingsForm
        key={initialData?.id || 'new'}
        initialData={initialData}
        onSubmit={onSubmit}
        onClose={onClose}
        isCreating={isCreating}
      />
    </Modal>
  )
}

function RoadmapSettingsForm({ initialData, onSubmit, onClose, isCreating }: UseRoadmapSettingsFormProps) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    isPaid,
    setIsPaid,
    visibility,
    setVisibility,
    copied,
    isSubmitting,
    shareUrl,
    handleCopyLink,
    handleSubmit,
  } = useRoadmapSettingsForm({ initialData, onSubmit, onClose, isCreating })

  return (
    <form onSubmit={handleSubmit} className="roadmap-settings-form">
      <Input
        label="Название"
        placeholder="Например: Frontend Developer 2026"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Textarea
        label="Описание"
        placeholder="Кратко опишите цели и содержание дорожной карты"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <Select
        label="Категория"
        options={CATEGORY_OPTIONS}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <div className="roadmap-settings-section">
        <div className="roadmap-settings-pricing-header">
          <span className="roadmap-settings-pricing-title">Стоимость карты</span>
          <div className="roadmap-settings-pricing-toggle">
            <button
              type="button"
              onClick={() => setIsPaid(false)}
              className={cn(
                'roadmap-settings-pricing-btn',
                !isPaid ? 'roadmap-settings-pricing-btn--active' : 'roadmap-settings-pricing-btn--inactive',
              )}
            >
              Бесплатно
            </button>
            <button
              type="button"
              onClick={() => setIsPaid(true)}
              className={cn(
                'roadmap-settings-pricing-btn',
                isPaid ? 'roadmap-settings-pricing-btn--active' : 'roadmap-settings-pricing-btn--inactive',
              )}
            >
              Платно
            </button>
          </div>
        </div>
        <span className="roadmap-settings-caption">
          {isPaid
            ? 'Платные карты доступны пользователям после покупки'
            : 'Бесплатные карты видны всем в каталоге при условии публичного доступа'}
        </span>
      </div>

      {!isCreating && (
        <div className="roadmap-settings-section">
          <Select
            label="Доступ"
            options={VISIBILITY_OPTIONS}
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as RoadmapVisibility)}
          />

          {visibility === 'PRIVATE' && (
            <div className="roadmap-settings-share-row">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="roadmap-settings-share-input"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? <Check size={14} className="text-[#059669]" /> : <Copy size={14} />}
                {copied ? 'Скопировано' : 'Копировать'}
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="roadmap-settings-submit-box">
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !title.trim()}
        >
          {isCreating ? 'Создать' : 'Сохранить'}
        </Button>
      </div>
    </form>
  )
}
