import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'

const SCORE_LABELS = ['—', 'Low fit', 'Below avg', 'Average', 'Good fit', 'Strong match', 'Top match']

function ScoreBadge({ score }: { score: number }) {
  const label = SCORE_LABELS[Math.min(6, Math.ceil(score))] ?? '—'
  const color = score >= 8 ? 'text-emerald-600' : score >= 6 ? 'text-brand' : score >= 4 ? 'text-amber-500' : 'text-red-400'
  return (
    <div className="flex flex-col items-end gap-0.5 shrink-0">
      <div className={cn('text-[22px] font-extrabold leading-none tabular-nums', color)}>{score.toFixed(1)}</div>
      <div className="text-[11px] text-app-secondary font-medium">{label}</div>
    </div>
  )
}

export function RightSidebar() {
  const { state, dispatch } = useApp()
  if (state.mode !== 'results') return null

  const hex = state.lastClickedHex

  const activeSearchRecord = state.searchHistory.find(r => r.id === state.currentSearchId)
  const bookmarks = activeSearchRecord?.bookmarks ?? []
  const isBookmarked = hex ? bookmarks.some(b => b.id === hex.hexId) : false

  return (
    <aside className="fixed right-5 top-4 z-[10] w-[300px] max-h-[calc(100vh-32px)] flex flex-col gap-3 font-app pointer-events-auto">
      {/* Hex info panel */}
      {hex ? (
        <div className="bg-white/92 backdrop-blur-sm border border-app-border rounded-card shadow-card overflow-hidden animate-slide-up">
          {/* Score header */}
          <div className="flex items-start justify-between px-4 py-4 border-b border-app-border">
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-bold text-app-tertiary uppercase tracking-[.06em] mb-1">Selected zone</div>
              <div className="text-[13.5px] font-semibold text-app-text">
                {state.business ?? 'Business'} location
              </div>
              <div className="text-[12px] text-app-secondary mt-0.5">
                {state.activeCity ?? 'City'}
              </div>
            </div>
            <ScoreBadge score={hex.score} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-app-border">
            <button
              type="button"
              onClick={() => dispatch({ type: isBookmarked ? 'REMOVE_BOOKMARK' : 'TOGGLE_BOOKMARK', payload: hex.hexId } as any)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all duration-200',
                isBookmarked
                  ? 'bg-brand border-brand text-white shadow-[0_2px_8px_rgba(68,182,197,.25)]'
                  : 'bg-white border-app-border text-app-text hover:border-brand hover:text-brand',
              )}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'TOGGLE_SIMILAR_HEXES' })}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all duration-200',
                state.similarHexesActive
                  ? 'bg-brand-tint2 border-brand text-brand'
                  : 'bg-white border-app-border text-app-text hover:border-brand hover:text-brand',
              )}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              {state.similarHexesActive ? 'Showing similar' : 'Similar zones'}
            </button>
          </div>

          {/* Score breakdown */}
          <div className="px-4 py-3.5">
            <div className="text-[11.5px] font-bold text-app-tertiary uppercase tracking-[.06em] mb-3">Score breakdown</div>
            <div className="flex flex-col gap-2.5">
              {state.metrics.slice(0, 4).map((m, i) => {
                const metricScore = Math.min(10, Math.max(0, hex.score - 0.5 + (i % 2 === 0 ? 0.3 : -0.2)))
                const pct = (metricScore / 10) * 100
                return (
                  <div key={m.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[12px] text-app-secondary">{m.name}</span>
                      <span className="text-[12px] font-semibold text-app-text">{metricScore.toFixed(1)}</span>
                    </div>
                    <div className="h-1.5 bg-app-counter rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Report button */}
          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'report' })}
              className="w-full bg-app-text text-white border-0 rounded-xl py-3 text-[14px] font-semibold cursor-pointer hover:bg-brand transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Generate report
            </button>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="bg-white/80 backdrop-blur-sm border border-app-border rounded-card shadow-card px-5 py-8 text-center">
          <div className="w-12 h-12 bg-brand-tint2 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#44B6C5" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div className="text-[14px] font-bold text-app-text mb-1">Click a zone</div>
          <div className="text-[12.5px] text-app-secondary leading-snug">
            Select any hex on the map to see its score breakdown and actions.
          </div>
        </div>
      )}

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm border border-app-border rounded-card shadow-card overflow-hidden">
          <div className="px-4 pt-3.5 pb-2 border-b border-app-border flex items-center justify-between">
            <div className="text-[11.5px] font-bold text-app-tertiary uppercase tracking-[.06em]">Bookmarks</div>
            <span className="text-[11px] bg-brand text-white rounded-pill px-1.5 py-px font-bold">{bookmarks.length}</span>
          </div>
          <div className="overflow-y-auto max-h-[240px]">
            {bookmarks.map(bk => (
              <div key={bk.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-app-counter transition-colors border-b border-app-border last:border-b-0">
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-app-text truncate">{bk.label}</div>
                  <div className="text-[11px] text-brand font-medium">Score: {bk.score.toFixed(1)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'REMOVE_BOOKMARK', payload: bk.id })}
                  className="ml-2 w-6 h-6 flex items-center justify-center rounded-md hover:bg-app-counter text-app-tertiary hover:text-red-400 cursor-pointer border-0 bg-transparent transition-all shrink-0"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
