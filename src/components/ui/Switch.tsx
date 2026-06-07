import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: React.ReactNode
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, disabled, checked, onCheckedChange, ...props }, ref) => {
    const inputId = id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    return (
      <label
        htmlFor={inputId}
        className={cn(
          'flex cursor-pointer items-center gap-2',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            disabled={disabled}
            checked={checked}
            onChange={e => onCheckedChange?.(e.target.checked)}
            className="peer sr-only"
            {...props}
          />
          <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors duration-200 peer-checked:bg-slate-900" />
          <div className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
        </div>
        {label && (
          <span className="text-sm font-medium leading-[14px] text-black">{label}</span>
        )}
      </label>
    )
  }
)
Switch.displayName = 'Switch'
