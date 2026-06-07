import { useRef, useCallback, useEffect, useState } from 'react'

interface Props {
  value: [number, number]
  onChange: (range: [number, number]) => void
  min?: number
  max?: number
}

export function RangeSlider({ value, onChange, min = 0, max = 10 }: Props) {
  const [local, setLocal] = useState<[number, number]>(value)
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<'low' | 'high' | null>(null)
  const localRef = useRef(local)
  localRef.current = local

  // Sync from parent
  useEffect(() => { setLocal(value) }, [value[0], value[1]])

  const posForValue = (v: number) =>
    `calc(8px + (100% - 16px) * ${(v - min) / (max - min)})`

  const valueFromClientX = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return 0
    const raw = (clientX - rect.left) / rect.width * (max - min) + min
    return Math.round(Math.max(min, Math.min(max, raw)))
  }, [min, max])

  const onPointerDown = useCallback((e: React.PointerEvent, which: 'low' | 'high') => {
    e.preventDefault()
    draggingRef.current = which

    const onMove = (me: PointerEvent) => {
      if (!draggingRef.current) return
      const v = valueFromClientX(me.clientX)
      const [lo, hi] = localRef.current
      const next: [number, number] = draggingRef.current === 'low'
        ? [Math.min(v, hi - 1), hi]
        : [lo, Math.max(v, lo + 1)]
      setLocal(next)
      onChange(next)
    }

    const onUp = () => {
      draggingRef.current = null
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [valueFromClientX, onChange])

  const onTrackDown = useCallback((e: React.PointerEvent) => {
    const v = valueFromClientX(e.clientX)
    const [lo, hi] = localRef.current
    const which: 'low' | 'high' = Math.abs(v - lo) <= Math.abs(v - hi) ? 'low' : 'high'
    onPointerDown(e, which)
  }, [valueFromClientX, onPointerDown])

  const fillLeft  = ((local[0] - min) / (max - min)) * 100
  const fillRight = ((max - local[1]) / (max - min)) * 100

  return (
    <div className="relative h-6 select-none touch-none">
      <div
        ref={trackRef}
        className="absolute top-[10px] left-2 right-2 h-[3px] bg-app-border-strong rounded cursor-pointer overflow-visible"
        onPointerDown={onTrackDown}
      >
        <div
          className="absolute top-0 h-full bg-brand rounded pointer-events-none"
          style={{ left: `${fillLeft}%`, right: `${fillRight}%` }}
        />
      </div>
      {/* Low thumb */}
      <div
        className="absolute top-[4px] w-4 h-4 -translate-x-1/2 rounded-full bg-white border-2 border-brand shadow cursor-grab active:cursor-grabbing z-10"
        style={{ left: posForValue(local[0]) }}
        onPointerDown={e => onPointerDown(e, 'low')}
      />
      {/* High thumb */}
      <div
        className="absolute top-[4px] w-4 h-4 -translate-x-1/2 rounded-full bg-white border-2 border-brand shadow cursor-grab active:cursor-grabbing z-10"
        style={{ left: posForValue(local[1]) }}
        onPointerDown={e => onPointerDown(e, 'high')}
      />
    </div>
  )
}
