import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'brand'

export interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}

const variants: Record<BadgeVariant, string> = {
  default:     'bg-slate-900 text-white',
  secondary:   'bg-slate-100 text-slate-700',
  destructive: 'bg-red-500 text-white',
  outline:     'border border-slate-200 text-slate-700',
  brand:       'bg-brand text-white',
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}
