import { createContext, useContext } from 'react'
import type { Connection, Edge, Node, OnEdgesChange, OnNodesChange } from '@xyflow/react'
import type {
  RoadmapResponse,
  CreateResourceRequest,
} from '@/shared/types/api'
import type { RoadmapFormData } from '@/entities/roadmap'
import type { ConstructorMode } from '../header/ConstructorTopBar'

export interface ConstructorContextValue {
  roadmapId: number | string
  roadmap?: Partial<RoadmapResponse> | null
  mode: ConstructorMode
  setMode: (mode: ConstructorMode) => void
  isSettingsOpen: boolean
  setIsSettingsOpen: (open: boolean) => void

  nodes: Node[]
  edges: Edge[]
  selectedElement: Node | Edge | null
  setSelectedElement: (element: Node | Edge | null) => void

  isSaving: boolean
  lastSaved: Date | null
  isDirty: boolean
  saveCanvas: () => Promise<unknown>

  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean

  onNodesChange: OnNodesChange<Node>
  onEdgesChange: OnEdgesChange<Edge>
  isValidConnection: (connection: Connection | Edge) => boolean
  onConnect: (connection: Connection) => void

  addNode: () => void
  addSection: () => void
  addText: () => void
  updateNodeData: (id: string, patch: Record<string, unknown>) => void
  updateSectionData: (id: string, patch: Record<string, unknown>) => void
  updateTextData: (id: string, patch: Record<string, unknown>) => void
  deleteNode: (id: string) => void
  deleteSection: (id: string) => void
  deleteText: (id: string) => void

  addResource: (nodeId: string, resourcePayload: CreateResourceRequest) => void
  deleteResource: (nodeId: string, resourceId?: number, index?: number) => void

  completedIds: string[]
  toggleComplete: (nodeId: string) => void

  onUpdateRoadmapSettings?: (data: RoadmapFormData) => Promise<unknown> | void
}

export const ConstructorContext = createContext<ConstructorContextValue | null>(null)

export function useConstructorContext(): ConstructorContextValue {
  const context = useContext(ConstructorContext)
  if (!context) {
    throw new Error('useConstructorContext must be used within a ConstructorProvider')
  }
  return context
}

export { ConstructorProvider, type ConstructorProviderProps } from './ConstructorProvider'
