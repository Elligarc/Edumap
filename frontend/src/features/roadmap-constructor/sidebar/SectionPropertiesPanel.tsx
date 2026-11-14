import { Trash2 } from 'lucide-react'
import type { Node } from '@xyflow/react'
import { Input } from '@/shared/ui'
import { Button } from '@/shared/ui'
import './SectionPropertiesPanel.css'

export interface SectionPropertiesPanelProps {
  section?: Node | null
  onChange?: (sectionId: string, patch: Record<string, unknown>) => void
  onDelete?: (sectionId: string) => void
}

export function SectionPropertiesPanel({ section, onChange, onDelete }: SectionPropertiesPanelProps) {
  if (!section) return null

  const data = (section.data || {}) as Record<string, unknown>

  return (
    <div className="section-properties-panel">
      <div className="section-properties-panel-header">
        <h3 className="section-properties-panel-title">Свойства секции</h3>
      </div>

      <div className="section-properties-fields">
        <Input
          label="Название секции"
          value={(data.title as string) || ''}
          onChange={(e) => onChange?.(section.id, { title: e.target.value })}
          placeholder="Например: Основы синтаксиса"
        />

        <div className="section-properties-dims-row">
          <Input
            label="Ширина (px)"
            type="number"
            value={(data.width as number) || 380}
            onChange={(e) => onChange?.(section.id, { width: Number(e.target.value) })}
          />
          <Input
            label="Высота (px)"
            type="number"
            value={(data.height as number) || 260}
            onChange={(e) => onChange?.(section.id, { height: Number(e.target.value) })}
          />
        </div>

        <div className="section-properties-hint-box">
          <p className="section-properties-hint-text">
            Секция служит визуальным контуром для группировки шагов на холсте и не влияет на связность узлов.
          </p>
        </div>
      </div>

      <div className="section-properties-footer">
        <Button
          variant="danger"
          className="w-full"
          onClick={() => onDelete?.(section.id)}
        >
          <Trash2 size={16} />
          Удалить секцию
        </Button>
      </div>
    </div>
  )
}
