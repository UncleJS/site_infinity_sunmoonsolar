import * as Astronomy from 'astronomy-engine'
import { civilDayBounds, safeTimeZone } from './timezone'

export interface RiseSetRow {
  date: Date
  rise: Date | null
  set: Date | null
  midpoint: Date | null
}

export interface BodyPosition {
  azimuth: number     // degrees from North, clockwise
  altitude: number    // degrees above horizon (elevation)
}

export interface MoonPhaseEvent {
  date: Date
  name: string
}

function toObserver(lat: number, lng: number): Astronomy.Observer {
  return new Astronomy.Observer(lat, lng, 0)
}

function inWindow(event: Date, start: Date, end: Date): boolean {
  return event >= start && event < end
}

function searchLimitDays(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime()
  // Cover 23h–25h civil days plus a small rounding margin.
  return Math.max(ms / 86_400_000, 1) + 0.15
}

function tryRise(
  body: Astronomy.Body,
  observer: Astronomy.Observer,
  start: Date,
  end: Date,
): Date | null {
  try {
    const r = Astronomy.SearchRiseSet(body, observer, +1, start, searchLimitDays(start, end))
    if (!r) return null
    if (!inWindow(r.date, start, end)) return null
    return r.date
  } catch {
    return null
  }
}

function trySet(
  body: Astronomy.Body,
  observer: Astronomy.Observer,
  start: Date,
  end: Date,
): Date | null {
  try {
    const s = Astronomy.SearchRiseSet(body, observer, -1, start, searchLimitDays(start, end))
    if (!s) return null
    if (!inWindow(s.date, start, end)) return null
    return s.date
  } catch {
    return null
  }
}

function tryTransit(
  body: Astronomy.Body,
  observer: Astronomy.Observer,
  start: Date,
  end: Date,
): Date | null {
  try {
    const startTime = Astronomy.MakeTime(start)
    const result = Astronomy.SearchHourAngle(body, observer, 0, startTime)
    if (!result) return null
    const t = result.time.date
    if (!inWindow(t, start, end)) return null
    return t
  } catch {
    return null
  }
}

function weekForBody(
  body: Astronomy.Body,
  lat: number,
  lng: number,
  timezone: string,
  when: Date,
  days: number,
): RiseSetRow[] {
  const observer = toObserver(lat, lng)
  const tz = safeTimeZone(timezone)
  const rows: RiseSetRow[] = []

  for (let i = 0; i < days; i++) {
    const { start, end } = civilDayBounds(when, tz, i)
    rows.push({
      date: start,
      rise: tryRise(body, observer, start, end),
      set: trySet(body, observer, start, end),
      midpoint: tryTransit(body, observer, start, end),
    })
  }
  return rows
}

/**
 * Sunrise / sunset / meridian transit for the next `days` civil days
 * in `timezone` (not the device clock).
 */
export function getSunWeek(
  lat: number,
  lng: number,
  timezone: string,
  when: Date = new Date(),
  days = 7,
): RiseSetRow[] {
  return weekForBody(Astronomy.Body.Sun, lat, lng, timezone, when, days)
}

/** Current sun azimuth and altitude */
export function getSunPosition(lat: number, lng: number, when?: Date): BodyPosition {
  const observer = toObserver(lat, lng)
  const t = when ? Astronomy.MakeTime(when) : Astronomy.MakeTime(new Date())
  const eq = Astronomy.Equator(Astronomy.Body.Sun, t, observer, true, true)
  const hor = Astronomy.Horizon(t, observer, eq.ra, eq.dec, 'normal')
  return { azimuth: hor.azimuth, altitude: hor.altitude }
}

/** Moonrise / moonset / transit for the next `days` civil days in `timezone`. */
export function getMoonWeek(
  lat: number,
  lng: number,
  timezone: string,
  when: Date = new Date(),
  days = 7,
): RiseSetRow[] {
  return weekForBody(Astronomy.Body.Moon, lat, lng, timezone, when, days)
}

/** Current moon azimuth and altitude */
export function getMoonPosition(lat: number, lng: number, when?: Date): BodyPosition {
  const observer = toObserver(lat, lng)
  const t = when ? Astronomy.MakeTime(when) : Astronomy.MakeTime(new Date())
  const eq = Astronomy.Equator(Astronomy.Body.Moon, t, observer, true, true)
  const hor = Astronomy.Horizon(t, observer, eq.ra, eq.dec, 'normal')
  return { azimuth: hor.azimuth, altitude: hor.altitude }
}

/** Full-moon dates for the next `months` months from `when`. */
export function getFullMoons(months = 6, when: Date = new Date()): MoonPhaseEvent[] {
  const events: MoonPhaseEvent[] = []
  let search = new Date(when)
  const end = new Date(when)
  end.setMonth(end.getMonth() + months)

  while (search < end) {
    try {
      const phase = Astronomy.SearchMoonPhase(180, search, 40)
      if (!phase || phase.date >= end) break
      events.push({ date: phase.date, name: 'Full Moon' })
      search = new Date(phase.date.getTime() + 24 * 60 * 60 * 1000)
    } catch {
      break
    }
  }
  return events
}

/** Moon illumination percentage */
export function getMoonIllumination(when?: Date): number {
  const t = when ? Astronomy.MakeTime(when) : Astronomy.MakeTime(new Date())
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, t)
  return Math.round(illum.phase_fraction * 100)
}

/**
 * Moon phase name from ecliptic longitude, binned into eight ~45° sectors
 * centred on the named phases (New 0°, First Quarter 90°, Full 180°, Last Quarter 270°).
 */
export function getMoonPhaseName(when?: Date): string {
  const t = when ? Astronomy.MakeTime(when) : Astronomy.MakeTime(new Date())
  const moonPhase = Astronomy.MoonPhase(t)

  if (moonPhase < 22.5 || moonPhase >= 337.5) return 'New Moon'
  if (moonPhase < 67.5) return 'Waxing Crescent'
  if (moonPhase < 112.5) return 'First Quarter'
  if (moonPhase < 157.5) return 'Waxing Gibbous'
  if (moonPhase < 202.5) return 'Full Moon'
  if (moonPhase < 247.5) return 'Waning Gibbous'
  if (moonPhase < 292.5) return 'Last Quarter'
  return 'Waning Crescent'
}
