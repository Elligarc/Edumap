import { describe, it, expect } from 'vitest'
import { transformCanvasToElements, DEFAULT_EDGE_MARKER } from './canvas-transformers'
import type { RoadmapCanvasResponse } from '@/shared/types/api'

describe('canvas-transformers', () => {
  it('transformCanvasToElements присваивает ребрам zIndex: 1 чтобы они отображались поверх секций', () => {
    const mockCanvas: RoadmapCanvasResponse = {
      roadmapId: 1,
      title: 'Roadmap Test',
      sections: [
        {
          id: 1,
          roadmapId: 1,
          title: 'Section A',
          positionX: 100,
          positionY: 100,
          width: 400,
          height: 300,
          sortOrder: 0,
          createdAt: '',
          updatedAt: '',
        },
      ],
      nodes: [
        {
          id: 10,
          roadmapId: 1,
          title: 'Node 1',
          description: null,
          type: 'START',
          required: true,
          positionX: 150,
          positionY: 150,
          parentNodeId: null,
          resources: [],
          createdAt: '',
          updatedAt: '',
        },
        {
          id: 20,
          roadmapId: 1,
          title: 'Node 2',
          description: null,
          type: 'DEFAULT',
          required: true,
          positionX: 150,
          positionY: 250,
          parentNodeId: 10,
          resources: [],
          createdAt: '',
          updatedAt: '',
        },
      ],
      texts: [],
      edges: [
        {
          id: 100,
          roadmapId: 1,
          sourceNodeId: 10,
          targetNodeId: 20,
          sourceHandle: 'bottom',
          targetHandle: 'top',
        },
      ],
    }

    const { nodes, edges } = transformCanvasToElements(mockCanvas)

    const section = nodes.find((n) => n.id === 'section-1')
    expect(section?.zIndex).toBe(0)

    const edge = edges.find((e) => e.id === 'edge-10-20')
    expect(edge).toBeDefined()
    expect(edge?.zIndex).toBe(1)
    expect(edge?.markerEnd).toEqual(DEFAULT_EDGE_MARKER)
  })
})
