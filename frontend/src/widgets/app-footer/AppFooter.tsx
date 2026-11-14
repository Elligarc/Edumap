import { Link } from 'react-router'
import { Map, Send, Globe, MessageCircle } from 'lucide-react'
import './AppFooter.css'

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-container">
        <Link to="/" className="app-footer-logo">
          <div className="app-footer-logo-badge">
            <Map size={16} />
          </div>
          <span className="app-footer-logo-text">Roadmap</span>
        </Link>

        <nav className="app-footer-nav" aria-label="Подвал сайта">
          <Link to="/" className="app-footer-link">
            Главная
          </Link>
          <Link to="/catalog" className="app-footer-link">
            Каталог
          </Link>
          <a href="mailto:support@ypd.dev" className="app-footer-link">
            Контакты
          </a>
        </nav>

        <div className="app-footer-socials">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="app-footer-social-btn"
            aria-label="Веб-сайт"
          >
            <Globe size={15} />
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="app-footer-social-btn"
            aria-label="Telegram"
          >
            <Send size={15} />
          </a>
          <a
            href="https://vk.com"
            target="_blank"
            rel="noreferrer"
            className="app-footer-social-btn"
            aria-label="Сообщество"
          >
            <MessageCircle size={15} />
          </a>
        </div>
      </div>
    </footer>
  )
}
