import { useMemo } from 'react'
import { calcSolar, calcMonthlyTilts } from '../lib/solar'
import type { Location } from '../lib/favorites'

interface Props {
  location: Location
}

export function SolarCard({ location }: Props) {
  const rec          = useMemo(() => calcSolar(location.lat), [location.lat])
  const monthlyTilts = useMemo(() => calcMonthlyTilts(location.lat), [location.lat])
  const currentMonth = new Date().getMonth() // 0-indexed

  return (
    <div className="card">
      <h2 className="card-title">⚡ Solar Panel</h2>
      <p className="solar-intro">
        Optimal orientation for <strong>{location.name}</strong>
        &nbsp;({rec.hemisphere} Hemisphere)
      </p>

      <div className="solar-grid">
        {/* Direction */}
        <div className="solar-item highlight">
          <span className="solar-label">Face Direction</span>
          <span className="solar-value">{rec.direction}</span>
          <span className="solar-sub">{rec.directionDeg}° from North</span>
        </div>

        {/* Summer */}
        <div className="solar-item summer">
          <span className="solar-label">☀️ Summer Tilt</span>
          <span className="solar-value">{rec.summerAngle}°</span>
          <span className="solar-sub">from horizontal</span>
        </div>

        {/* Annual average */}
        <div className="solar-item average">
          <span className="solar-label">📅 Year-Round Tilt</span>
          <span className="solar-value">{rec.averageAngle}°</span>
          <span className="solar-sub">from horizontal</span>
        </div>

        {/* Winter */}
        <div className="solar-item winter">
          <span className="solar-label">❄️ Winter Tilt</span>
          <span className="solar-value">{rec.winterAngle}°</span>
          <span className="solar-sub">from horizontal</span>
        </div>
      </div>

      {/* Visual angle diagram */}
      <AngleDiagram summerAngle={rec.summerAngle} winterAngle={rec.winterAngle} averageAngle={rec.averageAngle} />

      <div className="solar-notes">
        <p>
          <strong>Direction:</strong> Face your panel {rec.direction} — towards the equator.
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
              <th>Optimal Tilt</th>
            </tr>
          </thead>
          <tbody>
            {monthlyTilts.map((row, i) => (
              <tr key={row.month} className={i === currentMonth ? 'today-row' : ''}>
                <td>{row.month}</td>
                <td>{row.declination > 0 ? '+' : ''}{row.declination}°</td>
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
  // Dimensions chosen so lines stay in-viewport for all latitudes (up to ~75° winter tilt)
  const w        = 300
  const h        = 150
  const originX  = 20
  const originY  = 130   // ground line y — pushed down to give headroom above
  const len      = 110   // shorter arms so steep angles don't escape the viewport

  /**
   * Draw a line from the origin at `angleDeg` FROM HORIZONTAL.
   * 0° = flat along ground, 90° = pointing straight up.
   * rad = angleDeg directly (NOT 90-angleDeg which was the previous bug).
   */
  function polarLine(angleDeg: number, color: string, label: string, dasharray?: string) {
    const rad = (angleDeg * Math.PI) / 180          // angle from horizontal
    const ex  = originX + len * Math.cos(rad)
    const ey  = originY - len * Math.sin(rad)       // SVG y goes down, so subtract
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

  // Arc connecting the winter and summer lines at a fixed radius from origin.
  // Both angles now measured correctly from horizontal.
  const arcR    = 38
  const arcStart = (winterAngle  * Math.PI) / 180
  const arcEnd   = (summerAngle  * Math.PI) / 180
  const ax1 = originX + arcR * Math.cos(arcStart)
  const ay1 = originY - arcR * Math.sin(arcStart)
  const ax2 = originX + arcR * Math.cos(arcEnd)
  const ay2 = originY - arcR * Math.sin(arcEnd)
  const largeArc = Math.abs(winterAngle - summerAngle) > 180 ? 1 : 0

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="angle-diagram">
      {/* Ground / horizon line */}
      <line x1={originX - 4} y1={originY} x2={w - 10} y2={originY}
        stroke="#334155" strokeWidth="1.5" />
      {/* "Horizontal" label at ground line */}
      <text x={w - 12} y={originY - 4} fontSize="8" fill="#475569"
        textAnchor="end" dominantBaseline="auto">horizontal</text>
      {/* Arc sweep between winter and summer */}
      <path
        d={`M ${ax1} ${ay1} A ${arcR} ${arcR} 0 ${largeArc} 1 ${ax2} ${ay2}`}
        fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3,2"
      />
      {polarLine(winterAngle, '#93c5fd', `${winterAngle}° W`, '6,3')}
      {polarLine(averageAngle, '#86efac', `${averageAngle}° Avg`)}
      {polarLine(summerAngle, '#fcd34d', `${summerAngle}° S`)}
    </svg>
  )
}
