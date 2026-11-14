import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import './Modal.css'

export interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  title?: string
  children?: ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="ui-modal-root">
      <div className="ui-modal-overlay" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn('ui-modal-dialog', className)}
      >
        <div className="ui-modal-header">
          <h2 className="ui-modal-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="ui-modal-close-btn"
          >
            <X size={18} />
          </button>
        </div>
        <div className="ui-modal-body">{children}</div>
      </div>
    </div>
  )
}
