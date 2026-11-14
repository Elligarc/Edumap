import { type Edge, type Node } from '@xyflow/react'
import type { RoadmapCanvasResponse } from '@/shared/types/api'
import { DEFAULT_EDGE_MARKER } from './canvas-constants'

export { DEFAULT_EDGE_MARKER }

export interface TransformCanvasOptions {
  isViewer?: boolean
  onSectionResize?: (id: string, params: { width: number; height: number }) => void
}

export interface TransformCanvasResult {
  nodes: Node[]
  edges: Edge[]
}

export function transformCanvasToElements(
  canvasData: RoadmapCanvasResponse | null | undefined,
  options: TransformCanvasOptions = {},
): TransformCanvasResult {
  const { isViewer = false, onSectionResize } = options
  const initialNodes: Node[] = []
  const initialEdges: Edge[] = []

  if (!canvasData) {
    return { nodes: initialNodes, edges: initialEdges }
  }

  canvasData.sections?.forEach((sec) => {
    const secWidth = sec.width && Number(sec.width) > 50 ? Number(sec.width) : 380
    const secHeight = sec.height && Number(sec.height) > 50 ? Number(sec.height) : 260
    initialNodes.push({
      id: `section-${sec.id}`,
      type: 'sectionNode',
      position: { x: sec.positionX ?? 100, y: sec.positionY ?? 100 },
      data: {
        ...sec,
        width: secWidth,
        height: secHeight,
        entityType: 'section',
        isViewer,
        ...(onSectionResize ? { onResize: onSectionResize } : {}),
      },
      style: { width: secWidth, height: secHeight },
      zIndex: 0,
    })
  })

  canvasData.nodes?.forEach((node) => {
    initialNodes.push({
      id: `node-${node.id}`,
      type: isViewer ? 'viewerNode' : 'constructorNode',
      position: { x: node.positionX ?? 200, y: node.positionY ?? 200 },
      data: { ...node, entityType: 'node' },
      zIndex: 2,
    })
  })

  if (canvasData.edges && canvasData.edges.length > 0) {
    canvasData.edges.forEach((edge) => {
      initialEdges.push({
        id: `edge-${edge.sourceNodeId}-${edge.targetNodeId}`,
        source: `node-${edge.sourceNodeId}`,
        target: `node-${edge.targetNodeId}`,
        sourceHandle: edge.sourceHandle || 'bottom',
        targetHandle: edge.targetHandle || 'top',
        type: 'customEdge',
        zIndex: 1,
        markerEnd: DEFAULT_EDGE_MARKER,
        ...(isViewer ? { data: { isViewer: true } } : {}),
      })
    })
  } else {
    // fallback на parentNodeId
    canvasData.nodes?.forEach((node) => {
      if (node.parentNodeId) {
        initialEdges.push({
          id: `edge-${node.parentNodeId}-${node.id}`,
          source: `node-${node.parentNodeId}`,
          target: `node-${node.id}`,
          sourceHandle: 'bottom',
          targetHandle: 'top',
          type: 'customEdge',
          zIndex: 1,
          markerEnd: DEFAULT_EDGE_MARKER,
          ...(isViewer ? { data: { isViewer: true } } : {}),
        })
      }
    })
  }

  canvasData.texts?.forEach((txt) => {
    initialNodes.push({
      id: `text-${txt.id}`,
      type: 'textNode',
      position: { x: txt.positionX ?? 150, y: txt.positionY ?? 150 },
      data: { ...txt, entityType: 'text' },
      zIndex: 1,
    })
  })

  return { nodes: initialNodes, edges: initialEdges }
}
