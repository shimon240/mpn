import type { HexCell, SpotCenter, ZoningType, Metric } from '@/types'
import { checkLatLngOnLand } from '@/data/cities'
import type L from 'leaflet'

export const HEX_SIZE = 26
const HEX_W = Math.sqrt(3) * HEX_SIZE
const ROW_H = 1.5 * HEX_SIZE

// Teal color segments for metric mode
const SEG_COLORS: string[] = Array.from({ length: 10 }, (_, i) => {
  const sat = 50 + i * 1.55
  const lit = 92 - i * 7
  return `hsl(187,${sat.toFixed(0)}%,${lit.toFixed(0)}%)`
})

function hexPoints(cx: number, cy: number): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 3 * i + Math.PI / 6
    pts.push(`${(cx + HEX_SIZE * Math.cos(a)).toFixed(1)},${(cy + HEX_SIZE * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

function hexId(points: string): string {
  let h = 0
  for (let i = 0; i < points.length; i++) h = ((h << 5) - h + points.charCodeAt(i)) | 0
  return 'hex_' + Math.abs(h)
}

function deterministicNoise(c: number, r: number): number {
  return ((Math.sin(c * 127.1 + r * 311.7) * 43758.5453) % 1 + 1) % 1
}

function computeColor(
  t: number,
  mode: string | null,
  passesFilters: boolean,
): { color: string; opacity: number } {
  if (!mode) {
    const shade = Math.floor(218 + t * 28)
    return { color: `rgb(${shade},${shade + 4},${shade + 8})`, opacity: 0.45 }
  }
  if (mode !== 'composite') {
    const idx = Math.min(9, Math.floor(t * 10))
    return { color: SEG_COLORS[idx], opacity: passesFilters ? 0.54 : 0.08 }
  }
  let color: string, opacity: number
  if      (t > 0.78) { color = '#DC2626'; opacity = 0.59 }
  else if (t > 0.6)  { color = '#EA580C'; opacity = 0.53 }
  else if (t > 0.42) { color = '#F59E0B'; opacity = 0.49 }
  else if (t > 0.25) { color = '#FBBF24'; opacity = 0.41 }
  else if (t > 0.1)  { color = '#FEF3C7'; opacity = 0.38 }
  else               { color = '#E0F2F5'; opacity = 0.26 }
  if (!passesFilters) opacity = 0.02
  return { color, opacity }
}

export interface ComputeHexesOptions {
  width: number
  height: number
  spotCenters: SpotCenter[]
  mode: string | null
  metrics: Metric[]
  competitorRange: [number, number]
  zoning: Record<ZoningType, boolean>
  showOnly5of5: boolean
  leafletMap: L.Map | null
  activeCity: string
}

export function computeHexes(opts: ComputeHexesOptions): HexCell[] {
  const { width: w, height: h, spotCenters, mode, metrics, competitorRange, zoning, showOnly5of5, leafletMap, activeCity } = opts
  const spotR = Math.max(w, h) * 0.11
  const rows = Math.ceil(h / ROW_H) + 2
  const cols = Math.ceil(w / HEX_W) + 2
  const cells: HexCell[] = []

  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const x = c * HEX_W + (r % 2 === 0 ? 0 : HEX_W / 2)
      const y = r * ROW_H

      // Skip sea hexes when in results mode
      if (mode && leafletMap) {
        try {
          const ll = leafletMap.containerPointToLatLng([x, y])
          if (!checkLatLngOnLand(ll.lat, ll.lng, activeCity)) continue
        } catch { /* skip on error */ }
      }

      // Score from neighborhood clusters
      let t = 0
      for (const sp of spotCenters) {
        const d = Math.hypot(x - sp.x, y - sp.y) / spotR
        t = Math.max(t, Math.max(0, 1 - d * d))
      }
      const noise = (deterministicNoise(c, r) - 0.5) * 0.12
      t = Math.min(1, Math.max(0, t + noise))

      const score = Math.round(t * 10)

      // Pseudo-random zoning
      const pr = Math.floor(Math.abs(Math.sin(c * 12.9898 + r * 78.233)) * 100)
      const zType: ZoningType = pr <= 60 ? 'suitable' : pr <= 85 ? 'check' : 'unlikely'

      // Filter check
      let passesFilters = true
      for (const m of metrics) {
        if (score < m.range[0] || score > m.range[1]) { passesFilters = false; break }
      }
      if (passesFilters && (score < competitorRange[0] || score > competitorRange[1])) passesFilters = false
      if (passesFilters && !zoning[zType]) passesFilters = false
      if (passesFilters && showOnly5of5 && score < 10) passesFilters = false

      const { color, opacity } = computeColor(t, mode, passesFilters)
      const points = hexPoints(x, y)

      cells.push({ score, cx: x, cy: y, zType, passesFilters, color, opacity, points, hexId: hexId(points) })
    }
  }
  return cells
}
