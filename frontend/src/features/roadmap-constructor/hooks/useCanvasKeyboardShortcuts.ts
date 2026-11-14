import { useEffect } from 'react'

export interface UseCanvasKeyboardShortcutsOptions {
  undo: () => void
  redo: () => void
  enabled?: boolean
}

export function useCanvasKeyboardShortcuts({
  undo,
  redo,
  enabled = true,
}: UseCanvasKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return

      const target = event.target as HTMLElement | null
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if (isInput) {
        return
      }

      const isModifier = event.ctrlKey || event.metaKey
      if (!isModifier || event.altKey) {
        return
      }

      const key = event.key.toLowerCase()
      const isZKey = event.code === 'KeyZ' || key === 'z' || key === 'я'

      if (isZKey && event.shiftKey) {
        event.preventDefault()
        redo()
        return
      }

      if (isZKey && !event.shiftKey) {
        event.preventDefault()
        undo()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [undo, redo, enabled])
}
