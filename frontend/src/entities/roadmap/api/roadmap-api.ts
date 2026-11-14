import { endpoints } from '@/shared/api/endpoints'
import { httpClient, type QueryParams } from '@/shared/api/http-client'
import type {
  CreateRoadmapRequest,
  PageResponse,
  RoadmapCanvasResponse,
  RoadmapRatingResponse,
  RoadmapResponse,
  SyncCanvasRequest,
  UpdateRoadmapRequest,
} from '@/shared/types/api'

export const roadmapApi = {
  getRoadmaps: (params?: QueryParams): Promise<PageResponse<RoadmapResponse>> => {
    return httpClient.get<PageResponse<RoadmapResponse>>(endpoints.roadmaps.list(params))
  },

  getRoadmapById: (id: number | string): Promise<RoadmapResponse> => {
    return httpClient.get<RoadmapResponse>(endpoints.roadmaps.byId(id))
  },

  getMyRoadmaps: (): Promise<RoadmapResponse[]> => {
    return httpClient.get<RoadmapResponse[]>(endpoints.roadmaps.my())
  },

  createRoadmap: (data: CreateRoadmapRequest): Promise<RoadmapResponse> => {
    return httpClient.post<RoadmapResponse>(endpoints.roadmaps.create(), data)
  },

  updateRoadmap: (id: number | string, data: UpdateRoadmapRequest): Promise<RoadmapResponse> => {
    return httpClient.patch<RoadmapResponse>(endpoints.roadmaps.update(id), data)
  },

  deleteRoadmap: (id: number | string): Promise<void> => {
    return httpClient.delete(endpoints.roadmaps.delete(id))
  },

  publishRoadmap: (id: number | string): Promise<RoadmapResponse> => {
    return httpClient.post<RoadmapResponse>(endpoints.roadmaps.publish(id))
  },

  hideRoadmap: (id: number | string): Promise<RoadmapResponse> => {
    return httpClient.post<RoadmapResponse>(endpoints.roadmaps.hide(id))
  },

  getCanvas: (roadmapId: number | string): Promise<RoadmapCanvasResponse> => {
    return httpClient.get<RoadmapCanvasResponse>(endpoints.roadmaps.canvas(roadmapId))
  },

  syncCanvas: (
    roadmapId: number | string,
    payload: SyncCanvasRequest,
  ): Promise<RoadmapCanvasResponse> => {
    return httpClient.put<RoadmapCanvasResponse>(endpoints.roadmaps.canvas(roadmapId), payload)
  },

  rateRoadmap: (
    roadmapId: number | string,
    rating: number,
  ): Promise<RoadmapRatingResponse> => {
    return httpClient.post<RoadmapRatingResponse>(endpoints.roadmaps.rating(roadmapId), { rating })
  },

  getRoadmapRating: (roadmapId: number | string): Promise<RoadmapRatingResponse> => {
    return httpClient.get<RoadmapRatingResponse>(endpoints.roadmaps.rating(roadmapId))
  },
}
