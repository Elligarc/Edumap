import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCanvasHistory, extractEntityInfo } from './useCanvasHistory'
import { nodeApi } from '@/entities/node'
import type { Node, Edge } from '@xyflow/react'

vi.mock('@/entities/node', () => ({
  nodeApi: {
    deleteNode: vi.fn().mockResolvedValue(undefined),
    deleteSection: vi.fn().mockResolvedValue(undefined),
    deleteText: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('useCanvasHistory', () => {
  const dispatch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('extractEntityInfo correctly parses IDs', () => {
    expect(extractEntityInfo('node-123')).toEqual({ type: 'node', id: 123 })
    expect(extractEntityInfo('section-456')).toEqual({ type: 'section', id: 456 })
    expect(extractEntityInfo('text-789')).toEqual({ type: 'text', id: 789 })
    expect(extractEntityInfo('custom-001')).toEqual({ type: 'unknown', id: 0 })
  })

  it('starts with empty stacks and cannot undo or redo', () => {
    const { result } = renderHook(() => useCanvasHistory({ dispatch }))
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  it('records addition of a node and allows undo and redo', () => {
    const { result } = renderHook(() => useCanvasHistory({ dispatch }))

    const mockNode: Node = {
      id: 'node-1',
      position: { x: 10, y: 20 },
      data: { title: 'Test' },
    }

    act(() => {
      result.current.recordAdd('node', mockNode)
    })

    expect(result.current.canUndo).toBe(true)
    expect(result.current.canRedo).toBe(false)

    act(() => {
      result.current.undo()
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE_ELEMENTS',
      nodeIds: ['node-1'],
      edgeIds: [],
    })
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(true)
    expect(result.current.pendingDeletionsRef.current.nodeIds.has(1)).toBe(true)

    act(() => {
      result.current.redo()
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'RESTORE_ELEMENTS',
      nodes: [{ ...mockNode, selected: false }],
      edges: [],
    })
    expect(result.current.canUndo).toBe(true)
    expect(result.current.canRedo).toBe(false)
    expect(result.current.pendingDeletionsRef.current.nodeIds.has(1)).toBe(false)
  })

  it('records deletion of elements and allows undo and redo', () => {
    const { result } = renderHook(() => useCanvasHistory({ dispatch }))

    const mockNode: Node = {
      id: 'node-2',
      position: { x: 50, y: 50 },
      data: {},
      selected: true,
    }
    const mockEdge: Edge = {
      id: 'edge-1-2',
      source: 'node-1',
      target: 'node-2',
      selected: true,
    }

    act(() => {
      result.current.recordDelete([mockNode], [mockEdge])
    })

    expect(result.current.canUndo).toBe(true)
    expect(result.current.pendingDeletionsRef.current.nodeIds.has(2)).toBe(true)

    act(() => {
      result.current.undo()
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'RESTORE_ELEMENTS',
      nodes: [{ ...mockNode, selected: false }],
      edges: [{ ...mockEdge, selected: false }],
    })
    expect(result.current.pendingDeletionsRef.current.nodeIds.has(2)).toBe(false)
    expect(result.current.canRedo).toBe(true)

    act(() => {
      result.current.redo()
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE_ELEMENTS',
      nodeIds: ['node-2'],
      edgeIds: ['edge-1-2'],
    })
    expect(result.current.pendingDeletionsRef.current.nodeIds.has(2)).toBe(true)
  })

  it('commitDeletions calls nodeApi for all queued deletions and clears them', async () => {
    const { result } = renderHook(() => useCanvasHistory({ dispatch }))

    const node1: Node = { id: 'node-10', position: { x: 0, y: 0 }, data: {} }
    const sec1: Node = { id: 'section-20', position: { x: 0, y: 0 }, data: {} }
    const txt1: Node = { id: 'text-30', position: { x: 0, y: 0 }, data: {} }

    act(() => {
      result.current.recordDelete([node1, sec1, txt1], [])
    })

    await act(async () => {
      await result.current.commitDeletions()
    })

    expect(nodeApi.deleteNode).toHaveBeenCalledWith(10)
    expect(nodeApi.deleteSection).toHaveBeenCalledWith(20)
    expect(nodeApi.deleteText).toHaveBeenCalledWith(30)

    expect(result.current.pendingDeletionsRef.current.nodeIds.size).toBe(0)
    expect(result.current.pendingDeletionsRef.current.sectionIds.size).toBe(0)
    expect(result.current.pendingDeletionsRef.current.textIds.size).toBe(0)
  })

  it('clearHistory resets undo and redo stacks', () => {
    const { result } = renderHook(() => useCanvasHistory({ dispatch }))

    act(() => {
      result.current.recordAdd('edge', { id: 'e1', source: 'a', target: 'b' })
    })
    expect(result.current.canUndo).toBe(true)

    act(() => {
      result.current.clearHistory()
    })
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })
})
