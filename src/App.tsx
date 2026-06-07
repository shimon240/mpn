import { AppProvider, useApp } from './contexts/AppContext'
import { OnboardingModal } from './components/onboarding/OnboardingModal'
import { MapView } from './components/map/MapView'
import { LeftSidebar } from './components/sidebar/LeftSidebar'
import { RightSidebar } from './components/sidebar/RightSidebar'
import { ColoringPanel } from './components/panels/ColoringPanel'
import { ProfilePanel } from './components/panels/ProfilePanel'
import { ReportModal } from './components/modals/ReportModal'
import { ProfileSettingsModal } from './components/modals/ProfileSettingsModal'
import { SearchHistoryModal } from './components/modals/SearchHistoryModal'
import { LoginModal } from './components/modals/LoginModal'
import { HexTooltip } from './components/map/HexTooltip'

function AppInner() {
  const { state } = useApp()
  const inResults = state.mode === 'results'

  return (
    <div className="font-app h-screen overflow-hidden select-none">
      {/* Map background — always mounted so Leaflet persists */}
      <MapView />

      {/* Gradient overlay shown during onboarding */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none transition-opacity duration-[800ms]"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%,rgba(68,182,197,.08),transparent 55%),radial-gradient(ellipse at 20% 80%,rgba(15,23,42,.04),transparent 55%),#EAF1F4',
          opacity: inResults ? 0 : 1,
        }}
      />

      {/* Results UI */}
      <div
        className="transition-all duration-500"
        style={{ opacity: inResults ? 1 : 0, pointerEvents: inResults ? 'auto' : 'none' }}
      >
        <LeftSidebar />
        <RightSidebar />
        <ColoringPanel />
        <ProfilePanel />
        <HexTooltip />
      </div>

      {/* Onboarding modal */}
      <OnboardingModal />

      {/* Global modals */}
      <ReportModal />
      <ProfileSettingsModal />
      <SearchHistoryModal />
      <LoginModal />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
