import type { MouseEvent } from 'react'
import { BaseEdge, getBezierPath, EdgeLabelRenderer, useReactFlow, type EdgeProps } from '@xyflow/react'
import { X } from 'lucide-react'
import './CustomConnectionEdge.css'

export function CustomConnectionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const { deleteElements } = useReactFlow()

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    deleteElements({ edges: [{ id }] })
  }

  const isViewer = Boolean(data?.isViewer)

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={25}
        style={{
          stroke: selected ? '#0369a1' : '#0284c7',
          strokeWidth: selected ? 2.5 : 2,
          strokeDasharray: selected ? undefined : '5,5',
          ...style,
        }}
      />
      {!isViewer && selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 1000,
            }}
            className="nodrag nopan"
          >
            <button
              type="button"
              className="custom-connection-edge-delete-btn"
              title="Удалить связь"
              onClick={handleDelete}
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
