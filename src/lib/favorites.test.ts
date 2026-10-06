import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  isValidLocation,
  loadFavorites,
  saveFavorite,
  removeFavorite,
  loadLastLocation,
  saveLastLocation,
  type Location,
} from './favorites'

function stubStorage() {
  const mem: Record<string, string> = {}
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => (k in mem ? mem[k] : null),
    setItem: (k: string, v: string) => { mem[k] = v },
    removeItem: (k: string) => { delete mem[k] },
    clear: () => { for (const key of Object.keys(mem)) delete mem[key] },
    get length() { return Object.keys(mem).length },
    key: (i: number) => Object.keys(mem)[i] ?? null,
  })
  return mem
}

const london: Location = {
  name: 'London, UK',
  lat: 51.5074,
  lng: -0.1278,
  timezone: 'Europe/London',
}

describe('isValidLocation', () => {
  it('accepts a complete location', () => {
    expect(isValidLocation(london)).toBe(true)
  })

  it('rejects missing timezone, out-of-range coords, and non-objects', () => {
    expect(isValidLocation({ ...london, timezone: 'Nope' })).toBe(false)
    expect(isValidLocation({ ...london, lat: 99 })).toBe(false)
    expect(isValidLocation(null)).toBe(false)
    expect(isValidLocation([])).toBe(false)
  })
})

describe('favorites persistence', () => {
  beforeEach(() => {
    stubStorage()
  })

  it('round-trips a favourite', () => {
    expect(loadFavorites()).toEqual([])
    saveFavorite(london)
    expect(loadFavorites()).toEqual([london])
  })

  it('ignores corrupt JSON and non-arrays', () => {
    localStorage.setItem('sunmoonsolar_favorites', '{not json')
    expect(loadFavorites()).toEqual([])
    localStorage.setItem('sunmoonsolar_favorites', '{"lat":1}')
    expect(loadFavorites()).toEqual([])
  })

  it('drops entries with invalid coordinates', () => {
    localStorage.setItem('sunmoonsolar_favorites', JSON.stringify([
      london,
      { name: 'Bad', lat: 999, lng: 0, timezone: 'UTC' },
    ]))
    expect(loadFavorites()).toEqual([london])
  })

  it('removeFavorite deletes by coordinates', () => {
    saveFavorite(london)
    removeFavorite(london)
    expect(loadFavorites()).toEqual([])
  })

  it('persists last location', () => {
    expect(loadLastLocation()).toBeNull()
    saveLastLocation(london)
    expect(loadLastLocation()).toEqual(london)
  })
})
