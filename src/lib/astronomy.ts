import {
  Body,
  Equator,
  Horizon,
  Illumination,
  MakeTime,
  MoonPhase,
  Observer,
  SearchHourAngle,
  SearchMoonPhase,
  SearchRiseSet,
} from 'astronomy-engine'
import { civilDayBounds, safeTimeZone } from './timezone'

export interface RiseSetRow {
  date: Date
  rise: Date | null
  set: Date | null
  midpoint: Date | null
}

export interface BodyPosition {
  azimuth: number
  altitude: number
}

export interface MoonPhaseEvent {
  date: Date
  name: string
}

function toObserver(lat: number, lng: number): Observer {
  return new Observer(lat, lng, 0)
}

function inWindow(event: Date, start: Date, end: Date): boolean {
  return event >= start && event < end
}

function searchLimitDays(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime()
  return Math.max(ms / 86_400_000, 1) + 0.15
}

function tryRise(body: Body, observer: Observer, start: Date, end: Date): Date | null {
  try {
    const r = SearchRiseSet(body, observer, +1, start, searchLimitDays(start, end))
    if (!r) return null
    if (!inWindow(r.date, start, end)) return null
    return r.date
  } catch {
    return null
  }
}

function trySet(body: Body, observer: Observer, start: Date, end: Date): Date | null {
  try {
    const s = SearchRiseSet(body, observer, -1, start, searchLimitDays(start, end))
    if (!s) return null
    if (!inWindow(s.date, start, end)) return null
    return s.date
  } catch {
    return null
  }
}

function tryTransit(body: Body, observer: Observer, start: Date, end: Date): Date | null {
  try {
    const startTime = MakeTime(start)
    const result = SearchHourAngle(body, observer, 0, startTime)
    if (!result) return null
    const t = result.time.date
    if (!inWindow(t, start, end)) return null
    return t
  } catch {
    return null
  }
}

function weekForBody(
  body: Body,
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

export function getSunWeek(
  lat: number,
  lng: number,
  timezone: string,
  when: Date = new Date(),
  days = 7,
): RiseSetRow[] {
  return weekForBody(Body.Sun, lat, lng, timezone, when, days)
}

export function getSunPosition(lat: number, lng: number, when?: Date): BodyPosition {
  const observer = toObserver(lat, lng)
  const t = when ? MakeTime(when) : MakeTime(new Date())
  const eq = Equator(Body.Sun, t, observer, true, true)
  const hor = Horizon(t, observer, eq.ra, eq.dec, 'normal')
  return { azimuth: hor.azimuth, altitude: hor.altitude }
}

export function getMoonWeek(
  lat: number,
  lng: number,
  timezone: string,
  when: Date = new Date(),
  days = 7,
): RiseSetRow[] {
  return weekForBody(Body.Moon, lat, lng, timezone, when, days)
}

export function getMoonPosition(lat: number, lng: number, when?: Date): BodyPosition {
  const observer = toObserver(lat, lng)
  const t = when ? MakeTime(when) : MakeTime(new Date())
  const eq = Equator(Body.Moon, t, observer, true, true)
  const hor = Horizon(t, observer, eq.ra, eq.dec, 'normal')
  return { azimuth: hor.azimuth, altitude: hor.altitude }
}

export function getFullMoons(months = 6, when: Date = new Date()): MoonPhaseEvent[] {
  const events: MoonPhaseEvent[] = []
  let search = new Date(when)
  const end = new Date(when)
  end.setMonth(end.getMonth() + months)

  while (search < end) {
    try {
      const phase = SearchMoonPhase(180, search, 40)
      if (!phase || phase.date >= end) break
      events.push({ date: phase.date, name: 'Full Moon' })
      search = new Date(phase.date.getTime() + 24 * 60 * 60 * 1000)
    } catch {
      break
    }
  }
  return events
}

export function getMoonIllumination(when?: Date): number {
  const t = when ? MakeTime(when) : MakeTime(new Date())
  const illum = Illumination(Body.Moon, t)
  return Math.round(illum.phase_fraction * 100)
}

export function getMoonPhaseName(when?: Date): string {
  const t = when ? MakeTime(when) : MakeTime(new Date())
  const moonPhase = MoonPhase(t)

  if (moonPhase < 22.5 || moonPhase >= 337.5) return 'New Moon'
  if (moonPhase < 67.5) return 'Waxing Crescent'
  if (moonPhase < 112.5) return 'First Quarter'
  if (moonPhase < 157.5) return 'Waxing Gibbous'
  if (moonPhase < 202.5) return 'Full Moon'
  if (moonPhase < 247.5) return 'Waning Gibbous'
  if (moonPhase < 292.5) return 'Last Quarter'
  return 'Waning Crescent'
}
