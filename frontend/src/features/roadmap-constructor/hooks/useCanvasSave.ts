import { useState, useCallback, type Dispatch } from 'react'
import type { Edge, Node } from '@xyflow/react'
import { roadmapApi } from '@/entities/roadmap'
import type {
  CanvasNodeSyncItem,
  CanvasSectionSyncItem,
  CanvasTextSyncItem,
  NodeType,
  NodeResourceResponse,
  RoadmapCanvasResponse,
  SyncCanvasRequest,
} from '@/shared/types/api'
import { createEdgesPayload } from '../model/canvas-connections'
import type { CanvasAction } from '../model/canvas-reducer'
import type { PendingDeletions } from './useCanvasHistory'

export interface UseCanvasSaveOptions {
  roadmapId: number | string
  nodes: Node[]
  edges: Edge[]
  dispatch: Dispatch<CanvasAction>
  pendingDeletionsRef?: { current: PendingDeletions }
  commitDeletions?: () => Promise<void>
  onSaveSuccess?: (savedCanvas?: RoadmapCanvasResponse) => Promise<unknown> | unknown
}

export function useCanvasSave({
  roadmapId,
  nodes,
  edges,
  dispatch,
  pendingDeletionsRef,
  commitDeletions,
  onSaveSuccess,
}: UseCanvasSaveOptions) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const saveCanvas = useCallback(async (): Promise<RoadmapCanvasResponse | void> => {
    setIsSaving(true)
    try {
      const syncNodes: CanvasNodeSyncItem[] = []
      const syncSections: CanvasSectionSyncItem[] = []
      const syncTexts: CanvasTextSyncItem[] = []

      nodes.forEach((n) => {
        if (n.id.startsWith('node-')) {
          const id = Number(n.id.replace('node-', ''))
          const rawResources = (n.data?.resources as NodeResourceResponse[]) || []
          const resources = rawResources.map((r) => ({
            title: r.title,
            url: r.url,
            type: r.type || 'WEBSITE',
          }))

          syncNodes.push({
            id,
            title: typeof n.data?.title === 'string' && n.data.title.trim() ? n.data.title.trim() : 'Новый шаг',
            type: (n.data?.type as NodeType) || 'DEFAULT',
            content: typeof n.data?.content === 'string' ? n.data.content : undefined,
            isRequired: typeof n.data?.isRequired === 'boolean' ? n.data.isRequired : true,
            positionX: Math.round(n.position.x),
            positionY: Math.round(n.position.y),
            resources,
          })
        } else if (n.id.startsWith('section-')) {
          const id = Number(n.id.replace('section-', ''))
          const currentWidth = Math.round(Number(n.data?.width || n.style?.width || 380))
          const currentHeight = Math.round(Number(n.data?.height || n.style?.height || 260))

          syncSections.push({
            id,
            title: (n.data?.title as string) || 'Новая секция',
            positionX: Math.round(n.position.x),
            positionY: Math.round(n.position.y),
            width: currentWidth,
            height: currentHeight,
          })
        } else if (n.id.startsWith('text-')) {
          const id = Number(n.id.replace('text-', ''))

          syncTexts.push({
            id,
            content: (n.data?.content as string) || 'Текстовая заметка',
            positionX: Math.round(n.position.x),
            positionY: Math.round(n.position.y),
          })
        }
      })

      const deletedNodeIds = pendingDeletionsRef
        ? Array.from(pendingDeletionsRef.current.nodeIds)
        : []
      const deletedSectionIds = pendingDeletionsRef
        ? Array.from(pendingDeletionsRef.current.sectionIds)
        : []
      const deletedTextIds = pendingDeletionsRef
        ? Array.from(pendingDeletionsRef.current.textIds)
        : []

      if (!pendingDeletionsRef && commitDeletions) {
        await commitDeletions()
      }

      const payload: SyncCanvasRequest = {
        nodes: syncNodes,
        sections: syncSections,
        texts: syncTexts,
        edges: createEdgesPayload(edges),
        deletedNodeIds: deletedNodeIds.length > 0 ? deletedNodeIds : undefined,
        deletedSectionIds: deletedSectionIds.length > 0 ? deletedSectionIds : undefined,
        deletedTextIds: deletedTextIds.length > 0 ? deletedTextIds : undefined,
      }

      const savedCanvas = await roadmapApi.syncCanvas(roadmapId, payload)

      if (pendingDeletionsRef) {
        pendingDeletionsRef.current.nodeIds.clear()
        pendingDeletionsRef.current.sectionIds.clear()
        pendingDeletionsRef.current.textIds.clear()
      }

      setLastSaved(new Date())
      dispatch({ type: 'MARK_SAVED' })

      await onSaveSuccess?.(savedCanvas)
      return savedCanvas
    } catch (err) {
      console.error('Failed to save canvas:', err)
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [nodes, edges, roadmapId, dispatch, pendingDeletionsRef, commitDeletions, onSaveSuccess])

  return {
    isSaving,
    lastSaved,
    setLastSaved,
    saveCanvas,
  }
}
