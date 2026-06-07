import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  min?: number
  max?: number
  step?: number
  value?: number
  onValueChange?: (value: number) => void
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, step = 1, value = 0, onValueChange, ...props }, ref) => {
    const pct = ((value - min) / (max - min)) * 100
    return (
      <div className={cn('relative flex h-6 w-full touch-none items-center select-none', className)}>
        <div className="relative h-[3px] w-full rounded-full bg-slate-200">
          <div className="absolute h-full rounded-full bg-slate-900" style={{ width: `${pct}%` }} />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onValueChange?.(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          {...props}
        />
        <div
          className="pointer-events-none absolute -translate-x-1/2 h-4 w-4 rounded-full border-2 border-slate-900 bg-white shadow"
          style={{ left: `${pct}%` }}
        />
      </div>
    )
  }
)
Slider.displayName = 'Slider'
