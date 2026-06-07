import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'

const COLORING_OPTIONS = [
  { id: 'score', label: 'Overall score' },
  { id: 'foot_traffic', label: 'Foot traffic' },
  { id: 'competition', label: 'Competition' },
  { id: 'demographics', label: 'Demographics' },
  { id: 'rent', label: 'Rent level' },
  { id: 'visibility', label: 'Visibility' },
]

export function ColoringPanel() {
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  if (state.mode !== 'results') return null

  const currentLabel = COLORING_OPTIONS.find(o => o.id === state.activeColoring)?.label ?? 'Overall score'

  return (
    <div
      ref={ref}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[20] font-app pointer-events-auto"
    >
      {/* Main bar */}
      <div className="flex items-center gap-0 bg-white/90 backdrop-blur-sm border border-app-border rounded-[14px] shadow-card overflow-hidden h-11">
        {/* City indicator */}
        <div className="flex items-center gap-2 px-4 border-r border-app-border h-full">
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-[13.5px] font-bold text-app-text max-w-[120px] truncate">
            {state.activeCity ?? state.cities[0] ?? 'Select city'}
          </span>
        </div>

        {/* City switcher (if multiple) */}
        {state.cities.length > 1 && (
          <div className="flex items-center gap-0 border-r border-app-border">
            {state.cities.slice(0, 3).map(city => (
              <button
                key={city}
                type="button"
                onClick={() => dispatch({ type: 'SET_ACTIVE_CITY', payload: city })}
                className={cn(
                  'px-3 py-1 text-[12px] font-medium cursor-pointer border-0 h-11 transition-all duration-150',
                  state.activeCity === city
                    ? 'bg-brand text-white'
                    : 'bg-transparent text-app-secondary hover:bg-app-counter hover:text-app-text',
                )}
              >
                {city.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Coloring dropdown trigger */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className={cn(
            'flex items-center gap-2 px-4 h-full cursor-pointer border-0 transition-all duration-150',
            open ? 'bg-brand-tint2 text-brand' : 'bg-transparent text-app-text hover:bg-app-counter',
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M3 12h2M19 12h2M12 3v2M12 19v2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41"/>
          </svg>
          <span className="text-[13px] font-semibold">{currentLabel}</span>
          <svg
            className={cn('w-4 h-4 transition-transform duration-200', open && 'rotate-180')}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-[220px] bg-white border-[1.5px] border-app-border rounded-[12px] shadow-card overflow-hidden animate-slide-up">
          <div className="px-3.5 py-2 border-b border-app-border">
            <div className="text-[11px] font-bold text-app-tertiary uppercase tracking-[.06em]">Color map by</div>
          </div>
          {COLORING_OPTIONS.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => { dispatch({ type: 'SET_COLORING', payload: o.id }); setOpen(false) }}
              className={cn(
                'flex items-center justify-between w-full px-3.5 py-2.5 text-[13px] font-medium cursor-pointer border-0 transition-all duration-150',
                state.activeColoring === o.id
                  ? 'bg-brand-tint2 text-brand font-semibold'
                  : 'bg-transparent text-app-text hover:bg-app-counter',
              )}
            >
              {o.label}
              {state.activeColoring === o.id && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m20 6-11 11-5-5"/></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
