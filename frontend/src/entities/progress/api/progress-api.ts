import { endpoints } from '@/shared/api/endpoints'
import { httpClient } from '@/shared/api/http-client'
import type {
  MyRoadmapsProgressResponse,
  RoadmapProgressDetailResponse,
} from '@/shared/types/api'

export const progressApi = {
  getMyRoadmapsProgress: (): Promise<MyRoadmapsProgressResponse> => {
    return httpClient.get<MyRoadmapsProgressResponse>(endpoints.progress.myRoadmaps())
  },

  getRoadmapProgress: (
    roadmapId: number | string,
  ): Promise<RoadmapProgressDetailResponse> => {
    return httpClient.get<RoadmapProgressDetailResponse>(
      endpoints.progress.roadmapProgress(roadmapId),
    )
  },

  enroll: (roadmapId: number | string): Promise<RoadmapProgressDetailResponse> => {
    return httpClient.post<RoadmapProgressDetailResponse>(
      endpoints.progress.enroll(roadmapId),
    )
  },

  unenroll: (roadmapId: number | string): Promise<RoadmapProgressDetailResponse> => {
    return httpClient.delete<RoadmapProgressDetailResponse>(
      endpoints.progress.unenroll(roadmapId),
    )
  },

  toggleNode: (
    roadmapId: number | string,
    nodeId: number | string,
  ): Promise<RoadmapProgressDetailResponse> => {
    return httpClient.post<RoadmapProgressDetailResponse>(
      endpoints.progress.toggleNode(roadmapId, nodeId),
    )
  },
}
