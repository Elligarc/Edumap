import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import './Card.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  className?: string
  interactive?: boolean
  highlight?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    children,
    className,
    interactive = false,
    highlight = false,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'ui-card',
        interactive && 'ui-card--interactive',
        highlight && 'ui-card--highlight',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
