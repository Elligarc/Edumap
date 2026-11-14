import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import './Select.css'

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options?: SelectOption[]
  error?: string
  helperText?: string
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    options = [],
    error,
    helperText,
    className,
    containerClassName,
    id,
    ...props
  },
  ref,
) {
  const selectId = id || props.name

  return (
    <div className={cn('ui-select-container', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="ui-select-label">
          {label}
        </label>
      )}
      <div className="ui-select-wrapper">
        <select
          ref={ref}
          id={selectId}
          className={cn('ui-select', error && 'ui-select-error', className)}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="ui-select-icon" />
      </div>
      {error && <span className="text-xs text-[#DC2626]">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#64748B]">{helperText}</span>
      )}
    </div>
  )
})
