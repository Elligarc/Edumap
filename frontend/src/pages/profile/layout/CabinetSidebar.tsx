import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import {
  Activity,
  Map,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  Info,
  type LucideIcon,
} from 'lucide-react'
import { useAuthStore } from '@/entities/session'
import { Modal } from '@/shared/ui'
import { Button } from '@/shared/ui'

interface NavItem {
  title: string
  icon: LucideIcon
  to?: string
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { title: 'Активность', icon: Activity },
  { title: 'Мои карты', to: '/profile/roadmaps', icon: Map },
  { title: 'Команды', icon: Users },
  { title: 'Финансы', icon: CreditCard },
  { title: 'Настройки', to: '/profile/settings', icon: Settings },
]

const SUPPORT_NAV_ITEMS: NavItem[] = [
  { title: 'Центр помощи', icon: HelpCircle },
]

export function CabinetSidebar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const [stubTitle, setStubTitle] = useState<string | null>(null)

  const firstLetter = (user?.name || user?.email || 'U').charAt(0).toUpperCase()

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon
    if (item.to) {
      const isActive = location.pathname.includes(item.to)
      return (
        <Link
          key={item.title}
          to={item.to}
          className={`cabinet-nav-item ${isActive ? 'cabinet-nav-item--active' : ''}`}
        >
          <Icon size={18} />
          <span>{item.title}</span>
        </Link>
      )
    }

    return (
      <button
        key={item.title}
        type="button"
        className="cabinet-nav-item"
        onClick={() => setStubTitle(item.title)}
      >
        <Icon size={18} />
        <span>{item.title}</span>
      </button>
    )
  }

  return (
    <aside className="cabinet-sidebar" aria-label="Меню личного кабинета">
      <div>
        <div className="cabinet-user-card">
          <div className="cabinet-user-avatar">{firstLetter}</div>
          <div className="cabinet-user-info">
            <span className="cabinet-user-name">{user?.name || 'Пользователь'}</span>
            <span className="cabinet-user-email">{user?.email}</span>
          </div>
        </div>

        <nav className="cabinet-nav">
          {MAIN_NAV_ITEMS.map(renderNavItem)}

          <div className="cabinet-nav-section-title">Поддержка</div>

          {SUPPORT_NAV_ITEMS.map(renderNavItem)}
        </nav>
      </div>

      <Modal
        isOpen={Boolean(stubTitle)}
        onClose={() => setStubTitle(null)}
        title={stubTitle || 'Раздел в разработке'}
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-start gap-3 p-3 bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd] rounded-[4px] text-xs font-sans">
            <Info size={18} className="shrink-0 text-[#0284c7] mt-0.5" />
            <span>
              Раздел «{stubTitle}» находится в активной разработке и станет доступен в следующих релизах платформы.
            </span>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setStubTitle(null)} size="sm">
              Понятно
            </Button>
          </div>
        </div>
      </Modal>
    </aside>
  )
}
