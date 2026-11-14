import { useNavigate, useLocation } from 'react-router'
import { CheckCircle2, Circle, X, BookOpen } from 'lucide-react'
import type { Node } from '@xyflow/react'
import { Badge } from '@/shared/ui'
import { ResourceItem } from '@/entities/node'
import { useAuthStore } from '@/entities/session'
import type { ViewerNodeData } from '../canvas/nodes/ViewerNode'
import './ViewerNodeDetails.css'

export interface ViewerNodeDetailsProps {
  node?: Node | null
  isCompleted?: boolean
  onToggleComplete?: (nodeId: string) => void
  stepIndex?: number
  totalSteps?: number
  onClose?: () => void
}

export function ViewerNodeDetails({
  node,
  isCompleted,
  onToggleComplete,
  stepIndex,
  totalSteps,
  onClose,
}: ViewerNodeDetailsProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const handleToggleComplete = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }
    if (node) {
      onToggleComplete?.(node.id)
    }
  }

  if (!node) {
    return (
      <div className="viewer-node-details-empty" data-testid="viewer-node-details-empty">
        <Circle size={36} className="text-slate-300 stroke-1" />
        <p className="text-sm font-semibold text-slate-700">
          Выберите шаг на дорожной карте
        </p>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Кликните по любому узлу схемы, чтобы просмотреть материалы, инструкции и отметить его выполнение.
        </p>
      </div>
    )
  }

  const data = (node.data || {}) as ViewerNodeData
  const resources = data.resources || []

  return (
    <div className="viewer-node-details" data-testid="viewer-node-details">
      <div className="viewer-node-details-header">
        <div className="flex items-center gap-2">
          {stepIndex !== undefined && totalSteps !== undefined}
          <div className="viewer-node-details-badges">
            {data.type === 'START' && <Badge variant="start">Начало</Badge>}
            {data.type === 'END' && <Badge variant="end">Финал</Badge>}
            {Boolean(data.isRequired) && <Badge variant="primary">Обязательный</Badge>}
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="viewer-node-details-close-btn"
            aria-label="Закрыть панель шага"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="viewer-node-details-body">
        <h3 className="viewer-node-details-title">
          {(data.title as string) || 'Без названия'}
        </h3>

        {data.content ? (
          <p className="viewer-node-details-content">
            {data.content as string}
          </p>
        ) : (
          <p className="viewer-node-details-empty-content">
            Описание для этого шага пока не добавлено.
          </p>
        )}
      </div>

      <div className="viewer-node-details-resources">
        <span className="viewer-node-details-resources-title">
          <BookOpen size={18} className="text-(--color-primary)" />
          <span>Материалы</span>
        </span>

        {resources.length === 0 ? (
          <p className="viewer-node-details-empty-content">
            К этому шагу пока не прикреплены учебные материалы.
          </p>
        ) : (
          <div className="viewer-node-details-resources-list">
            {resources.map((res) => (
              <ResourceItem key={res.id || res.url} resource={res} />
            ))}
          </div>
        )}
      </div>

      <div className="viewer-node-details-footer">
        <button
          type="button"
          onClick={handleToggleComplete}
          className={`viewer-node-complete-btn ${
            isCompleted
              ? 'viewer-node-complete-btn--completed'
              : 'viewer-node-complete-btn--incomplete'
          }`}
          data-testid="viewer-node-toggle-complete-btn"
        >
          <CheckCircle2 size={18} />
          <span>{isCompleted ? 'Пройден (отменить)' : 'Завершить шаг'}</span>
        </button>
      </div>
    </div>
  )
}
