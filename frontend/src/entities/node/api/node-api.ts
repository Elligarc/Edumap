import { endpoints } from '@/shared/api/endpoints'
import { httpClient } from '@/shared/api/http-client'
import type {
  CreateNodeRequest,
  CreateResourceRequest,
  CreateSectionRequest,
  CreateTextRequest,
  NodeResourceResponse,
  NodeResponse,
  RoadmapEdgeRequest,
  RoadmapEdgeResponse,
  SectionResponse,
  TextResponse,
  UpdateNodeRequest,
  UpdateSectionRequest,
  UpdateTextRequest,
} from '@/shared/types/api'

export const nodeApi = {
  createNode: (roadmapId: number | string, data: CreateNodeRequest): Promise<NodeResponse> => {
    return httpClient.post<NodeResponse>(endpoints.roadmaps.nodes(roadmapId), data)
  },

  updateNode: (id: number | string, data: UpdateNodeRequest): Promise<NodeResponse> => {
    return httpClient.patch<NodeResponse>(endpoints.nodes.update(id), data)
  },

  deleteNode: (id: number | string): Promise<void> => {
    return httpClient.delete(endpoints.nodes.delete(id))
  },

  addResource: (
    nodeId: number | string,
    data: CreateResourceRequest,
  ): Promise<NodeResourceResponse> => {
    return httpClient.post<NodeResourceResponse>(endpoints.nodes.addResource(nodeId), data)
  },

  deleteResource: (nodeId: number | string, resourceId: number | string): Promise<void> => {
    return httpClient.delete(endpoints.nodes.deleteResource(nodeId, resourceId))
  },

  createSection: (
    roadmapId: number | string,
    data: CreateSectionRequest,
  ): Promise<SectionResponse> => {
    return httpClient.post<SectionResponse>(endpoints.roadmaps.sections(roadmapId), data)
  },

  updateSection: (id: number | string, data: UpdateSectionRequest): Promise<SectionResponse> => {
    return httpClient.patch<SectionResponse>(endpoints.sections.update(id), data)
  },

  deleteSection: (id: number | string): Promise<void> => {
    return httpClient.delete(endpoints.sections.delete(id))
  },

  createText: (roadmapId: number | string, data: CreateTextRequest): Promise<TextResponse> => {
    return httpClient.post<TextResponse>(endpoints.roadmaps.texts(roadmapId), data)
  },

  updateText: (id: number | string, data: UpdateTextRequest): Promise<TextResponse> => {
    return httpClient.patch<TextResponse>(endpoints.texts.update(id), data)
  },

  deleteText: (id: number | string): Promise<void> => {
    return httpClient.delete(endpoints.texts.delete(id))
  },

  syncEdges: (
    roadmapId: number | string,
    edges: RoadmapEdgeRequest[],
  ): Promise<RoadmapEdgeResponse[]> => {
    return httpClient.put<RoadmapEdgeResponse[]>(endpoints.roadmaps.edges(roadmapId), edges)
  },
}
