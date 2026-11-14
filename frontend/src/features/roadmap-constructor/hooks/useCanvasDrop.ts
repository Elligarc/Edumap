import { useCallback, type DragEvent } from 'react'
import { useReactFlow } from '@xyflow/react'

export interface CanvasDropCenterOffsets {
  node: { x: number; y: number }
  section: { x: number; y: number }
  text: { x: number; y: number }
}

export const DEFAULT_DROP_OFFSETS: CanvasDropCenterOffsets = {
  node: { x: 100, y: 40 }, // ~200x80
  section: { x: 190, y: 130 }, // 380x260
  text: { x: 75, y: 20 }, // ~150x40
}

export interface UseCanvasDropOptions {
  addNode: (pos?: { x: number; y: number }) => Promise<unknown> | unknown
  addSection: (pos?: { x: number; y: number }) => Promise<unknown> | unknown
  addText: (pos?: { x: number; y: number }) => Promise<unknown> | unknown
  offsets?: CanvasDropCenterOffsets
}

export function useCanvasDrop({
  addNode,
  addSection,
  addText,
  offsets = DEFAULT_DROP_OFFSETS,
}: UseCanvasDropOptions) {
  const { screenToFlowPosition } = useReactFlow()

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) {
        return
      }

      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      if (type === 'node') {
        const x = Math.round(flowPosition.x - offsets.node.x)
        const y = Math.round(flowPosition.y - offsets.node.y)
        addNode({ x, y })
      } else if (type === 'section') {
        const x = Math.round(flowPosition.x - offsets.section.x)
        const y = Math.round(flowPosition.y - offsets.section.y)
        addSection({ x, y })
      } else if (type === 'text') {
        const x = Math.round(flowPosition.x - offsets.text.x)
        const y = Math.round(flowPosition.y - offsets.text.y)
        addText({ x, y })
      }
    },
    [screenToFlowPosition, addNode, addSection, addText, offsets],
  )

  return {
    onDragOver,
    onDrop,
  }
}
