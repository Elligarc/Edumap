import { HttpError } from '@/shared/api/http-client'

export function getErrorMessage(
  err: unknown,
  codeMap: Record<string, string> = {},
  fallback = 'Не удалось подключиться к серверу. Попробуйте позже.',
): string {
  if (err instanceof HttpError) {
    if (err.code && codeMap[err.code]) {
      return codeMap[err.code]
    }
    return err.message || fallback
  }
  if (err instanceof Error && err.message) {
    return err.message
  }
  return fallback
}
