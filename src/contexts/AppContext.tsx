import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { AppState, AppAction, Metric } from '@/types'
import { deriveMetrics } from '@/lib/scoring'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const NBHD_LABELS = ['Central district', 'North quarter', 'Old town', 'Marina area', 'Eastern block', 'West side', 'Heritage area', 'Commercial zone', 'Riverside area', 'Creative hub']

const initialState: AppState = {
  mode: 'onboarding',
  step: 1,
  business: null,
  businessCategory: null,
  cities: [],
  activeCity: null,
  preset: null,
  viewMode: 'presets',
  fullListSelections: { who: [], whats: [], kind: [], feels: [], safety: [] },
  competitors: [],
  metrics: [],
  competitorRange: [0, 10],
  activeColoring: 'composite',
  zoning: { suitable: true, check: true, unlikely: true },
  showOnly5of5: false,
  lastClickedHex: null,
  similarHexesActive: false,
  auth: { loggedIn: true, firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com', avatar: null },
  searchHistory: [
    { id: 'sh1', business: 'Coffee shop', cities: ['Tel Aviv-Yafo'], competitors: ['Cafe', 'Bakery', 'Restaurant'], keywords: ['Young adults (20–39)', 'Walking area', 'Social Hub', 'Packed with locals'], date: 'May 14', bookmarks: [{ id: 'bm1', label: 'Rothschild Blvd area', score: 9 }, { id: 'bm2', label: 'Florentin district', score: 8 }] },
    { id: 'sh2', business: 'Gym',         cities: ['Haifa'],         competitors: ['Pilates Studio', 'Yoga Studio', 'Martial Arts Club'], keywords: ['Adults (40–64)', 'Parking nearby', 'Nice Life', 'Residential'], date: 'May 10', bookmarks: [] },
    { id: 'sh3', business: 'Hair Salon',  cities: ['Jerusalem'],     competitors: ['Barber', 'Beauty Salon', 'Nail Salon'], keywords: ['Adults (40–64)', 'Commercial & office hub', 'Day activity'], date: 'May 7', bookmarks: [{ id: 'bm3', label: 'City center area', score: 7 }] },
  ],
  currentSearchId: null,
  openModal: null,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_BUSINESS':
      return { ...state, business: action.payload.business, businessCategory: action.payload.category }

    case 'ADD_CITY':
      if (state.cities.includes(action.payload)) return state
      return { ...state, cities: [...state.cities, action.payload] }

    case 'REMOVE_CITY':
      return { ...state, cities: state.cities.filter(c => c !== action.payload) }

    case 'SET_PRESET':
      return { ...state, preset: action.payload }

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }

    case 'TOGGLE_FL_TAG': {
      const { catId, tag } = action.payload
      const arr = state.fullListSelections[catId]
      const next = arr.includes(tag) ? arr.filter(t => t !== tag) : [...arr, tag]
      return { ...state, fullListSelections: { ...state.fullListSelections, [catId]: next } }
    }

    case 'AI_FILL_TAGS':
      return {
        ...state,
        fullListSelections: {
          who:    action.payload.who    ?? [],
          whats:  action.payload.whats  ?? [],
          kind:   action.payload.kind   ?? [],
          feels:  action.payload.feels  ?? [],
          safety: action.payload.safety ?? [],
        },
      }

    case 'TOGGLE_COMPETITOR': {
      const item = action.payload
      const comps = state.competitors.includes(item)
        ? state.competitors.filter(c => c !== item)
        : [...state.competitors, item]
      return { ...state, competitors: comps }
    }

    case 'SET_COMPETITORS':
      return { ...state, competitors: action.payload }

    case 'GO_STEP':
      return { ...state, step: action.payload }

    case 'FINISH_ONBOARDING': {
      const metrics = deriveMetrics(state.business, state.viewMode, state.fullListSelections)
      const d = new Date()
      const newSearch = {
        id: 'sh_' + Date.now(),
        business: state.business ?? '',
        cities: [...state.cities],
        competitors: [...state.competitors],
        keywords: metrics.map(m => m.name).slice(0, 6),
        date: MONTHS[d.getMonth()] + ' ' + d.getDate(),
        bookmarks: [],
      }
      return {
        ...state,
        mode: 'results',
        metrics,
        activeColoring: 'composite',
        competitorRange: [0, 10],
        activeCity: state.cities[0] ?? null,
        currentSearchId: newSearch.id,
        searchHistory: [newSearch, ...state.searchHistory],
        lastClickedHex: null,
        similarHexesActive: false,
      }
    }

    case 'RESTART':
      return {
        ...initialState,
        auth: state.auth,
        searchHistory: state.searchHistory,
      }

    case 'SET_METRIC_RANGE': {
      const metrics = state.metrics.map(m =>
        m.id === action.payload.id ? { ...m, range: action.payload.range } : m
      )
      return { ...state, metrics }
    }

    case 'SET_COMPETITOR_RANGE':
      return { ...state, competitorRange: action.payload }

    case 'SET_COLORING':
      return { ...state, activeColoring: action.payload }

    case 'TOGGLE_ZONING':
      return { ...state, zoning: { ...state.zoning, [action.payload]: !state.zoning[action.payload] } }

    case 'TOGGLE_5OF5':
      return { ...state, showOnly5of5: !state.showOnly5of5 }

    case 'SET_ACTIVE_CITY':
      return { ...state, activeCity: action.payload }

    case 'CLICK_HEX':
      return { ...state, lastClickedHex: action.payload, similarHexesActive: false }

    case 'CLOSE_HEX':
      return { ...state, lastClickedHex: null, similarHexesActive: false }

    case 'TOGGLE_BOOKMARK': {
      if (!state.currentSearchId || !state.lastClickedHex) return state
      const { score, hexId } = state.lastClickedHex
      const searchHistory = state.searchHistory.map(s => {
        if (s.id !== state.currentSearchId) return s
        const existing = s.bookmarks.find(b => b.id === hexId)
        return {
          ...s,
          bookmarks: existing
            ? s.bookmarks.filter(b => b.id !== hexId)
            : [...s.bookmarks, { id: hexId, label: NBHD_LABELS[score % NBHD_LABELS.length] + ' · ' + score + '/10', score }],
        }
      })
      return { ...state, searchHistory }
    }

    case 'REMOVE_BOOKMARK': {
      if (!state.currentSearchId) return state
      const searchHistory = state.searchHistory.map(s =>
        s.id !== state.currentSearchId ? s : { ...s, bookmarks: s.bookmarks.filter(b => b.id !== action.payload) }
      )
      return { ...state, searchHistory }
    }

    case 'TOGGLE_SIMILAR_HEXES':
      return { ...state, similarHexesActive: !state.similarHexesActive }

    case 'OPEN_MODAL':
      return { ...state, openModal: action.payload }

    case 'UPDATE_AUTH':
      return { ...state, auth: { ...state.auth, ...action.payload } }

    case 'LOGIN': {
      const emailName = action.payload.email.split('@')[0] || 'User'
      return {
        ...state,
        auth: { ...state.auth, loggedIn: true, email: action.payload.email, firstName: state.auth.firstName || emailName },
        openModal: null,
      }
    }

    case 'LOGOUT':
      return { ...state, auth: { ...state.auth, loggedIn: false }, currentSearchId: null, lastClickedHex: null }

    case 'LOAD_SEARCH': {
      const s = state.searchHistory.find(x => x.id === action.payload)
      if (!s) return state
      const metrics: Metric[] = s.keywords.map((t, i) => ({ id: 'hist_' + i, name: t, category: 'WHO IS AROUND', range: [0, 10] }))
      return {
        ...state,
        mode: 'results',
        business: s.business,
        cities: [...s.cities],
        activeCity: s.cities[0] ?? null,
        competitors: [...s.competitors],
        currentSearchId: s.id,
        metrics,
        activeColoring: 'composite',
        competitorRange: [0, 10],
        showOnly5of5: false,
        lastClickedHex: null,
        openModal: null,
      }
    }

    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextValue>({ state: initialState, dispatch: () => {} })

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
