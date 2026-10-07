import { useState, useEffect, type KeyboardEvent } from 'react'
import { LocationPanel } from './components/LocationPanel'
import { SunCard } from './components/SunCard'
import { MoonCard } from './components/MoonCard'
import { SolarCard } from './components/SolarCard'
import type { Location } from './lib/favorites'
import { loadLastLocation, saveLastLocation } from './lib/favorites'
import { formatClock } from './lib/format'

const DEFAULT_LOCATION: Location = {
  name: 'Centurion, South Africa',
  lat: -25.8603,
  lng: 28.1894,
  timezone: 'Africa/Johannesburg',
}

const TABS = [
  { id: 'sun' as const, label: 'Sun', icon: '☀️' },
  { id: 'moon' as const, label: 'Moon', icon: '🌕' },
  { id: 'solar' as const, label: 'Solar', icon: '⚡' },
]

export default function App() {
  const [location, setLocation] = useState<Location>(() => loadLastLocation() ?? DEFAULT_LOCATION)
  const [now, setNow] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'sun' | 'moon' | 'solar'>('sun')

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  function handleLocationChange(loc: Location) {
    setLocation(loc)
    saveLastLocation(loc)
  }

  function onTabKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const ids = TABS.map(t => t.id)
    const i = ids.indexOf(activeTab)
    let next: typeof activeTab | undefined
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      next = ids[(i + 1) % ids.length]
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      next = ids[(i - 1 + ids.length) % ids.length]
    } else if (e.key === 'Home') {
      e.preventDefault()
      next = ids[0]
    } else if (e.key === 'End') {
      e.preventDefault()
      next = ids[ids.length - 1]
    }
    if (next) {
      setActiveTab(next)
      requestAnimationFrame(() => document.getElementById(`tab-${next}`)?.focus())
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-title">
            <span className="header-icon" aria-hidden="true">🌞🌕⚡</span>
            <h1>Sun Moon Solar</h1>
          </div>
          <time className="header-time" dateTime={now.toISOString()}>
            {formatClock(now, location.timezone)}
          </time>
        </div>
      </header>

      <main className="app-main">
        <LocationPanel location={location} onLocationChange={handleLocationChange} />

        <div
          className="tab-bar"
          role="tablist"
          aria-label="Calculator views"
          onKeyDown={onTabKeyDown}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span aria-hidden="true">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'sun' && (
            <div role="tabpanel" id="panel-sun" aria-labelledby="tab-sun">
              <SunCard location={location} now={now} />
            </div>
          )}
          {activeTab === 'moon' && (
            <div role="tabpanel" id="panel-moon" aria-labelledby="tab-moon">
              <MoonCard location={location} now={now} />
            </div>
          )}
          {activeTab === 'solar' && (
            <div role="tabpanel" id="panel-solar" aria-labelledby="tab-solar">
              <SolarCard location={location} now={now} />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <span>
          © 2026 Sun Moon Solar ·{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-NC-SA 4.0
          </a>
          {' · '}
          <span className="build-stamp">{__GIT_SHA__} · {__BUILT_AT__}</span>
        </span>
      </footer>
    </div>
  )
}
