import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'subtle' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'icon' | 'icon-circle'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  default:     'bg-slate-900 text-white hover:bg-slate-700',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline:     'bg-white border border-slate-200 text-slate-900 hover:bg-slate-100',
  subtle:      'bg-slate-100 text-slate-900 hover:bg-slate-200',
  ghost:       'bg-transparent text-slate-900 hover:bg-slate-100',
  link:        'bg-transparent text-slate-900 hover:underline underline-offset-4',
}

const sizes: Record<ButtonSize, string> = {
  default:     'h-10 px-4 py-2 text-sm',
  sm:          'h-8 px-3 py-1.5 text-sm',
  icon:        'h-8 w-8 p-2 border border-slate-200',
  'icon-circle': 'h-10 w-10 p-3 rounded-full border border-slate-200',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[6px] font-medium leading-6 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
