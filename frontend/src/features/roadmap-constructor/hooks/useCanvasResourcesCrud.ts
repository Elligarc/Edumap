import { useCallback, type Dispatch } from 'react'
import type { CreateResourceRequest, NodeResourceResponse } from '@/shared/types/api'
import type { CanvasAction } from '../model/canvas-reducer'

export interface UseCanvasResourcesCrudOptions {
  dispatch: Dispatch<CanvasAction>
}

export function useCanvasResourcesCrud({ dispatch }: UseCanvasResourcesCrudOptions) {
  const addResource = useCallback(
    (rawNodeId: string, resourcePayload: CreateResourceRequest): void => {
      const localResource: NodeResourceResponse = {
        id: -Date.now(),
        title: resourcePayload.title,
        url: resourcePayload.url,
        type: resourcePayload.type || 'WEBSITE',
      }
      dispatch({
        type: 'SET_NODES',
        nodes: (nds) =>
          nds.map((n) => {
            if (n.id === rawNodeId) {
              const existingResources = (n.data?.resources as NodeResourceResponse[]) || []
              const resources = [...existingResources, localResource]
              return { ...n, data: { ...n.data, resources } }
            }
            return n
          }),
      })
    },
    [dispatch],
  )

  const deleteResource = useCallback(
    (rawNodeId: string, resourceId?: number, index?: number): void => {
      dispatch({
        type: 'SET_NODES',
        nodes: (nds) =>
          nds.map((n) => {
            if (n.id === rawNodeId) {
              const existingResources = (n.data?.resources as NodeResourceResponse[]) || []
              const resources = existingResources.filter((r, idx) => {
                if (resourceId !== undefined && resourceId !== null && r.id !== undefined && r.id !== null) {
                  return r.id !== resourceId
                }
                if (index !== undefined && index !== null) {
                  return idx !== index
                }
                return true
              })
              return { ...n, data: { ...n.data, resources } }
            }
            return n
          }),
      })
    },
    [dispatch],
  )

  return { addResource, deleteResource }
}

