import { env } from '@/shared/config/env'
import type { ApiErrorResponse } from '@/shared/types/api'

export class HttpError extends Error {
  readonly status: number
  readonly code: string
  readonly fieldErrors?: Record<string, string>

  constructor(status: number, code: string, message: string, fieldErrors?: Record<string, string>) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

export type QueryValue = string | number | boolean | null | undefined
export type QueryParams = Record<string, QueryValue>

let currentAccessToken: string | null = null
let refreshHandler: (() => Promise<string | null>) | null = null
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

export function setAccessToken(token: string | null): void {
  currentAccessToken = token
}

export function getAccessToken(): string | null {
  return currentAccessToken
}

export function setUnauthorizedHandler(handler: (() => Promise<string | null>) | null): void {
  refreshHandler = handler
}

export function buildUrl(path: string, query?: QueryParams): string {
  let base = path
  if (!path.startsWith('http')) {
    if (path.startsWith(env.apiBaseUrl)) {
      base = path
    } else {
      base = `${env.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
    }
  }

  if (!query) {
    return base
  }

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value))
    }
  }

  const search = params.toString()
  return search ? `${base}?${search}` : base
}

async function toHttpError(response: Response): Promise<HttpError> {
  let code = `HTTP_${response.status}`
  let detail = response.statusText || 'Ошибка запроса'
  let fieldErrors: Record<string, string> | undefined

  try {
    const body = (await response.json()) as ApiErrorResponse
    if (body.code) code = body.code
    if (body.detail) detail = body.detail
    if (body.fieldErrors) fieldErrors = body.fieldErrors
  } catch {
  }

  return new HttpError(response.status, code, detail, fieldErrors)
}

function getRequestHeaders(body?: unknown, token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const activeToken = token ?? currentAccessToken
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`
  }
  return headers
}

async function executeFetch(
  method: string,
  url: string,
  body?: unknown,
  token?: string | null,
): Promise<Response> {
  return fetch(url, {
    method,
    credentials: 'include',
    headers: getRequestHeaders(body, token),
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const url = buildUrl(path)
  const response = await executeFetch(method, url, body)

  if (response.status === 401 && refreshHandler && !path.includes('/auth/')) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = refreshHandler().finally(() => {
        isRefreshing = false
        refreshPromise = null
      })
    }

    const newToken = await refreshPromise
    if (newToken) {
      const retryResponse = await executeFetch(method, url, body, newToken)
      if (!retryResponse.ok) {
        throw await toHttpError(retryResponse)
      }
      if (retryResponse.status === 204) {
        return undefined as T
      }
      return (await retryResponse.json()) as T
    }
  }

  if (!response.ok) {
    throw await toHttpError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const httpClient = {
  get<T>(path: string, query?: QueryParams): Promise<T> {
    return request<T>('GET', buildUrl(path, query))
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('POST', path, body)
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PUT', path, body)
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PATCH', path, body)
  },

  delete<T = void>(path: string): Promise<T> {
    return request<T>('DELETE', path)
  },
}
