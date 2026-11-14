export interface UseConstructorTopBarOptions {
  lastSaved?: Date | null
  isSaving: boolean
  isDirty: boolean
}

export function useConstructorTopBar({ lastSaved, isSaving, isDirty }: UseConstructorTopBarOptions) {
  const formatLastSaved = (): string => {
    if (!lastSaved) return ''
    return 'Сохранено только что'
  }

  const saveStatusText = isSaving
    ? 'Сохранение...'
    : isDirty
      ? 'Есть несохраненные изменения'
      : formatLastSaved()

  return {
    saveStatusText,
  }
}
