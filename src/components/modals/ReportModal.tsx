import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'market', title: 'Market Overview', icon: '📊' },
  { id: 'location', title: 'Location Analysis', icon: '📍' },
  { id: 'competition', title: 'Competitive Landscape', icon: '⚔️' },
  { id: 'ai', title: 'AI Recommendations', icon: '✨' },
]

function AITyping({ text, started }: { text: string; started: boolean }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!started) return
    setShown(0)
    let i = 0
    const timer = setInterval(() => {
      i++
      setShown(i)
      if (i >= text.length) clearInterval(timer)
    }, 18)
    return () => clearInterval(timer)
  }, [started, text])

  return <span>{text.slice(0, shown)}{shown < text.length && started ? <span className="animate-pulse text-brand">▍</span> : null}</span>
}

export function ReportModal() {
  const { state, dispatch } = useApp()
  const [activeSection, setActiveSection] = useState('market')
  const [aiStarted, setAiStarted] = useState(false)

  useEffect(() => {
    if (state.openModal === 'report') {
      setAiStarted(false)
      const t = setTimeout(() => setAiStarted(true), 1200)
      return () => clearTimeout(t)
    }
  }, [state.openModal])

  if (state.openModal !== 'report') return null

  const hex = state.lastClickedHex
  const score = hex?.score ?? 7.2
  const business = state.business ?? 'your business'
  const city = state.activeCity ?? 'Tel Aviv'

  const aiText = `Based on the analysis of ${city}'s ${business} market, this zone scores ${score.toFixed(1)}/10 overall. The location shows strong foot traffic indicators, moderate competition density, and favorable demographic alignment with your target customer profile. Key differentiators include proximity to transit hubs and high lunchtime pedestrian volume. We recommend prioritizing this zone for scouting within the next 30 days, particularly on weekday mornings when visibility is highest.`

  return (
    <div className="fixed inset-0 bg-[rgba(15,23,42,0.55)] backdrop-blur-md z-[100] flex items-center justify-center p-6 font-app animate-fade-in">
      <div className="relative bg-white rounded-modal w-full max-w-[900px] max-h-[calc(100vh-48px)] flex flex-col shadow-modal-heavy overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-6 pb-4 border-b border-app-border shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-brand" />
              <span className="text-[11.5px] font-bold text-app-tertiary uppercase tracking-[.06em]">Location report</span>
            </div>
            <h2 className="text-[22px] font-extrabold tracking-tight text-app-text">
              {business} · {city}
            </h2>
            <div className="text-[13px] text-app-secondary mt-0.5">Score: <span className="font-bold text-brand">{score.toFixed(1)}/10</span></div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button"
              className="flex items-center gap-1.5 bg-app-counter border-0 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold text-app-text cursor-pointer hover:bg-brand-tint2 hover:text-brand transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export PDF
            </button>
            <button type="button"
              onClick={() => dispatch({ type: 'OPEN_MODAL', payload: null })}
              className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-transparent border-0 cursor-pointer text-app-tertiary hover:bg-app-counter hover:text-app-text transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Body — 3-column */}
        <div className="flex flex-1 min-h-0">
          {/* Nav */}
          <div className="w-[200px] border-r border-app-border bg-app-counter/50 py-4 shrink-0">
            {SECTIONS.map(s => (
              <button key={s.id} type="button"
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  'flex items-center gap-2.5 w-full px-5 py-2.5 text-[13px] font-medium cursor-pointer border-0 transition-all text-left',
                  activeSection === s.id
                    ? 'bg-white text-brand font-semibold border-r-2 border-brand'
                    : 'bg-transparent text-app-secondary hover:bg-white/50 hover:text-app-text',
                )}>
                <span>{s.icon}</span>
                {s.title}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeSection === 'market' && (
              <div>
                <h3 className="text-[16px] font-bold text-app-text mb-4">Market Overview — {city}</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Market size', value: '~4,200', sub: 'potential customers/day' },
                    { label: 'Avg spend', value: '₪85', sub: 'per visit' },
                    { label: 'Growth rate', value: '+8.3%', sub: 'YoY in category' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-app-counter rounded-xl p-4">
                      <div className="text-[22px] font-extrabold text-brand">{stat.value}</div>
                      <div className="text-[12px] font-bold text-app-text mt-0.5">{stat.label}</div>
                      <div className="text-[11px] text-app-secondary">{stat.sub}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[13.5px] text-app-secondary leading-relaxed">
                  The {business} market in {city} is experiencing steady growth driven by urbanization and shifting consumer preferences. The northern and central districts show particularly strong demand indicators, with foot traffic peaking on Thursday–Saturday evenings.
                </p>
              </div>
            )}

            {activeSection === 'location' && (
              <div>
                <h3 className="text-[16px] font-bold text-app-text mb-4">Location Analysis</h3>
                <div className="bg-[hsl(187,60%,96%)] border border-brand-light rounded-xl p-5 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center text-white text-sm">★</div>
                    <span className="font-bold text-brand">Zone score: {score.toFixed(1)}/10</span>
                  </div>
                  <div className="flex gap-3">
                    {[['Foot traffic', 8.2], ['Visibility', 7.5], ['Accessibility', 9.0], ['Competitors', 6.1]].map(([k, v]) => (
                      <div key={k as string} className="flex-1">
                        <div className="text-[11px] text-app-secondary mb-1">{k}</div>
                        <div className="h-1.5 bg-white rounded-full overflow-hidden">
                          <div className="h-full bg-brand rounded-full" style={{ width: `${(v as number / 10) * 100}%` }} />
                        </div>
                        <div className="text-[11px] font-bold text-app-text mt-0.5">{v}/10</div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[13.5px] text-app-secondary leading-relaxed">
                  This zone benefits from high pedestrian visibility and good transit access. The surrounding commercial mix suggests an established neighborhood with stable customer flow. Parking availability is moderate — consider proximity to public transit as a primary draw.
                </p>
              </div>
            )}

            {activeSection === 'competition' && (
              <div>
                <h3 className="text-[16px] font-bold text-app-text mb-4">Competitive Landscape</h3>
                <div className="flex flex-col gap-2 mb-4">
                  {(state.competitors.slice(0, 5) || ['Competitor A', 'Competitor B', 'Competitor C']).map((comp, i) => (
                    <div key={comp} className="flex items-center gap-3 bg-app-counter rounded-xl p-3.5">
                      <div className="w-8 h-8 bg-brand-tint2 rounded-lg flex items-center justify-center text-brand font-bold text-sm shrink-0">
                        {comp[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-semibold text-app-text">{comp}</div>
                        <div className="text-[12px] text-app-secondary">{Math.floor(150 + i * 80 - i * 30)} m away · {2 + i} locations in area</div>
                      </div>
                      <div className={cn('text-[12px] font-bold px-2 py-0.5 rounded-pill', i < 2 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600')}>
                        {i < 2 ? 'High threat' : 'Manageable'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'ai' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white text-sm">✨</div>
                  <h3 className="text-[16px] font-bold text-app-text">AI Recommendations</h3>
                </div>
                <div className="bg-app-counter rounded-xl p-5 text-[13.5px] text-app-text leading-relaxed font-medium min-h-[120px]">
                  <AITyping text={aiText} started={aiStarted} />
                </div>
                <div className="mt-4 flex flex-col gap-2.5">
                  {[
                    { emoji: '📅', text: 'Visit zone on a Thursday morning for peak foot traffic observation' },
                    { emoji: '🏷️', text: 'Budget ₪8,000–12,000/month for rent in this zone' },
                    { emoji: '🤝', text: 'Network with nearby complementary businesses (bakeries, pharmacies)' },
                  ].map(tip => (
                    <div key={tip.emoji} className="flex items-start gap-3 bg-brand-tint2 rounded-xl px-4 py-3">
                      <span>{tip.emoji}</span>
                      <span className="text-[13px] text-app-text leading-snug">{tip.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
