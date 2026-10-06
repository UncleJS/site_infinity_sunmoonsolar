import { describe, expect, it } from 'vitest'
import { civilDayBounds, civilDateKey, startOfZonedDay, isValidTimeZone } from './timezone'

describe('startOfZonedDay', () => {
  it('uses the location civil day, not UTC midnight', () => {
    // 04:00 UTC on 15 Jun 2026 is still 14 Jun evening in Los Angeles
    const instant = new Date('2026-06-15T04:00:00Z')
    const laStart = startOfZonedDay(instant, 'America/Los_Angeles')
    const londonStart = startOfZonedDay(instant, 'Europe/London')

    expect(civilDateKey(laStart, 'America/Los_Angeles')).toBe('2026-06-14')
    expect(civilDateKey(londonStart, 'Europe/London')).toBe('2026-06-15')
    expect(laStart.getTime()).not.toBe(londonStart.getTime())
  })

  it('offsetDays steps by civil date in that zone', () => {
    const instant = new Date('2026-06-15T04:00:00Z')
    const day0 = startOfZonedDay(instant, 'Pacific/Auckland', 0)
    const day1 = startOfZonedDay(instant, 'Pacific/Auckland', 1)
    expect(civilDateKey(day0, 'Pacific/Auckland')).toBe('2026-06-15')
    expect(civilDateKey(day1, 'Pacific/Auckland')).toBe('2026-06-16')
  })

  it('civil day length covers a UK spring-forward DST day', () => {
    // UK DST starts 2026-03-29 01:00 UTC
    const before = new Date('2026-03-29T00:30:00Z')
    const { start, end } = civilDayBounds(before, 'Europe/London')
    const hours = (end.getTime() - start.getTime()) / 3_600_000
    expect(hours).toBe(23)
  })

  it('civil day length covers a US fall-back DST day', () => {
    // US DST ends 2026-11-01
    const during = new Date('2026-11-01T12:00:00Z')
    const { start, end } = civilDayBounds(during, 'America/New_York')
    const hours = (end.getTime() - start.getTime()) / 3_600_000
    expect(hours).toBe(25)
  })

  it('rejects invalid IANA ids', () => {
    expect(isValidTimeZone('Europe/London')).toBe(true)
    expect(isValidTimeZone('Not/AZone')).toBe(false)
  })
})
