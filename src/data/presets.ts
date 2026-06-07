import type { Preset, FullListCategory, FullListSelections } from '@/types'

export const presets: Preset[] = [
  { id: 'traffic',  icon: '🚶', title: 'Maximum foot traffic', desc: 'Pedestrian streets, central areas, daytime activity.' },
  { id: 'rent',     icon: '💰', title: 'Cheap rent first',     desc: 'Quieter zones, lower density of premium spots.' },
  { id: 'niche',    icon: '🎯', title: 'Open niche',           desc: 'Few direct competitors, adjacent demand nearby.' },
  { id: 'audience', icon: '👥', title: 'My audience nearby',   desc: 'Demographics matched to your business.' },
  { id: 'vibe',     icon: '🌃', title: 'Atmosphere & vibe',    desc: 'Evening life, cultural clusters, tourists.' },
]

export const fullListCategories: FullListCategory[] = [
  { id: 'who', title: 'Who is around', subtitle: 'People living and working nearby', icon: 'users', groups: [
    { label: 'Age & lifecycle', tags: ['Kids & teens area', 'Young adults (20–39)', 'Adults (40–64)', 'Seniors (65+)'] },
    { label: 'Households',      tags: ['Big families', 'Married people', 'Home owners'] },
    { label: 'Community',       tags: ['Olims area', 'Dati', 'Haredi', 'Secular', 'Masorati', 'Mostly Christians', 'Mostly Druzes', 'Mostly Jews', 'Mostly Muslims'] },
  ]},
  { id: 'whats', title: "What's around", subtitle: 'Nearby businesses and places', icon: 'building', groups: [
    { label: 'Food & drink', tags: ['Bakery', 'Bar', 'Cafe', 'Coffee shop', 'Fast food', 'Pizzeria', 'Restaurant', 'Winery'] },
    { label: 'Retail',       tags: ['Convenience store', 'Grocery store', 'Mall', 'Pharmacy'] },
    { label: 'Specialty',    tags: ['Car dealer', 'Cosmetics & beauty', 'Fashion boutique', 'Furniture store', 'Jewelry store', "Women's clothing"] },
    { label: 'Culture',      tags: ['Cultural & historic', 'Heritage', 'Art gallery', 'Museum', 'Theatre'] },
    { label: 'Nightlife',    tags: ['Arts & entertainment', 'Dance club', 'Music venue'] },
    { label: 'Services',     tags: ['Beauty & wellness', 'Lodging', 'Business center', 'Medical center'] },
    { label: 'Transport',    tags: ['LRT stations', 'Train stations'] },
  ]},
  { id: 'kind', title: 'What kind of place', subtitle: 'Character and rhythm of the area', icon: 'grid', groups: [
    { label: 'Land use', tags: ['Residential', 'Commercial & office hub', 'Walking area', 'Working / industrial', 'Street-dense'] },
    { label: 'Access',   tags: ['Parking nearby', 'Public transport access'] },
    { label: 'Activity', tags: ['Day activity', 'Evening activity', 'Has everything', 'Essential shopping'] },
  ]},
  { id: 'feels', title: 'How the place feels', subtitle: 'Vibe and atmosphere', icon: 'sparkle', groups: [
    { label: 'Vibe', tags: ['Sleep and Party', 'Almost Nobody', 'Heritage Core', 'Nice Life', 'Local Living', 'Social Hub', 'Weekend Escape', 'Creative cluster', 'Nice to walk', 'Packed with locals', 'Tourist area'] },
  ]},
  { id: 'safety', title: 'Safety & economic tier', subtitle: 'Safety and income level', icon: 'shield', groups: [
    { label: 'Safety',   tags: ['Low crime'] },
    { label: 'Economic', tags: ['Car owners', 'High employment', 'Premium places', 'Wealthy area'] },
  ]},
]

type Archetype = 'food-traffic' | 'food-residential' | 'nightlife' | 'health-residential' | 'beauty' | 'fitness' | 'pet' | 'culture' | 'default'

const aiTagPlaybook: Record<Archetype, Partial<FullListSelections>> = {
  'food-traffic':     { who: ['Young adults (20–39)', 'Adults (40–64)'], whats: ['Cafe', 'Coffee shop', 'Restaurant', 'Mall'], kind: ['Walking area', 'Day activity', 'Street-dense'], feels: ['Social Hub', 'Packed with locals', 'Nice to walk'], safety: ['Low crime'] },
  'food-residential': { who: ['Adults (40–64)', 'Big families', 'Home owners'], whats: ['Grocery store', 'Pharmacy', 'Convenience store'], kind: ['Residential', 'Day activity', 'Parking nearby'], feels: ['Local Living', 'Nice to walk'], safety: ['Low crime'] },
  'nightlife':        { who: ['Young adults (20–39)', 'Secular'], whats: ['Bar', 'Restaurant', 'Music venue', 'Dance club'], kind: ['Walking area', 'Evening activity', 'Street-dense'], feels: ['Social Hub', 'Sleep and Party', 'Tourist area', 'Creative cluster'], safety: ['Low crime'] },
  'health-residential': { who: ['Adults (40–64)', 'Seniors (65+)', 'Big families'], whats: ['Pharmacy', 'Medical center', 'Grocery store'], kind: ['Residential', 'Parking nearby', 'Public transport access'], feels: ['Local Living', 'Nice Life'], safety: ['Low crime'] },
  'beauty':           { who: ['Young adults (20–39)', 'Adults (40–64)', 'Secular'], whats: ['Cafe', 'Fashion boutique', 'Cosmetics & beauty', 'Beauty & wellness'], kind: ['Walking area', 'Day activity', 'Commercial & office hub'], feels: ['Social Hub', 'Nice to walk', 'Nice Life'], safety: ['Low crime', 'Premium places'] },
  'fitness':          { who: ['Young adults (20–39)', 'Adults (40–64)'], whats: ['Cafe', 'Beauty & wellness'], kind: ['Residential', 'Parking nearby', 'Day activity'], feels: ['Nice Life', 'Local Living'], safety: ['Low crime', 'High employment'] },
  'pet':              { who: ['Adults (40–64)', 'Home owners'], whats: ['Grocery store', 'Pharmacy'], kind: ['Residential', 'Parking nearby'], feels: ['Local Living', 'Nice Life'], safety: ['Low crime'] },
  'culture':          { who: ['Young adults (20–39)', 'Adults (40–64)', 'Secular'], whats: ['Cafe', 'Bar', 'Art gallery', 'Theatre', 'Cultural & historic'], kind: ['Walking area', 'Evening activity'], feels: ['Heritage Core', 'Creative cluster', 'Tourist area', 'Nice to walk'], safety: ['Low crime'] },
  'default':          { who: ['Adults (40–64)'], whats: ['Cafe', 'Grocery store', 'Pharmacy'], kind: ['Residential', 'Day activity', 'Parking nearby'], feels: ['Local Living'], safety: ['Low crime'] },
}

const archetypePresetMap: Record<Archetype, string> = {
  'food-traffic':     'traffic',
  'food-residential': 'audience',
  'nightlife':        'vibe',
  'health-residential': 'audience',
  'beauty':           'audience',
  'fitness':          'niche',
  'pet':              'audience',
  'culture':          'vibe',
  'default':          'traffic',
}

export function archetypeFor(business: string): Archetype {
  const s = business.toLowerCase()
  if (/coffee|cafe|ice|dessert|pizz/.test(s))              return 'food-traffic'
  if (/bakery|grocery|pharmacy|convenience|butcher|liquor|deli/.test(s)) return 'food-residential'
  if (/bar|wine|club|music|theatre|gallery|museum/.test(s)) return 'nightlife'
  if (/dentist|doctor|medical|optome|psycho|counsel|physical|spa|holistic/.test(s)) return 'health-residential'
  if (/barber|salon|beauty|nail|hair|cosmetic|skin|tattoo|massage/.test(s)) return 'beauty'
  if (/gym|yoga|pilates|martial|dance|sport|swim|bike/.test(s)) return 'fitness'
  if (/pet|veterin/.test(s))                                return 'pet'
  if (/art|book|toy|flower|craft/.test(s))                  return 'culture'
  return 'default'
}

export function presetForArchetype(archetype: Archetype): string {
  return archetypePresetMap[archetype]
}

export function aiTagsFor(archetype: Archetype): Partial<FullListSelections> {
  return aiTagPlaybook[archetype] ?? aiTagPlaybook.default
}
