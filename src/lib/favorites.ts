import { isValidTimeZone, safeTimeZone } from './timezone'

export interface Location {
  name: string
  lat: number
  lng: number
  timezone: string
}

const FAVORITES_KEY = 'sunmoonsolar_favorites'
const LAST_LOCATION_KEY = 'sunmoonsolar_last_location'

export function isValidLocation(value: unknown): value is Location {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  if (typeof v.name !== 'string' || v.name.trim() === '') return false
  if (typeof v.lat !== 'number' || !Number.isFinite(v.lat) || v.lat < -90 || v.lat > 90) return false
  if (typeof v.lng !== 'number' || !Number.isFinite(v.lng) || v.lng < -180 || v.lng > 180) return false
  if (typeof v.timezone !== 'string' || !isValidTimeZone(v.timezone)) return false
  return true
}

function sanitizeLocation(value: unknown): Location | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  const lat = typeof v.lat === 'number' ? v.lat : Number(v.lat)
  const lng = typeof v.lng === 'number' ? v.lng : Number(v.lng)
  const name = typeof v.name === 'string' ? v.name.trim() : ''
  const timezone = typeof v.timezone === 'string' ? safeTimeZone(v.timezone) : 'UTC'
  const candidate: Location = {
    name: name || `${lat}, ${lng}`,
    lat,
    lng,
    timezone,
  }
  return isValidLocation(candidate) ? candidate : null
}

function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function loadFavorites(): Location[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(sanitizeLocation).filter((x): x is Location => x !== null)
  } catch {
    return []
  }
}

export function saveFavorite(loc: Location): Location[] {
  const favs = loadFavorites()
  const exists = favs.some(f => f.lat === loc.lat && f.lng === loc.lng)
  if (exists) return favs
  const updated = [...favs, loc]
  writeJson(FAVORITES_KEY, updated)
  return loadFavorites()
}

export function removeFavorite(loc: Location): Location[] {
  const favs = loadFavorites()
  const updated = favs.filter(f => !(f.lat === loc.lat && f.lng === loc.lng))
  writeJson(FAVORITES_KEY, updated)
  return loadFavorites()
}

export function renameFavorite(loc: Location, newName: string): Location[] {
  const favs = loadFavorites()
  const updated = favs.map(f =>
    f.lat === loc.lat && f.lng === loc.lng ? { ...f, name: newName } : f
  )
  writeJson(FAVORITES_KEY, updated)
  return loadFavorites()
}

export function isFavorite(loc: Location, favs?: Location[]): boolean {
  const list = favs ?? loadFavorites()
  return list.some(f => f.lat === loc.lat && f.lng === loc.lng)
}

export function loadLastLocation(): Location | null {
  try {
    const raw = localStorage.getItem(LAST_LOCATION_KEY)
    if (!raw) return null
    return sanitizeLocation(JSON.parse(raw))
  } catch {
    return null
  }
}

export function saveLastLocation(loc: Location): void {
  writeJson(LAST_LOCATION_KEY, loc)
}
