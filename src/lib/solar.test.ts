import { describe, expect, it } from 'vitest'
import { calcMonthlyTilts, calcSolar, cooperDeclination, noonFacing } from './solar'

describe('noonFacing', () => {
  it('faces south when latitude is north of the sun', () => {
    expect(noonFacing(51.5, 0).direction).toBe('South')
    expect(noonFacing(51.5, 23.45).direction).toBe('South')
  })

  it('faces north in Singapore in June when the sun is north of zenith', () => {
    const june = cooperDeclination(152) // 1 June
    expect(june).toBeGreaterThan(20)
    expect(noonFacing(1.35, june).direction).toBe('North')
  })

  it('faces south in Singapore in December', () => {
    const dec = cooperDeclination(335) // 1 December
    expect(dec).toBeLessThan(-20)
    expect(noonFacing(1.35, dec).direction).toBe('South')
  })
})

describe('calcSolar', () => {
  it('keeps seasonal tilts as |lat| ± 15', () => {
    const rec = calcSolar(51.5, 172)
    expect(rec.summerAngle).toBe(37)
    expect(rec.averageAngle).toBe(52)
    expect(rec.winterAngle).toBe(67)
    expect(rec.direction).toBe('South')
    expect(rec.facesEquator).toBe(true)
  })

  it('does not always face the equator in the tropics', () => {
    const june = calcSolar(1.35, 152)
    expect(june.direction).toBe('North')
    expect(june.facesEquator).toBe(false)
  })
})

describe('calcMonthlyTilts', () => {
  it('keeps tilt as |lat − δ| and varies facing near the equator', () => {
    const rows = calcMonthlyTilts(1.35)
    expect(rows).toHaveLength(12)
    const june = rows[5]
    expect(june.month).toBe('June')
    expect(june.direction).toBe('North')
    expect(june.tilt).toBe(Math.round(Math.abs(1.35 - june.declination) * 10) / 10)
    const december = rows[11]
    expect(december.direction).toBe('South')
  })
})
