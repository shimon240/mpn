import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useApp } from '@/contexts/AppContext'
import { HexGrid } from './HexGrid'
import { cityCoords, getNeighborhoods, fallbackSpotCenters } from '@/data/cities'
import type { SpotCenter } from '@/types'

function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return size
}

export function MapView() {
  const { state } = useApp()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [spotCenters, setSpotCenters] = useState<SpotCenter[]>([])
  const { w, h } = useWindowSize()

  // Init Leaflet once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, {
      center: [32.0853, 34.7818],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      opacity: 0.9,
    }).addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Navigate to active city
  useEffect(() => {
    const map = mapRef.current
    if (!map || !state.activeCity) return
    const coords = cityCoords[state.activeCity] ?? [32.0853, 34.7818]
    map.setView(coords, 13, { animate: true, duration: 1 })
  }, [state.activeCity])

  // Compute spot centers whenever city or map moves
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const compute = () => {
      const city = state.activeCity ?? state.cities[0] ?? ''
      const nbrs = getNeighborhoods(city)
      const centers: SpotCenter[] = []
      for (const [, lat, lng] of nbrs) {
        if (!lat && !lng) continue
        try {
          const pt = map.latLngToContainerPoint(L.latLng(lat, lng))
          centers.push({ x: pt.x, y: pt.y })
        } catch { /* ignore */ }
      }
      setSpotCenters(centers.length ? centers : fallbackSpotCenters(w, h))
    }

    map.whenReady(compute)
    map.on('moveend zoomend', compute)
    return () => { map.off('moveend zoomend', compute) }
  }, [state.activeCity, state.cities, w, h])

  // Fallback spot centers when no map / onboarding
  useEffect(() => {
    if (!mapRef.current || !state.activeCity) {
      setSpotCenters(fallbackSpotCenters(w, h))
    }
  }, [w, h, state.activeCity])

  const inResults = state.mode === 'results'
  const hexMode = inResults ? state.activeColoring : null

  return (
    <>
      {/* Leaflet container */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[0] transition-opacity duration-[1000ms] delay-300"
        style={{ opacity: inResults ? 1 : 0, pointerEvents: inResults ? 'auto' : 'none' }}
      />

      {/* Hex grid SVG */}
      <HexGrid
        width={w}
        height={h}
        spotCenters={spotCenters}
        leafletMap={mapRef.current}
        mode={hexMode}
        similarHexesActive={state.similarHexesActive}
        lastClickedHex={state.lastClickedHex}
      />
    </>
  )
}
