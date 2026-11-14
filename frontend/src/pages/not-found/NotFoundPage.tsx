import './NotFoundPage.css'

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <h1 className="not-found-title">Страница не найдена</h1>
      <p className="not-found-desc">Проверьте адрес или вернитесь на главную.</p>
      <a href="/" className="not-found-link">
        На главную
      </a>
    </main>
  )
}
