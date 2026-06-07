import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'

export function SearchHistoryModal() {
  const { state, dispatch } = useApp()
  const [expanded, setExpanded] = useState<string | null>(null)

  if (state.openModal !== 'searchHistory') return null

  const close = () => dispatch({ type: 'OPEN_MODAL', payload: null })

  return (
    <div className="fixed inset-0 bg-[rgba(15,23,42,0.55)] backdrop-blur-md z-[100] flex items-center justify-center p-6 font-app animate-fade-in">
      <div className="relative bg-white rounded-modal w-full max-w-[640px] max-h-[calc(100vh-48px)] flex flex-col shadow-modal-heavy overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-app-border shrink-0">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight">Search history</h2>
            <p className="text-[13px] text-app-secondary mt-0.5">{state.searchHistory.length} saved searches</p>
          </div>
          <button type="button" onClick={close}
            className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-transparent border-0 cursor-pointer text-app-tertiary hover:bg-app-counter hover:text-app-text transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {state.searchHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-app-counter rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>
              </div>
              <div className="text-[14px] font-bold text-app-text mb-1">No searches yet</div>
              <div className="text-[13px] text-app-secondary">Complete a search to see it here.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {state.searchHistory.map(record => {
                const isExpanded = expanded === record.id
                const isActive = record.id === state.currentSearchId
                return (
                  <div key={record.id}
                    className={cn(
                      'bg-white border-[1.5px] border-app-border rounded-card overflow-hidden transition-all duration-200',
                      isActive && 'border-brand bg-brand-lighter',
                      isExpanded && !isActive && 'border-app-border-strong',
                    )}>
                    {/* Row */}
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      <div className="w-9 h-9 bg-brand-tint2 rounded-xl flex items-center justify-center text-brand text-sm font-bold shrink-0">
                        {record.business[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-[14px] font-bold text-app-text truncate">{record.business}</div>
                          {isActive && <span className="text-[10px] font-bold bg-brand text-white rounded-pill px-1.5 py-px shrink-0">Active</span>}
                        </div>
                        <div className="text-[12px] text-app-secondary truncate">
                          {record.cities.join(', ')} · {record.date}
                          {record.bookmarks.length > 0 && ` · ${record.bookmarks.length} bookmarks`}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button type="button"
                          onClick={() => { dispatch({ type: 'LOAD_SEARCH', payload: record.id }); close() }}
                          className="px-3.5 py-1.5 bg-brand-tint2 text-brand border border-brand-light rounded-[8px] text-[12px] font-semibold cursor-pointer hover:bg-brand hover:text-white hover:border-brand transition-all">
                          Load
                        </button>
                        <button type="button"
                          onClick={() => setExpanded(isExpanded ? null : record.id)}
                          className={cn(
                            'w-7 h-7 flex items-center justify-center rounded-[8px] bg-transparent border-0 cursor-pointer text-app-tertiary hover:bg-app-counter hover:text-app-text transition-all',
                          )}>
                          <svg className={cn('w-4 h-4 transition-transform duration-200', isExpanded && 'rotate-180')}
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                      </div>
                    </div>

                    {/* Expanded bookmarks */}
                    <div className={cn('overflow-hidden transition-[max-height] duration-350', isExpanded ? 'max-h-[400px]' : 'max-h-0')}>
                      {record.bookmarks.length > 0 ? (
                        <div className="border-t border-app-border px-4 pb-3.5 pt-3">
                          <div className="text-[11px] font-bold text-app-tertiary uppercase tracking-[.06em] mb-2">
                            Bookmarks ({record.bookmarks.length})
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {record.bookmarks.map(bk => (
                              <div key={bk.id} className="flex items-center justify-between bg-app-counter rounded-[10px] px-3.5 py-2.5">
                                <div>
                                  <div className="text-[13px] font-semibold text-app-text">{bk.label}</div>
                                  <div className="text-[11px] text-brand font-bold">Score: {bk.score.toFixed(1)}</div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#44B6C5" stroke="#44B6C5" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="border-t border-app-border px-4 py-3.5 text-[13px] text-app-secondary">
                          No bookmarks for this search.
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
