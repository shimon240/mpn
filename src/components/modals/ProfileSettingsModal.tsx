import { useState, useRef } from 'react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'

export function ProfileSettingsModal() {
  const { state, dispatch } = useApp()
  const [firstName, setFirstName] = useState(state.auth.firstName)
  const [lastName, setLastName] = useState(state.auth.lastName)
  const [email, setEmail] = useState(state.auth.email)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (state.openModal !== 'profileSettings') return null

  const close = () => dispatch({ type: 'OPEN_MODAL', payload: null })

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    dispatch({ type: 'UPDATE_AUTH', payload: { avatar: url } })
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    dispatch({ type: 'UPDATE_AUTH', payload: { firstName, lastName, email } })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()

  return (
    <div className="fixed inset-0 bg-[rgba(15,23,42,0.55)] backdrop-blur-md z-[100] flex items-center justify-center p-6 font-app animate-fade-in">
      <div className="relative bg-white rounded-modal w-full max-w-[520px] shadow-modal-heavy overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-app-border">
          <h2 className="text-[20px] font-extrabold tracking-tight">Profile settings</h2>
          <button type="button" onClick={close}
            className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-transparent border-0 cursor-pointer text-app-tertiary hover:bg-app-counter hover:text-app-text transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={save} className="px-8 py-6 flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-16 h-16 rounded-full bg-brand-tint2 border-2 border-brand-light flex items-center justify-center cursor-pointer hover:border-brand transition-all overflow-hidden group relative shrink-0"
            >
              {state.auth.avatar ? (
                <>
                  <img src={state.auth.avatar} alt="avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                </>
              ) : (
                <span className="text-xl font-bold text-brand">{initials || '?'}</span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleAvatar} />
            <div>
              <div className="text-[14px] font-bold text-app-text">{firstName} {lastName}</div>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-[13px] text-brand font-semibold bg-transparent border-0 cursor-pointer p-0 hover:underline mt-0.5">
                Change photo
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[12.5px] font-bold text-app-text block mb-1.5">First name</span>
              <input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full border-[1.5px] border-app-border rounded-xl px-4 py-3 text-[14px] font-[inherit] text-app-text outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(68,182,197,.12)] transition-all bg-white"
              />
            </label>
            <label className="block">
              <span className="text-[12.5px] font-bold text-app-text block mb-1.5">Last name</span>
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full border-[1.5px] border-app-border rounded-xl px-4 py-3 text-[14px] font-[inherit] text-app-text outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(68,182,197,.12)] transition-all bg-white"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[12.5px] font-bold text-app-text block mb-1.5">Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-[1.5px] border-app-border rounded-xl px-4 py-3 text-[14px] font-[inherit] text-app-text outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(68,182,197,.12)] transition-all bg-white"
            />
          </label>

          <label className="block">
            <span className="text-[12.5px] font-bold text-app-text block mb-1.5">New password <span className="font-normal text-app-tertiary">(leave blank to keep current)</span></span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border-[1.5px] border-app-border rounded-xl px-4 py-3 text-[14px] font-[inherit] text-app-text outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(68,182,197,.12)] transition-all bg-white"
            />
          </label>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={close}
              className="bg-transparent border-0 text-[13.5px] text-app-secondary hover:text-app-text cursor-pointer font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cn(
                'flex items-center gap-2 bg-brand text-white border-0 rounded-xl px-6 py-3 text-[14px] font-bold cursor-pointer transition-all duration-200',
                'shadow-[0_2px_10px_rgba(68,182,197,.3)] hover:enabled:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed',
                saved && 'bg-emerald-500 shadow-[0_2px_10px_rgba(34,197,94,.3)]',
              )}
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
              ) : saved ? (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m20 6-11 11-5-5"/></svg>Saved!</>
              ) : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
