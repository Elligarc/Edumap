import { useReducer, useCallback, useEffect, useRef } from 'react'
import type { Edge, Node } from '@xyflow/react'
import type { RoadmapCanvasResponse } from '@/shared/types/api'
import { canvasReducer, initialCanvasState } from '../model/canvas-reducer'
import { transformCanvasToElements } from '@/entities/roadmap'
import { useCanvasElementsCrud } from './useCanvasElementsCrud'
import { useCanvasFlowSync } from './useCanvasFlowSync'
import { useCanvasSave } from './useCanvasSave'
import { useCanvasHistory } from './useCanvasHistory'

export function useConstructorCanvas(
  roadmapId: number | string,
  canvasData?: RoadmapCanvasResponse | null,
  onSaveSuccess?: (savedCanvas?: RoadmapCanvasResponse) => Promise<unknown> | unknown,
) {
  const [state, dispatch] = useReducer(canvasReducer, initialCanvasState)
  const canvasDataRef = useRef<RoadmapCanvasResponse | null>(null)

  const history = useCanvasHistory({ dispatch })

  const recentlyRemovedIdsRef = useRef<{
    nodeIds: Set<string>
    edgeIds: Set<string>
  }>({
    nodeIds: new Set(),
    edgeIds: new Set(),
  })

  const markRecentlyRemoved = useCallback((nodeIds: string[], edgeIds: string[]) => {
    nodeIds.forEach((id) => recentlyRemovedIdsRef.current.nodeIds.add(id))
    edgeIds.forEach((id) => recentlyRemovedIdsRef.current.edgeIds.add(id))

    setTimeout(() => {
      nodeIds.forEach((id) => recentlyRemovedIdsRef.current.nodeIds.delete(id))
      edgeIds.forEach((id) => recentlyRemovedIdsRef.current.edgeIds.delete(id))
    }, 400)
  }, [])

  const handleSectionResize = useCallback(
    (secId: string, params: { width: number; height: number }) => {
      dispatch({
        type: 'RESIZE_SECTION',
        secId,
        width: Math.round(params.width),
        height: Math.round(params.height),
      })
    },
    [],
  )

  const {
    isSaving,
    lastSaved,
    setLastSaved,
    saveCanvas,
  } = useCanvasSave({
    roadmapId,
    nodes: state.nodes,
    edges: state.edges,
    dispatch,
    pendingDeletionsRef: history.pendingDeletionsRef,
    commitDeletions: history.commitDeletions,
    onSaveSuccess,
  })

  useEffect(() => {
    if (canvasData && canvasData !== canvasDataRef.current) {
      canvasDataRef.current = canvasData
      const { nodes, edges } = transformCanvasToElements(canvasData, {
        onSectionResize: handleSectionResize,
      })
      dispatch({ type: 'SET_ELEMENTS', nodes, edges })
      history.clearHistory()
      setLastSaved(new Date())
    }
  }, [canvasData, handleSectionResize, history, setLastSaved])

  const flowSync = useCanvasFlowSync({
    nodes: state.nodes,
    edges: state.edges,
    dispatch,
    recordAdd: history.recordAdd,
    recordDelete: history.recordDelete,
    markRecentlyRemoved,
    recentlyRemovedIdsRef,
  })

  const crud = useCanvasElementsCrud({
    roadmapId,
    dispatch,
    nodes: state.nodes,
    edges: state.edges,
    recordAdd: history.recordAdd,
    recordDelete: history.recordDelete,
    markRecentlyRemoved,
    handleSectionResize,
  })

  const setSelectedElement = useCallback((element: Node | Edge | null) => {
    dispatch({ type: 'SET_SELECTED_ELEMENT', element })
  }, [])

  return {
    nodes: state.nodes,
    edges: state.edges,
    selectedElement: state.selectedElement,
    setSelectedElement,
    isSaving,
    lastSaved,
    isDirty: state.isDirty,
    saveCanvas,
    undo: history.undo,
    redo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    ...flowSync,
    ...crud,
  }
}
