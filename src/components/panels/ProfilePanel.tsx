import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'

export function ProfilePanel() {
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

  const { auth } = state
  const initials = auth.loggedIn
    ? `${auth.firstName[0] ?? ''}${auth.lastName[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <div ref={ref} className="fixed top-4 right-[316px] z-[20] font-app pointer-events-auto">
      {/* Avatar button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-11 h-11 rounded-full bg-white border-[1.5px] border-app-border shadow-card flex items-center justify-center cursor-pointer hover:border-brand hover:shadow-[0_0_0_4px_rgba(68,182,197,.12)] transition-all duration-200 overflow-hidden"
      >
        {auth.avatar ? (
          <img src={auth.avatar} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className={cn(
            'text-[13px] font-bold',
            auth.loggedIn ? 'text-brand' : 'text-app-secondary',
          )}>
            {auth.loggedIn ? initials : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            )}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-[220px] bg-white border-[1.5px] border-app-border rounded-[14px] shadow-card overflow-hidden animate-slide-up">
          {auth.loggedIn ? (
            <>
              {/* User info */}
              <div className="px-4 py-3.5 border-b border-app-border">
                <div className="text-[14px] font-bold text-app-text">{auth.firstName} {auth.lastName}</div>
                <div className="text-[12px] text-app-secondary truncate">{auth.email}</div>
              </div>
              {/* Menu items */}
              {[
                { icon: <UserIcon />, label: 'Profile settings', onClick: () => { dispatch({ type: 'OPEN_MODAL', payload: 'profileSettings' }); setOpen(false) } },
                { icon: <HistoryIcon />, label: 'Search history', onClick: () => { dispatch({ type: 'OPEN_MODAL', payload: 'searchHistory' }); setOpen(false) } },
                { icon: <RestartIcon />, label: 'New search', onClick: () => { dispatch({ type: 'RESTART' }); setOpen(false) } },
              ].map(item => (
                <button key={item.label} type="button" onClick={item.onClick}
                  className="flex items-center gap-3 w-full px-4 py-3 text-[13.5px] font-medium text-app-text bg-transparent border-0 cursor-pointer hover:bg-app-counter transition-colors text-left border-b border-app-border last:border-b-0">
                  <span className="text-app-secondary w-4 h-4 flex items-center justify-center shrink-0">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <button type="button"
                onClick={() => { dispatch({ type: 'LOGOUT' }); setOpen(false) }}
                className="flex items-center gap-3 w-full px-4 py-3 text-[13.5px] font-medium text-red-500 bg-transparent border-0 cursor-pointer hover:bg-red-50 transition-colors text-left">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                Log out
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-3.5 border-b border-app-border">
                <div className="text-[14px] font-bold text-app-text mb-0.5">Welcome!</div>
                <div className="text-[12px] text-app-secondary">Sign in to save searches</div>
              </div>
              <button type="button"
                onClick={() => { dispatch({ type: 'OPEN_MODAL', payload: 'login' }); setOpen(false) }}
                className="w-full px-4 py-3.5 text-[13.5px] font-semibold text-brand bg-transparent border-0 cursor-pointer hover:bg-brand-tint2 transition-colors text-left">
                Sign in →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function UserIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
}
function HistoryIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>
}
function RestartIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
}
