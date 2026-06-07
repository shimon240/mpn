import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, disabled, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className={cn('flex flex-col gap-1.5', disabled && 'opacity-50')}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium leading-5 text-slate-900">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            'w-full rounded-[6px] border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-900',
            'placeholder:text-slate-400',
            'focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20',
            'disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-sm leading-5 text-red-500">{error}</p>
        ) : helperText ? (
          <p className="text-sm leading-5 text-slate-500">{helperText}</p>
        ) : null}
      </div>
    )
  }
)
Input.displayName = 'Input'
