import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/entities/session'

export function useAppHeader() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isInitialized, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const toggleMobileNav = useCallback(() => {
    setIsMobileNavOpen((prev) => !prev)
  }, [])

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false)
  }, [])

  const handleLogout = useCallback(async () => {
    closeMenu()
    closeMobileNav()
    await logout()
    navigate('/')
  }, [closeMenu, closeMobileNav, logout, navigate])

  const handleProfileClick = useCallback(() => {
    closeMenu()
    closeMobileNav()
    navigate('/profile/roadmaps')
  }, [closeMenu, closeMobileNav, navigate])

  const handleSettingsClick = useCallback(() => {
    closeMenu()
    closeMobileNav()
    navigate('/profile/settings')
  }, [closeMenu, closeMobileNav, navigate])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen, closeMenu])

  return {
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
  }
}
