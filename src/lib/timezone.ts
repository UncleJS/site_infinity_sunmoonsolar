/** IANA timezone helpers: civil-day bounds without depending on the device TZ. */

export function isValidTimeZone(tz: string): boolean {
  if (!tz || typeof tz !== 'string') return false
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz }).format()
    return true
  } catch {
    return false
  }
}

export function safeTimeZone(tz: string): string {
  return isValidTimeZone(tz) ? tz : 'UTC'
}

export interface ZonedParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const tz = safeTimeZone(timeZone)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const get = (type: string) => {
    const v = parts.find(p => p.type === type)?.value
    return v ? Number(v) : 0
  }

  let hour = get('hour')
  if (hour === 24) hour = 0

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour,
    minute: get('minute'),
    second: get('second'),
  }
}

/** Offset of `timeZone` at `date`: zoned wall time as UTC millis minus actual UTC millis. */
export function offsetAt(date: Date, timeZone: string): number {
  const p = getZonedParts(date, timeZone)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return asUtc - date.getTime()
}

/**
 * Convert a civil date-time in `timeZone` to a UTC Date.
 * If the local time falls in a DST gap, returns the first valid instant on that civil day.
 */
export function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
): Date {
  const tz = safeTimeZone(timeZone)
  let guess = Date.UTC(year, month - 1, day, hour, minute, second)

  for (let i = 0; i < 4; i++) {
    const next = Date.UTC(year, month - 1, day, hour, minute, second) - offsetAt(new Date(guess), tz)
    if (next === guess) break
    guess = next
  }

  const p = getZonedParts(new Date(guess), tz)
  if (p.year === year && p.month === month && p.day === day && p.hour === hour) {
    return new Date(guess)
  }

  // DST spring-forward: 00:00 may not exist. Walk until we land on the civil day.
  const end = guess + 4 * 60 * 60 * 1000
  for (let t = guess - 2 * 60 * 60 * 1000; t <= end; t += 60 * 1000) {
    const q = getZonedParts(new Date(t), tz)
    if (q.year === year && q.month === month && q.day === day) {
      return new Date(t)
    }
  }

  return new Date(guess)
}

/** Start of the civil day that contains `base` in `timeZone`, plus `offsetDays`. */
export function startOfZonedDay(base: Date, timeZone: string, offsetDays = 0): Date {
  const tz = safeTimeZone(timeZone)
  const p = getZonedParts(base, tz)
  const shifted = new Date(Date.UTC(p.year, p.month - 1, p.day + offsetDays))
  return zonedDateTimeToUtc(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth() + 1,
    shifted.getUTCDate(),
    0, 0, 0,
    tz,
  )
}

export function civilDayBounds(base: Date, timeZone: string, offsetDays = 0): { start: Date; end: Date } {
  return {
    start: startOfZonedDay(base, timeZone, offsetDays),
    end: startOfZonedDay(base, timeZone, offsetDays + 1),
  }
}

export function civilDateKey(date: Date, timeZone: string): string {
  const p = getZonedParts(date, timeZone)
  const mm = String(p.month).padStart(2, '0')
  const dd = String(p.day).padStart(2, '0')
  return `${p.year}-${mm}-${dd}`
}
