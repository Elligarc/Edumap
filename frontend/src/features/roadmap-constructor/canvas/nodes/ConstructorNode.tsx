import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Play, Flag, BookOpen } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { NodeResourceResponse, NodeType } from '@/shared/types/api'
import './ConstructorNode.css'

export interface ConstructorNodeData {
  title?: string
  type?: NodeType
  content?: string
  resources?: NodeResourceResponse[]
  isRequired?: boolean
  entityType?: 'node'
  [key: string]: unknown
}

export interface ConstructorNodeProps extends Partial<NodeProps> {
  data: ConstructorNodeData
  selected?: boolean
}

export const ConstructorNode = memo(function ConstructorNode({
  data,
  selected,
}: ConstructorNodeProps) {
  const title = (data?.title as string) || ''
  const type = (data?.type as NodeType) || 'DEFAULT'
  const content = (data?.content as string) || ''
  const resources = (data?.resources as NodeResourceResponse[]) || []

  const isStart = type === 'START'
  const isEnd = type === 'END'

  return (
    <div
      className={cn(
        'constructor-node',
        selected && 'constructor-node--selected',
        isStart && 'constructor-node--start',
        isEnd && 'constructor-node--end',
      )}
    >
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="!w-2 !h-2 !bg-white !border-[1.5px] !border-(--color-primary) transition-transform hover:!scale-125 hover:!bg-(--color-primary)"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="!w-2 !h-2 !bg-white !border-[1.5px] !border-(--color-primary) transition-transform hover:!scale-125 hover:!bg-(--color-primary)"
      />

      {isStart && (
        <div className="constructor-node-badge-start">
          <div className="w-4 h-4 rounded-xs bg-(--color-primary-light) flex items-center justify-center text-(--color-primary)">
            <Play size={10} fill="currentColor" />
          </div>
          <span className="text-xs font-sans font-semibold text-(--color-primary)">
            Начало
          </span>
        </div>
      )}

      {isEnd && (
        <div className="constructor-node-badge-end">
          <div className="w-4 h-4 rounded-xs bg-(--color-danger-light) flex items-center justify-center text-(--color-danger)">
            <Flag size={10} />
          </div>
          <span className="text-xs font-sans font-semibold text-(--color-danger)">
            Финал
          </span>
        </div>
      )}

      <h4 className="constructor-node-title">
        {title || 'Новый шаг'}
      </h4>

      {content && (
        <p className="constructor-node-content">
          {content}
        </p>
      )}

      {resources && resources.length > 0 && (
        <div className="constructor-node-resources">
          <span className="flex items-center gap-1 font-sans text-xs font-medium text-(--color-primary)">
            <BookOpen size={12} />
            {resources.length}{' '}
            {resources.length === 1
              ? 'ресурс'
              : resources.length < 5
                ? 'ресурса'
                : 'ресурсов'}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-2 !h-2 !bg-white !border-[1.5px] !border-(--color-primary) transition-transform hover:!scale-125 hover:!bg-(--color-primary)"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2 !h-2 !bg-white !border-[1.5px] !border-(--color-primary) transition-transform hover:!scale-125 hover:!bg-(--color-primary)"
      />
    </div>
  )
})
