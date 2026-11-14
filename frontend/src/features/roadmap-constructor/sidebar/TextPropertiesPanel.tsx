import { Trash2 } from 'lucide-react'
import type { Node } from '@xyflow/react'
import { Textarea } from '@/shared/ui'
import { Button } from '@/shared/ui'
import './TextPropertiesPanel.css'

export interface TextPropertiesPanelProps {
  textNode?: Node | null
  onChange?: (textNodeId: string, patch: Record<string, unknown>) => void
  onDelete?: (textNodeId: string) => void
}

export function TextPropertiesPanel({ textNode, onChange, onDelete }: TextPropertiesPanelProps) {
  if (!textNode) return null

  const data = (textNode.data || {}) as Record<string, unknown>

  return (
    <div className="text-properties-panel">
      <div className="text-properties-panel-header">
        <h3 className="text-properties-panel-title">Свойства текста</h3>
      </div>

      <div className="text-properties-fields">
        <Textarea
          label="Содержимое текста"
          value={(data.content as string) || ''}
          onChange={(e) => onChange?.(textNode.id, { content: e.target.value })}
          placeholder="Текст подсказки или заметки на холсте"
          rows={5}
        />
      </div>

      <div className="text-properties-footer">
        <Button
          variant="danger"
          className="w-full"
          onClick={() => onDelete?.(textNode.id)}
        >
          <Trash2 size={16} />
          Удалить текст
        </Button>
      </div>
    </div>
  )
}
