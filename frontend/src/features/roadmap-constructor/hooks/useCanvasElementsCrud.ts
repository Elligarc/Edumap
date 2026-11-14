import { useCallback, useRef, type Dispatch } from 'react'
import type { Edge, Node } from '@xyflow/react'
import type { CanvasAction } from '../model/canvas-reducer'
import { useCanvasResourcesCrud } from './useCanvasResourcesCrud'

export interface UseCanvasElementsCrudOptions {
  roadmapId: number | string
  dispatch: Dispatch<CanvasAction>
  nodes: Node[]
  edges: Edge[]
  recordAdd?: (kind: 'node' | 'edge', item: Node | Edge) => void
  recordDelete?: (nodes: Node[], edges: Edge[]) => void
  markRecentlyRemoved?: (nodeIds: string[], edgeIds: string[]) => void
  handleSectionResize: (secId: string, params: { width: number; height: number }) => void
}

export function useCanvasElementsCrud({
  dispatch,
  nodes,
  edges,
  recordAdd,
  recordDelete,
  markRecentlyRemoved,
  handleSectionResize,
}: UseCanvasElementsCrudOptions) {
  const resourcesCrud = useCanvasResourcesCrud({ dispatch })
  const nextTempIdRef = useRef<number>(-1)

  const getNextTempId = useCallback(() => {
    const id = nextTempIdRef.current
    nextTempIdRef.current -= 1
    return id
  }, [])

  const addNode = useCallback(
    (pos: { x: number; y: number } = { x: 300, y: 250 }): Node => {
      const tempId = getNextTempId()
      const newNode: Node = {
        id: `node-${tempId}`,
        type: 'constructorNode',
        position: { x: pos.x, y: pos.y },
        data: {
          id: tempId,
          title: 'Новый шаг',
          type: 'DEFAULT',
          required: true,
          positionX: pos.x,
          positionY: pos.y,
          resources: [],
          entityType: 'node',
        },
        zIndex: 2,
      }
      dispatch({ type: 'ADD_NODE', node: newNode })
      recordAdd?.('node', newNode)
      return newNode
    },
    [dispatch, getNextTempId, recordAdd],
  )

  const updateNodeData = useCallback(
    (rawNodeId: string, patch: Record<string, unknown>) => {
      dispatch({ type: 'UPDATE_NODE_DATA', id: rawNodeId, data: patch })
    },
    [dispatch],
  )

  const deleteNode = useCallback(
    async (rawNodeId: string): Promise<void> => {
      const targetNode = nodes.find((n) => n.id === rawNodeId)
      if (!targetNode) return
      const connectedEdges = edges.filter(
        (e) => e.source === rawNodeId || e.target === rawNodeId,
      )
      markRecentlyRemoved?.([rawNodeId], connectedEdges.map((e) => e.id))
      recordDelete?.([targetNode], connectedEdges)
      dispatch({ type: 'DELETE_NODE', id: rawNodeId })
    },
    [nodes, edges, markRecentlyRemoved, recordDelete, dispatch],
  )

  const addSection = useCallback(
    (pos: { x: number; y: number } = { x: 150, y: 150 }): Node => {
      const tempId = getNextTempId()
      const newSec: Node = {
        id: `section-${tempId}`,
        type: 'sectionNode',
        position: { x: pos.x, y: pos.y },
        data: {
          id: tempId,
          title: 'Новая секция',
          positionX: pos.x,
          positionY: pos.y,
          width: 380,
          height: 260,
          entityType: 'section',
          onResize: handleSectionResize,
        },
        style: { width: 380, height: 260 },
        zIndex: 0,
      }
      dispatch({ type: 'ADD_NODE', node: newSec })
      recordAdd?.('node', newSec)
      return newSec
    },
    [dispatch, getNextTempId, handleSectionResize, recordAdd],
  )

  const updateSectionData = useCallback(
    (rawSectionId: string, patch: Record<string, unknown>) => {
      dispatch({ type: 'UPDATE_NODE_DATA', id: rawSectionId, data: patch })
    },
    [dispatch],
  )

  const deleteSection = useCallback(
    async (rawSecId: string): Promise<void> => {
      const targetSec = nodes.find((n) => n.id === rawSecId)
      if (!targetSec) return
      markRecentlyRemoved?.([rawSecId], [])
      recordDelete?.([targetSec], [])
      dispatch({ type: 'DELETE_NODE', id: rawSecId })
    },
    [nodes, markRecentlyRemoved, recordDelete, dispatch],
  )

  const addText = useCallback(
    (pos: { x: number; y: number } = { x: 200, y: 180 }): Node => {
      const tempId = getNextTempId()
      const newTxt: Node = {
        id: `text-${tempId}`,
        type: 'textNode',
        position: { x: pos.x, y: pos.y },
        data: {
          id: tempId,
          content: 'Текстовая заметка',
          positionX: pos.x,
          positionY: pos.y,
          entityType: 'text',
        },
        zIndex: 1,
      }
      dispatch({ type: 'ADD_NODE', node: newTxt })
      recordAdd?.('node', newTxt)
      return newTxt
    },
    [dispatch, getNextTempId, recordAdd],
  )

  const updateTextData = useCallback(
    (rawTextId: string, patch: Record<string, unknown>) => {
      dispatch({ type: 'UPDATE_NODE_DATA', id: rawTextId, data: patch })
    },
    [dispatch],
  )

  const deleteText = useCallback(
    async (rawTextId: string): Promise<void> => {
      const targetText = nodes.find((n) => n.id === rawTextId)
      if (!targetText) return
      markRecentlyRemoved?.([rawTextId], [])
      recordDelete?.([targetText], [])
      dispatch({ type: 'DELETE_NODE', id: rawTextId })
    },
    [nodes, markRecentlyRemoved, recordDelete, dispatch],
  )

  return {
    addNode,
    updateNodeData,
    deleteNode,
    addSection,
    updateSectionData,
    deleteSection,
    addText,
    updateTextData,
    deleteText,
    ...resourcesCrud,
  }
}
