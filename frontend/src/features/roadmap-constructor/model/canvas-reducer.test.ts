import { describe, it, expect } from 'vitest'
import type { Edge, Node } from '@xyflow/react'
import { canvasReducer, initialCanvasState } from './canvas-reducer'
import { isValidConnection } from './canvas-connections'

describe('canvasReducer', () => {
  it('должен инициализировать элементы и сбрасывать isDirty', () => {
    const nodes: Node[] = [{ id: 'node-1', position: { x: 0, y: 0 }, data: { title: 'Шаг 1' } }]
    const edges: Edge[] = [{ id: 'edge-1-2', source: 'node-1', target: 'node-2' }]
    const state = canvasReducer(initialCanvasState, {
      type: 'SET_ELEMENTS',
      nodes,
      edges,
    })

    expect(state.nodes).toEqual(nodes)
    expect(state.edges).toEqual(edges)
    expect(state.isDirty).toBe(false)
  })

  it('должен обновлять данные узла и синхронизировать selectedElement', () => {
    const initialState = {
      ...initialCanvasState,
      nodes: [{ id: 'node-1', position: { x: 0, y: 0 }, data: { title: 'Старый' } }],
      selectedElement: { id: 'node-1', position: { x: 0, y: 0 }, data: { title: 'Старый' } },
    }

    const state = canvasReducer(initialState, {
      type: 'UPDATE_NODE_DATA',
      id: 'node-1',
      data: { title: 'Новый' },
    })

    expect(state.nodes[0].data.title).toBe('Новый')
    expect((state.selectedElement as Node).data.title).toBe('Новый')
    expect(state.isDirty).toBe(true)
  })

  it('должен атомарно удалять узел и все связанные входящие и исходящие ребра', () => {
    const initialState = {
      ...initialCanvasState,
      nodes: [
        { id: 'node-1', position: { x: 0, y: 0 }, data: {} },
        { id: 'node-2', position: { x: 0, y: 0 }, data: {} },
        { id: 'node-3', position: { x: 0, y: 0 }, data: {} },
      ],
      edges: [
        { id: 'edge-1-2', source: 'node-1', target: 'node-2' },
        { id: 'edge-2-3', source: 'node-2', target: 'node-3' },
        { id: 'edge-1-3', source: 'node-1', target: 'node-3' },
      ],
      selectedElement: { id: 'node-2', position: { x: 0, y: 0 }, data: {} },
    }

    const state = canvasReducer(initialState, {
      type: 'DELETE_NODE',
      id: 'node-2',
    })

    expect(state.nodes.map((n) => n.id)).toEqual(['node-1', 'node-3'])
    expect(state.edges.map((e) => e.id)).toEqual(['edge-1-3'])
    expect(state.selectedElement).toBeNull()
    expect(state.isDirty).toBe(true)
  })

  it('должен изменять размер секции и обновлять selectedElement', () => {
    const initialState = {
      ...initialCanvasState,
      nodes: [
        {
          id: 'section-1',
          position: { x: 0, y: 0 },
          data: { width: 380, height: 260 },
          style: { width: 380, height: 260 },
        },
      ],
      selectedElement: {
        id: 'section-1',
        position: { x: 0, y: 0 },
        data: { width: 380, height: 260 },
        style: { width: 380, height: 260 },
      },
    }

    const state = canvasReducer(initialState, {
      type: 'RESIZE_SECTION',
      secId: 'section-1',
      width: 500,
      height: 400,
    })

    expect(state.nodes[0].style?.width).toBe(500)
    expect(state.nodes[0].data.height).toBe(400)
    expect((state.selectedElement as Node).style?.width).toBe(500)
  })

  it('SET_NODES должен сохранять актуальные данные в selectedElement если выбранный узел обновился', () => {
    const initialState = {
      ...initialCanvasState,
      nodes: [
        {
          id: 'node-1',
          position: { x: 0, y: 0 },
          data: { title: 'Node 1', resources: [] },
        },
      ],
      selectedElement: {
        id: 'node-1',
        position: { x: 0, y: 0 },
        data: { title: 'Node 1', resources: [] },
      },
    }

    const state = canvasReducer(initialState, {
      type: 'SET_NODES',
      nodes: (prev) =>
        prev.map((n) =>
          n.id === 'node-1'
            ? { ...n, data: { ...n.data, resources: [{ id: 1, title: 'Docs', url: 'https://docs.io', type: 'DOCS' }] } }
            : n,
        ),
    })

    expect(state.nodes[0].data.resources).toHaveLength(1)
    expect((state.selectedElement as Node).data.resources).toHaveLength(1)
    expect(state.isDirty).toBe(true)
  })

  it('должен восстанавливать узлы и ребра через RESTORE_ELEMENTS', () => {
    const initialState = {
      ...initialCanvasState,
      nodes: [{ id: 'node-1', position: { x: 0, y: 0 }, data: {} }],
      edges: [],
    }

    const state = canvasReducer(initialState, {
      type: 'RESTORE_ELEMENTS',
      nodes: [{ id: 'node-2', position: { x: 100, y: 100 }, data: {}, selected: true }],
      edges: [{ id: 'edge-1-2', source: 'node-1', target: 'node-2', selected: true }],
    })

    expect(state.nodes.map((n) => n.id)).toEqual(['node-1', 'node-2'])
    expect(state.nodes[1].selected).toBe(false)
    expect(state.edges.map((e) => e.id)).toEqual(['edge-1-2'])
    expect(state.edges[0].selected).toBe(false)
    expect(state.selectedElement).toBeNull()
    expect(state.isDirty).toBe(true)
  })

  it('должен удалять набор узлов и ребер через REMOVE_ELEMENTS', () => {
    const initialState = {
      ...initialCanvasState,
      nodes: [
        { id: 'node-1', position: { x: 0, y: 0 }, data: {} },
        { id: 'node-2', position: { x: 100, y: 100 }, data: {} },
      ],
      edges: [{ id: 'edge-1-2', source: 'node-1', target: 'node-2' }],
      selectedElement: { id: 'node-2', position: { x: 100, y: 100 }, data: {} },
    }

    const state = canvasReducer(initialState, {
      type: 'REMOVE_ELEMENTS',
      nodeIds: ['node-2'],
      edgeIds: [],
    })

    expect(state.nodes.map((n) => n.id)).toEqual(['node-1'])
    expect(state.edges).toEqual([])
    expect(state.selectedElement).toBeNull()
    expect(state.isDirty).toBe(true)
  })
})

describe('isValidConnection', () => {
  it('запрещает самосоединение', () => {
    expect(isValidConnection({ source: 'node-1', target: 'node-1' }, [])).toBe(false)
  })

  it('запрещает соединение не-узлов (например секций или текстов)', () => {
    expect(isValidConnection({ source: 'section-1', target: 'node-2' }, [])).toBe(false)
    expect(isValidConnection({ source: 'node-1', target: 'text-2' }, [])).toBe(false)
  })

  it('запрещает дублирующие ребра в обоих направлениях', () => {
    const existingEdges: Edge[] = [{ id: 'e1', source: 'node-1', target: 'node-2' }]
    expect(isValidConnection({ source: 'node-1', target: 'node-2' }, existingEdges)).toBe(false)
    expect(isValidConnection({ source: 'node-2', target: 'node-1' }, existingEdges)).toBe(false)
  })

  it('разрешает валидное новое ребро между узлами', () => {
    const existingEdges: Edge[] = [{ id: 'e1', source: 'node-1', target: 'node-2' }]
    expect(isValidConnection({ source: 'node-1', target: 'node-3' }, existingEdges)).toBe(true)
  })
})
