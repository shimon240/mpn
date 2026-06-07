import { useMemo, useCallback } from 'react'
import type L from 'leaflet'
import { useApp } from '@/contexts/AppContext'
import { computeHexes } from '@/lib/hex'
import type { SpotCenter, HexCell } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  width: number
  height: number
  spotCenters: SpotCenter[]
  leafletMap: L.Map | null
  mode: string | null
  similarHexesActive: boolean
  lastClickedHex: { score: number; hexId: string; points: string } | null
}

export function HexGrid({ width, height, spotCenters, leafletMap, mode, similarHexesActive, lastClickedHex }: Props) {
  const { state, dispatch } = useApp()

  const hexes = useMemo(() => computeHexes({
    width,
    height,
    spotCenters,
    mode,
    metrics: state.metrics,
    competitorRange: state.competitorRange,
    zoning: state.zoning,
    showOnly5of5: state.showOnly5of5,
    leafletMap,
    activeCity: state.activeCity ?? '',
  }), [
    width, height, spotCenters, mode,
    state.metrics, state.competitorRange, state.zoning, state.showOnly5of5,
    leafletMap, state.activeCity,
  ])

  const onHexClick = useCallback((hex: HexCell) => {
    if (!mode) return
    dispatch({ type: 'CLICK_HEX', payload: { score: hex.score, hexId: hex.hexId, points: hex.points } })
  }, [dispatch, mode])

  const onHexEnter = useCallback((e: React.MouseEvent, hex: HexCell) => {
    if (!mode) return
    window.dispatchEvent(new CustomEvent('hex-tooltip-show', { detail: { score: hex.score, x: e.clientX, y: e.clientY } }))
  }, [mode])

  const onHexMove = useCallback((e: React.MouseEvent) => {
    window.dispatchEvent(new CustomEvent('hex-tooltip-move', { detail: { x: e.clientX, y: e.clientY } }))
  }, [])

  const onHexLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent('hex-tooltip-hide'))
  }, [])

  return (
    <svg
      className={cn(
        'fixed inset-0 w-full h-full z-[2] transition-opacity duration-[800ms]',
        mode ? 'opacity-100' : 'opacity-40',
      )}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ pointerEvents: 'none' }}
    >
      {hexes.map(hex => {
        const isClicked = hex.points === lastClickedHex?.points
        const isSimilar = similarHexesActive
          ? Math.abs(hex.score - (lastClickedHex?.score ?? 0)) <= 1
          : true
        const opacity = similarHexesActive
          ? (isSimilar ? hex.opacity : 0.05)
          : hex.opacity

        return (
          <polygon
            key={hex.hexId}
            points={hex.points}
            fill={isClicked ? '#44B6C5' : hex.color}
            fillOpacity={isClicked ? 0.5 : opacity}
            stroke={isClicked ? '#44B6C5' : 'rgba(255,255,255,.6)'}
            strokeWidth={isClicked ? 2 : 0.6}
            style={{
              filter: isClicked ? 'drop-shadow(0 0 6px rgba(68,182,197,.6))' : undefined,
              cursor: hex.passesFilters ? 'pointer' : 'default',
              pointerEvents: (mode && hex.passesFilters && (!similarHexesActive || isSimilar)) ? 'all' : 'none',
              transition: 'opacity 0.4s ease, fill 0.4s ease, stroke 0.3s ease',
            }}
            onClick={() => onHexClick(hex)}
            onMouseEnter={e => onHexEnter(e, hex)}
            onMouseMove={onHexMove}
            onMouseLeave={onHexLeave}
          />
        )
      })}
    </svg>
  )
}
