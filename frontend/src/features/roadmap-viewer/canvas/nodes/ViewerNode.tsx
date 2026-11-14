import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Play, Flag, CheckCircle2, BookOpen, Compass, Target, ArrowRightCircle, Sparkles } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { NodeResourceResponse, NodeType } from '@/shared/types/api'
import './ViewerNode.css'

export interface ViewerNodeData {
  title?: string
  type?: NodeType
  content?: string
  resources?: NodeResourceResponse[]
  isCompleted?: boolean
  entityType?: 'node'
  onSelect?: () => void
  [key: string]: unknown
}

export interface ViewerNodeProps extends Partial<NodeProps> {
  data: ViewerNodeData
  selected?: boolean
}

export const ViewerNode = memo(function ViewerNode({
  data,
  selected,
}: ViewerNodeProps) {
  const title = (data?.title as string) || ''
  const type = (data?.type as NodeType) || 'DEFAULT'
  const content = (data?.content as string) || ''
  const resources = (data?.resources as NodeResourceResponse[]) || []
  const isCompleted = Boolean(data?.isCompleted)

  const isStart = type === 'START'
  const isEnd = type === 'END'

  return (
    <div
      className={cn(
        'viewer-node',
        selected && 'viewer-node--selected',
        isCompleted && 'viewer-node--completed',
        isStart && !isCompleted && 'viewer-node--start',
        isEnd && !isCompleted && 'viewer-node--end',
      )}
      onClick={(e) => {
        e.stopPropagation()
        data?.onSelect?.()
      }}
    >
      <Handle type="source" position={Position.Top} id="top" className="viewer-node-handle" />
      <Handle type="source" position={Position.Left} id="left" className="viewer-node-handle" />

      <div className="flex items-center justify-between mb-2">
        {isStart && (
          <div className="viewer-node-badge-start">
            <ArrowRightCircle size={13} />
            <span>Старт</span>
          </div>
        )}
        {isEnd && (
          <div className="viewer-node-badge-end">
            <Flag size={13} />
            <span>Конец</span>
          </div>
        )}
        {!isStart && !isEnd && <div />}

        {isCompleted && (
          <span className="viewer-node-completed-status">
            <CheckCircle2 size={14} className="text-(--color-success)" />
            Пройдено
          </span>
        )}
      </div>

      <h4 className="viewer-node-title">{title || 'Шаг'}</h4>
      {content && <p className="viewer-node-content">{content}</p>}

      {resources && resources.length > 0 && (
        <div className="viewer-node-resources">
          <span className="flex items-center gap-1 font-sans text-xs font-medium text-(--color-primary)">
            <BookOpen size={12} />
            {resources.length} {resources.length === 1 ? 'ресурс' : resources.length < 5 ? 'ресурса' : 'ресурсов'}
          </span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="bottom" className="viewer-node-handle" />
      <Handle type="source" position={Position.Right} id="right" className="viewer-node-handle" />
    </div>
  )
})
