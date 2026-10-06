export interface SolarRecommendation {
  /** Direction to face panel (cardinal) */
  direction: string
  /** Direction in degrees from North */
  directionDeg: number
  /** True when solar noon is on the equatorward side of zenith */
  facesEquator: boolean
  /** Summer tilt angle from horizontal (degrees) */
  summerAngle: number
  /** Winter tilt angle from horizontal (degrees) */
  winterAngle: number
  /** Year-round average tilt */
  averageAngle: number
  hemisphere: 'Northern' | 'Southern' | 'Equatorial'
}

/** Cooper 1969: δ = 23.45 × sin(2π/365 × (284 + N)). Rule of thumb, ~1° vs VSOP. */
export function cooperDeclination(dayOfYear: number): number {
  return 23.45 * Math.sin((2 * Math.PI / 365) * (284 + dayOfYear))
}

/**
 * Noon-sun azimuth for a fixed-tilt panel: face the sun at solar noon.
 * If lat > δ the sun transits south of zenith → face south; if lat < δ, face north.
 */
export function noonFacing(lat: number, decl: number): { direction: string; directionDeg: number } {
  const delta = lat - decl
  if (delta > 0.05) return { direction: 'South', directionDeg: 180 }
  if (delta < -0.05) return { direction: 'North', directionDeg: 0 }
  return lat >= 0
    ? { direction: 'South', directionDeg: 180 }
    : { direction: 'North', directionDeg: 0 }
}

function equatorFacing(lat: number): { direction: string; directionDeg: number } {
  if (lat < 0) return { direction: 'North', directionDeg: 0 }
  return { direction: 'South', directionDeg: 180 }
}

/** Day-of-year on the 1st of each month in a non-leap year (Cooper 365-day year). */
const MONTH_FIRST_DAYS = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function dayOfYearFromYmd(year: number, month: number, day: number): number {
  const start = Date.UTC(year, 0, 1)
  const at = Date.UTC(year, month - 1, day)
  return Math.floor((at - start) / 86_400_000) + 1
}

/**
 * Seasonal tilt rules of thumb, plus current-day facing from noon declination.
 * In the tropics (|lat| < |δ|) facing is poleward, not towards the equator.
 */
export function calcSolar(lat: number, dayOfYear = 80): SolarRecommendation {
  const absLat = Math.abs(lat)

  let hemisphere: 'Northern' | 'Southern' | 'Equatorial'
  if (lat > 5) hemisphere = 'Northern'
  else if (lat < -5) hemisphere = 'Southern'
  else hemisphere = 'Equatorial'

  const decl = cooperDeclination(dayOfYear)
  const current = noonFacing(lat, decl)
  const equator = equatorFacing(lat)
  const facesEquator = current.directionDeg === equator.directionDeg

  const summerAngle = Math.min(90, Math.max(0, Math.round(absLat - 15)))
  const winterAngle = Math.min(90, Math.max(0, Math.round(absLat + 15)))
  const averageAngle = Math.min(90, Math.max(0, Math.round(absLat)))

  return {
    direction: current.direction,
    directionDeg: current.directionDeg,
    facesEquator,
    summerAngle,
    winterAngle,
    averageAngle,
    hemisphere,
  }
}

export interface MonthlyTilt {
  month: string
  declination: number
  tilt: number
  direction: string
  directionDeg: number
}

/**
 * Optimal noon tilt for the 1st of each month: |lat − δ|, clamped 0–90°.
 * Facing follows sign(lat − δ).
 */
export function calcMonthlyTilts(lat: number): MonthlyTilt[] {
  return MONTH_FIRST_DAYS.map((N, i) => {
    const decl = cooperDeclination(N)
    const tilt = Math.min(90, Math.max(0, Math.round(Math.abs(lat - decl) * 10) / 10))
    const facing = noonFacing(lat, decl)
    return {
      month: MONTH_NAMES[i],
      declination: Math.round(decl * 10) / 10,
      tilt,
      direction: facing.direction,
      directionDeg: facing.directionDeg,
    }
  })
}
