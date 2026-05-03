import { useState, useEffect } from 'react'
import { LocationPanel } from './components/LocationPanel'
import { SunCard } from './components/SunCard'
import { MoonCard } from './components/MoonCard'
import { SolarCard } from './components/SolarCard'
import type { Location } from './lib/favorites'

const DEFAULT_LOCATION: Location = {
  name: 'London, UK',
  lat: 51.5074,
  lng: -0.1278,
  timezone: 'Europe/London',
}

export default function App() {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION)
  const [now, setNow] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'sun' | 'moon' | 'solar'>('sun')

  // Tick clock every 30 seconds
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-title">
            <span className="header-icon">🌞🌕⚡</span>
            <h1>Sun Moon Solar</h1>
          </div>
          <div className="header-time">
            {now.toLocaleString('en-CA', {
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit', second: '2-digit',
              hour12: false,
            }).replace(',', '')}
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Location */}
        <LocationPanel location={location} onLocationChange={setLocation} />

        {/* Tab selector */}
        <div className="tab-bar">
          <button
            className={`tab-btn ${activeTab === 'sun' ? 'active' : ''}`}
            onClick={() => setActiveTab('sun')}
          >
            ☀️ Sun
          </button>
          <button
            className={`tab-btn ${activeTab === 'moon' ? 'active' : ''}`}
            onClick={() => setActiveTab('moon')}
          >
            🌕 Moon
          </button>
          <button
            className={`tab-btn ${activeTab === 'solar' ? 'active' : ''}`}
            onClick={() => setActiveTab('solar')}
          >
            ⚡ Solar
          </button>
        </div>

        {/* Tab content */}
        <div className="tab-content">
          {activeTab === 'sun' && <SunCard location={location} now={now} />}
          {activeTab === 'moon' && <MoonCard location={location} now={now} />}
          {activeTab === 'solar' && <SolarCard location={location} />}
        </div>
      </main>

      <footer className="app-footer">
        <span>Fully offline PWA · All calculations run on-device · No data sent anywhere</span>
        <span>
          © 2025 Sun Moon Solar ·{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-NC-SA 4.0
          </a>
        </span>
      </footer>
    </div>
  )
}
