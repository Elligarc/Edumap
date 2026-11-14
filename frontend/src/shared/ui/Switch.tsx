import { cn } from '@/shared/lib/cn'
import './Switch.css'

export interface SwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

export function Switch({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: SwitchProps) {
  return (
    <div
      onClick={() => !disabled && onChange?.(!checked)}
      className={cn(
        'ui-switch-container',
        disabled && 'ui-switch-container--disabled',
        className,
      )}
    >
      <div className="ui-switch-label-group">
        {label && <span className="ui-switch-label">{label}</span>}
        {description && <span className="ui-switch-description">{description}</span>}
      </div>
      <div
        className={cn(
          'ui-switch-track',
          checked ? 'ui-switch-track--checked' : 'ui-switch-track--unchecked',
        )}
      >
        <span
          className={cn(
            'ui-switch-thumb',
            checked ? 'ui-switch-thumb--checked' : 'ui-switch-thumb--unchecked',
          )}
        />
      </div>
    </div>
  )
}
