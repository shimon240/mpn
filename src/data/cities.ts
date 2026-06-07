import type { Region, SpotCenter } from '@/types'

export const regions: Region[] = [
  { name: 'North', cities: ['Haifa', 'Tiberias', 'Nahariya', 'Acre', 'Safed', 'Karmiel'] },
  { name: 'Center', cities: ['Tel Aviv-Yafo', 'Ramat Gan', 'Bat Yam', 'Holon', 'Rishon LeZion', 'Petah Tikva', 'Herzliya', 'Netanya'] },
  { name: 'Jerusalem', cities: ['Jerusalem', 'Beit Shemesh'] },
  { name: 'South', cities: ['Ashdod', "Be'er Sheva", 'Ashqelon', 'Eilat', 'Dimona', 'Sderot'] },
]

export const allCities = regions.flatMap(r => r.cities)

export const cityCoords: Record<string, [number, number]> = {
  'Tel Aviv-Yafo':  [32.0853, 34.7818],
  'Haifa':          [32.7940, 34.9896],
  "Be'er Sheva":   [31.2516, 34.7913],
  'Jerusalem':      [31.7683, 35.2137],
  'Rishon LeZion':  [31.9642, 34.8044],
  'Ashdod':         [31.8040, 34.6553],
  'Petah Tikva':    [32.0877, 34.8878],
  'Netanya':        [32.3227, 34.8569],
  'Holon':          [32.0150, 34.7713],
  'Bat Yam':        [32.0225, 34.7530],
  'Ramat Gan':      [32.0697, 34.8238],
  'Herzliya':       [32.1672, 34.8437],
  'Rehovot':        [31.8948, 34.8117],
}

// [name, lat, lng]
export type Neighborhood = [string, number, number]

export const neighborhoods: Record<string, Neighborhood[]> = {
  'Tel Aviv-Yafo': [
    ['Rothschild Blvd', 32.0647, 34.7740],
    ['Florentin',       32.0590, 34.7680],
    ['Neve Tzedek',     32.0620, 34.7660],
    ['Carmel Market',   32.0672, 34.7685],
    ['Sarona',          32.0725, 34.7820],
  ],
  'Haifa': [
    ['German Colony',   32.8120, 35.0010],
    ['Hadar',           32.8200, 35.0050],
    ['Carmel Center',   32.7970, 34.9880],
    ['Ben-Gurion Ave',  32.8160, 35.0030],
    ['Wadi Nisnas',     32.8150, 35.0025],
  ],
  'Ashdod': [
    ['City Center',     31.8040, 34.6553],
    ['Rova Aleph',      31.8100, 34.6500],
    ['Port Area',       31.7980, 34.6460],
    ['Yud-Aleph',       31.8150, 34.6620],
    ['Park Zone',       31.7950, 34.6510],
  ],
  "Be'er Sheva": [
    ['Old City',        31.2430, 34.7930],
    ['Ramot',           31.2600, 34.8020],
    ['Big Center',      31.2500, 34.7980],
    ["Neve Ze'ev",      31.2700, 34.8100],
    ['University area', 31.2620, 34.7990],
  ],
}

export const fallbackNeighborhoods: Neighborhood[] = [
  ['Central district', 0, 0],
  ['North quarter',    0, 0],
  ['Old town',         0, 0],
  ['Marina area',      0, 0],
  ['University zone',  0, 0],
]

export function getNeighborhoods(city: string): Neighborhood[] {
  return neighborhoods[city] ?? fallbackNeighborhoods
}

export function checkLatLngOnLand(_lat: number, lng: number, city: string): boolean {
  if (['Tel Aviv-Yafo', 'Bat Yam', 'Holon'].includes(city)) return lng > 34.758
  if (city === 'Netanya')  return lng > 34.847
  if (city === 'Ashdod')   return lng > 34.638
  if (city === 'Herzliya') return lng > 34.794
  if (city === 'Haifa')    return lng > 34.955
  return true
}

export function fallbackSpotCenters(w: number, h: number): SpotCenter[] {
  const cx = w * 0.45, cy = h * 0.5
  return [
    { x: cx,         y: cy         },
    { x: cx - w*.1,  y: cy + h*.1  },
    { x: cx + w*.08, y: cy - h*.08 },
    { x: cx + w*.05, y: cy + h*.12 },
    { x: cx - w*.08, y: cy - h*.12 },
  ]
}
