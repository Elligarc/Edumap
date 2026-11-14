import { render, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConstructorProvider } from '../model/ConstructorContext'
import { ConstructorCanvas } from './ConstructorCanvas'
import { nodeApi } from '@/entities/node'

import type { NodeResponse } from '@/shared/types/api'

vi.spyOn(nodeApi, 'createNode').mockResolvedValue({
  id: 101,
  roadmapId: 1,
  title: 'Новый шаг',
  description: null,
  type: 'DEFAULT',
  required: true,
  positionX: 300,
  positionY: 200,
  parentNodeId: null,
  resources: [],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
} as NodeResponse)

describe('ConstructorCanvas', () => {
  it('рендерит контейнер холста с классом constructor-canvas и узлом ReactFlow', () => {
    const { container } = render(
      <ConstructorProvider roadmapId={1}>
        <ConstructorCanvas />
      </ConstructorProvider>,
    )

    const canvasWrapper = container.querySelector('.constructor-canvas')
    expect(canvasWrapper).toBeInTheDocument()

    const reactFlowElement = container.querySelector('.react-flow')
    expect(reactFlowElement).toBeInTheDocument()
  })

  it('обрабатывает dragOver и drop на контейнере холста без ошибок', async () => {
    const { container } = render(
      <ConstructorProvider roadmapId={1}>
        <ConstructorCanvas />
      </ConstructorProvider>,
    )

    const canvasWrapper = container.querySelector('.constructor-canvas')!
    expect(canvasWrapper).toBeInTheDocument()

    const dragOverSuccess = fireEvent.dragOver(canvasWrapper, {
      dataTransfer: { dropEffect: '' },
    })
    expect(dragOverSuccess).toBe(false)

    await act(async () => {
      fireEvent.drop(canvasWrapper, {
        dataTransfer: {
          getData: (type: string) => (type === 'application/reactflow' ? 'node' : ''),
        },
        clientX: 300,
        clientY: 200,
      })
    })
  })
})
