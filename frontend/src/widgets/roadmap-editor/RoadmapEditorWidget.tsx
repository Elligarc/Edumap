import type { Node } from '@xyflow/react'
import { ConstructorTopBar } from '@/features/roadmap-constructor'
import { ConstructorToolbar } from '@/features/roadmap-constructor'
import { ConstructorCanvas } from '@/features/roadmap-constructor'
import { ConstructorSidebar } from '@/features/roadmap-constructor'
import { ViewerCanvas, ViewerNodeDetails } from '@/features/roadmap-viewer'
import { RoadmapSettingsModal } from '@/entities/roadmap'
import { useConstructorContext } from '@/features/roadmap-constructor'
import './RoadmapEditorWidget.css'

export interface RoadmapEditorWidgetProps {
  className?: string
}

export function RoadmapEditorWidget({ className = '' }: RoadmapEditorWidgetProps) {
  const {
    mode,
    nodes,
    edges,
    selectedElement,
    setSelectedElement,
    completedIds,
    toggleComplete,
    isSettingsOpen,
    setIsSettingsOpen,
    roadmap,
    onUpdateRoadmapSettings,
  } = useConstructorContext()

  const selectedNode =
    selectedElement && 'id' in selectedElement && selectedElement.id.startsWith('node-')
      ? (selectedElement as Node)
      : null

  return (
    <div className={`roadmap-editor-widget ${className}`.trim()}>
      <ConstructorTopBar />

      <div className="roadmap-editor-body">
        {mode === 'editor' ? (
          <>
            <ConstructorToolbar />
            <ConstructorCanvas />
          </>
        ) : (
          <ViewerCanvas
            nodes={nodes}
            edges={edges}
            completedIds={completedIds}
            onSelectNode={setSelectedElement}
            selectedNode={selectedNode}
          />
        )}

        <aside className="roadmap-editor-sidebar">
          {mode === 'editor' ? (
            <ConstructorSidebar />
          ) : (
            <ViewerNodeDetails
              node={selectedNode}
              isCompleted={Boolean(selectedNode && completedIds.includes(selectedNode.id))}
              onToggleComplete={toggleComplete}
            />
          )}
        </aside>
      </div>

      <RoadmapSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialData={roadmap}
        onSubmit={onUpdateRoadmapSettings ?? (() => {})}
      />
    </div>
  )
}
