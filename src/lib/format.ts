/** Format a Date to local time string: YYYY-MM-DD HH:mm:ss */
export function formatDateTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(',', '')
    .replace(/\//g, '-')
}

/** Format only the time portion HH:mm */
export function formatTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

/** Format date portion YYYY-MM-DD */
export function formatDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** Format a day-of-week + date label */
export function formatDayLabel(date: Date, timezone: string): string {
  const dow = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    weekday: 'short',
  }).format(date)
  const d = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
  }).format(date)
  return `${dow} ${d}`
}

/** Convert degrees to cardinal direction string */
export function azimuthToCardinal(az: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const idx = Math.round(((az % 360) + 360) % 360 / 22.5) % 16
  return dirs[idx]
}

/** Round number to given decimal places */
export function round(n: number, dp = 1): number {
  const m = Math.pow(10, dp)
  return Math.round(n * m) / m
}

/** Midpoint between two Date objects */
export function midpoint(a: Date, b: Date): Date {
  return new Date((a.getTime() + b.getTime()) / 2)
}
