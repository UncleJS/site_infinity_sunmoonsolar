import { useMemo } from 'react'
import { getSunPosition, getSunWeek } from '../lib/astronomy'
import { formatTime, formatDayLabel, azimuthToCardinal, round } from '../lib/format'
import type { Location } from '../lib/favorites'
import { CompassRose, ElevationArc } from './Instruments'

interface Props {
  location: Location
  now: Date
}

export function SunCard({ location, now }: Props) {
  const pos = useMemo(
    () => getSunPosition(location.lat, location.lng, now),
    [location, now]
  )

  const week = useMemo(
    () => getSunWeek(location.lat, location.lng, 7),
    [location]
  )

  const aboveHorizon = pos.altitude > 0

  return (
    <div className="card">
      <h2 className="card-title">☀️ Sun</h2>

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
      </div>

      {/* Instruments: compass + elevation arc side by side */}
      <div className="instruments-row">
        <div className="instrument-wrap">
          <CompassRose azimuth={pos.azimuth} color="#f59e0b" />
          <span className="instrument-caption">Direction</span>
        </div>
        <div className="instrument-wrap">
          <ElevationArc altitude={pos.altitude} color="#f59e0b" />
          <span className="instrument-caption">Elevation</span>
        </div>
      </div>

      {/* 7-day table */}
      <h3 className="section-title">Next 7 Days</h3>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sunrise</th>
              <th>Midpoint</th>
              <th>Sunset</th>
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
    </div>
  )
}
