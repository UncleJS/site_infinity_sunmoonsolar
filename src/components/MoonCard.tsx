import { useMemo } from 'react'
import {
  getMoonPosition,
  getMoonWeek,
  getFullMoons,
  getMoonIllumination,
  getMoonPhaseName,
} from '../lib/astronomy'
import { formatTime, formatDate, formatDayLabel, azimuthToCardinal, round } from '../lib/format'
import type { Location } from '../lib/favorites'
import { CompassRose, ElevationArc } from './Instruments'

interface Props {
  location: Location
  now: Date
}

export function MoonCard({ location, now }: Props) {
  const pos = useMemo(
    () => getMoonPosition(location.lat, location.lng, now),
    [location, now]
  )
  const illumination = useMemo(() => getMoonIllumination(now), [now])
  const phaseName = useMemo(() => getMoonPhaseName(now), [now])

  const week = useMemo(
    () => getMoonWeek(location.lat, location.lng, 7),
    [location]
  )

  const fullMoons = useMemo(() => getFullMoons(6), [])

  const aboveHorizon = pos.altitude > 0

  return (
    <div className="card">
      <h2 className="card-title">🌕 Moon</h2>

      {/* Current position data */}
      <div className="position-grid">
        <div className="position-item">
          <span className="pos-label">Azimuth</span>
          <span className="pos-value">{round(pos.azimuth)}°</span>
          <span className="pos-sub">{azimuthToCardinal(pos.azimuth)}</span>
        </div>
        <div className="position-item">
          <span className="pos-label">Elevation</span>
          <span className={`pos-value ${aboveHorizon ? 'above' : 'below'}`}>
            {round(pos.altitude)}°
          </span>
          <span className="pos-sub">{aboveHorizon ? 'Above horizon' : 'Below horizon'}</span>
        </div>
        <div className="position-item">
          <span className="pos-label">Phase</span>
          <span className="pos-value phase-name">{phaseName}</span>
          <span className="pos-sub">{illumination}% illuminated</span>
        </div>
      </div>

      {/* Instruments: compass + elevation arc side by side */}
      <div className="instruments-row">
        <div className="instrument-wrap">
          <CompassRose azimuth={pos.azimuth} color="#94a3b8" />
          <span className="instrument-caption">Direction</span>
        </div>
        <div className="instrument-wrap">
          <ElevationArc altitude={pos.altitude} color="#94a3b8" />
          <span className="instrument-caption">Elevation</span>
        </div>
      </div>

      {/* 7-day moonrise/set table */}
      <h3 className="section-title">Next 7 Days</h3>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Moonrise</th>
              <th>Midpoint</th>
              <th>Moonset</th>
            </tr>
          </thead>
          <tbody>
            {week.map((row, i) => (
              <tr key={i} className={i === 0 ? 'today-row' : ''}>
                <td>{formatDayLabel(row.date, location.timezone)}</td>
                <td className="sunrise">{row.rise ? formatTime(row.rise, location.timezone) : '—'}</td>
                <td className="midpoint">{row.midpoint ? formatTime(row.midpoint, location.timezone) : '—'}</td>
                <td className="sunset">{row.set ? formatTime(row.set, location.timezone) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full moons */}
      <h3 className="section-title">Full Moons — Next 6 Months</h3>
      <div className="full-moon-list">
        {fullMoons.map((fm, i) => (
          <div key={i} className="full-moon-item">
            <span className="full-moon-icon">🌕</span>
            <span className="full-moon-date">{formatDate(fm.date, location.timezone)}</span>
            <span className="full-moon-time">{formatTime(fm.date, location.timezone)}</span>
          </div>
        ))}
        {fullMoons.length === 0 && <p className="no-data">No data available.</p>}
      </div>
    </div>
  )
}
