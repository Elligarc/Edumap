import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { DragEvent } from 'react'
import { useCanvasDrop } from './useCanvasDrop'

const mockScreenToFlowPosition = vi.fn()

vi.mock('@xyflow/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@xyflow/react')>()
  return {
    ...actual,
    useReactFlow: () => ({
      screenToFlowPosition: mockScreenToFlowPosition,
    }),
  }
})

describe('useCanvasDrop', () => {
  const createDragEvent = (type?: string, clientX = 400, clientY = 300) => {
    const preventDefault = vi.fn()
    const getData = vi.fn().mockReturnValue(type || '')
    const dataTransfer = {
      getData,
      dropEffect: '',
    }

    return {
      event: {
        preventDefault,
        clientX,
        clientY,
        dataTransfer,
      } as unknown as DragEvent,
      preventDefault,
      dataTransfer,
      getData,
    }
  }

  it('onDragOver вызывает preventDefault и выставляет dropEffect в move', () => {
    const { result } = renderHook(() =>
      useCanvasDrop({
        addNode: vi.fn(),
        addSection: vi.fn(),
        addText: vi.fn(),
      }),
    )

    const { event, preventDefault, dataTransfer } = createDragEvent()
    result.current.onDragOver(event)

    expect(preventDefault).toHaveBeenCalledTimes(1)
    expect(dataTransfer.dropEffect).toBe('move')
  })

  it('onDrop игнорирует события без валидного типа в dataTransfer', () => {
    const addNode = vi.fn()
    const { result } = renderHook(() =>
      useCanvasDrop({
        addNode,
        addSection: vi.fn(),
        addText: vi.fn(),
      }),
    )

    const { event } = createDragEvent('')
    result.current.onDrop(event)

    expect(mockScreenToFlowPosition).not.toHaveBeenCalled()
    expect(addNode).not.toHaveBeenCalled()
  })

  it('onDrop для node центрирует элемент со смещением 100/40 и вызывает addNode', () => {
    const addNode = vi.fn()
    mockScreenToFlowPosition.mockReturnValue({ x: 500, y: 350 })

    const { result } = renderHook(() =>
      useCanvasDrop({
        addNode,
        addSection: vi.fn(),
        addText: vi.fn(),
      }),
    )

    const { event, preventDefault } = createDragEvent('node', 400, 300)
    result.current.onDrop(event)

    expect(preventDefault).toHaveBeenCalledTimes(1)
    expect(mockScreenToFlowPosition).toHaveBeenCalledWith({ x: 400, y: 300 })
    expect(addNode).toHaveBeenCalledWith({ x: 400, y: 310 }) // 500 - 100 = 400, 350 - 40 = 310
  })

  it('onDrop для section центрирует элемент со смещением 190/130 и вызывает addSection', () => {
    const addSection = vi.fn()
    mockScreenToFlowPosition.mockReturnValue({ x: 500, y: 350 })

    const { result } = renderHook(() =>
      useCanvasDrop({
        addNode: vi.fn(),
        addSection,
        addText: vi.fn(),
      }),
    )

    const { event } = createDragEvent('section', 400, 300)
    result.current.onDrop(event)

    expect(mockScreenToFlowPosition).toHaveBeenCalledWith({ x: 400, y: 300 })
    expect(addSection).toHaveBeenCalledWith({ x: 310, y: 220 }) // 500 - 190 = 310, 350 - 130 = 220
  })

  it('onDrop для text центрирует элемент со смещением 75/20 и вызывает addText', () => {
    const addText = vi.fn()
    mockScreenToFlowPosition.mockReturnValue({ x: 500, y: 350 })

    const { result } = renderHook(() =>
      useCanvasDrop({
        addNode: vi.fn(),
        addSection: vi.fn(),
        addText,
      }),
    )

    const { event } = createDragEvent('text', 400, 300)
    result.current.onDrop(event)

    expect(mockScreenToFlowPosition).toHaveBeenCalledWith({ x: 400, y: 300 })
    expect(addText).toHaveBeenCalledWith({ x: 425, y: 330 }) // 500 - 75 = 425, 350 - 20 = 330
  })
})
