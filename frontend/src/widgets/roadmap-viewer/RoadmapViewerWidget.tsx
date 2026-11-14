import { useMemo } from 'react'
import { ViewerCanvas, ViewerNodeDetails } from '@/features/roadmap-viewer'
import type { RoadmapCanvasResponse, RoadmapResponse } from '@/shared/types/api'
import { RoadmapLearnerHero } from './ui/RoadmapLearnerHero'
import { useRoadmapViewerWidget } from './useRoadmapViewerWidget'
import './RoadmapViewerWidget.css'

export interface RoadmapViewerWidgetProps {
  roadmap?: Partial<RoadmapResponse> | null
  canvasData?: RoadmapCanvasResponse | null
}

export function RoadmapViewerWidget({
  roadmap,
  canvasData,
}: RoadmapViewerWidgetProps) {
  const {
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
  } = useRoadmapViewerWidget({ roadmap, canvasData })

  const viewerNodes = useMemo(() => {
    return nodes.filter(
      (n) => n.type === 'viewerNode' || n.id.startsWith('node-')
    )
  }, [nodes])

  const selectedNodeIndex = useMemo(() => {
    if (!selectedNode) return undefined
    const idx = viewerNodes.findIndex((n) => n.id === selectedNode.id)
    return idx >= 0 ? idx + 1 : undefined
  }, [selectedNode, viewerNodes])

  const totalSteps = viewerNodes.length || stats.total

  return (
    <div className="roadmap-viewer-widget" data-testid="roadmap-viewer-widget">
      <RoadmapLearnerHero
        roadmap={roadmap}
        stats={stats}
        isEnrolled={isEnrolled}
        onEnrollToggle={toggleEnroll}
        isEnrolling={isEnrolling}
      />

      <div className="roadmap-viewer-workspace">
        <div className="roadmap-viewer-canvas-card">
          <ViewerCanvas
            nodes={nodes}
            edges={edges}
            completedIds={completedIds}
            onSelectNode={setSelectedNode}
            selectedNode={selectedNode}
          />
        </div>

        <div className="roadmap-viewer-sidebar-card">
          <ViewerNodeDetails
            node={selectedNode}
            isCompleted={Boolean(selectedNode && completedIds.includes(selectedNode.id))}
            onToggleComplete={toggleComplete}
            stepIndex={selectedNodeIndex}
            totalSteps={totalSteps}
            onClose={() => setSelectedNode(null)}
          />
        </div>

        {selectedNode && (
          <div
            className="roadmap-viewer-mobile-drawer-overlay"
            onClick={() => setSelectedNode(null)}
            data-testid="roadmap-viewer-mobile-drawer"
          >
            <div
              className="roadmap-viewer-mobile-drawer"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Детали шага"
            >
              <ViewerNodeDetails
                node={selectedNode}
                isCompleted={Boolean(completedIds.includes(selectedNode.id))}
                onToggleComplete={toggleComplete}
                stepIndex={selectedNodeIndex}
                totalSteps={totalSteps}
                onClose={() => setSelectedNode(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
