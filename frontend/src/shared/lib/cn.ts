export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | Record<string, boolean | undefined | null>

export function cn(...values: ClassValue[]): string {
  const result: string[] = []

  for (const value of values) {
    if (!value) continue

    if (typeof value === 'string' || typeof value === 'number') {
      result.push(String(value))
      continue
    }

    if (typeof value === 'object') {
      for (const [key, enabled] of Object.entries(value)) {
        if (enabled) result.push(key)
      }
    }
  }

  return result.join(' ')
}
