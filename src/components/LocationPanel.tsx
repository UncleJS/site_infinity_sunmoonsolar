import { useState, useMemo, useId, type KeyboardEvent } from 'react'
import tzlookup from 'tz-lookup'
import { searchCities, type City } from '../data/cities'
import type { Location } from '../lib/favorites'
import {
  loadFavorites,
  saveFavorite,
  removeFavorite,
  renameFavorite,
  isFavorite,
} from '../lib/favorites'
import { isValidTimeZone } from '../lib/timezone'

interface Props {
  location: Location
  onLocationChange: (loc: Location) => void
}

export function LocationPanel({ location, onLocationChange }: Props) {
  const [citySearch, setCitySearch] = useState('')
  const [latInput, setLatInput] = useState('')
  const [lngInput, setLngInput] = useState('')
  const [latLngError, setLatLngError] = useState('')
  const [tzWarning, setTzWarning] = useState('')
  const [favorites, setFavorites] = useState<Location[]>(loadFavorites)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const [showNameForm, setShowNameForm] = useState(false)
  const [favNameInput, setFavNameInput] = useState('')
  const [nameFormMode, setNameFormMode] = useState<'add' | 'rename'>('add')

  const listboxId = useId()
  const cityInputId = useId()
  const latInputId = useId()
  const lngInputId = useId()
  const favNameId = useId()

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return []
    return searchCities(citySearch, 12)
  }, [citySearch])

  function selectCity(city: City) {
    onLocationChange({
      name: `${city.name}, ${city.country}`,
      lat: city.lat,
      lng: city.lng,
      timezone: city.timezone,
    })
    setCitySearch(city.name)
    setShowCityDropdown(false)
    setShowNameForm(false)
    setTzWarning('')
  }

  function handleLatLng() {
    const lat = parseFloat(latInput)
    const lng = parseFloat(lngInput)
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setLatLngError('Latitude must be between -90 and 90')
      return
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setLatLngError('Longitude must be between -180 and 180')
      return
    }
    setLatLngError('')
    let tz = 'UTC'
    let lookedUp = false
    try {
      tz = tzlookup(lat, lng)
      lookedUp = true
    } catch {
      tz = 'UTC'
    }
    if (!isValidTimeZone(tz)) {
      tz = 'UTC'
      lookedUp = false
    }
    setTzWarning(lookedUp ? '' : 'Timezone could not be resolved; times shown in UTC.')
    onLocationChange({ name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng, timezone: tz })
    setShowNameForm(false)
  }

  function handleStarClick() {
    if (isFavorite(location, favorites)) {
      const savedName = favorites.find(f => f.lat === location.lat && f.lng === location.lng)?.name ?? location.name
      setFavNameInput(savedName)
      setNameFormMode('rename')
      setShowNameForm(true)
    } else {
      setFavNameInput(location.name)
      setNameFormMode('add')
      setShowNameForm(true)
    }
  }

  function confirmSaveFavourite() {
    const name = favNameInput.trim() || location.name
    if (nameFormMode === 'add') {
      setFavorites(saveFavorite({ ...location, name }))
    } else {
      setFavorites(renameFavorite(location, name))
    }
    setShowNameForm(false)
  }

  function onCityKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showCityDropdown || filteredCities.length === 0) {
      if (e.key === 'ArrowDown' && filteredCities.length > 0) {
        setShowCityDropdown(true)
        e.preventDefault()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight(h => (h + 1) % filteredCities.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight(h => (h - 1 + filteredCities.length) % filteredCities.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectCity(filteredCities[highlight] ?? filteredCities[0])
    } else if (e.key === 'Escape') {
      setShowCityDropdown(false)
    }
  }

  const starred = isFavorite(location, favorites)
  const activeOptionId = showCityDropdown && filteredCities[highlight]
    ? `${listboxId}-opt-${highlight}`
    : undefined

  return (
    <div className="card">
      <h2 className="card-title"><span aria-hidden="true">📍</span> Location</h2>

      <div className="current-location">
        <div className="current-location-info">
          <span className="location-name">{location.name}</span>
          <span className="location-coords">
            {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}° · {location.timezone}
          </span>
        </div>
        <button
          type="button"
          className={`btn-fav ${starred ? 'btn-fav--saved' : ''} ${showNameForm ? 'btn-fav--pending' : ''}`}
          onClick={handleStarClick}
          aria-pressed={starred}
        >
          {starred ? '★ Saved' : '☆ Save as Favourite'}
        </button>
      </div>

      {showNameForm && (
        <div className="fav-name-form">
          <label className="visually-hidden" htmlFor={favNameId}>Favourite name</label>
          <input
            id={favNameId}
            className="text-input"
            type="text"
            placeholder="Name this favourite…"
            value={favNameInput}
            onChange={e => setFavNameInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') confirmSaveFavourite()
              if (e.key === 'Escape') setShowNameForm(false)
            }}
            autoFocus
          />
          <button type="button" className="btn-save" onClick={confirmSaveFavourite}>
            {nameFormMode === 'add' ? 'Save ★' : 'Rename ★'}
          </button>
          {nameFormMode === 'rename' && (
            <button
              type="button"
              className="btn-remove"
              onClick={() => {
                setFavorites(removeFavorite(location))
                setShowNameForm(false)
              }}
            >
              Remove
            </button>
          )}
          <button type="button" className="btn-cancel" onClick={() => setShowNameForm(false)}>Cancel</button>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="section">
          <p className="section-label" id="fav-label">Favourites</p>
          <div className="fav-list" role="list" aria-labelledby="fav-label">
            {favorites.map(f => (
              <button
                type="button"
                key={`${f.lat},${f.lng}`}
                className={`fav-chip ${location.lat === f.lat && location.lng === f.lng ? 'active' : ''}`}
                onClick={() => { onLocationChange(f); setShowNameForm(false); setTzWarning('') }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <label className="section-label" htmlFor={cityInputId}>Search City</label>
        <div className="dropdown-wrap">
          <input
            id={cityInputId}
            className="text-input"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showCityDropdown && filteredCities.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            placeholder="e.g. London, Tokyo…"
            value={citySearch}
            onChange={e => {
              setCitySearch(e.target.value)
              setShowCityDropdown(true)
              setHighlight(0)
            }}
            onFocus={() => setShowCityDropdown(true)}
            onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
            onKeyDown={onCityKeyDown}
          />
          {showCityDropdown && filteredCities.length > 0 && (
            <ul className="dropdown" id={listboxId} role="listbox">
              {filteredCities.map((c, i) => (
                <li
                  key={`${c.name}-${c.country}`}
                  id={`${listboxId}-opt-${i}`}
                  role="option"
                  aria-selected={i === highlight}
                  className={i === highlight ? 'highlighted' : ''}
                  onMouseDown={e => { e.preventDefault(); selectCity(c) }}
                  onMouseEnter={() => setHighlight(i)}
                >
                  {c.name}, {c.country}
                  <span className="coords-hint">{c.lat.toFixed(2)}°, {c.lng.toFixed(2)}°</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="section">
        <p className="section-label" id="latlng-label">Manual Lat / Long</p>
        <div className="latlng-row" role="group" aria-labelledby="latlng-label">
          <label className="visually-hidden" htmlFor={latInputId}>Latitude</label>
          <input
            id={latInputId}
            className="text-input"
            type="number"
            placeholder="Latitude (-90 to 90)"
            value={latInput}
            onChange={e => setLatInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleLatLng() }}
            step="0.0001"
            min="-90"
            max="90"
          />
          <label className="visually-hidden" htmlFor={lngInputId}>Longitude</label>
          <input
            id={lngInputId}
            className="text-input"
            type="number"
            placeholder="Longitude (-180 to 180)"
            value={lngInput}
            onChange={e => setLngInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleLatLng() }}
            step="0.0001"
            min="-180"
            max="180"
          />
          <button type="button" className="btn-primary" onClick={handleLatLng}>Go</button>
        </div>
        {latLngError && <p className="error-text" role="alert">{latLngError}</p>}
        {tzWarning && <p className="error-text" role="status">{tzWarning}</p>}
      </div>
    </div>
  )
}
