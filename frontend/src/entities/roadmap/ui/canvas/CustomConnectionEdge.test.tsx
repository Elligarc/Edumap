import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReactFlowProvider, Position } from '@xyflow/react'
import { CustomConnectionEdge } from './CustomConnectionEdge'

describe('CustomConnectionEdge', () => {
  it('отображает ребро с дефолтными пунктирными стилями если не выбрано', () => {
    const { container } = render(
      <ReactFlowProvider>
        <svg>
          <CustomConnectionEdge
            id="edge-1-2"
            source="node-1"
            target="node-2"
            sourceX={0}
            sourceY={0}
            targetX={100}
            targetY={100}
            sourcePosition={Position.Bottom}
            targetPosition={Position.Top}
            selected={false}
          />
        </svg>
      </ReactFlowProvider>,
    )

    const path = container.querySelector('.react-flow__edge-path')
    expect(path).toBeInTheDocument()
    expect(path).toHaveStyle({ stroke: 'rgb(2, 132, 199)' })
  })

  it('отображает ребро с активным стилем когда ребро выбрано', () => {
    const { container } = render(
      <ReactFlowProvider>
        <svg>
          <CustomConnectionEdge
            id="edge-1-2"
            source="node-1"
            target="node-2"
            sourceX={0}
            sourceY={0}
            targetX={100}
            targetY={100}
            sourcePosition={Position.Bottom}
            targetPosition={Position.Top}
            selected={true}
          />
        </svg>
      </ReactFlowProvider>,
    )

    const path = container.querySelector('.react-flow__edge-path')
    expect(path).toBeInTheDocument()
    expect(path).toHaveStyle({ stroke: 'rgb(3, 105, 161)', strokeWidth: '2.5' })
  })

  it('применяет маркер стрелки на конце ребра через markerEnd', () => {
    const { container } = render(
      <ReactFlowProvider>
        <svg>
          <CustomConnectionEdge
            id="edge-1-2"
            source="node-1"
            target="node-2"
            sourceX={0}
            sourceY={0}
            targetX={100}
            targetY={100}
            sourcePosition={Position.Bottom}
            targetPosition={Position.Top}
            markerEnd="url(#arrow-closed)"
            selected={false}
          />
        </svg>
      </ReactFlowProvider>,
    )

    const path = container.querySelector('.react-flow__edge-path')
    expect(path).toBeInTheDocument()
    expect(path).toHaveAttribute('marker-end', 'url(#arrow-closed)')
  })
})
