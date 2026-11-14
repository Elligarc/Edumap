
export interface ApiErrorResponse {
  code: string
  detail: string
  fieldErrors?: Record<string, string>
}

export interface UserSummary {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  user: UserSummary
  accessToken: string
}

export interface TokenRefreshResponse {
  accessToken: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserProfileResponse {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export type RoadmapVisibility = 'PUBLISHED' | 'PRIVATE' | 'HIDDEN'
export type RoadmapDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export interface RoadmapResponse {
  id: number
  title: string
  description: string | null
  category: string | null
  difficulty: RoadmapDifficulty | null
  visibility: RoadmapVisibility
  price: number | null
  authorId: number
  authorName?: string | null
  nodesCount?: number
  rating?: number | null
  ratingsCount?: number | null
  studentsCount?: number | null
  currentUserRating?: number | null
  createdAt: string
  updatedAt: string
}

export interface RoadmapRatingResponse {
  roadmapId: number
  averageRating: number | null
  ratingsCount: number
  currentUserRating?: number | null
}

export interface SetRoadmapRatingRequest {
  rating: number
}

export interface CreateRoadmapRequest {
  title: string
  description?: string | null
  category?: string | null
  difficulty?: RoadmapDifficulty | null
  visibility?: RoadmapVisibility
  price?: number | null
}

export interface UpdateRoadmapRequest {
  title?: string
  description?: string | null
  category?: string | null
  difficulty?: RoadmapDifficulty | null
  visibility?: RoadmapVisibility
  price?: number | null
}

export type NodeType = 'DEFAULT' | 'START' | 'END'

export interface NodeResourceResponse {
  id: number
  title: string
  url: string
  type: string | null
}

export interface NodeResponse {
  id: number
  roadmapId: number
  title: string
  description: string | null
  type: NodeType
  required: boolean
  positionX: number
  positionY: number
  parentNodeId: number | null
  resources: NodeResourceResponse[]
  createdAt: string
  updatedAt: string
}

export interface CreateNodeRequest {
  title: string
  description?: string | null
  type?: NodeType
  required?: boolean
  positionX?: number
  positionY?: number
  parentNodeId?: number | null
}

export interface UpdateNodeRequest {
  title?: string
  description?: string | null
  type?: NodeType
  required?: boolean
  positionX?: number
  positionY?: number
  parentNodeId?: number | null
}

export interface CreateResourceRequest {
  title: string
  url: string
  type?: string | null
}

export interface SectionResponse {
  id: number
  roadmapId: number
  title: string
  positionX: number
  positionY: number
  width: number
  height: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CreateSectionRequest {
  title: string
  positionX?: number
  positionY?: number
  width?: number
  height?: number
}

export interface UpdateSectionRequest {
  title?: string
  positionX?: number
  positionY?: number
  width?: number
  height?: number
}

export interface TextResponse {
  id: number
  roadmapId: number
  content: string
  positionX: number
  positionY: number
  createdAt: string
  updatedAt: string
}

export interface CreateTextRequest {
  content: string
  positionX?: number
  positionY?: number
}

export interface UpdateTextRequest {
  content?: string
  positionX?: number
  positionY?: number
}

export interface RoadmapEdgeResponse {
  id: number
  roadmapId: number
  sourceNodeId: number
  targetNodeId: number
  sourceHandle: string | null
  targetHandle: string | null
  createdAt?: string
}

export interface RoadmapEdgeRequest {
  sourceNodeId: number
  targetNodeId: number
  sourceHandle?: string | null
  targetHandle?: string | null
}

export interface RoadmapCanvasResponse {
  roadmapId: number
  title: string
  sections: SectionResponse[]
  nodes: NodeResponse[]
  texts: TextResponse[]
  edges: RoadmapEdgeResponse[]
}

export interface CanvasNodeSyncItem {
  id: number
  title?: string
  type?: NodeType
  content?: string
  isRequired?: boolean
  positionX: number
  positionY: number
  parentNodeId?: number | null
  resources?: CreateResourceRequest[]
}

export interface CanvasSectionSyncItem {
  id: number
  positionX: number
  positionY: number
  width: number
  height: number
  title: string
}

export interface CanvasTextSyncItem {
  id: number
  positionX: number
  positionY: number
  content: string
}

export interface SyncCanvasRequest {
  nodes?: CanvasNodeSyncItem[]
  sections?: CanvasSectionSyncItem[]
  texts?: CanvasTextSyncItem[]
  edges?: RoadmapEdgeRequest[]
  deletedNodeIds?: number[]
  deletedSectionIds?: number[]
  deletedTextIds?: number[]
}

export interface PageResponse<T> {
  items?: T[]
  content?: T[]
  totalElements?: number
  totalPages?: number
  page?: number
  number?: number
  size?: number
}

export * from './progress'

