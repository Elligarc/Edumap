import { memo } from 'react'
import { Folder } from 'lucide-react'
import { NodeResizer, type NodeProps, type ResizeParams } from '@xyflow/react'
import { cn } from '@/shared/lib/cn'
import './SectionNode.css'

export interface SectionNodeData {
  title?: string
  width?: number | string
  height?: number | string
  isViewer?: boolean
  onResize?: (id: string, params: { width: number; height: number }) => void
  entityType?: 'section'
  [key: string]: unknown
}

export interface SectionNodeProps extends Partial<NodeProps> {
  id: string
  data: SectionNodeData
  selected?: boolean
}

export const SectionNode = memo(function SectionNode({
  id,
  data,
  selected,
}: SectionNodeProps) {
  const width = data?.width && Number(data.width) > 50 ? Number(data.width) : 380
  const height = data?.height && Number(data.height) > 50 ? Number(data.height) : 260
  const title = (data?.title as string) || 'Секция'
  const isViewer = Boolean(data?.isViewer)

  const handleResize = (_: unknown, params: ResizeParams) => {
    const onResize = data?.onResize as ((id: string, params: { width: number; height: number }) => void) | undefined
    onResize?.(id, params)
  }

  return (
    <>
      {!isViewer && (
        <NodeResizer
          minWidth={160}
          minHeight={100}
          isVisible={selected}
          lineClassName="!border-[#0284c7] !border-dashed"
          handleClassName="!w-2.5 !h-2.5 !bg-white !border-2 !border-[#0284c7] !rounded-[2px] hover:!scale-125 !transition-transform shadow-xs"
          onResize={handleResize}
          onResizeEnd={handleResize}
        />
      )}
      <div
        style={{ width: `${width}px`, height: `${height}px` }}
        className={cn(
          'section-node-container',
          selected && 'section-node-container--selected',
        )}
      >
        <div className="section-node-header">
          <Folder size={16} className="section-node-icon" />
          <span className="section-node-title">
            {title}
          </span>
        </div>
      </div>
    </>
  )
})
