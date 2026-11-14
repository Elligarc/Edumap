import type { Edge, Node } from '@xyflow/react'

export interface CanvasState {
  nodes: Node[]
  edges: Edge[]
  selectedElement: Node | Edge | null
  isDirty: boolean
}

export type CanvasAction =
  | { type: 'SET_ELEMENTS'; nodes: Node[]; edges: Edge[] }
  | { type: 'SET_NODES'; nodes: Node[] | ((prev: Node[]) => Node[]) }
  | { type: 'SET_EDGES'; edges: Edge[] | ((prev: Edge[]) => Edge[]) }
  | { type: 'SET_SELECTED_ELEMENT'; element: Node | Edge | null }
  | { type: 'ADD_NODE'; node: Node }
  | { type: 'UPDATE_NODE_DATA'; id: string; data: Record<string, unknown> }
  | { type: 'DELETE_NODE'; id: string }
  | { type: 'RESIZE_SECTION'; secId: string; width: number; height: number }
  | { type: 'ADD_EDGE'; edge: Edge; targetNodeId?: string; sourceNodeId?: string }
  | { type: 'DELETE_EDGE'; id: string }
  | { type: 'RESTORE_ELEMENTS'; nodes: Node[]; edges: Edge[] }
  | { type: 'REMOVE_ELEMENTS'; nodeIds: string[]; edgeIds: string[] }
  | { type: 'MARK_SAVED' }

export const initialCanvasState: CanvasState = {
  nodes: [],
  edges: [],
  selectedElement: null,
  isDirty: false,
}

export function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'SET_ELEMENTS': {
      return {
        ...state,
        nodes: action.nodes,
        edges: action.edges,
        isDirty: false,
      }
    }

    case 'SET_NODES': {
      const nextNodes = typeof action.nodes === 'function' ? action.nodes(state.nodes) : action.nodes
      const nextSelected =
        state.selectedElement && 'id' in state.selectedElement
          ? nextNodes.find((n) => n.id === state.selectedElement?.id) ?? state.selectedElement
          : state.selectedElement

      return {
        ...state,
        nodes: nextNodes,
        selectedElement: nextSelected,
        isDirty: true,
      }
    }

    case 'SET_EDGES': {
      return {
        ...state,
        edges: typeof action.edges === 'function' ? action.edges(state.edges) : action.edges,
        isDirty: true,
      }
    }

    case 'SET_SELECTED_ELEMENT': {
      return {
        ...state,
        selectedElement: action.element,
      }
    }

    case 'ADD_NODE': {
      return {
        ...state,
        nodes: [...state.nodes, action.node],
        selectedElement: action.node,
        isDirty: true,
      }
    }

    case 'UPDATE_NODE_DATA': {
      const nextNodes = state.nodes.map((n) =>
        n.id === action.id ? { ...n, data: { ...n.data, ...action.data } } : n,
      )
      const nextSelected =
        state.selectedElement && 'id' in state.selectedElement && state.selectedElement.id === action.id
          ? { ...state.selectedElement, data: { ...state.selectedElement.data, ...action.data } }
          : state.selectedElement

      return {
        ...state,
        nodes: nextNodes,
        selectedElement: nextSelected,
        isDirty: true,
      }
    }

    case 'DELETE_NODE': {
      const nextNodes = state.nodes.filter((n) => n.id !== action.id)
      const nextEdges = state.edges.filter(
        (e) => e.source !== action.id && e.target !== action.id,
      )
      const nextSelected =
        state.selectedElement && 'id' in state.selectedElement && state.selectedElement.id === action.id
          ? null
          : state.selectedElement

      return {
        ...state,
        nodes: nextNodes,
        edges: nextEdges,
        selectedElement: nextSelected,
        isDirty: true,
      }
    }

    case 'RESIZE_SECTION': {
      const { secId, width, height } = action
      const nextNodes = state.nodes.map((n) => {
        if (n.id === secId) {
          return {
            ...n,
            style: { ...n.style, width, height },
            data: { ...n.data, width, height },
          }
        }
        return n
      })

      const nextSelected =
        state.selectedElement && 'id' in state.selectedElement && state.selectedElement.id === secId
          ? {
              ...state.selectedElement,
              style: { ...state.selectedElement.style, width, height },
              data: { ...state.selectedElement.data, width, height },
            }
          : state.selectedElement

      return {
        ...state,
        nodes: nextNodes,
        selectedElement: nextSelected,
        isDirty: true,
      }
    }

    case 'ADD_EDGE': {
      const { edge, targetNodeId, sourceNodeId } = action
      const nextEdges = [...state.edges, edge]
      let nextNodes = state.nodes

      if (targetNodeId && sourceNodeId) {
        nextNodes = state.nodes.map((n) =>
          n.id === targetNodeId
            ? { ...n, data: { ...n.data, parentNodeId: sourceNodeId } }
            : n,
        )
      }

      return {
        ...state,
        nodes: nextNodes,
        edges: nextEdges,
        isDirty: true,
      }
    }

    case 'DELETE_EDGE': {
      return {
        ...state,
        edges: state.edges.filter((e) => e.id !== action.id),
        selectedElement:
          state.selectedElement && 'id' in state.selectedElement && state.selectedElement.id === action.id
            ? null
            : state.selectedElement,
        isDirty: true,
      }
    }

    case 'RESTORE_ELEMENTS': {
      const existingNodeIds = new Set(state.nodes.map((n) => n.id))
      const newNodes = action.nodes
        .filter((n) => !existingNodeIds.has(n.id))
        .map((n) => ({ ...n, selected: false }))
      const existingEdgeIds = new Set(state.edges.map((e) => e.id))
      const newEdges = action.edges
        .filter((e) => !existingEdgeIds.has(e.id))
        .map((e) => ({ ...e, selected: false }))

      return {
        ...state,
        nodes: [...state.nodes, ...newNodes],
        edges: [...state.edges, ...newEdges],
        selectedElement: null,
        isDirty: true,
      }
    }

    case 'REMOVE_ELEMENTS': {
      const nodeSet = new Set(action.nodeIds)
      const edgeSet = new Set(action.edgeIds)

      const nextNodes = state.nodes.filter((n) => !nodeSet.has(n.id))
      const nextEdges = state.edges.filter(
        (e) => !edgeSet.has(e.id) && !nodeSet.has(e.source) && !nodeSet.has(e.target),
      )
      const nextSelected =
        state.selectedElement &&
        'id' in state.selectedElement &&
        (nodeSet.has(state.selectedElement.id) || edgeSet.has(state.selectedElement.id))
          ? null
          : state.selectedElement

      return {
        ...state,
        nodes: nextNodes,
        edges: nextEdges,
        selectedElement: nextSelected,
        isDirty: true,
      }
    }

    case 'MARK_SAVED': {
      return {
        ...state,
        isDirty: false,
      }
    }

    default:
      return state
  }
}
