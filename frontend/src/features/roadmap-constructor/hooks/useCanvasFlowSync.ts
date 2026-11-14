import { useCallback, type Dispatch, type MutableRefObject } from 'react'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from '@xyflow/react'
import { isValidConnection } from '../model/canvas-connections'
import { DEFAULT_EDGE_MARKER } from '@/entities/roadmap'
import type { CanvasAction } from '../model/canvas-reducer'

export interface UseCanvasFlowSyncOptions {
  nodes: Node[]
  edges: Edge[]
  dispatch: Dispatch<CanvasAction>
  recordAdd?: (kind: 'node' | 'edge', item: Node | Edge) => void
  recordDelete?: (nodes: Node[], edges: Edge[]) => void
  markRecentlyRemoved?: (nodeIds: string[], edgeIds: string[]) => void
  recentlyRemovedIdsRef?: MutableRefObject<{ nodeIds: Set<string>; edgeIds: Set<string> }>
}

export function useCanvasFlowSync({
  nodes,
  edges,
  dispatch,
  recordAdd,
  recordDelete,
  markRecentlyRemoved,
  recentlyRemovedIdsRef,
}: UseCanvasFlowSyncOptions) {
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const removedChanges = changes.filter((c) => c.type === 'remove')
      if (removedChanges.length > 0) {
        const removedIds = new Set(removedChanges.map((c) => (c as { id: string }).id))
        const removedNodes = nodes.filter((n) => removedIds.has(n.id))
        if (removedNodes.length > 0) {
          const connectedEdges = edges.filter(
            (e) => removedIds.has(e.source) || removedIds.has(e.target),
          )
          markRecentlyRemoved?.(
            removedNodes.map((n) => n.id),
            connectedEdges.map((e) => e.id),
          )
          recordDelete?.(removedNodes, connectedEdges)
        }
      }

      dispatch({
        type: 'SET_NODES',
        nodes: (nds) => applyNodeChanges(changes, nds),
      })
    },
    [nodes, edges, markRecentlyRemoved, recordDelete, dispatch],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const removedChanges = changes.filter((c) => c.type === 'remove')
      if (removedChanges.length > 0) {
        const removedEdgeIds = new Set(removedChanges.map((c) => (c as { id: string }).id))
        const removedInfo = recentlyRemovedIdsRef?.current
        const standaloneEdges = edges.filter((e) => {
          if (!removedEdgeIds.has(e.id)) return false
          if (removedInfo?.edgeIds.has(e.id)) return false
          if (removedInfo?.nodeIds.has(e.source) || removedInfo?.nodeIds.has(e.target)) {
            return false
          }
          const sourceNode = nodes.find((n) => n.id === e.source)
          const targetNode = nodes.find((n) => n.id === e.target)
          if (!sourceNode || !targetNode) return false
          if (sourceNode.selected || targetNode.selected) return false
          return true
        })

        if (standaloneEdges.length > 0) {
          markRecentlyRemoved?.([], standaloneEdges.map((e) => e.id))
          recordDelete?.([], standaloneEdges)
        }
      }

      dispatch({
        type: 'SET_EDGES',
        edges: (eds) => applyEdgeChanges(changes, eds),
      })
    },
    [edges, nodes, recentlyRemovedIdsRef, markRecentlyRemoved, recordDelete, dispatch],
  )

  const checkValidConnection = useCallback(
    (connection: Connection | Edge) => isValidConnection(connection, edges),
    [edges],
  )

  const onConnect = useCallback(
    (params: Connection) => {
      if (!isValidConnection(params, edges)) {
        return
      }

      const sourceHandle = params.sourceHandle || 'bottom'
      const targetHandle = params.targetHandle || 'top'

      const newEdge: Edge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        sourceHandle,
        targetHandle,
        type: 'customEdge',
        zIndex: 1,
        markerEnd: DEFAULT_EDGE_MARKER,
      }

      dispatch({
        type: 'SET_EDGES',
        edges: (eds) => addEdge(newEdge, eds),
      })
      recordAdd?.('edge', newEdge)

      if (params.source?.startsWith('node-') && params.target?.startsWith('node-')) {
        const sourceId = Number(params.source.replace('node-', ''))
        dispatch({
          type: 'UPDATE_NODE_DATA',
          id: params.target,
          data: { parentNodeId: sourceId },
        })
      }
    },
    [edges, dispatch, recordAdd],
  )

  const deleteEdge = useCallback(
    (edgeId: string) => {
      const edgeToDelete = edges.find((e) => e.id === edgeId)
      if (edgeToDelete) {
        recordDelete?.([], [edgeToDelete])
      }
      dispatch({ type: 'DELETE_EDGE', id: edgeId })
    },
    [edges, recordDelete, dispatch],
  )

  return {
    onNodesChange,
    onEdgesChange,
    isValidConnection: checkValidConnection,
    onConnect,
    deleteEdge,
  }
}
