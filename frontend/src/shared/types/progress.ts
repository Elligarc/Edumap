export interface ProgressRoadmapCard {
  roadmapId: number
  title: string
  description?: string | null
  category?: string | null
  difficulty?: string | null
  nodesCount: number
  completedNodesCount: number
  progressPercent: number
  rating: number
  participantsCount: number
  isCompleted: boolean
}

export interface MyRoadmapsProgressResponse {
  inProgress: ProgressRoadmapCard[]
  completed: ProgressRoadmapCard[]
}

export interface RoadmapProgressDetailResponse {
  roadmapId: number
  isEnrolled: boolean
  totalNodes: number
  completedNodes: number
  progressPercent: number
  completedNodeIds: number[]
}
