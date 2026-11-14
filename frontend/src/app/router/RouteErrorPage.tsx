import { isRouteErrorResponse, useRouteError } from 'react-router'

export function RouteErrorPage() {
  const error = useRouteError()

  let title = 'Что-то пошло не так'
  let detail: string | undefined

  if (isRouteErrorResponse(error)) {
    title = `Ошибка ${error.status}`
    detail =
      typeof error.data === 'object' && error.data !== null && 'detail' in error.data
        ? String((error.data as Record<string, unknown>).detail)
        : error.statusText
  } else if (error instanceof Error) {
    detail = error.message
  }

  return (
    <main style={{ padding: 'var(--space-6)', fontFamily: 'var(--font-sans)' }} role="alert">
      <h1 style={{ marginBottom: 'var(--space-2)' }}>{title}</h1>
      {detail ? <p style={{ color: 'var(--color-text-muted)' }}>{detail}</p> : null}
      <a href="/">Вернуться на главную</a>
    </main>
  )
}
