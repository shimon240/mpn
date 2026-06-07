import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupCtx { value: string; onValueChange: (v: string) => void; name: string }
const RadioGroupContext = createContext<RadioGroupCtx>({ value: '', onValueChange: () => {}, name: 'radio' })

export interface RadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  className?: string
  children: React.ReactNode
}

export function RadioGroup({ value = '', onValueChange = () => {}, name = 'radio', className, children }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name }}>
      <div role="radiogroup" className={cn('flex flex-col gap-2', className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps {
  value: string
  label?: React.ReactNode
  disabled?: boolean
  className?: string
}

export function RadioGroupItem({ value, label, disabled, className }: RadioGroupItemProps) {
  const { value: current, onValueChange, name } = useContext(RadioGroupContext)
  const checked = current === value
  const id = `${name}-${value}`
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-center gap-2',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onValueChange(value)}
        className="peer sr-only"
      />
      <div className={cn(
        'flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 bg-white',
        'peer-checked:border-slate-900',
        'peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400 peer-focus-visible:ring-offset-2',
      )}>
        {checked && <div className="h-2 w-2 rounded-full bg-slate-900" />}
      </div>
      {label && <span className="text-sm font-medium leading-[14px] text-black">{label}</span>}
    </label>
  )
}
