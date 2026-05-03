import * as Astronomy from 'astronomy-engine'
import { midpoint } from './format'

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

// ─── helpers ────────────────────────────────────────────────────────────────

function toObserver(lat: number, lng: number): Astronomy.Observer {
  return new Astronomy.Observer(lat, lng, 0)
}

function startOfDay(base: Date, offsetDays: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + offsetDays)
  d.setHours(0, 0, 0, 0)
  return d
}

function tryRise(
  body: Astronomy.Body,
  observer: Astronomy.Observer,
  date: Date
): Date | null {
  try {
    const r = Astronomy.SearchRiseSet(body, observer, +1, date, 1)
    if (!r) return null
    // Ensure the event is within the same calendar day (UTC)
    const next = new Date(date)
    next.setDate(next.getDate() + 1)
    if (r.date < date || r.date >= next) return null
    return r.date
  } catch {
    return null
  }
}

function trySet(
  body: Astronomy.Body,
  observer: Astronomy.Observer,
  date: Date
): Date | null {
  try {
    const s = Astronomy.SearchRiseSet(body, observer, -1, date, 1)
    if (!s) return null
    const next = new Date(date)
    next.setDate(next.getDate() + 1)
    if (s.date < date || s.date >= next) return null
    return s.date
  } catch {
    return null
  }
}

// ─── Sun ────────────────────────────────────────────────────────────────────

/**
 * Sunrise / sunset / midpoint for the next `days` calendar days (UTC-based).
 */
export function getSunWeek(lat: number, lng: number, days = 7): RiseSetRow[] {
  const observer = toObserver(lat, lng)
  const rows: RiseSetRow[] = []
  const now = new Date()

  for (let i = 0; i < days; i++) {
    const date = startOfDay(now, i)
    const rise = tryRise(Astronomy.Body.Sun, observer, date)
    const set = trySet(Astronomy.Body.Sun, observer, date)
    const mid = rise && set ? midpoint(rise, set) : null
    rows.push({ date, rise, set, midpoint: mid })
  }
  return rows
}

/** Current sun azimuth and altitude */
export function getSunPosition(lat: number, lng: number, when?: Date): BodyPosition {
  const observer = toObserver(lat, lng)
  const t = when ? Astronomy.MakeTime(when) : Astronomy.MakeTime(new Date())
  const eq = Astronomy.Equator(Astronomy.Body.Sun, t, observer, true, true)
  const hor = Astronomy.Horizon(t, observer, eq.ra, eq.dec, 'normal')
  return { azimuth: hor.azimuth, altitude: hor.altitude }
}

// ─── Moon ───────────────────────────────────────────────────────────────────

/** Moonrise / moonset / midpoint for the next `days` calendar days */
export function getMoonWeek(lat: number, lng: number, days = 7): RiseSetRow[] {
  const observer = toObserver(lat, lng)
  const rows: RiseSetRow[] = []
  const now = new Date()

  for (let i = 0; i < days; i++) {
    const date = startOfDay(now, i)
    const rise = tryRise(Astronomy.Body.Moon, observer, date)
    const set = trySet(Astronomy.Body.Moon, observer, date)
    const mid = rise && set ? midpoint(rise, set) : null
    rows.push({ date, rise, set, midpoint: mid })
  }
  return rows
}

/** Current moon azimuth and altitude */
export function getMoonPosition(lat: number, lng: number, when?: Date): BodyPosition {
  const observer = toObserver(lat, lng)
  const t = when ? Astronomy.MakeTime(when) : Astronomy.MakeTime(new Date())
  const eq = Astronomy.Equator(Astronomy.Body.Moon, t, observer, true, true)
  const hor = Astronomy.Horizon(t, observer, eq.ra, eq.dec, 'normal')
  return { azimuth: hor.azimuth, altitude: hor.altitude }
}

/** Full-moon dates for the next `months` months */
export function getFullMoons(months = 6): MoonPhaseEvent[] {
  const events: MoonPhaseEvent[] = []
  let search = new Date()
  const end = new Date()
  end.setMonth(end.getMonth() + months)

  while (search < end) {
    try {
      const phase = Astronomy.SearchMoonPhase(180, search, 40)
      if (!phase || phase.date >= end) break
      events.push({ date: phase.date, name: 'Full Moon' })
      // Advance past this event to find the next
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

/** Moon phase name from angle */
export function getMoonPhaseName(when?: Date): string {
  const t = when ? Astronomy.MakeTime(when) : Astronomy.MakeTime(new Date())
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, t)
  const angle = illum.phase_angle
  // phase_angle: 0=full, 180=new, decreasing=waxing, increasing=waning
  // Use MoonPhase to get ecliptic longitude angle (0–360)
  const moonPhase = Astronomy.MoonPhase(t) // 0=New, 90=FQ, 180=Full, 270=LQ

  if (moonPhase < 22.5 || moonPhase >= 337.5) return 'New Moon'
  if (moonPhase < 67.5) return 'Waxing Crescent'
  if (moonPhase < 112.5) return 'First Quarter'
  if (moonPhase < 157.5) return 'Waxing Gibbous'
  if (moonPhase < 202.5) return 'Full Moon'
  if (moonPhase < 247.5) return 'Waning Gibbous'
  if (moonPhase < 292.5) return 'Last Quarter'
  return 'Waning Crescent'
}
