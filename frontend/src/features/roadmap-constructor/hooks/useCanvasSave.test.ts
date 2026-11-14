import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCanvasSave } from './useCanvasSave'
import { roadmapApi } from '@/entities/roadmap'
import type { Node, Edge } from '@xyflow/react'
import type { PendingDeletions } from './useCanvasHistory'

vi.mock('@/entities/roadmap', () => ({
  roadmapApi: {
    syncCanvas: vi.fn().mockResolvedValue({}),
  },
}))

describe('useCanvasSave', () => {
  const dispatch = vi.fn()
  const onSaveSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(roadmapApi.syncCanvas).mockResolvedValue({
      roadmapId: 10,
      title: 'Synced Roadmap',
      sections: [],
      texts: [],
      nodes: [],
      edges: [],
    })
  })

  it('sends single batch syncCanvas call with nodes, sections, texts and edges', async () => {
    const nodes: Node[] = [
      {
        id: 'node-10',
        position: { x: 100, y: 150 },
        data: { title: 'Step 1', type: 'START', isRequired: true, content: 'Intro' },
      },
      {
        id: 'node--1',
        position: { x: 200, y: 250 },
        data: {
          title: 'Step 2 (New)',
          type: 'DEFAULT',
          isRequired: false,
          resources: [{ title: 'Doc', url: 'https://doc.com', type: 'WEBSITE' }],
        },
      },
      {
        id: 'section--1',
        position: { x: 50, y: 50 },
        data: { title: 'New Section', width: 400, height: 300 },
      },
      {
        id: 'text--1',
        position: { x: 300, y: 80 },
        data: { content: 'My Note' },
      },
    ]

    const edges: Edge[] = [
      {
        id: 'edge-1',
        source: 'node-10',
        target: 'node--1',
        sourceHandle: 'bottom',
        targetHandle: 'top',
      },
    ]

    const pendingDeletionsRef = {
      current: {
        nodeIds: new Set<number>([99]),
        sectionIds: new Set<number>([88]),
        textIds: new Set<number>([77]),
      } as PendingDeletions,
    }

    const { result } = renderHook(() =>
      useCanvasSave({
        roadmapId: 10,
        nodes,
        edges,
        dispatch,
        pendingDeletionsRef,
        onSaveSuccess,
      }),
    )

    await act(async () => {
      await result.current.saveCanvas()
    })

    expect(roadmapApi.syncCanvas).toHaveBeenCalledTimes(1)
    expect(roadmapApi.syncCanvas).toHaveBeenCalledWith(10, {
      nodes: [
        {
          id: 10,
          title: 'Step 1',
          type: 'START',
          content: 'Intro',
          isRequired: true,
          positionX: 100,
          positionY: 150,
          resources: [],
        },
        {
          id: -1,
          title: 'Step 2 (New)',
          type: 'DEFAULT',
          content: undefined,
          isRequired: false,
          positionX: 200,
          positionY: 250,
          resources: [{ title: 'Doc', url: 'https://doc.com', type: 'WEBSITE' }],
        },
      ],
      sections: [
        {
          id: -1,
          title: 'New Section',
          positionX: 50,
          positionY: 50,
          width: 400,
          height: 300,
        },
      ],
      texts: [
        {
          id: -1,
          content: 'My Note',
          positionX: 300,
          positionY: 80,
        },
      ],
      edges: [
        {
          sourceNodeId: 10,
          targetNodeId: -1,
          sourceHandle: 'bottom',
          targetHandle: 'top',
        },
      ],
      deletedNodeIds: [99],
      deletedSectionIds: [88],
      deletedTextIds: [77],
    })

    expect(pendingDeletionsRef.current.nodeIds.size).toBe(0)
    expect(pendingDeletionsRef.current.sectionIds.size).toBe(0)
    expect(pendingDeletionsRef.current.textIds.size).toBe(0)

    expect(dispatch).toHaveBeenCalledWith({ type: 'MARK_SAVED' })
    expect(onSaveSuccess).toHaveBeenCalledTimes(1)
    expect(onSaveSuccess).toHaveBeenCalledWith(expect.objectContaining({
      roadmapId: 10,
      title: 'Synced Roadmap',
    }))
    expect(result.current.lastSaved).not.toBeNull()
  })

  it('keeps pendingDeletions and does not mark saved if syncCanvas fails', async () => {
    vi.mocked(roadmapApi.syncCanvas).mockRejectedValueOnce(new Error('Network error'))

    const pendingDeletionsRef = {
      current: {
        nodeIds: new Set<number>([42]),
        sectionIds: new Set<number>(),
        textIds: new Set<number>(),
      } as PendingDeletions,
    }

    const { result } = renderHook(() =>
      useCanvasSave({
        roadmapId: 10,
        nodes: [],
        edges: [],
        dispatch,
        pendingDeletionsRef,
      }),
    )

    await expect(
      act(async () => {
        await result.current.saveCanvas()
      }),
    ).rejects.toThrow('Network error')

    expect(pendingDeletionsRef.current.nodeIds.has(42)).toBe(true)
    expect(dispatch).not.toHaveBeenCalledWith({ type: 'MARK_SAVED' })
  })
})
