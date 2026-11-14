import { useState, type ReactNode } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import type { RoadmapCanvasResponse, RoadmapResponse } from '@/shared/types/api'
import type { RoadmapFormData } from '@/entities/roadmap'
import { useConstructorCanvas } from '../hooks/useConstructorCanvas'
import { useViewerProgress } from '@/entities/roadmap'
import type { ConstructorMode } from '../header/ConstructorTopBar'
import { ConstructorContext, type ConstructorContextValue } from './ConstructorContext'

export interface ConstructorProviderProps {
  roadmapId: number | string
  roadmap?: Partial<RoadmapResponse> | null
  canvasData?: RoadmapCanvasResponse | null
  onSaveSuccess?: (savedCanvas?: RoadmapCanvasResponse) => Promise<unknown> | unknown
  onUpdateRoadmapSettings?: (data: RoadmapFormData) => Promise<unknown> | void
  children: ReactNode
}

export function ConstructorProvider({
  roadmapId,
  roadmap,
  canvasData,
  onSaveSuccess,
  onUpdateRoadmapSettings,
  children,
}: ConstructorProviderProps) {
  const [mode, setMode] = useState<ConstructorMode>('editor')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const canvasState = useConstructorCanvas(
    roadmapId,
    canvasData,
    onSaveSuccess,
  )

  const { completedIds, toggleComplete } = useViewerProgress(
    roadmap?.id || roadmapId,
    canvasState.nodes,
  )

  const value: ConstructorContextValue = {
    roadmapId,
    roadmap,
    mode,
    setMode,
    isSettingsOpen,
    setIsSettingsOpen,
    ...canvasState,
    completedIds,
    toggleComplete,
    onUpdateRoadmapSettings,
  }

  return (
    <ReactFlowProvider>
      <ConstructorContext.Provider value={value}>
        {children}
      </ConstructorContext.Provider>
    </ReactFlowProvider>
  )
}
