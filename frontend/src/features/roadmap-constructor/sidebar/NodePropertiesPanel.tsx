import { Plus, Trash2 } from 'lucide-react'
import type { Node } from '@xyflow/react'
import { Input } from '@/shared/ui'
import { Textarea } from '@/shared/ui'
import { Select } from '@/shared/ui'
import { Switch } from '@/shared/ui'
import { Button } from '@/shared/ui'
import { ResourceItem } from '@/entities/node'
import type { CreateResourceRequest } from '@/shared/types/api'
import type { ConstructorNodeData } from '../canvas/nodes/ConstructorNode'
import {
  NODE_TYPE_OPTIONS,
  RESOURCE_TYPES,
  useNodePropertiesPanel,
} from './useNodePropertiesPanel'
import './NodePropertiesPanel.css'

export interface NodePropertiesPanelProps {
  node?: Node | null
  onChange?: (nodeId: string, patch: Record<string, unknown>) => void
  onDelete?: (nodeId: string) => void
  onAddResource?: (nodeId: string, resourcePayload: CreateResourceRequest) => void
  onDeleteResource?: (nodeId: string, resourceId?: number, index?: number) => void
}

export function NodePropertiesPanel({
  node,
  onChange,
  onDelete,
  onAddResource,
  onDeleteResource,
}: NodePropertiesPanelProps) {
  const {
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
  } = useNodePropertiesPanel({ node, onAddResource })

  if (!node) return null

  const data = (node.data || {}) as ConstructorNodeData
  const resources = data.resources || []

  return (
    <div className="node-properties-panel">
      <div className="node-properties-panel-header">
        <h3 className="node-properties-panel-title">Свойства узла</h3>
      </div>

      <div className="node-properties-fields">
        <Switch
          label="Обязательность"
          description={data.isRequired ? 'Обязателен для прохождения' : 'Не обязателен'}
          checked={data.isRequired ?? true}
          onChange={(val) => onChange?.(node.id, { isRequired: val })}
        />

        <Select
          label="Тип шага"
          options={NODE_TYPE_OPTIONS}
          value={data.type || 'DEFAULT'}
          onChange={(e) => onChange?.(node.id, { type: e.target.value })}
        />

        <Input
          label="Заголовок шага"
          value={data.title || ''}
          onChange={(e) => onChange?.(node.id, { title: e.target.value })}
          placeholder="Название шага"
        />

        <Textarea
          label="Описание"
          value={data.content || ''}
          onChange={(e) => onChange?.(node.id, { content: e.target.value })}
          placeholder="Подробное описание или инструкции"
          rows={4}
        />
      </div>

      <div className="node-properties-resources-section">
        <div className="node-properties-resources-header">
          <span className="node-properties-resources-title">
            Ресурсы
          </span>
          <button
            type="button"
            onClick={() => setShowAddResource(!showAddResource)}
            className="node-properties-add-btn"
          >
            <Plus size={14} />
            Добавить
          </button>
        </div>

        {showAddResource && (
          <form
            onSubmit={handleCreateResource}
            className="node-properties-resource-form"
          >
            <Input
              label="Название ресурса"
              placeholder="Например: Видео на YouTube"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              required
            />
            <Input
              label="Ссылка (URL)"
              placeholder="https://..."
              type="url"
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              required
            />
            <Select
              label="Тип"
              options={RESOURCE_TYPES}
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
            />
            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" className="flex-1">
                Сохранить
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={cancelAddResource}
              >
                Отмена
              </Button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-2">
          {resources.length === 0 && !showAddResource && (
            <span className="node-properties-empty-hint">
              Ресурсы еще не добавлены
            </span>
          )}
          {resources.map((res, index) => (
            <ResourceItem
              key={res.id || `${res.url}-${index}`}
              resource={res}
              isEditable
              onDelete={(resId) => onDeleteResource?.(node.id, resId, index)}
            />
          ))}
        </div>
      </div>

      <div className="node-properties-footer">
        <Button
          variant="danger"
          className="w-full"
          onClick={() => onDelete?.(node.id)}
        >
          <Trash2 size={16} />
          Удалить узел
        </Button>
      </div>
    </div>
  )
}
