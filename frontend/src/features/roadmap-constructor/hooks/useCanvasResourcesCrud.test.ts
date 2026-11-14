import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { Node } from '@xyflow/react'
import { useCanvasResourcesCrud } from './useCanvasResourcesCrud'
import type { CanvasAction } from '../model/canvas-reducer'

describe('useCanvasResourcesCrud', () => {
  it('addResource добавляет ресурс в черновик узла без сетевых запросов', () => {
    let capturedAction: CanvasAction | null = null
    const dispatch = vi.fn((action: CanvasAction) => {
      capturedAction = action
    })

    const { result } = renderHook(() => useCanvasResourcesCrud({ dispatch }))

    act(() => {
      result.current.addResource('node-10', {
        title: 'Learn React',
        url: 'https://react.dev',
        type: 'DOCS',
      })
    })

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(capturedAction).not.toBeNull()
    if (capturedAction && (capturedAction as { type: string }).type === 'SET_NODES') {
      const setNodesAction = capturedAction as {
        type: 'SET_NODES'
        nodes: (prev: Node[]) => Node[]
      }
      const initialNodes: Node[] = [
        {
          id: 'node-10',
          position: { x: 0, y: 0 },
          data: { resources: [] },
        },
      ]
      const updatedNodes = setNodesAction.nodes(initialNodes)
      expect(updatedNodes[0].data.resources).toHaveLength(1)
      const added = (updatedNodes[0].data.resources as Array<{ title: string; url: string }>)[0]
      expect(added.title).toBe('Learn React')
      expect(added.url).toBe('https://react.dev')
    }
  })

  it('deleteResource удаляет ресурс по ID или индексу локально', () => {
    let capturedAction: CanvasAction | null = null
    const dispatch = vi.fn((action: CanvasAction) => {
      capturedAction = action
    })

    const { result } = renderHook(() => useCanvasResourcesCrud({ dispatch }))

    act(() => {
      result.current.deleteResource('node-10', 42)
    })

    expect(dispatch).toHaveBeenCalledTimes(1)
    if (capturedAction && (capturedAction as { type: string }).type === 'SET_NODES') {
      const setNodesAction = capturedAction as {
        type: 'SET_NODES'
        nodes: (prev: Node[]) => Node[]
      }
      const initialNodes: Node[] = [
        {
          id: 'node-10',
          position: { x: 0, y: 0 },
          data: {
            resources: [
              { id: 42, title: 'To Delete', url: 'https://delete.me', type: 'ARTICLE' },
              { id: 99, title: 'To Keep', url: 'https://keep.me', type: 'DOCS' },
            ],
          },
        },
      ]
      const updatedNodes = setNodesAction.nodes(initialNodes)
      expect(updatedNodes[0].data.resources).toHaveLength(1)
      const remaining = (updatedNodes[0].data.resources as Array<{ id: number }>)[0]
      expect(remaining.id).toBe(99)
    }
  })

  it('deleteResource корректно удаляет ресурс без ID по индексу', () => {
    let capturedAction: CanvasAction | null = null
    const dispatch = vi.fn((action: CanvasAction) => {
      capturedAction = action
    })

    const { result } = renderHook(() => useCanvasResourcesCrud({ dispatch }))

    act(() => {
      result.current.deleteResource('node-10', undefined, 0)
    })

    if (capturedAction && (capturedAction as { type: string }).type === 'SET_NODES') {
      const setNodesAction = capturedAction as {
        type: 'SET_NODES'
        nodes: (prev: Node[]) => Node[]
      }
      const initialNodes: Node[] = [
        {
          id: 'node-10',
          position: { x: 0, y: 0 },
          data: {
            resources: [
              { title: 'First (no id)', url: 'https://first.com', type: 'ARTICLE' },
              { title: 'Second (no id)', url: 'https://second.com', type: 'DOCS' },
            ],
          },
        },
      ]
      const updatedNodes = setNodesAction.nodes(initialNodes)
      expect(updatedNodes[0].data.resources).toHaveLength(1)
      const remaining = (updatedNodes[0].data.resources as Array<{ title: string }>)[0]
      expect(remaining.title).toBe('Second (no id)')
    }
  })
})
