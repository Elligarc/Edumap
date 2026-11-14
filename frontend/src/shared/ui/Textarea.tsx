import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import './Textarea.css'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    error,
    helperText,
    className,
    containerClassName,
    id,
    rows = 3,
    ...props
  },
  ref,
) {
  const textareaId = id || props.name

  return (
    <div className={cn('ui-textarea-container', containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="ui-textarea-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn('ui-textarea', error && 'ui-textarea-error', className)}
        {...props}
      />
      {error && <span className="text-xs text-[#DC2626]">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#64748B]">{helperText}</span>
      )}
    </div>
  )
})
