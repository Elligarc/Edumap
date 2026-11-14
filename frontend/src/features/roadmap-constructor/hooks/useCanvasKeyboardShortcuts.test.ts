import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCanvasKeyboardShortcuts } from './useCanvasKeyboardShortcuts'

describe('useCanvasKeyboardShortcuts', () => {
  const undo = vi.fn()
  const redo = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('triggers undo on Ctrl+Z', () => {
    renderHook(() => useCanvasKeyboardShortcuts({ undo, redo }))

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)

    expect(undo).toHaveBeenCalledTimes(1)
    expect(redo).not.toHaveBeenCalled()
  })

  it('triggers undo on Cmd+Z (Mac)', () => {
    renderHook(() => useCanvasKeyboardShortcuts({ undo, redo }))

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      metaKey: true,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)

    expect(undo).toHaveBeenCalledTimes(1)
    expect(redo).not.toHaveBeenCalled()
  })

  it('triggers redo on Ctrl+Shift+Z', () => {
    renderHook(() => useCanvasKeyboardShortcuts({ undo, redo }))

    const event = new KeyboardEvent('keydown', {
      key: 'Z',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)

    expect(redo).toHaveBeenCalledTimes(1)
    expect(undo).not.toHaveBeenCalled()
  })

  it('triggers redo on Cmd+Shift+Z (Mac)', () => {
    renderHook(() => useCanvasKeyboardShortcuts({ undo, redo }))

    const event = new KeyboardEvent('keydown', {
      key: 'Z',
      metaKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)

    expect(redo).toHaveBeenCalledTimes(1)
    expect(undo).not.toHaveBeenCalled()
  })

  it('triggers undo on Russian layout (Ctrl+Я / KeyZ)', () => {
    renderHook(() => useCanvasKeyboardShortcuts({ undo, redo }))

    const event = new KeyboardEvent('keydown', {
      key: 'я',
      code: 'KeyZ',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)

    expect(undo).toHaveBeenCalledTimes(1)
    expect(redo).not.toHaveBeenCalled()
  })

  it('triggers redo on Russian layout (Ctrl+Shift+Я / KeyZ)', () => {
    renderHook(() => useCanvasKeyboardShortcuts({ undo, redo }))

    const event = new KeyboardEvent('keydown', {
      key: 'Я',
      code: 'KeyZ',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)

    expect(redo).toHaveBeenCalledTimes(1)
    expect(undo).not.toHaveBeenCalled()
  })

  it('does NOT trigger on Ctrl+Y (per user requirement)', () => {
    renderHook(() => useCanvasKeyboardShortcuts({ undo, redo }))

    const event = new KeyboardEvent('keydown', {
      key: 'y',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)

    expect(undo).not.toHaveBeenCalled()
    expect(redo).not.toHaveBeenCalled()
  })

  it('ignores shortcuts when target is an INPUT', () => {
    renderHook(() => useCanvasKeyboardShortcuts({ undo, redo }))

    const input = document.createElement('input')
    document.body.appendChild(input)

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(event, 'target', { value: input })
    window.dispatchEvent(event)

    expect(undo).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })

  it('ignores shortcuts when target is a TEXTAREA', () => {
    renderHook(() => useCanvasKeyboardShortcuts({ undo, redo }))

    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(event, 'target', { value: textarea })
    window.dispatchEvent(event)

    expect(undo).not.toHaveBeenCalled()
    document.body.removeChild(textarea)
  })

  it('does nothing when enabled is false', () => {
    renderHook(() => useCanvasKeyboardShortcuts({ undo, redo, enabled: false }))

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)

    expect(undo).not.toHaveBeenCalled()
    expect(redo).not.toHaveBeenCalled()
  })
})
