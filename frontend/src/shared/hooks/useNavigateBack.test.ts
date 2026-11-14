import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useNavigateBack } from './useNavigateBack'

const mockNavigate = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

describe('useNavigateBack', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('навигирует назад, если история браузера не пуста', () => {
    Object.defineProperty(window, 'history', {
      value: { length: 3 },
      writable: true,
    })

    const { result } = renderHook(() => useNavigateBack('/fallback'))
    act(() => {
      result.current()
    })

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('навигирует на fallbackPath, если истории нет', () => {
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
      writable: true,
    })

    const { result } = renderHook(() => useNavigateBack('/my-fallback'))
    act(() => {
      result.current()
    })

    expect(mockNavigate).toHaveBeenCalledWith('/my-fallback')
  })
})
