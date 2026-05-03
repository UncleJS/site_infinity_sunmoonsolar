export interface SolarRecommendation {
  /** Direction to face panel (cardinal) */
  direction: string
  /** Direction in degrees from North */
  directionDeg: number
  /** Summer tilt angle from horizontal (degrees) */
  summerAngle: number
  /** Winter tilt angle from horizontal (degrees) */
  winterAngle: number
  /** Year-round average tilt */
  averageAngle: number
  hemisphere: 'Northern' | 'Southern' | 'Equatorial'
}

/**
 * Calculate optimal solar panel orientation.
 *
 * Rules:
 *  - Northern hemisphere (lat > 5): face South (180°)
 *  - Southern hemisphere (lat < -5): face North (0°)
 *  - Equatorial zone (-5 to 5): face South if lat >= 0 else North
 *  - Summer tilt  = |lat| - 15, clamped 0–90
 *  - Winter tilt  = |lat| + 15, clamped 0–90
 *  - Average tilt = |lat|, clamped 0–90
 */
export function calcSolar(lat: number): SolarRecommendation {
  const absLat = Math.abs(lat)

  let direction: string
  let directionDeg: number
  let hemisphere: 'Northern' | 'Southern' | 'Equatorial'

  if (lat > 5) {
    direction = 'South'
    directionDeg = 180
    hemisphere = 'Northern'
  } else if (lat < -5) {
    direction = 'North'
    directionDeg = 0
    hemisphere = 'Southern'
  } else {
    direction = lat >= 0 ? 'South' : 'North'
    directionDeg = lat >= 0 ? 180 : 0
    hemisphere = 'Equatorial'
  }

  const summerAngle = Math.min(90, Math.max(0, Math.round(absLat - 15)))
  const winterAngle = Math.min(90, Math.max(0, Math.round(absLat + 15)))
  const averageAngle = Math.min(90, Math.max(0, Math.round(absLat)))

  return { direction, directionDeg, summerAngle, winterAngle, averageAngle, hemisphere }
}

export interface MonthlyTilt {
  month: string
  declination: number   // degrees, + = N of equator
  tilt: number          // optimal tilt from horizontal, degrees
}

/**
 * Compute optimal solar panel tilt for the 1st of each month.
 * Solar declination: δ = 23.45 × sin(2π/365 × (284 + N))
 * Optimal tilt: |lat − δ|, clamped 0–90°
 */
export function calcMonthlyTilts(lat: number): MonthlyTilt[] {
  // Day-of-year for 1st of each month (non-leap year)
  const firstDays = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
  const months    = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December']

  return firstDays.map((N, i) => {
    const decl = 23.45 * Math.sin((2 * Math.PI / 365) * (284 + N))
    const tilt = Math.min(90, Math.max(0, Math.round(Math.abs(lat - decl) * 10) / 10))
    return {
      month:       months[i],
      declination: Math.round(decl * 10) / 10,
      tilt,
    }
  })
}
