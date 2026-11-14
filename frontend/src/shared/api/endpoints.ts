export const endpoints = {
  base: '/api/v1',
  auth: {
    register: (): string => '/api/v1/auth/register',
    login: (): string => '/api/v1/auth/login',
    refresh: (): string => '/api/v1/auth/refresh',
    logout: (): string => '/api/v1/auth/logout',
  },
  users: {
    me: (): string => '/api/v1/users/me',
    changePassword: (): string => '/api/v1/users/me/password',
  },
  roadmaps: {
    my: (): string => '/api/v1/roadmaps/my',
    list: (params: Record<string, string | number | boolean | undefined | null> = {}): string => {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value))
        }
      })
      const qs = searchParams.toString()
      return `/api/v1/roadmaps${qs ? `?${qs}` : ''}`
    },
    byId: (id: number | string): string => `/api/v1/roadmaps/${id}`,
    create: (): string => '/api/v1/roadmaps',
    update: (id: number | string): string => `/api/v1/roadmaps/${id}`,
    delete: (id: number | string): string => `/api/v1/roadmaps/${id}`,
    publish: (id: number | string): string => `/api/v1/roadmaps/${id}/publish`,
    hide: (id: number | string): string => `/api/v1/roadmaps/${id}/hide`,
    nodes: (roadmapId: number | string): string => `/api/v1/roadmaps/${roadmapId}/nodes`,
    sections: (roadmapId: number | string): string => `/api/v1/roadmaps/${roadmapId}/sections`,
    texts: (roadmapId: number | string): string => `/api/v1/roadmaps/${roadmapId}/texts`,
    edges: (roadmapId: number | string): string => `/api/v1/roadmaps/${roadmapId}/edges`,
    canvas: (roadmapId: number | string): string => `/api/v1/roadmaps/${roadmapId}/canvas`,
    rating: (roadmapId: number | string): string => `/api/v1/roadmaps/${roadmapId}/rating`,
  },
  sections: {
    byId: (id: number | string): string => `/api/v1/sections/${id}`,
    update: (id: number | string): string => `/api/v1/sections/${id}`,
    delete: (id: number | string): string => `/api/v1/sections/${id}`,
  },
  texts: {
    byId: (id: number | string): string => `/api/v1/texts/${id}`,
    update: (id: number | string): string => `/api/v1/texts/${id}`,
    delete: (id: number | string): string => `/api/v1/texts/${id}`,
  },
  nodes: {
    byId: (id: number | string): string => `/api/v1/nodes/${id}`,
    update: (id: number | string): string => `/api/v1/nodes/${id}`,
    delete: (id: number | string): string => `/api/v1/nodes/${id}`,
    addResource: (nodeId: number | string): string => `/api/v1/nodes/${nodeId}/resources`,
    deleteResource: (nodeId: number | string, resourceId: number | string): string =>
      `/api/v1/nodes/${nodeId}/resources/${resourceId}`,
  },
  progress: {
    myRoadmaps: (): string => '/api/v1/progress/my-roadmaps',
    roadmapProgress: (roadmapId: number | string): string =>
      `/api/v1/progress/roadmaps/${roadmapId}`,
    enroll: (roadmapId: number | string): string =>
      `/api/v1/progress/roadmaps/${roadmapId}/enroll`,
    unenroll: (roadmapId: number | string): string =>
      `/api/v1/progress/roadmaps/${roadmapId}/enroll`,
    toggleNode: (roadmapId: number | string, nodeId: number | string): string =>
      `/api/v1/progress/roadmaps/${roadmapId}/nodes/${nodeId}/toggle`,
  },
}
