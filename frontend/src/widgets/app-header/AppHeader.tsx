import { Link, useLocation } from 'react-router'
import { Map, Flame, User, LayoutGrid, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAppHeader } from './useAppHeader'
import './AppHeader.css'

export function AppHeader() {
  const location = useLocation()
  const {
    user,
    isAuthenticated,
    isInitialized,
    isMenuOpen,
    isMobileNavOpen,
    menuRef,
    toggleMenu,
    toggleMobileNav,
    closeMobileNav,
    handleLogout,
    handleProfileClick,
    handleSettingsClick,
  } = useAppHeader()

  const isHome = location.pathname === '/'
  const isCatalog = location.pathname === '/catalog'
  const isProfile = location.pathname.startsWith('/profile')

  return (
    <header className="app-header">
      <div className="app-header-left">
        <button
          type="button"
          className="app-header-mobile-toggle"
          onClick={toggleMobileNav}
          aria-label={isMobileNavOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMobileNavOpen}
        >
          {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="app-header-logo-badge">
            <Map size={18} />
          </div>
          <span className="app-header-logo-text">Roadmap</span>
        </Link>
      </div>

      <nav className="app-header-nav" aria-label="Основная навигация">
        <Link
          to="/"
          className={`app-header-link ${isHome ? 'app-header-link--active' : ''}`}
        >
          Главная
        </Link>
        <Link
          to="/catalog"
          className={`app-header-link ${isCatalog ? 'app-header-link--active' : ''}`}
        >
          Каталог
        </Link>
        <Link
          to={isAuthenticated ? '/profile/roadmaps' : '/login'}
          className={`app-header-link ${isProfile ? 'app-header-link--active' : ''}`}
        >
          Мое обучение
        </Link>
      </nav>

      <div className="app-header-right">
        {!isInitialized ? (
          <div className="app-header-skeleton" data-testid="app-header-skeleton" />
        ) : isAuthenticated ? (
          <>
            <div className="app-header-streak" title="Ваша активность">
              <div className="app-header-streak-icon">
                <Flame size={14} />
              </div>
              <div className="flex flex-col">
                <span className="app-header-streak-title">99 дней</span>
                <span className="app-header-streak-subtitle">подряд</span>
              </div>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="app-header-user-btn"
                onClick={toggleMenu}
                aria-label="Меню пользователя"
                aria-expanded={isMenuOpen}
              >
                <User size={18} />
              </button>

              {isMenuOpen && (
                <div className="app-header-menu">
                  <div className="app-header-menu-header">
                    <p className="app-header-menu-name">{user?.name || 'Пользователь'}</p>
                    <p className="app-header-menu-email">{user?.email}</p>
                  </div>

                  <button
                    type="button"
                    className="app-header-menu-item"
                    onClick={handleProfileClick}
                  >
                    <LayoutGrid size={16} />
                    <span>Мои карты</span>
                  </button>

                  <button
                    type="button"
                    className="app-header-menu-item"
                    onClick={handleSettingsClick}
                  >
                    <Settings size={16} />
                    <span>Настройки</span>
                  </button>

                  <div className="app-header-menu-divider" />

                  <button
                    type="button"
                    className="app-header-menu-item app-header-menu-item--danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Выйти</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="app-header-login-btn">
              Войти
            </Link>
            <Link to="/register" className="app-header-register-btn">
              Регистрация
            </Link>
          </>
        )}
      </div>

      {isMobileNavOpen && (
        <nav className="app-header-mobile-nav" aria-label="Мобильная навигация">
          <Link
            to="/"
            className={`app-header-mobile-link ${isHome ? 'app-header-mobile-link--active' : ''}`}
            onClick={closeMobileNav}
          >
            Главная
          </Link>
          <Link
            to="/catalog"
            className={`app-header-mobile-link ${isCatalog ? 'app-header-mobile-link--active' : ''}`}
            onClick={closeMobileNav}
          >
            Каталог
          </Link>
          <Link
            to={isAuthenticated ? '/profile/roadmaps' : '/login'}
            className={`app-header-mobile-link ${isProfile ? 'app-header-mobile-link--active' : ''}`}
            onClick={closeMobileNav}
          >
            Мое обучение
          </Link>
        </nav>
      )}
    </header>
  )
}
