export interface City {
  name: string
  country: string
  lat: number
  lng: number
  timezone: string
}

/** Compact set: default city plus one entry per major region/timezone. */
export const CITIES: City[] = [
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo' },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, timezone: 'Africa/Johannesburg' },
  { name: 'Centurion', country: 'South Africa', lat: -25.8603, lng: 28.1894, timezone: 'Africa/Johannesburg' },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, timezone: 'Africa/Johannesburg' },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, timezone: 'Africa/Lagos' },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, timezone: 'Africa/Nairobi' },
  { name: 'Anchorage', country: 'USA', lat: 61.2181, lng: -149.9003, timezone: 'America/Anchorage' },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago' },
  { name: 'Denver', country: 'USA', lat: 39.7392, lng: -104.9903, timezone: 'America/Denver' },
  { name: 'Honolulu', country: 'USA', lat: 21.3069, lng: -157.8583, timezone: 'Pacific/Honolulu' },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles' },
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' },
  { name: 'Phoenix', country: 'USA', lat: 33.4484, lng: -112.0740, timezone: 'America/Phoenix' },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, timezone: 'America/Mexico_City' },
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo' },
  { name: 'Reykjavik', country: 'Iceland', lat: 64.1355, lng: -21.8954, timezone: 'Atlantic/Reykjavik' },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, timezone: 'Europe/Berlin' },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, timezone: 'Europe/Moscow' },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694, timezone: 'Asia/Hong_Kong' },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, timezone: 'Pacific/Auckland' },
  { name: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605, timezone: 'Australia/Perth' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney' },
]

export function searchCities(query: string, limit = 20): City[] {
  const q = query.toLowerCase()
  return CITIES.filter(
    c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
  ).slice(0, limit)
}
