import { useApp } from '@/contexts/AppContext'
import { RangeSlider } from './RangeSlider'
import { cn } from '@/lib/utils'
import { formatRangeStr } from '@/lib/scoring'
import type { ZoningType } from '@/types'

export function LeftSidebar() {
  const { state, dispatch } = useApp()
  if (state.mode !== 'results') return null

  const zoningConfig: { id: ZoningType; label: string; color: string; dot: string }[] = [
    { id: 'suitable', label: 'Suitable zones', color: 'text-emerald-600', dot: 'bg-emerald-500' },
    { id: 'check', label: 'Needs checking', color: 'text-amber-500', dot: 'bg-amber-400' },
    { id: 'unlikely', label: 'Unlikely fit', color: 'text-red-500', dot: 'bg-red-400' },
  ]

  return (
    <aside className="fixed left-5 top-4 z-[10] w-[280px] max-h-[calc(100vh-32px)] flex flex-col gap-3 font-app pointer-events-auto">
      {/* 5-star toggle */}
      <div className="bg-white/90 backdrop-blur-sm border border-app-border rounded-card shadow-card px-4 py-3.5">
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_5OF5' })}
          className={cn(
            'flex items-center gap-2.5 w-full text-left bg-transparent border-0 cursor-pointer rounded-lg px-2 py-1.5 transition-all duration-150 hover:bg-app-counter',
            state.showOnly5of5 && 'bg-brand-tint2',
          )}
        >
          <div className={cn(
            'w-8 h-8 rounded-[8px] flex items-center justify-center text-[15px] shrink-0 transition-all duration-150',
            state.showOnly5of5 ? 'bg-brand text-white' : 'bg-app-counter text-app-secondary',
          )}>
            ★
          </div>
          <div>
            <div className={cn('text-[13.5px] font-bold leading-tight', state.showOnly5of5 ? 'text-brand' : 'text-app-text')}>
              Show only 5/5
            </div>
            <div className="text-[11.5px] text-app-secondary">Top scoring hexes only</div>
          </div>
        </button>
      </div>

      {/* Zoning filter */}
      <div className="bg-white/90 backdrop-blur-sm border border-app-border rounded-card shadow-card px-4 py-3.5">
        <div className="text-[11.5px] font-bold text-app-tertiary uppercase tracking-[.06em] mb-2.5">Zoning filter</div>
        <div className="flex flex-col gap-2">
          {zoningConfig.map(z => (
            <button
              key={z.id}
              type="button"
              onClick={() => dispatch({ type: 'TOGGLE_ZONING', payload: z.id })}
              className={cn(
                'flex items-center gap-2.5 bg-transparent border-0 cursor-pointer rounded-lg px-2 py-1.5 transition-all duration-150 hover:bg-app-counter text-left',
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0',
                state.zoning[z.id] ? 'bg-brand border-brand' : 'border-app-border-strong bg-white',
              )}>
                {state.zoning[z.id] && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className={cn('w-2 h-2 rounded-full shrink-0', z.dot)} />
              <span className={cn('text-[13px] font-medium', state.zoning[z.id] ? 'text-app-text' : 'text-app-secondary')}>{z.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Competitor range */}
      <div className="bg-white/90 backdrop-blur-sm border border-app-border rounded-card shadow-card px-4 py-3.5">
        <div className="text-[11.5px] font-bold text-app-tertiary uppercase tracking-[.06em] mb-2">Competitor density</div>
        <div className="text-[13px] font-semibold text-app-text mb-1">
          {state.competitorRange[0]}–{state.competitorRange[1]} nearby
        </div>
        <RangeSlider
          value={state.competitorRange}
          onChange={range => dispatch({ type: 'SET_COMPETITOR_RANGE', payload: range })}
          min={0}
          max={10}
        />
      </div>

      {/* Metric sliders */}
      {state.metrics.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm border border-app-border rounded-card shadow-card px-4 py-3.5 overflow-y-auto flex-1">
          <div className="text-[11.5px] font-bold text-app-tertiary uppercase tracking-[.06em] mb-3">Filters</div>
          <div className="flex flex-col gap-4">
            {state.metrics.map(m => {
              return (
                <div key={m.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold text-app-text">{m.name}</span>
                    <span className="text-[12px] text-app-secondary font-medium">
                      {formatRangeStr(m.range, m.name)}
                    </span>
                  </div>
                  <RangeSlider
                    value={m.range}
                    onChange={range => dispatch({ type: 'SET_METRIC_RANGE', payload: { id: m.id, range } })}
                    min={0}
                    max={10}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </aside>
  )
}
