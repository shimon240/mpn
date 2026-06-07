export interface BusinessCategory {
  cat: string
  icon: string
  items: string[]
}

export interface Region {
  name: string
  cities: string[]
}

export interface Preset {
  id: string
  icon: string
  title: string
  desc: string
}

export interface FullListGroup {
  label: string
  tags: string[]
}

export interface FullListCategory {
  id: string
  title: string
  subtitle: string
  icon: string
  groups: FullListGroup[]
}

export interface Metric {
  id: string
  name: string
  category: string
  range: [number, number]
}

export interface Bookmark {
  id: string
  label: string
  score: number
}

export interface SearchRecord {
  id: string
  business: string
  cities: string[]
  competitors: string[]
  keywords: string[]
  date: string
  bookmarks: Bookmark[]
}

export type ZoningType = 'suitable' | 'check' | 'unlikely'

export interface HexCell {
  score: number
  cx: number
  cy: number
  zType: ZoningType
  passesFilters: boolean
  color: string
  opacity: number
  points: string
  hexId: string
}

export interface SpotCenter { x: number; y: number }

export type ViewMode = 'presets' | 'fulllist'

export interface FullListSelections {
  who: string[]
  whats: string[]
  kind: string[]
  feels: string[]
  safety: string[]
}

export interface Auth {
  loggedIn: boolean
  firstName: string
  lastName: string
  email: string
  avatar: string | null
}

export type ModalKind = 'report' | 'profileSettings' | 'searchHistory' | 'login'

export interface AppState {
  mode: 'onboarding' | 'results'
  step: 1 | 2 | 3 | 4
  business: string | null
  businessCategory: string | null
  cities: string[]
  activeCity: string | null
  preset: string | null
  viewMode: ViewMode
  fullListSelections: FullListSelections
  competitors: string[]
  metrics: Metric[]
  competitorRange: [number, number]
  activeColoring: string
  zoning: Record<ZoningType, boolean>
  showOnly5of5: boolean
  lastClickedHex: { score: number; hexId: string; points: string } | null
  similarHexesActive: boolean
  auth: Auth
  searchHistory: SearchRecord[]
  currentSearchId: string | null
  openModal: ModalKind | null
}

export type AppAction =
  | { type: 'SET_BUSINESS'; payload: { business: string; category: string } }
  | { type: 'ADD_CITY'; payload: string }
  | { type: 'REMOVE_CITY'; payload: string }
  | { type: 'SET_PRESET'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'TOGGLE_FL_TAG'; payload: { catId: keyof FullListSelections; tag: string } }
  | { type: 'AI_FILL_TAGS'; payload: Partial<FullListSelections> }
  | { type: 'TOGGLE_COMPETITOR'; payload: string }
  | { type: 'SET_COMPETITORS'; payload: string[] }
  | { type: 'GO_STEP'; payload: 1 | 2 | 3 | 4 }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'RESTART' }
  | { type: 'SET_METRIC_RANGE'; payload: { id: string; range: [number, number] } }
  | { type: 'SET_COMPETITOR_RANGE'; payload: [number, number] }
  | { type: 'SET_COLORING'; payload: string }
  | { type: 'TOGGLE_ZONING'; payload: ZoningType }
  | { type: 'TOGGLE_5OF5' }
  | { type: 'SET_ACTIVE_CITY'; payload: string }
  | { type: 'CLICK_HEX'; payload: { score: number; hexId: string; points: string } }
  | { type: 'CLOSE_HEX' }
  | { type: 'TOGGLE_BOOKMARK' }
  | { type: 'REMOVE_BOOKMARK'; payload: string }
  | { type: 'TOGGLE_SIMILAR_HEXES' }
  | { type: 'OPEN_MODAL'; payload: ModalKind | null }
  | { type: 'UPDATE_AUTH'; payload: Partial<Auth> }
  | { type: 'LOGIN'; payload: { email: string } }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_SEARCH'; payload: string }
