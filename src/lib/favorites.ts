export interface Location {
  name: string
  lat: number
  lng: number
  timezone: string
}

const FAVORITES_KEY = 'sunmoonsolar_favorites'

export function loadFavorites(): Location[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Location[]
  } catch {
    return []
  }
}

export function saveFavorite(loc: Location): Location[] {
  const favs = loadFavorites()
  const exists = favs.some(f => f.lat === loc.lat && f.lng === loc.lng)
  if (exists) return favs
  const updated = [...favs, loc]
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  return updated
}

export function removeFavorite(loc: Location): Location[] {
  const favs = loadFavorites()
  const updated = favs.filter(f => !(f.lat === loc.lat && f.lng === loc.lng))
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  return updated
}

export function renameFavorite(loc: Location, newName: string): Location[] {
  const favs = loadFavorites()
  const updated = favs.map(f =>
    f.lat === loc.lat && f.lng === loc.lng ? { ...f, name: newName } : f
  )
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  return updated
}

export function isFavorite(loc: Location): boolean {
  return loadFavorites().some(f => f.lat === loc.lat && f.lng === loc.lng)
}
