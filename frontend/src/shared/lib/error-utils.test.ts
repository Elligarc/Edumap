import { describe, expect, it } from 'vitest'
import { HttpError } from '@/shared/api/http-client'
import { getErrorMessage } from './error-utils'

describe('getErrorMessage', () => {
  it('возвращает сопоставленный текст по коду HttpError', () => {
    const error = new HttpError(401, 'INVALID_CREDENTIALS', 'Unauthorized')
    const message = getErrorMessage(
      error,
      { INVALID_CREDENTIALS: 'Код и пароль неверны' },
      'Fallback message',
    )
    expect(message).toBe('Код и пароль неверны')
  })

  it('возвращает err.message если код не сопоставлен', () => {
    const error = new HttpError(400, 'SOME_UNKNOWN_CODE', 'Специфическая ошибка валидации')
    const message = getErrorMessage(error, {}, 'Fallback message')
    expect(message).toBe('Специфическая ошибка валидации')
  })

  it('возвращает fallback при неизвестных ошибках без сообщения', () => {
    const message = getErrorMessage({}, {}, 'По умолчанию')
    expect(message).toBe('По умолчанию')
  })

  it('извлекает сообщение из стандартного Error', () => {
    const message = getErrorMessage(new Error('Сетевой сбой'))
    expect(message).toBe('Сетевой сбой')
  })
})
