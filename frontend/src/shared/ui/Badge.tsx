import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import './Badge.css'

export interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'draft' | 'published' | 'private' | 'hidden' | string
  className?: string
  onClick?: () => void
  title?: string
}

export function Badge({ children, variant = 'default', className, onClick, title }: BadgeProps) {
  return (
    <span
      className={cn(
        'ui-badge',
        `ui-badge--${variant}`,
        className,
      )}
      onClick={onClick}
      title={title}
    >
      {children}
    </span>
  )
}
