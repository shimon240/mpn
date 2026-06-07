import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectGroup {
  label?: string
  options: SelectOption[]
}

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options?: SelectOption[]
  groups?: SelectGroup[]
  disabled?: boolean
  className?: string
}

export function Select({
  value,
  onValueChange,
  placeholder = 'Select an option',
  options,
  groups,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  const allOptions = groups ? groups.flatMap(g => g.options) : (options ?? [])
  const selectedLabel = allOptions.find(o => o.value === value)?.label

  const handleSelect = (val: string) => {
    onValueChange?.(val)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-[6px] border border-slate-300 bg-white px-3 py-2',
          'text-sm leading-6 transition-colors',
          'hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !selectedLabel && 'text-slate-400',
          selectedLabel && 'text-slate-900',
        )}
      >
        <span className="flex-1 text-left">{selectedLabel ?? placeholder}</span>
        <svg
          className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150', open && 'rotate-180')}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full z-50 mt-1.5 w-full overflow-hidden rounded-[6px] border border-slate-100 bg-white shadow-dropdown">
          {groups
            ? groups.map((group, gi) => (
                <div key={gi}>
                  {gi > 0 && <div className="mx-1 h-px bg-slate-200" />}
                  {group.label && (
                    <div className="px-8 pt-1.5 pb-0">
                      <span className="text-sm font-medium leading-5 text-slate-900">{group.label}</span>
                    </div>
                  )}
                  <div className="px-1 pb-1">
                    {group.options.map(opt => (
                      <OptionItem
                        key={opt.value}
                        option={opt}
                        selected={opt.value === value}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </div>
              ))
            : options?.map(opt => (
                <OptionItem
                  key={opt.value}
                  option={opt}
                  selected={opt.value === value}
                  onSelect={handleSelect}
                />
              ))}
        </div>
      )}
    </div>
  )
}

function OptionItem({
  option,
  selected,
  onSelect,
}: {
  option: SelectOption
  selected: boolean
  onSelect: (val: string) => void
}) {
  return (
    <button
      type="button"
      disabled={option.disabled}
      onClick={() => onSelect(option.value)}
      className={cn(
        'flex w-full items-center gap-2 rounded-[6px] py-1.5 pr-2 text-sm font-medium leading-5 text-slate-700',
        'hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50',
        selected ? 'pl-2' : 'pl-8',
      )}
    >
      {selected && (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {option.label}
    </button>
  )
}
