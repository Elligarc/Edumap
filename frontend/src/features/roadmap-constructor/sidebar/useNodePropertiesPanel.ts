import { useState, type FormEvent } from 'react'
import type { Node } from '@xyflow/react'
import type { CreateResourceRequest } from '@/shared/types/api'
import type { SelectOption } from '@/shared/ui'

export const NODE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'DEFAULT', label: 'Обычный шаг' },
  { value: 'START', label: 'Начальный узел (START)' },
  { value: 'END', label: 'Финальный узел (END)' },
]

export const RESOURCE_TYPES: SelectOption[] = [
  { value: 'VIDEO', label: 'Видео (YouTube)' },
  { value: 'ARTICLE', label: 'Статья' },
  { value: 'DOCS', label: 'Документация' },
  { value: 'OTHER', label: 'Другое' },
]

export interface UseNodePropertiesPanelOptions {
  node?: Node | null
  onAddResource?: (nodeId: string, resourcePayload: CreateResourceRequest) => void
}

export function useNodePropertiesPanel({ node, onAddResource }: UseNodePropertiesPanelOptions) {
  const [showAddResource, setShowAddResource] = useState(false)
  const [resourceTitle, setResourceTitle] = useState('')
  const [resourceUrl, setResourceUrl] = useState('')
  const [resourceType, setResourceType] = useState('ARTICLE')

  const handleCreateResource = (e: FormEvent) => {
    e.preventDefault()
    if (!resourceTitle.trim() || !resourceUrl.trim() || !node) return

    onAddResource?.(node.id, {
      title: resourceTitle.trim(),
      url: resourceUrl.trim(),
      type: resourceType,
    })

    setResourceTitle('')
    setResourceUrl('')
    setShowAddResource(false)
  }

  const cancelAddResource = () => {
    setShowAddResource(false)
    setResourceTitle('')
    setResourceUrl('')
  }

  return {
    showAddResource,
    setShowAddResource,
    resourceTitle,
    setResourceTitle,
    resourceUrl,
    setResourceUrl,
    resourceType,
    setResourceType,
    handleCreateResource,
    cancelAddResource,
  }
}
