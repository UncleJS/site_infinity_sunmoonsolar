/** Shared instrument components for Sun and Moon cards */

// ─── Compass Rose ────────────────────────────────────────────────────────────
interface CompassProps {
  azimuth: number
  color: string
}

export function CompassRose({ azimuth, color }: CompassProps) {
  const r  = 44
  const cx = 60
  const cy = 60
  const rad = ((azimuth - 90) * Math.PI) / 180
  const px = cx + r * Math.cos(rad)
  const py = cy + r * Math.sin(rad)

  // 24 ticks every 15° — 3 size tiers
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const deg  = i * 15
    const aRad = ((deg - 90) * Math.PI) / 180
    const isCardinal      = deg % 90 === 0          // 0 90 180 270
    const isIntercardinal = deg % 45 === 0 && !isCardinal // 45 135 225 315
    const len  = isCardinal ? 10 : isIntercardinal ? 7 : 4
    const sw   = isCardinal ? 1.5 : 1
    return { aRad, len, sw }
  })

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r + 4}
        fill="none" stroke="#f8fafc" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={r}
        fill="none" stroke="#f8fafc" strokeWidth="1" strokeOpacity="0.15" />
      {/* Cardinal labels */}
      {(['N', 'E', 'S', 'W'] as const).map((d, i) => {
        const a  = ((i * 90 - 90) * Math.PI) / 180
        const tx = cx + (r + 12) * Math.cos(a)
        const ty = cy + (r + 12) * Math.sin(a)
        return (
          <text key={d} x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
            fontSize="10" fontWeight="700" fill="#f8fafc">{d}</text>
        )
      })}
      {/* Tick marks */}
      {ticks.map(({ aRad, len, sw }, i) => (
        <line key={i}
          x1={cx + r * Math.cos(aRad)}       y1={cy + r * Math.sin(aRad)}
          x2={cx + (r - len) * Math.cos(aRad)} y2={cy + (r - len) * Math.sin(aRad)}
          stroke="#f8fafc" strokeWidth={sw} strokeOpacity="0.9"
        />
      ))}
      {/* Pointer line */}
      <line x1={cx} y1={cy} x2={px} y2={py}
        stroke={color} strokeWidth="1.5" opacity="0.85" />
      {/* Body dot — glow then solid */}
      <circle cx={px} cy={py} r="9"  fill={color} opacity="0.3" />
      <circle cx={px} cy={py} r="5"  fill={color} />
    </svg>
  )
}

// ─── Elevation Arc ────────────────────────────────────────────────────────────
interface ElevationProps {
  altitude: number
  color: string
}

/**
 * Side-view semicircle showing the body's angle above/below the horizon.
 * 0° = on the horizon (right side), 90° = zenith (top), negative = below horizon.
 */
export function ElevationArc({ altitude, color }: ElevationProps) {
  const cx = 70
  const cy = 78
  const r  = 55

  const clampedAlt = Math.max(-30, Math.min(90, altitude))
  const altRad = (clampedAlt * Math.PI) / 180
  const dotX = cx + r * Math.cos(altRad)
  const dotY = cy - r * Math.sin(altRad)

  const aboveHorizon = altitude >= 0
  const dotColor = aboveHorizon ? color : '#f87171'

  // Ticks at every 15° on the right quadrant (0–90°)
  const ticks = [0, 15, 30, 45, 60, 75, 90].map(a => {
    const aRad = (a * Math.PI) / 180
    const len  = a % 30 === 0 ? 8 : 4
    const sw   = a % 30 === 0 ? 1.5 : 1
    return {
      a,
      ox: cx + r * Math.cos(aRad),
      oy: cy - r * Math.sin(aRad),
      ix: cx + (r - len) * Math.cos(aRad),
      iy: cy - (r - len) * Math.sin(aRad),
      sw,
    }
  })

  // Labels at 0°, 30°, 60°, 90°
  const labels = [0, 30, 60, 90].map(a => {
    const aRad = (a * Math.PI) / 180
    return {
      a,
      lx: cx + (r + 12) * Math.cos(aRad),
      ly: cy - (r + 12) * Math.sin(aRad),
    }
  })

  // Below-horizon dashed arc: 0° → −30°
  const negRad = (-30 * Math.PI) / 180
  const negX = cx + r * Math.cos(negRad)
  const negY = cy - r * Math.sin(negRad)

  return (
    <svg width="145" height="113" viewBox="0 0 145 113">
      {/* Below-horizon dashed arc */}
      <path
        d={`M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${negX} ${negY}`}
        fill="none" stroke="#f8fafc" strokeWidth="1.2"
        strokeOpacity="0.3" strokeDasharray="3,3"
      />
      {/* Sky semicircle */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#f8fafc" strokeWidth="1.5" strokeOpacity="0.6"
      />
      {/* Ground line */}
      <line x1="4" y1={cy} x2="141" y2={cy}
        stroke="#f8fafc" strokeWidth="1.5" />
      {/* Tick marks */}
      {ticks.map(({ a, ox, oy, ix, iy, sw }) => (
        <line key={a} x1={ox} y1={oy} x2={ix} y2={iy}
          stroke="#f8fafc" strokeWidth={sw} strokeOpacity="0.9" />
      ))}
      {/* Angle labels */}
      {labels.map(({ a, lx, ly }) => (
        <text key={a} x={lx} y={ly}
          fontSize="8" fill="#f8fafc"
          textAnchor="middle" dominantBaseline="middle">
          {a}°
        </text>
      ))}
      {/* "Horizon" label */}
      <text x="6" y={cy - 5} fontSize="7" fill="#f8fafc" dominantBaseline="auto">
        Horizon
      </text>
      {/* Glow ring */}
      <circle cx={dotX} cy={dotY} r="9" fill={dotColor} opacity="0.3" />
      {/* Body dot */}
      <circle cx={dotX} cy={dotY} r="5" fill={dotColor} />
    </svg>
  )
}
