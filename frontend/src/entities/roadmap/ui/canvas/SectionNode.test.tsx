import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import { SectionNode } from './SectionNode'

describe('SectionNode', () => {
  it('отображает заголовок секции', () => {
    const data = {
      title: 'Основы архитектуры',
      width: 400,
      height: 300,
    }

    render(
      <ReactFlowProvider>
        <SectionNode id="section-1" data={data} selected={false} />
      </ReactFlowProvider>,
    )

    expect(screen.getByText('Основы архитектуры')).toBeInTheDocument()
  })

  it('отображает заголовок по умолчанию, если title отсутствует', () => {
    render(
      <ReactFlowProvider>
        <SectionNode id="section-2" data={{}} selected={false} />
      </ReactFlowProvider>,
    )

    expect(screen.getByText('Секция')).toBeInTheDocument()
  })

  it('не рендерит NodeResizer при isViewer=true даже если selected=true', () => {
    const { container } = render(
      <ReactFlowProvider>
        <SectionNode
          id="section-3"
          data={{ title: 'Просмотр', isViewer: true }}
          selected={true}
        />
      </ReactFlowProvider>,
    )

    expect(container.querySelector('.react-flow__resize-control')).not.toBeInTheDocument()
  })
})
