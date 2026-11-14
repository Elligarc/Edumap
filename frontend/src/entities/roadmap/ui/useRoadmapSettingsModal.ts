import { useState, type FormEvent } from 'react'
import type { RoadmapResponse, RoadmapVisibility } from '@/shared/types/api'
import type { SelectOption } from '@/shared/ui'

export const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'Разработка', label: 'Разработка' },
  { value: 'Дизайн', label: 'Дизайн' },
  { value: 'Маркетинг', label: 'Маркетинг' },
  { value: 'Бизнес', label: 'Бизнес' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Soft Skills', label: 'Soft Skills' },
]

export const VISIBILITY_OPTIONS: SelectOption[] = [
  { value: 'PUBLISHED', label: 'Публичный' },
  { value: 'PRIVATE', label: 'Приватный' },
]

export interface RoadmapFormData {
  title: string
  description: string
  category: string
  price: number
  visibility: RoadmapVisibility
}

export interface UseRoadmapSettingsFormProps {
  initialData?: Partial<RoadmapResponse> | null
  onSubmit: (data: RoadmapFormData) => Promise<unknown> | void
  onClose?: () => void
  isCreating?: boolean
}

export function useRoadmapSettingsForm({
  initialData,
  onSubmit,
  onClose,
  isCreating = false,
}: UseRoadmapSettingsFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [category, setCategory] = useState(initialData?.category || 'Разработка')
  const [isPaid, setIsPaid] = useState(Boolean(initialData?.price && initialData.price > 0))
  const [visibility, setVisibility] = useState<RoadmapVisibility>(
    isCreating ? 'PRIVATE' : (initialData?.visibility as RoadmapVisibility) || 'PRIVATE',
  )
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/roadmaps/${initialData?.id || 'new'}`
      : ''

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        price: isPaid
          ? Math.round(initialData?.price && initialData.price > 0 ? initialData.price : 990)
          : 0,
        visibility: isCreating ? 'PRIVATE' : visibility,
      })
      onClose?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}
