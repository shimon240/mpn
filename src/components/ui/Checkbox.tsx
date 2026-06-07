import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
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
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'h-4 w-4 cursor-pointer rounded-[2px] border border-slate-200 bg-white accent-slate-900',
            'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
            'disabled:cursor-not-allowed',
          )}
          {...props}
        />
        {label && (
          <span className="text-sm font-medium leading-[14px] text-black">{label}</span>
        )}
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'
