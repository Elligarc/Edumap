import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import { ConstructorNode } from './ConstructorNode'

describe('ConstructorNode', () => {
  it('отображает узел с типом START и ресурсами', () => {
    const data = {
      title: 'Основы HTML',
      type: 'START' as const,
      content: 'Изучите теги и структуру документа',
      resources: [{ id: 1, title: 'HTML MDN', url: 'https://mdn.io', type: null }],
    }

    render(
      <ReactFlowProvider>
        <ConstructorNode data={data} selected={false} />
      </ReactFlowProvider>,
    )

    expect(screen.getByText(/начало/i)).toBeInTheDocument()
    expect(screen.getByText('Основы HTML')).toBeInTheDocument()
    expect(screen.getByText('Изучите теги и структуру документа')).toBeInTheDocument()
    expect(screen.getByText(/1 ресурс/)).toBeInTheDocument()
  })

  it('отображает узел с типом END', () => {
    const data = {
      title: 'Сертификация',
      type: 'END' as const,
      content: 'Сдача финального проекта',
    }

    render(
      <ReactFlowProvider>
        <ConstructorNode data={data} selected={false} />
      </ReactFlowProvider>,
    )

    expect(screen.getByText('Финал')).toBeInTheDocument()
    expect(screen.getByText('Сертификация')).toBeInTheDocument()
  })
})
