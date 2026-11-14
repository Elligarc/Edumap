import type { Connection, Edge } from '@xyflow/react'
import type { RoadmapEdgeRequest } from '@/shared/types/api'

export type EdgeOrConnection = Connection | Edge | { source?: string | null; target?: string | null }

export function isValidConnection(
  connection: EdgeOrConnection,
  edges: Edge[] = [],
): boolean {
  if (!connection.source || !connection.target || connection.source === connection.target) {
    return false
  }

  const isSourceNode = connection.source.startsWith('node-')
  const isTargetNode = connection.target.startsWith('node-')
  if (!isSourceNode || !isTargetNode) {
    return false
  }

  const hasExistingEdge = edges.some(
    (e) =>
      (e.source === connection.source && e.target === connection.target) ||
      (e.source === connection.target && e.target === connection.source),
  )

  return !hasExistingEdge
}

export function createEdgesPayload(edges: Edge[] = []): RoadmapEdgeRequest[] {
  const payload: RoadmapEdgeRequest[] = []
  edges.forEach((e) => {
    if (e.source?.startsWith('node-') && e.target?.startsWith('node-')) {
      const sourceId = Number(e.source.replace('node-', ''))
      const targetId = Number(e.target.replace('node-', ''))
      payload.push({
        sourceNodeId: sourceId,
        targetNodeId: targetId,
        sourceHandle: e.sourceHandle || 'bottom',
        targetHandle: e.targetHandle || 'top',
      })
    }
  })
  return payload
}
