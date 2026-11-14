import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import { ViewerNode } from './ViewerNode'

describe('ViewerNode', () => {
  it('отображает статус "Пройдено" если узел завершен', () => {
    const data = {
      title: 'JavaScript переменные',
      type: 'DEFAULT' as const,
      content: 'let, const, var',
      isCompleted: true,
    }

    render(
      <ReactFlowProvider>
        <ViewerNode data={data} selected={false} />
      </ReactFlowProvider>,
    )

    expect(screen.getByText('JavaScript переменные')).toBeInTheDocument()
    expect(screen.getByText('Пройдено')).toBeInTheDocument()
  })

  it('скрывает точки прикрепления ребер (хэндлы) в режиме просмотра', () => {
    const data = {
      title: 'JavaScript переменные',
      type: 'DEFAULT' as const,
    }

    const { container } = render(
      <ReactFlowProvider>
        <ViewerNode data={data} selected={false} />
      </ReactFlowProvider>,
    )

    const handles = container.querySelectorAll('.react-flow__handle')
    expect(handles.length).toBe(4)
    handles.forEach((handle) => {
      expect(handle).toHaveClass('viewer-node-handle')
    })
  })

  it('применяет класс viewer-node--selected только при selected=true', () => {
    const data = {
      title: 'JavaScript переменные',
      type: 'DEFAULT' as const,
    }

    const { container, rerender } = render(
      <ReactFlowProvider>
        <ViewerNode data={data} selected={true} />
      </ReactFlowProvider>,
    )

    const nodeElement = container.querySelector('.viewer-node')
    expect(nodeElement).toHaveClass('viewer-node--selected')

    rerender(
      <ReactFlowProvider>
        <ViewerNode data={data} selected={false} />
      </ReactFlowProvider>,
    )

    expect(nodeElement).not.toHaveClass('viewer-node--selected')
  })
})
