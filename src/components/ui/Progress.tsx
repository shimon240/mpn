import { cn } from '@/lib/utils'

export interface ProgressProps {
  value?: number
  className?: string
}

export function Progress({ value = 0, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-slate-100', className)}
    >
      <div
        className="h-full rounded-full bg-slate-900 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
