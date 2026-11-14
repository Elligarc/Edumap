import { useState, useMemo } from 'react'
import type { Node } from '@xyflow/react'
import type { RoadmapCanvasResponse, RoadmapResponse } from '@/shared/types/api'
import { transformCanvasToElements, useViewerProgress } from '@/entities/roadmap'

export interface UseRoadmapViewerWidgetOptions {
  roadmap?: Partial<RoadmapResponse> | null
  canvasData?: RoadmapCanvasResponse | null
}

export function useRoadmapViewerWidget({ roadmap, canvasData }: UseRoadmapViewerWidgetOptions) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const { nodes, edges } = useMemo(() => {
    return transformCanvasToElements(canvasData, { isViewer: true })
  }, [canvasData])

  const {
    completedIds,
    toggleComplete,
    stats,
    isEnrolled,
    isEnrolling,
    toggleEnroll,
  } = useViewerProgress(roadmap?.id || '', nodes)

  return {
    selectedNode,
    setSelectedNode,
    nodes,
    edges,
    completedIds,
    toggleComplete,
    stats,
    isEnrolled,
    isEnrolling,
    toggleEnroll,
  }
}
