import { useMemo } from 'react'
import { calcSolar, calcMonthlyTilts, dayOfYearFromYmd } from '../lib/solar'
import type { Location } from '../lib/favorites'
import { getZonedParts } from '../lib/timezone'

interface Props {
  location: Location
  now: Date
}

export function SolarCard({ location, now }: Props) {
  const parts = getZonedParts(now, location.timezone)
  const doy = dayOfYearFromYmd(parts.year, parts.month, parts.day)
  const rec = useMemo(() => calcSolar(location.lat, doy), [location.lat, doy])
  const monthlyTilts = useMemo(() => calcMonthlyTilts(location.lat), [location.lat])
  const currentMonth = parts.month - 1

  return (
    <div className="card">
      <h2 className="card-title"><span aria-hidden="true">⚡</span> Solar Panel</h2>
      <p className="solar-intro">
        Optimal orientation for <strong>{location.name}</strong>
        &nbsp;({rec.hemisphere} Hemisphere)
      </p>

      <div className="solar-grid">
        <div className="solar-item highlight">
          <span className="solar-label">Face Direction</span>
          <span className="solar-value">{rec.direction}</span>
          <span className="solar-sub">{rec.directionDeg}° from North (today)</span>
        </div>

        <div className="solar-item summer">
          <span className="solar-label">☀️ Summer Tilt</span>
          <span className="solar-value">{rec.summerAngle}°</span>
          <span className="solar-sub">from horizontal</span>
        </div>

        <div className="solar-item average">
          <span className="solar-label">📅 Year-Round Tilt</span>
          <span className="solar-value">{rec.averageAngle}°</span>
          <span className="solar-sub">from horizontal</span>
        </div>

        <div className="solar-item winter">
          <span className="solar-label">❄️ Winter Tilt</span>
          <span className="solar-value">{rec.winterAngle}°</span>
          <span className="solar-sub">from horizontal</span>
        </div>
      </div>

      <AngleDiagram summerAngle={rec.summerAngle} winterAngle={rec.winterAngle} averageAngle={rec.averageAngle} />

      <div className="solar-notes">
        <p>
          <strong>Direction:</strong> Face your panel {rec.direction}
          {rec.facesEquator
            ? ' — towards the equator.'
            : ' — towards the noon sun (poleward of the equator while the sun is overhead on the other side).'}
        </p>
        <p>
          <strong>Summer:</strong> Lower angle ({rec.summerAngle}°) — sun is high in the sky.
        </p>
        <p>
          <strong>Winter:</strong> Higher angle ({rec.winterAngle}°) — sun is low on the horizon.
        </p>
        <p>
          <strong>Tip:</strong> If you can only set one fixed angle, use {rec.averageAngle}° year-round.
        </p>
      </div>

      <h3 className="section-title">Monthly Optimal Tilt — 1st of Each Month</h3>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Declination</th>
              <th>Face</th>
              <th>Optimal Tilt</th>
            </tr>
          </thead>
          <tbody>
            {monthlyTilts.map((row, i) => (
              <tr key={row.month} className={i === currentMonth ? 'today-row' : ''}>
                <td>{row.month}</td>
                <td>{row.declination > 0 ? '+' : ''}{row.declination}°</td>
                <td>{row.direction}</td>
                <td className="solar-tilt-cell">{row.tilt}°</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AngleDiagram({
  summerAngle,
  winterAngle,
  averageAngle,
}: {
  summerAngle: number
  winterAngle: number
  averageAngle: number
}) {
  const w        = 300
  const h        = 150
  const originX  = 20
  const originY  = 130
  const len      = 110

  function polarLine(angleDeg: number, color: string, label: string, dasharray?: string) {
    const rad = (angleDeg * Math.PI) / 180
    const ex  = originX + len * Math.cos(rad)
    const ey  = originY - len * Math.sin(rad)
    const lx  = originX + (len + 18) * Math.cos(rad)
    const ly  = originY - (len + 18) * Math.sin(rad)
    return (
      <g key={label}>
        <line
          x1={originX} y1={originY} x2={ex} y2={ey}
          stroke={color} strokeWidth="2.5"
          strokeDasharray={dasharray ?? 'none'}
          strokeLinecap="round"
        />
        <text x={lx} y={ly} fontSize="9" fill={color} textAnchor="middle" dominantBaseline="middle">
          {label}
        </text>
      </g>
    )
  }

  const arcR    = 38
  const arcStart = (winterAngle  * Math.PI) / 180
  const arcEnd   = (summerAngle  * Math.PI) / 180
  const ax1 = originX + arcR * Math.cos(arcStart)
  const ay1 = originY - arcR * Math.sin(arcStart)
  const ax2 = originX + arcR * Math.cos(arcEnd)
  const ay2 = originY - arcR * Math.sin(arcEnd)
  const largeArc = Math.abs(winterAngle - summerAngle) > 180 ? 1 : 0

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="angle-diagram"
      role="img"
      aria-label={`Panel tilt diagram: summer ${summerAngle} degrees, year-round ${averageAngle} degrees, winter ${winterAngle} degrees from horizontal`}
    >
      <line x1={originX - 4} y1={originY} x2={w - 10} y2={originY}
        stroke="#334155" strokeWidth="1.5" />
      <text x={w - 12} y={originY - 4} fontSize="8" fill="#94a3b8"
        textAnchor="end" dominantBaseline="auto">horizontal</text>
      <path
        d={`M ${ax1} ${ay1} A ${arcR} ${arcR} 0 ${largeArc} 1 ${ax2} ${ay2}`}
        fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2"
      />
      {polarLine(winterAngle, '#93c5fd', `${winterAngle}° W`, '6,3')}
      {polarLine(averageAngle, '#86efac', `${averageAngle}° Avg`)}
      {polarLine(summerAngle, '#fcd34d', `${summerAngle}° S`)}
    </svg>
  )
}
