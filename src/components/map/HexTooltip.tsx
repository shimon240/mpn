import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const SCORE_LABELS = ['Low fit', 'Below avg', 'Average', 'Good fit', 'Strong match', 'Top match']

interface Props {
  score: number | null
  x: number
  y: number
  visible: boolean
}

export function HexTooltipEl({ score, x, y, visible }: Props) {
  if (score === null) return null
  const label = SCORE_LABELS[Math.min(5, Math.floor(score / 2))]
  return (
    <div
      className={cn(
        'fixed z-[200] pointer-events-none bg-app-text text-white px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap',
        'transition-opacity duration-150',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      style={{ left: x + 14, top: y - 10 }}
    >
      <strong className="block font-bold mb-0.5">Score: {score}</strong>
      {label}
    </div>
  )
}

// Context-connected version for use in App
export function HexTooltip() {
  // Tooltip state is managed globally via a DOM event since it needs
  // to be updated at high frequency (every mousemove on hex)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = (e: CustomEvent) => {
      const { score, x, y } = e.detail
      if (!el) return
      el.innerHTML = `<strong style="display:block;font-weight:700;margin-bottom:2px">Score: ${score}</strong>${['Low fit','Below avg','Average','Good fit','Strong match','Top match'][Math.min(5,Math.floor(score/2))]}`
      el.style.left = (x + 14) + 'px'
      el.style.top  = (y - 10) + 'px'
      el.style.opacity = '1'
    }
    const hide = () => { el.style.opacity = '0' }
    const move = (e: CustomEvent) => {
      el.style.left = (e.detail.x + 14) + 'px'
      el.style.top  = (e.detail.y - 10) + 'px'
    }

    window.addEventListener('hex-tooltip-show' as any, show)
    window.addEventListener('hex-tooltip-hide' as any, hide)
    window.addEventListener('hex-tooltip-move' as any, move)
    return () => {
      window.removeEventListener('hex-tooltip-show' as any, show)
      window.removeEventListener('hex-tooltip-hide' as any, hide)
      window.removeEventListener('hex-tooltip-move' as any, move)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed z-[200] pointer-events-none bg-[#0F172A] text-white px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-opacity duration-150 opacity-0"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    />
  )
}
