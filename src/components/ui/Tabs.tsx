import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

interface TabsCtx { value: string; onValueChange: (v: string) => void }
const TabsContext = createContext<TabsCtx>({ value: '', onValueChange: () => {} })

export interface TabsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

export function Tabs({ value, defaultValue = '', onValueChange, className, children }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const handleChange = (v: string) => { setInternal(v); onValueChange?.(v) }
  return (
    <TabsContext.Provider value={{ value: current, onValueChange: handleChange }}>
      <div className={cn('flex flex-col gap-2', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('inline-flex items-center rounded-[6px] bg-slate-100 p-[5px]', className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const { value: current, onValueChange } = useContext(TabsContext)
  const active = current === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onValueChange(value)}
      className={cn(
        'rounded-[3px] px-3 py-1.5 text-sm font-medium leading-5 transition-all',
        active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-700 hover:text-slate-900',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const { value: current } = useContext(TabsContext)
  if (current !== value) return null
  return (
    <div role="tabpanel" className={cn('rounded-[6px] border border-slate-200 p-6', className)}>
      {children}
    </div>
  )
}
