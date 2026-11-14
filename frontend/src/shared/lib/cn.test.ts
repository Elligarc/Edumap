import { describe, expect, it } from 'vitest'
import { cn } from '@/shared/lib/cn'

describe('cn', () => {
  it('объединяет строковые классы', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('отбрасывает пустые и ложные значения', () => {
    expect(cn('a', false, null, undefined, '', 0, 'b')).toBe('a b')
  })

  it('поддерживает условные объекты', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active')
  })

  it('возвращает пустую строку без аргументов', () => {
    expect(cn()).toBe('')
  })
})
