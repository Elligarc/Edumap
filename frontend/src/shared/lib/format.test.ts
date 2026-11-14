import { describe, it, expect } from 'vitest'
import {
  pluralizeRu,
  formatNodesCount,
  formatParticipantsCount,
  formatDate,
  formatDateTime,
} from './format'

describe('format utilities', () => {
  it('correctly pluralizes Russian words', () => {
    expect(pluralizeRu(0, 'узел', 'узла', 'узлов')).toBe('0 узлов')
    expect(pluralizeRu(1, 'узел', 'узла', 'узлов')).toBe('1 узел')
    expect(pluralizeRu(2, 'узел', 'узла', 'узлов')).toBe('2 узла')
    expect(pluralizeRu(4, 'узел', 'узла', 'узлов')).toBe('4 узла')
    expect(pluralizeRu(5, 'узел', 'узла', 'узлов')).toBe('5 узлов')
    expect(pluralizeRu(11, 'узел', 'узла', 'узлов')).toBe('11 узлов')
    expect(pluralizeRu(12, 'узел', 'узла', 'узлов')).toBe('12 узлов')
    expect(pluralizeRu(21, 'узел', 'узла', 'узлов')).toBe('21 узел')
    expect(pluralizeRu(24, 'узел', 'узла', 'узлов')).toBe('24 узла')
  })

  it('formats nodes count correctly', () => {
    expect(formatNodesCount(1)).toBe('1 узел')
    expect(formatNodesCount(2)).toBe('2 узла')
    expect(formatNodesCount(4)).toBe('4 узла')
    expect(formatNodesCount(6)).toBe('6 узлов')
  })

  it('formats participants count correctly', () => {
    expect(formatParticipantsCount(0)).toBe('0 участников')
    expect(formatParticipantsCount(1)).toBe('1 участник')
    expect(formatParticipantsCount(2)).toBe('2 участника')
    expect(formatParticipantsCount(5)).toBe('5 участников')
    expect(formatParticipantsCount(14)).toBe('14 участников')
    expect(formatParticipantsCount(21)).toBe('21 участник')
  })

  it('formats dates', () => {
    const iso = '2026-11-09T10:00:00Z'
    expect(formatDate(iso)).toBeTruthy()
    expect(formatDateTime(iso)).toBeTruthy()
  })
})
