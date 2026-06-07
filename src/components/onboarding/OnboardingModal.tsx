import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { businesses, smartCompetitorsFor } from '@/data/businesses'
import { regions, allCities } from '@/data/cities'
import { presets, fullListCategories, archetypeFor, aiTagsFor, presetForArchetype } from '@/data/presets'
import { cn } from '@/lib/utils'
import type { FullListSelections } from '@/types'

/* ─── Step indicator ─────────────────────────────────────────── */
function StepDots({ current }: { current: number }) {
  return (
    <div className="flex gap-1.5 mb-[18px]">
      {[1, 2, 3, 4].map(n => (
        <div key={n} className={cn('h-1 flex-1 rounded-sm transition-colors duration-300', n <= current ? 'bg-brand' : 'bg-app-counter')} />
      ))}
    </div>
  )
}

/* ─── Chip ────────────────────────────────────────────────────── */
function Chip({ label, selected, onClick, disabled }: { label: string; selected: boolean; onClick(): void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'bg-white border-[1.5px] border-app-border rounded-pill px-3.5 py-2 text-[13px] font-medium text-app-text cursor-pointer transition-all duration-150',
        'hover:border-brand hover:text-brand',
        selected && 'bg-brand border-brand text-white hover:border-brand hover:text-white',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {label}
    </button>
  )
}

/* ─── Category accordion card ─────────────────────────────────── */
function CategoryCard({ cat, icon, items, onSelect, selectedItem }: {
  cat: string; icon: string; items: string[]; onSelect(item: string): void; selectedItem: string | null
}) {
  const [open, setOpen] = useState(false)
  const hasSelection = items.includes(selectedItem ?? '')
  return (
    <div className={cn(
      'bg-white border-[1.5px] border-app-border rounded-card mb-2.5 overflow-hidden transition-all duration-200',
      open && 'border-brand',
      hasSelection && 'border-brand bg-brand-lighter',
    )}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-4 px-[18px] py-4 w-full bg-transparent border-0 text-left hover:bg-brand/[.04] transition-colors duration-150"
      >
        <div className="w-[42px] h-[42px] bg-app-icon-bg rounded-[10px] flex items-center justify-center text-app-icon-color shrink-0">
          <CatIcon name={icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15.5px] font-bold text-app-text mb-0.5">{cat}</div>
          <div className="text-[13px] text-app-secondary leading-snug">
            {hasSelection ? selectedItem : `${items.length} options`}
          </div>
        </div>
        <div className={cn(
          'px-3 py-1 rounded-pill text-xs font-semibold shrink-0 transition-all duration-200',
          hasSelection ? 'bg-brand text-white' : 'bg-app-counter text-app-secondary',
        )}>
          {hasSelection ? `✓ ${selectedItem}` : items.length}
        </div>
        <svg className={cn('w-5 h-5 text-app-tertiary shrink-0 transition-transform duration-250', open && 'rotate-180')}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div className={cn('overflow-hidden transition-[max-height] duration-350', open ? 'max-h-[600px]' : 'max-h-0')}>
        <div className="flex flex-wrap gap-2 px-[18px] pb-[18px] pt-1">
          {items.map(item => (
            <Chip key={item} label={item} selected={selectedItem === item} onClick={() => onSelect(item)} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Step 1: Business type ───────────────────────────────────── */
function Step1() {
  const { state, dispatch } = useApp()
  return (
    <>
      <ModalHeader step={1} title="What's your business?" subtitle="Pick what you're opening — we'll tailor the rest around it." />
      <div className="flex-1 overflow-y-auto px-8 py-3.5 scrollbar-thin">
        {businesses.map(b => (
          <CategoryCard
            key={b.cat}
            cat={b.cat}
            icon={b.icon}
            items={b.items}
            selectedItem={state.businessCategory === b.cat ? state.business : null}
            onSelect={item => dispatch({ type: 'SET_BUSINESS', payload: { business: item, category: b.cat } })}
          />
        ))}
      </div>
      <ModalFooter
        step={1}
        status={state.business ? `Selected: ${state.business}` : 'No selection yet'}
        canContinue={!!state.business}
        onContinue={() => dispatch({ type: 'GO_STEP', payload: 2 })}
      />
    </>
  )
}

/* ─── Step 2: City ────────────────────────────────────────────── */
function Step2() {
  const { state, dispatch } = useApp()
  const [query, setQuery] = useState('')
  const [showAuto, setShowAuto] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = query.length >= 1
    ? allCities.filter(c => c.toLowerCase().includes(query.toLowerCase()) && !state.cities.includes(c))
    : []

  return (
    <>
      <ModalHeader step={2} title="Which city are you targeting?" subtitle="Select regions or search any place in Israel." />
      <div className="flex-1 overflow-y-auto px-8 py-3.5 scrollbar-thin">
        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-app-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setShowAuto(true) }}
            onFocus={() => setShowAuto(true)}
            onBlur={() => setTimeout(() => setShowAuto(false), 150)}
            placeholder="Search any city…"
            autoComplete="off"
            className="w-full pl-11 pr-4 py-3.5 border-[1.5px] border-app-border rounded-xl text-sm bg-white font-[inherit] text-app-text outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(68,182,197,.12)] transition-all"
          />
          {showAuto && suggestions.length > 0 && (
            <div className="absolute top-[calc(100%+4px)] left-0 right-0 max-h-[200px] overflow-y-auto bg-white border-[1.5px] border-app-border rounded-[10px] shadow-card z-60">
              {suggestions.map(c => (
                <div key={c}
                  className="px-3.5 py-2.5 text-sm cursor-pointer text-app-text hover:bg-brand-tint2 hover:text-brand transition-colors"
                  onMouseDown={() => { dispatch({ type: 'ADD_CITY', payload: c }); setQuery('') }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected city chips */}
        {state.cities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {state.cities.map(c => (
              <button key={c} type="button"
                onClick={() => dispatch({ type: 'REMOVE_CITY', payload: c })}
                className="flex items-center gap-1.5 bg-brand-tint2 border-[1.5px] border-brand rounded-pill px-3.5 py-2 text-[13px] font-semibold text-app-text hover:bg-brand-tint transition-all"
              >
                {c} <span className="text-brand text-base leading-none">×</span>
              </button>
            ))}
          </div>
        )}

        {/* Regions */}
        <div className="text-[11.5px] font-bold text-app-tertiary uppercase tracking-[.08em] mb-3">Regions</div>
        {regions.map(r => (
          <RegionAccordion key={r.name} region={r} selectedCities={state.cities}
            onToggle={c => dispatch({ type: state.cities.includes(c) ? 'REMOVE_CITY' : 'ADD_CITY', payload: c })} />
        ))}
      </div>
      <ModalFooter
        step={2}
        status={state.cities.length > 0 ? `${state.cities.length} city selected` : 'No city selected'}
        canContinue={state.cities.length > 0}
        onBack={() => dispatch({ type: 'GO_STEP', payload: 1 })}
        onContinue={() => dispatch({ type: 'GO_STEP', payload: 3 })}
      />
    </>
  )
}

function RegionAccordion({ region, selectedCities, onToggle }: { region: typeof regions[0]; selectedCities: string[]; onToggle(c: string): void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white border-[1.5px] border-app-border rounded-card mb-2.5 overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between px-[18px] py-4 w-full bg-transparent border-0 text-left hover:bg-brand/[.04] transition-colors">
        <div className="text-[15.5px] font-bold text-app-text">{region.name}</div>
        <svg className={cn('w-5 h-5 text-app-tertiary transition-transform duration-250', open && 'rotate-180')}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div className={cn('overflow-hidden transition-[max-height] duration-350', open ? 'max-h-[400px]' : 'max-h-0')}>
        <div className="flex flex-wrap gap-2 px-[18px] pb-[18px] pt-1">
          {region.cities.map(c => (
            <Chip key={c} label={c} selected={selectedCities.includes(c)} onClick={() => onToggle(c)} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Step 3: Preferences ─────────────────────────────────────── */
function Step3() {
  const { state, dispatch } = useApp()
  const totalFL = Object.values(state.fullListSelections).reduce((n, a) => n + a.length, 0)

  const aiRecommend = () => {
    const archetype = archetypeFor(state.business ?? '')
    if (state.viewMode === 'presets') {
      const presetId = presetForArchetype(archetype)
      dispatch({ type: 'SET_PRESET', payload: presetId })
    } else {
      const tags = aiTagsFor(archetype)
      dispatch({ type: 'AI_FILL_TAGS', payload: tags as Partial<FullListSelections> })
    }
  }

  return (
    <>
      <ModalHeader step={3} title={`What matters most for your ${state.business ?? 'business'}?`} subtitle="Start with a preset, or switch to the full list to fine-tune every keyword." />
      <div className="flex items-center justify-between px-8 py-3.5 gap-3 flex-wrap shrink-0 border-b border-app-border">
        <button type="button" onClick={aiRecommend}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand text-white rounded-pill text-[13px] font-semibold cursor-pointer hover:bg-brand-hover transition-all shadow-[0_2px_8px_rgba(68,182,197,.25)]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2l1.8 5.8L19.6 9.6 14 12l-2 7-2-7-5.6-2.4 5.8-1.8z"/></svg>
          AI Recommend
        </button>
        <div className="inline-flex bg-app-counter rounded-[10px] p-1 gap-0.5">
          {(['presets', 'fulllist'] as const).map(m => (
            <button key={m} type="button"
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: m })}
              className={cn(
                'px-3.5 py-1.5 text-[13px] font-semibold rounded-[7px] cursor-pointer transition-all duration-150 border-0',
                state.viewMode === m ? 'bg-white text-app-text shadow-sm' : 'bg-transparent text-app-secondary hover:text-app-text',
              )}
            >
              {m === 'presets' ? 'Presets' : <>Full list {totalFL > 0 && <span className="ml-1.5 bg-brand text-white rounded-pill px-1.5 text-[11px] font-bold">{totalFL}</span>}</>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-3.5 scrollbar-thin">
        {state.viewMode === 'presets' ? (
          <div className="grid grid-cols-2 gap-2.5">
            {presets.map(p => (
              <button key={p.id} type="button"
                onClick={() => dispatch({ type: 'SET_PRESET', payload: p.id })}
                className={cn(
                  'border-2 border-app-border rounded-card p-4 cursor-pointer bg-white text-left font-[inherit] transition-all duration-150',
                  'hover:border-brand hover:bg-brand-tint2 hover:-translate-y-px',
                  state.preset === p.id && 'border-brand bg-brand-light shadow-[0_4px_14px_rgba(68,182,197,.18)]',
                )}
              >
                <span className="block text-[22px] mb-2">{p.icon}</span>
                <div className="text-[14.5px] font-bold text-app-text mb-1 tracking-tight">{p.title}</div>
                <div className="text-[12.5px] text-app-secondary leading-snug">{p.desc}</div>
              </button>
            ))}
          </div>
        ) : (
          fullListCategories.map(cat => (
            <FullListCatCard key={cat.id} cat={cat} selections={state.fullListSelections}
              onToggle={(catId, tag) => dispatch({ type: 'TOGGLE_FL_TAG', payload: { catId: catId as keyof FullListSelections, tag } })} />
          ))
        )}
      </div>
      <ModalFooter
        step={3}
        status={state.preset ? `Preset: ${presets.find(p => p.id === state.preset)?.title}` : totalFL > 0 ? `${totalFL} keywords` : 'Pick a preset or open full list'}
        canContinue={!!state.preset || totalFL > 0}
        onBack={() => dispatch({ type: 'GO_STEP', payload: 2 })}
        onContinue={() => dispatch({ type: 'GO_STEP', payload: 4 })}
      />
    </>
  )
}

function FullListCatCard({ cat, selections, onToggle }: {
  cat: typeof fullListCategories[0]
  selections: FullListSelections
  onToggle(catId: string, tag: string): void
}) {
  const [open, setOpen] = useState(false)
  const sel = selections[cat.id as keyof FullListSelections] ?? []
  const total = cat.groups.reduce((n, g) => n + g.tags.length, 0)
  return (
    <div className={cn('bg-white border-[1.5px] border-app-border rounded-card mb-2.5 overflow-hidden transition-all duration-200', open && 'border-brand', sel.length > 0 && 'border-brand bg-brand-lighter')}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-4 px-[18px] py-4 w-full bg-transparent border-0 text-left hover:bg-brand/[.04] transition-colors">
        <div className="flex-1 min-w-0">
          <div className="text-[15.5px] font-bold text-app-text mb-0.5">{cat.title}</div>
          <div className="text-[13px] text-app-secondary leading-snug">{cat.subtitle}</div>
        </div>
        <div className={cn('px-3 py-1 rounded-pill text-xs font-semibold transition-all duration-200', sel.length > 0 ? 'bg-brand text-white' : 'bg-app-counter text-app-secondary')}>
          {sel.length} / {total}
        </div>
        <svg className={cn('w-5 h-5 text-app-tertiary shrink-0 transition-transform duration-250', open && 'rotate-180')}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div className={cn('overflow-hidden transition-[max-height] duration-350', open ? 'max-h-[800px]' : 'max-h-0')}>
        <div className="flex flex-wrap gap-2 px-[18px] pb-[18px] pt-3">
          {cat.groups.map(g => (
            <div key={g.label} className="w-full">
              <div className="text-[11px] font-bold text-app-tertiary uppercase tracking-[.06em] mt-2 mb-1">{g.label}</div>
              <div className="flex flex-wrap gap-2">
                {g.tags.map(t => (
                  <Chip key={t} label={t} selected={sel.includes(t)} onClick={() => onToggle(cat.id, t)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Step 4: Competitors ─────────────────────────────────────── */
function Step4() {
  const { state, dispatch } = useApp()
  const suggested = state.business && state.businessCategory
    ? smartCompetitorsFor(state.business, state.businessCategory)
    : []

  useEffect(() => {
    if (state.competitors.length === 0 && suggested.length > 0) {
      dispatch({ type: 'SET_COMPETITORS', payload: suggested })
    }
  }, [])

  const subset = state.competitors.slice(0, 3).map(x => x.toLowerCase()).join(', ')
  const more = state.competitors.length > 3

  return (
    <>
      <ModalHeader step={4} title={`Who competes with your ${state.business ?? 'business'}?`} subtitle="We pre-selected likely competitors. Adjust if needed." />
      <div className="flex items-center justify-between px-8 py-3.5 gap-3 shrink-0 border-b border-app-border">
        <button type="button" onClick={() => dispatch({ type: 'SET_COMPETITORS', payload: suggested })}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand text-white rounded-pill text-[13px] font-semibold hover:bg-brand-hover transition-all shadow-[0_2px_8px_rgba(68,182,197,.25)]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2l1.8 5.8L19.6 9.6 14 12l-2 7-2-7-5.6-2.4 5.8-1.8z"/></svg>
          Reset to AI
        </button>
        <button type="button" onClick={() => dispatch({ type: 'SET_COMPETITORS', payload: [] })}
          className="bg-transparent border-0 text-[13px] text-app-secondary hover:text-app-text cursor-pointer font-medium">
          Clear all
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-3.5 scrollbar-thin">
        {state.business && (
          <div className="flex items-start gap-2.5 bg-brand-tint2 border border-brand-light rounded-xl px-3.5 py-3 mb-3.5 text-[13px] text-app-text leading-snug">
            <svg className="text-brand shrink-0 mt-px w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <span>For a <strong>{state.business}</strong>, we look at {subset}{more ? ', …' : ''}. Adjust below.</span>
          </div>
        )}
        {businesses.map(b => {
          const sel = b.items.filter(x => state.competitors.includes(x))
          return (
            <div key={b.cat} className={cn('bg-white border-[1.5px] border-app-border rounded-card mb-2.5 overflow-hidden', sel.length && 'border-brand bg-brand-lighter')}>
              <CompCategoryCard cat={b.cat} icon={b.icon} items={b.items} selected={state.competitors}
                onToggle={item => dispatch({ type: 'TOGGLE_COMPETITOR', payload: item })} defaultOpen={sel.length > 0} />
            </div>
          )
        })}
      </div>
      <ModalFooter
        step={4}
        status={`${state.competitors.length} competitor${state.competitors.length === 1 ? '' : 's'}`}
        canContinue={state.competitors.length > 0}
        onBack={() => dispatch({ type: 'GO_STEP', payload: 3 })}
        onContinue={() => dispatch({ type: 'FINISH_ONBOARDING' })}
        continueLabel="Show me the map →"
      />
    </>
  )
}

function CompCategoryCard({ cat, icon, items, selected, onToggle, defaultOpen }: {
  cat: string; icon: string; items: string[]; selected: string[]; onToggle(item: string): void; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  const sel = items.filter(x => selected.includes(x))
  return (
    <>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-4 px-[18px] py-4 w-full bg-transparent border-0 text-left hover:bg-brand/[.04] transition-colors">
        <div className="w-[42px] h-[42px] bg-app-icon-bg rounded-[10px] flex items-center justify-center text-app-icon-color shrink-0">
          <CatIcon name={icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15.5px] font-bold text-app-text mb-0.5">{cat}</div>
          <div className="text-[13px] text-app-secondary">{items.length} options</div>
        </div>
        <div className={cn('px-3 py-1 rounded-pill text-xs font-semibold', sel.length > 0 ? 'bg-brand text-white' : 'bg-app-counter text-app-secondary')}>
          {sel.length} / {items.length}
        </div>
        <svg className={cn('w-5 h-5 text-app-tertiary shrink-0 transition-transform duration-250', open && 'rotate-180')}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div className={cn('overflow-hidden transition-[max-height] duration-350', open ? 'max-h-[600px]' : 'max-h-0')}>
        <div className="flex flex-wrap gap-2 px-[18px] pb-[18px] pt-1">
          {items.map(item => (
            <Chip key={item} label={item} selected={selected.includes(item)} onClick={() => onToggle(item)} />
          ))}
        </div>
      </div>
    </>
  )
}

/* ─── Shared header / footer ─────────────────────────────────── */
function ModalHeader({ step, title, subtitle }: { step: number; title: string; subtitle: string }) {
  return (
    <div className="px-8 pt-7 pb-3 shrink-0">
      <div className="flex justify-end mb-2.5">
        <button type="button" onClick={() => {}}
          className="bg-transparent border-0 cursor-pointer text-app-tertiary p-1.5 rounded-lg hover:bg-app-counter hover:text-app-text transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <StepDots current={step} />
      <h2 className="text-[26px] font-extrabold tracking-tight leading-tight mb-2">{title}</h2>
      <p className="text-[14px] text-app-secondary leading-[1.55]">{subtitle}</p>
    </div>
  )
}

function ModalFooter({ step, status, canContinue, onBack, onContinue, continueLabel = 'Continue' }: {
  step: number; status: string; canContinue: boolean; onBack?(): void; onContinue(): void; continueLabel?: string
}) {
  return (
    <div className="flex items-center justify-between px-8 py-[18px] border-t border-app-border bg-white shrink-0 gap-3">
      {step > 1 ? (
        <button type="button" onClick={onBack}
          className="bg-transparent border-0 text-[13px] text-app-secondary hover:text-app-text cursor-pointer font-medium">
          ← Back
        </button>
      ) : <div />}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[13px] text-app-secondary truncate max-w-[200px]">{status}</span>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="bg-brand text-white border-0 rounded-xl px-5 py-3 text-[14px] font-semibold cursor-pointer flex items-center gap-2.5 transition-all duration-200 shadow-[0_2px_10px_rgba(68,182,197,.3)] hover:enabled:bg-brand-hover hover:enabled:-translate-y-px hover:enabled:shadow-[0_4px_14px_rgba(68,182,197,.4)] disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {continueLabel}
        </button>
      </div>
    </div>
  )
}

/* ─── Category SVG icons ──────────────────────────────────────── */
function CatIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    utensils: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/><path d="M21 15v7"/></svg>,
    scissors: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
    paw: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.05Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10z"/></svg>,
    'shopping-bag': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    shirt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>,
    hammer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="m17.64 15 4.36-4.36"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>,
    laptop: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    gift: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    car: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>,
    dumbbell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>,
    palette: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.83-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67H16c3.05 0 5.55-2.5 5.55-5.55C21.96 6.01 17.46 2 12 2z"/></svg>,
    'heart-pulse': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>,
  }
  return <>{icons[name] ?? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>}</>
}

/* ─── Root ─────────────────────────────────────────────────────── */
export function OnboardingModal() {
  const { state } = useApp()
  if (state.mode !== 'onboarding') return null

  return (
    <div className="fixed inset-0 bg-[rgba(15,23,42,0.42)] backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
      <div className="relative bg-white rounded-modal w-full max-w-[720px] max-h-[calc(100vh-48px)] flex flex-col shadow-modal overflow-hidden animate-slide-up"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        {state.step === 1 && <Step1 />}
        {state.step === 2 && <Step2 />}
        {state.step === 3 && <Step3 />}
        {state.step === 4 && <Step4 />}
      </div>
    </div>
  )
}
