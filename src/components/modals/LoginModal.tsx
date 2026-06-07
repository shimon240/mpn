import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'

export function LoginModal() {
  const { state, dispatch } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (state.openModal !== 'login') return null

  const close = () => dispatch({ type: 'OPEN_MODAL', payload: null })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    dispatch({ type: 'LOGIN', payload: { email } })
    setLoading(false)
    close()
  }

  return (
    <div className="fixed inset-0 bg-[rgba(15,23,42,0.55)] backdrop-blur-md z-[100] flex items-center justify-center p-6 font-app animate-fade-in">
      <div className="relative bg-white rounded-modal w-full max-w-[440px] shadow-modal-heavy overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-8 pt-7 pb-5 border-b border-app-border">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-brand-tint2 rounded-xl flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#44B6C5" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <button type="button" onClick={close}
              className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-transparent border-0 cursor-pointer text-app-tertiary hover:bg-app-counter hover:text-app-text transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <h2 className="text-[24px] font-extrabold tracking-tight">Sign in to Mapinamo</h2>
          <p className="text-[13.5px] text-app-secondary mt-1.5">Save your searches and bookmarks across sessions.</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="px-8 py-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-[10px] px-3.5 py-2.5 mb-4">
              {error}
            </div>
          )}

          <label className="block mb-4">
            <span className="text-[12.5px] font-bold text-app-text block mb-1.5">Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full border-[1.5px] border-app-border rounded-xl px-4 py-3 text-[14px] font-[inherit] text-app-text outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(68,182,197,.12)] transition-all bg-white"
            />
          </label>

          <label className="block mb-5">
            <span className="text-[12.5px] font-bold text-app-text block mb-1.5">Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full border-[1.5px] border-app-border rounded-xl px-4 py-3 text-[14px] font-[inherit] text-app-text outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(68,182,197,.12)] transition-all bg-white"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full bg-brand text-white border-0 rounded-xl py-3.5 text-[15px] font-bold cursor-pointer transition-all duration-200',
              'shadow-[0_2px_10px_rgba(68,182,197,.3)] hover:enabled:bg-brand-hover hover:enabled:shadow-[0_4px_18px_rgba(68,182,197,.4)]',
              'disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2',
            )}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : 'Sign in'}
          </button>

          <p className="text-center text-[12.5px] text-app-secondary mt-4">
            Don't have an account?{' '}
            <span className="text-brand font-semibold cursor-pointer hover:underline">Sign up</span>
          </p>
        </form>
      </div>
    </div>
  )
}
