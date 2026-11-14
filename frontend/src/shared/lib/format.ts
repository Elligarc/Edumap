const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(value: string | number | Date): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : dateFormatter.format(date)
}

export function formatDateTime(value: string | number | Date): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : dateTimeFormatter.format(date)
}

export function pluralizeRu(count: number, one: string, few: string, many: string): string {
  const abs = Math.abs(count)
  const mod100 = abs % 100
  const mod10 = abs % 10

  if (mod100 >= 11 && mod100 <= 14) {
    return `${count.toLocaleString('ru-RU')} ${many}`
  }
  if (mod10 === 1) {
    return `${count.toLocaleString('ru-RU')} ${one}`
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return `${count.toLocaleString('ru-RU')} ${few}`
  }
  return `${count.toLocaleString('ru-RU')} ${many}`
}

export function formatNodesCount(count: number): string {
  return pluralizeRu(count, 'узел', 'узла', 'узлов')
}

export function formatParticipantsCount(count: number): string {
  return pluralizeRu(count, 'участник', 'участника', 'участников')
}

export function formatRatingsCount(count: number): string {
  return pluralizeRu(count, 'оценка', 'оценки', 'оценок')
}

