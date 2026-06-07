import type { AppState, Metric, FullListSelections } from '@/types'
import { archetypeFor, aiTagsFor } from '@/data/presets'

const catTitleMap: Record<keyof FullListSelections, string> = {
  who:    'WHO IS AROUND',
  whats:  "WHAT'S AROUND",
  kind:   'WHAT KIND OF PLACE',
  feels:  'HOW THE PLACE FEELS',
  safety: 'SAFETY & ECONOMIC TIER',
}

export function deriveMetrics(
  business: string | null,
  viewMode: AppState['viewMode'],
  fullListSelections: AppState['fullListSelections'],
): Metric[] {
  const tags: { id: string; name: string; category: string }[] = []

  if (viewMode === 'fulllist') {
    const totalFL = Object.values(fullListSelections).reduce((n, a) => n + a.length, 0)
    if (totalFL > 0) {
      for (const [cid, sel] of Object.entries(fullListSelections) as [keyof FullListSelections, string[]][]) {
        for (const t of sel) {
          tags.push({ id: `${cid}_${t.replace(/\s+/g, '_')}`, name: t, category: catTitleMap[cid] })
        }
      }
    }
  }

  if (tags.length === 0) {
    const archetype = archetypeFor(business ?? '')
    const playbook = aiTagsFor(archetype)
    for (const [cid, sel] of Object.entries(playbook) as [keyof FullListSelections, string[]][]) {
      for (const t of sel) {
        tags.push({ id: `${cid}_${t.replace(/\s+/g, '_')}`, name: t, category: catTitleMap[cid] })
      }
    }
  }

  return tags.map(t => ({ ...t, range: [0, 10] as [number, number] }))
}

export function getMetricFormatInfo(name: string): { type: 'percentage' | 'count' | 'score'; suffix: string } {
  const n = name.toLowerCase()
  if (/(adults|teens|seniors|families|people|owners|olims|dati|haredi|secular|masorati|christians|druzes|jews|muslims|employment)/.test(n))
    return { type: 'percentage', suffix: '%' }
  if (/(bakery|bar|cafe|coffee|food|pizzeria|restaurant|winery|store|mall|pharmacy|dealer|cosmetics|boutique|jewelry|clothing|gallery|museum|theatre|historic|heritage|club|venue|entertainment|beauty|wellness|lodging|center|station|parking)/.test(n))
    return { type: 'count', suffix: ' places' }
  return { type: 'score', suffix: ' pts' }
}

export function formatRangeStr(range: [number, number], name: string): string {
  const info = getMetricFormatInfo(name)
  const v0 = info.type === 'percentage' ? range[0] * 10 : range[0]
  const v1 = info.type === 'percentage' ? range[1] * 10 : range[1]
  const plus = range[1] === 10 && info.type === 'count' ? '+' : ''
  return `${v0}–${v1}${plus}${info.suffix}`
}
