import { describe, expect, it } from 'vitest'
import { buildUrl } from '@/shared/api/http-client'

describe('buildUrl', () => {
  it('добавляет базовый путь API', () => {
    expect(buildUrl('/roadmaps')).toBe('/api/v1/roadmaps')
  })

  it('не дублирует базовый путь, если он уже присутствует', () => {
    expect(buildUrl('/api/v1/roadmaps')).toBe('/api/v1/roadmaps')
  })

  it('не добавляет базовый путь для абсолютного URL', () => {
    expect(buildUrl('https://example.com/roadmaps')).toBe('https://example.com/roadmaps')
  })

  it('сериализует параметры запроса', () => {
    expect(buildUrl('/roadmaps', { q: 'java', page: 0, size: 20 })).toBe(
      '/api/v1/roadmaps?q=java&page=0&size=20',
    )
  })

  it('пропускает пустые параметры', () => {
    expect(buildUrl('/roadmaps', { q: '', category: undefined, page: 1 })).toBe(
      '/api/v1/roadmaps?page=1',
    )
  })
})
