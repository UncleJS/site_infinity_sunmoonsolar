import { useState, useMemo } from 'react'
import tzlookup from 'tz-lookup'
import { CITIES } from '../data/cities'
import type { Location } from '../lib/favorites'
import { loadFavorites, saveFavorite, removeFavorite, renameFavorite, isFavorite } from '../lib/favorites'

interface Props {
  location: Location | null
  onLocationChange: (loc: Location) => void
}

export function LocationPanel({ location, onLocationChange }: Props) {
  const [citySearch, setCitySearch] = useState('')
  const [latInput, setLatInput] = useState('')
  const [lngInput, setLngInput] = useState('')
  const [latLngError, setLatLngError] = useState('')
  const [favorites, setFavorites] = useState<Location[]>(loadFavorites)
  const [showCityDropdown, setShowCityDropdown] = useState(false)

  // Favourite name form state
  const [showNameForm, setShowNameForm] = useState(false)
  const [favNameInput, setFavNameInput] = useState('')
  const [nameFormMode, setNameFormMode] = useState<'add' | 'rename'>('add')

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return []
    const q = citySearch.toLowerCase()
    return CITIES.filter(
      c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    ).slice(0, 12)
  }, [citySearch])

  function selectCity(city: typeof CITIES[0]) {
    onLocationChange({ name: `${city.name}, ${city.country}`, lat: city.lat, lng: city.lng, timezone: city.timezone })
    setCitySearch(city.name)
    setShowCityDropdown(false)
    setShowNameForm(false)
  }

  function handleLatLng() {
    const lat = parseFloat(latInput)
    const lng = parseFloat(lngInput)
    if (isNaN(lat) || lat < -90 || lat > 90) { setLatLngError('Latitude must be between -90 and 90'); return }
    if (isNaN(lng) || lng < -180 || lng > 180) { setLatLngError('Longitude must be between -180 and 180'); return }
    setLatLngError('')
    let tz = 'UTC'
    try { tz = tzlookup(lat, lng) } catch { /* keep UTC */ }
    onLocationChange({ name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng, timezone: tz })
    setShowNameForm(false)
  }

  function handleStarClick() {
    if (!location) return
    if (isFavorite(location)) {
      // Open form pre-filled with saved name for rename/remove
      const savedName = favorites.find(f => f.lat === location.lat && f.lng === location.lng)?.name ?? location.name
      setFavNameInput(savedName)
      setNameFormMode('rename')
      setShowNameForm(true)
    } else {
      // Open form pre-filled with location name for new favourite
      setFavNameInput(location.name)
      setNameFormMode('add')
      setShowNameForm(true)
    }
  }

  function confirmSaveFavourite() {
    if (!location) return
    const name = favNameInput.trim() || location.name
    if (nameFormMode === 'add') {
      setFavorites(saveFavorite({ ...location, name }))
    } else {
      setFavorites(renameFavorite(location, name))
    }
    setShowNameForm(false)
  }

  function cancelNameForm() {
    setShowNameForm(false)
  }

  const starred = location ? isFavorite(location) : false

  return (
    <div className="card">
      <h2 className="card-title">📍 Location</h2>

      {/* Current location display */}
      {location && (
        <div className="current-location">
          <div className="current-location-info">
            <span className="location-name">{location.name}</span>
            <span className="location-coords">
              {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
            </span>
          </div>
          <button
            className={`btn-fav ${starred ? 'btn-fav--saved' : ''} ${showNameForm ? 'btn-fav--pending' : ''}`}
            onClick={handleStarClick}
          >
            {starred ? '★ Saved' : '☆ Save as Favourite'}
          </button>
        </div>
      )}

      {/* Inline favourite name form */}
      {showNameForm && location && (
        <div className="fav-name-form">
          <input
            className="text-input"
            type="text"
            placeholder="Name this favourite…"
            value={favNameInput}
            onChange={e => setFavNameInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') confirmSaveFavourite(); if (e.key === 'Escape') cancelNameForm() }}
            autoFocus
          />
          <button className="btn-save" onClick={confirmSaveFavourite}>
            {nameFormMode === 'add' ? 'Save ★' : 'Rename ★'}
          </button>
          {nameFormMode === 'rename' && (
            <button className="btn-remove" onClick={() => {
              setFavorites(removeFavorite(location))
              setShowNameForm(false)
            }}>Remove</button>
          )}
          <button className="btn-cancel" onClick={cancelNameForm}>Cancel</button>
        </div>
      )}

      {/* Favourites shortlist */}
      {favorites.length > 0 && (
        <div className="section">
          <label className="section-label">Favourites</label>
          <div className="fav-list">
            {favorites.map((f, i) => (
              <button
                key={i}
                className={`fav-chip ${location?.lat === f.lat && location?.lng === f.lng ? 'active' : ''}`}
                onClick={() => { onLocationChange(f); setShowNameForm(false) }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* City search */}
      <div className="section">
        <label className="section-label">Search City</label>
        <div className="dropdown-wrap">
          <input
            className="text-input"
            type="text"
            placeholder="e.g. London, Tokyo…"
            value={citySearch}
            onChange={e => { setCitySearch(e.target.value); setShowCityDropdown(true) }}
            onFocus={() => setShowCityDropdown(true)}
            onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
          />
          {showCityDropdown && filteredCities.length > 0 && (
            <ul className="dropdown">
              {filteredCities.map((c, i) => (
                <li key={i} onMouseDown={() => selectCity(c)}>
                  {c.name}, {c.country}
                  <span className="coords-hint">{c.lat.toFixed(2)}°, {c.lng.toFixed(2)}°</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Manual lat/lng */}
      <div className="section">
        <label className="section-label">Manual Lat / Long</label>
        <div className="latlng-row">
          <input
            className="text-input"
            type="number"
            placeholder="Latitude (-90 to 90)"
            value={latInput}
            onChange={e => setLatInput(e.target.value)}
            step="0.0001"
            min="-90"
            max="90"
          />
          <input
            className="text-input"
            type="number"
            placeholder="Longitude (-180 to 180)"
            value={lngInput}
            onChange={e => setLngInput(e.target.value)}
            step="0.0001"
            min="-180"
            max="180"
          />
          <button className="btn-primary" onClick={handleLatLng}>Go</button>
        </div>
        {latLngError && <p className="error-text">{latLngError}</p>}
      </div>
    </div>
  )
}
