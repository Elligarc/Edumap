import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import { cn } from '@/shared/lib/cn'
import './CanvasTextNode.css'

export interface CanvasTextNodeData {
  content?: string
  entityType?: 'text'
  [key: string]: unknown
}

export const CanvasTextNode = memo(function CanvasTextNode({
  data,
  selected,
}: NodeProps) {
  const content = (data?.content as string) || 'Текстовый блок'

  return (
    <div
      className={cn(
        'canvas-text-node',
        selected && 'canvas-text-node--selected',
      )}
    >
      <p className="canvas-text-node-content">
        {content}
      </p>
    </div>
  )
})
