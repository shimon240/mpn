import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

interface AccordionCtx { open: string[]; toggle: (v: string) => void }
const AccordionContext = createContext<AccordionCtx>({ open: [], toggle: () => {} })

export interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  className?: string
  children: React.ReactNode
}

export function Accordion({ type = 'single', defaultValue, value, onValueChange, className, children }: AccordionProps) {
  const toArr = (v?: string | string[]) => (v === undefined ? [] : Array.isArray(v) ? v : [v])
  const [internal, setInternal] = useState<string[]>(toArr(defaultValue))
  const open = value !== undefined ? toArr(value) : internal

  const toggle = (v: string) => {
    const next = type === 'single'
      ? (open.includes(v) ? [] : [v])
      : (open.includes(v) ? open.filter(x => x !== v) : [...open, v])
    setInternal(next)
    onValueChange?.(type === 'single' ? (next[0] ?? '') : next)
  }

  return (
    <AccordionContext.Provider value={{ open, toggle }}>
      <div className={cn('flex flex-col', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({ value: _value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  return <div className={cn('border-b border-slate-200 last:border-0', className)}>{children}</div>
}

export function AccordionTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const { open, toggle } = useContext(AccordionContext)
  const isOpen = open.includes(value)
  return (
    <button
      type="button"
      onClick={() => toggle(value)}
      aria-expanded={isOpen}
      className={cn(
        'flex w-full items-center justify-between py-4 text-base font-medium leading-6 text-slate-900',
        'hover:underline transition-all',
        className,
      )}
    >
      {children}
      <svg
        className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
        viewBox="0 0 16 16" fill="none" aria-hidden
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

export function AccordionContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const { open } = useContext(AccordionContext)
  if (!open.includes(value)) return null
  return <div className={cn('pb-4 text-sm leading-5 text-slate-900', className)}>{children}</div>
}
