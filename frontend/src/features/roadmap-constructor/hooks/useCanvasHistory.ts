import { useState, useCallback, useRef, type Dispatch } from 'react'
import type { Edge, Node } from '@xyflow/react'
import { nodeApi } from '@/entities/node'
import type { CanvasAction } from '../model/canvas-reducer'

export const MAX_HISTORY_LENGTH = 50

export type CanvasHistoryItem =
  | {
      type: 'ADD_ELEMENT'
      element: { kind: 'node' | 'edge'; item: Node | Edge }
    }
  | {
      type: 'DELETE_ELEMENTS'
      nodes: Node[]
      edges: Edge[]
    }

export interface PendingDeletions {
  nodeIds: Set<number>
  sectionIds: Set<number>
  textIds: Set<number>
}

export function extractEntityInfo(rawId: string): {
  type: 'node' | 'section' | 'text' | 'unknown'
  id: number
} {
  if (rawId.startsWith('node-')) {
    return { type: 'node', id: Number(rawId.replace('node-', '')) }
  }
  if (rawId.startsWith('section-')) {
    return { type: 'section', id: Number(rawId.replace('section-', '')) }
  }
  if (rawId.startsWith('text-')) {
    return { type: 'text', id: Number(rawId.replace('text-', '')) }
  }
  return { type: 'unknown', id: 0 }
}

export interface UseCanvasHistoryOptions {
  dispatch: Dispatch<CanvasAction>
}

export function useCanvasHistory({ dispatch }: UseCanvasHistoryOptions) {
  const [undoStack, setUndoStack] = useState<CanvasHistoryItem[]>([])
  const [redoStack, setRedoStack] = useState<CanvasHistoryItem[]>([])

  const pendingDeletionsRef = useRef<PendingDeletions>({
    nodeIds: new Set<number>(),
    sectionIds: new Set<number>(),
    textIds: new Set<number>(),
  })

  const queueDeletions = useCallback((nodes: Node[]) => {
    nodes.forEach((n) => {
      const info = extractEntityInfo(n.id)
      if (info.id > 0) {
        if (info.type === 'node') pendingDeletionsRef.current.nodeIds.add(info.id)
        else if (info.type === 'section') pendingDeletionsRef.current.sectionIds.add(info.id)
        else if (info.type === 'text') pendingDeletionsRef.current.textIds.add(info.id)
      }
    })
  }, [])

  const unqueueDeletions = useCallback((nodes: Node[]) => {
    nodes.forEach((n) => {
      const info = extractEntityInfo(n.id)
      if (info.id > 0) {
        if (info.type === 'node') pendingDeletionsRef.current.nodeIds.delete(info.id)
        else if (info.type === 'section') pendingDeletionsRef.current.sectionIds.delete(info.id)
        else if (info.type === 'text') pendingDeletionsRef.current.textIds.delete(info.id)
      }
    })
  }, [])

  const recordAdd = useCallback((kind: 'node' | 'edge', item: Node | Edge) => {
    const cleanItem = { ...item, selected: false } as Node | Edge
    setUndoStack((prev) => {
      const next: CanvasHistoryItem[] = [
        ...prev,
        { type: 'ADD_ELEMENT', element: { kind, item: cleanItem } },
      ]
      return next.length > MAX_HISTORY_LENGTH ? next.slice(next.length - MAX_HISTORY_LENGTH) : next
    })
    setRedoStack([])
  }, [])

  const recordDelete = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      if (nodes.length === 0 && edges.length === 0) return

      queueDeletions(nodes)

      const cleanNodes = nodes.map((n) => ({ ...n, selected: false }))
      const cleanEdges = edges.map((e) => ({ ...e, selected: false }))

      setUndoStack((prev) => {
        const next: CanvasHistoryItem[] = [
          ...prev,
          { type: 'DELETE_ELEMENTS', nodes: cleanNodes, edges: cleanEdges },
        ]
        return next.length > MAX_HISTORY_LENGTH ? next.slice(next.length - MAX_HISTORY_LENGTH) : next
      })
      setRedoStack([])
    },
    [queueDeletions],
  )

  const undo = useCallback(() => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo
      const item = prevUndo[prevUndo.length - 1]
      const nextUndo = prevUndo.slice(0, prevUndo.length - 1)

      if (item.type === 'ADD_ELEMENT') {
        const { kind, item: elem } = item.element
        if (kind === 'node') {
          const node = elem as Node
          dispatch({ type: 'REMOVE_ELEMENTS', nodeIds: [node.id], edgeIds: [] })
          queueDeletions([node])
        } else {
          const edge = elem as Edge
          dispatch({ type: 'REMOVE_ELEMENTS', nodeIds: [], edgeIds: [edge.id] })
        }
      } else if (item.type === 'DELETE_ELEMENTS') {
        const unselectedNodes = item.nodes.map((n) => ({ ...n, selected: false }))
        const unselectedEdges = item.edges.map((e) => ({ ...e, selected: false }))
        dispatch({
          type: 'RESTORE_ELEMENTS',
          nodes: unselectedNodes,
          edges: unselectedEdges,
        })
        unqueueDeletions(item.nodes)
      }

      setRedoStack((prevRedo) => [...prevRedo, item])
      return nextUndo
    })
  }, [dispatch, queueDeletions, unqueueDeletions])

  const redo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo
      const item = prevRedo[prevRedo.length - 1]
      const nextRedo = prevRedo.slice(0, prevRedo.length - 1)

      if (item.type === 'ADD_ELEMENT') {
        const { kind, item: elem } = item.element
        if (kind === 'node') {
          const node = { ...(elem as Node), selected: false }
          dispatch({ type: 'RESTORE_ELEMENTS', nodes: [node], edges: [] })
          unqueueDeletions([node])
        } else {
          const edge = { ...(elem as Edge), selected: false }
          dispatch({ type: 'RESTORE_ELEMENTS', nodes: [], edges: [edge] })
        }
      } else if (item.type === 'DELETE_ELEMENTS') {
        const nodeIds = item.nodes.map((n) => n.id)
        const edgeIds = item.edges.map((e) => e.id)
        dispatch({ type: 'REMOVE_ELEMENTS', nodeIds, edgeIds })
        queueDeletions(item.nodes)
      }

      setUndoStack((prevUndo) => [...prevUndo, item])
      return nextRedo
    })
  }, [dispatch, queueDeletions, unqueueDeletions])

  const commitDeletions = useCallback(async (): Promise<void> => {
    const { nodeIds, sectionIds, textIds } = pendingDeletionsRef.current

    const nodePromises = Array.from(nodeIds).map((id) =>
      nodeApi.deleteNode(id).catch((err) => {
        console.error(`Failed to commit deletion for node ${id}:`, err)
      }),
    )
    const sectionPromises = Array.from(sectionIds).map((id) =>
      nodeApi.deleteSection(id).catch((err) => {
        console.error(`Failed to commit deletion for section ${id}:`, err)
      }),
    )
    const textPromises = Array.from(textIds).map((id) =>
      nodeApi.deleteText(id).catch((err) => {
        console.error(`Failed to commit deletion for text ${id}:`, err)
      }),
    )

    await Promise.all([...nodePromises, ...sectionPromises, ...textPromises])

    pendingDeletionsRef.current.nodeIds.clear()
    pendingDeletionsRef.current.sectionIds.clear()
    pendingDeletionsRef.current.textIds.clear()
  }, [])

  const clearHistory = useCallback(() => {
    setUndoStack([])
    setRedoStack([])
  }, [])

  return {
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    recordAdd,
    recordDelete,
    commitDeletions,
    clearHistory,
    pendingDeletionsRef,
  }
}
