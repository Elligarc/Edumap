import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import './Input.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    className,
    containerClassName,
    id,
    type = 'text',
    ...props
  },
  ref,
) {
  const inputId = id || props.name

  return (
    <div className={cn('ui-input-container', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="ui-input-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={cn('ui-input', error && 'ui-input-error', className)}
        {...props}
      />
      {error && <span className="text-xs text-[#DC2626]">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#64748B]">{helperText}</span>
      )}
    </div>
  )
})
