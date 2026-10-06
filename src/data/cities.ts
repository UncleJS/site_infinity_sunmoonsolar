export interface City {
  name: string
  country: string
  lat: number
  lng: number
  timezone: string
}

export const CITIES: City[] = [
  // Africa
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo' },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, timezone: 'Africa/Johannesburg' },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, timezone: 'Africa/Johannesburg' },
  { name: 'Brakfontein', country: 'South Africa', lat: -25.8781, lng: 28.1687, timezone: 'Africa/Johannesburg' },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, timezone: 'Africa/Lagos' },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, timezone: 'Africa/Nairobi' },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898, timezone: 'Africa/Casablanca' },
  { name: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.1870, timezone: 'Africa/Accra' },
  { name: 'Addis Ababa', country: 'Ethiopia', lat: 9.0320, lng: 38.7469, timezone: 'Africa/Addis_Ababa' },
  { name: 'Dar es Salaam', country: 'Tanzania', lat: -6.7924, lng: 39.2083, timezone: 'Africa/Dar_es_Salaam' },
  { name: 'Tunis', country: 'Tunisia', lat: 36.8190, lng: 10.1658, timezone: 'Africa/Tunis' },

  // Americas — North
  { name: 'Anchorage', country: 'USA', lat: 61.2181, lng: -149.9003, timezone: 'America/Anchorage' },
  { name: 'Atlanta', country: 'USA', lat: 33.7490, lng: -84.3880, timezone: 'America/New_York' },
  { name: 'Boston', country: 'USA', lat: 42.3601, lng: -71.0589, timezone: 'America/New_York' },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago' },
  { name: 'Dallas', country: 'USA', lat: 32.7767, lng: -96.7970, timezone: 'America/Chicago' },
  { name: 'Denver', country: 'USA', lat: 39.7392, lng: -104.9903, timezone: 'America/Denver' },
  { name: 'Honolulu', country: 'USA', lat: 21.3069, lng: -157.8583, timezone: 'Pacific/Honolulu' },
  { name: 'Houston', country: 'USA', lat: 29.7604, lng: -95.3698, timezone: 'America/Chicago' },
  { name: 'Las Vegas', country: 'USA', lat: 36.1699, lng: -115.1398, timezone: 'America/Los_Angeles' },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles' },
  { name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, timezone: 'America/New_York' },
  { name: 'Minneapolis', country: 'USA', lat: 44.9778, lng: -93.2650, timezone: 'America/Chicago' },
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' },
  { name: 'Phoenix', country: 'USA', lat: 33.4484, lng: -112.0740, timezone: 'America/Phoenix' },
  { name: 'Portland', country: 'USA', lat: 45.5051, lng: -122.6750, timezone: 'America/Los_Angeles' },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321, timezone: 'America/Los_Angeles' },
  { name: 'Washington DC', country: 'USA', lat: 38.9072, lng: -77.0369, timezone: 'America/New_York' },
  { name: 'Calgary', country: 'Canada', lat: 51.0447, lng: -114.0719, timezone: 'America/Edmonton' },
  { name: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673, timezone: 'America/Toronto' },
  { name: 'Ottawa', country: 'Canada', lat: 45.4215, lng: -75.6972, timezone: 'America/Toronto' },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto' },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, timezone: 'America/Vancouver' },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, timezone: 'America/Mexico_City' },
  { name: 'Guadalajara', country: 'Mexico', lat: 20.6597, lng: -103.3496, timezone: 'America/Mexico_City' },

  // Americas — Central & Caribbean
  { name: 'Guatemala City', country: 'Guatemala', lat: 14.6349, lng: -90.5069, timezone: 'America/Guatemala' },
  { name: 'Havana', country: 'Cuba', lat: 23.1136, lng: -82.3666, timezone: 'America/Havana' },
  { name: 'Panama City', country: 'Panama', lat: 8.9936, lng: -79.5197, timezone: 'America/Panama' },
  { name: 'San José', country: 'Costa Rica', lat: 9.9281, lng: -84.0907, timezone: 'America/Costa_Rica' },

  // Americas — South
  { name: 'Bogotá', country: 'Colombia', lat: 4.7110, lng: -74.0721, timezone: 'America/Bogota' },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
  { name: 'Caracas', country: 'Venezuela', lat: 10.4806, lng: -66.9036, timezone: 'America/Caracas' },
  { name: 'La Paz', country: 'Bolivia', lat: -16.5000, lng: -68.1500, timezone: 'America/La_Paz' },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, timezone: 'America/Lima' },
  { name: 'Montevideo', country: 'Uruguay', lat: -34.9011, lng: -56.1645, timezone: 'America/Montevideo' },
  { name: 'Quito', country: 'Ecuador', lat: -0.1807, lng: -78.4678, timezone: 'America/Guayaquil' },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729, timezone: 'America/Sao_Paulo' },
  { name: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693, timezone: 'America/Santiago' },
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo' },

  // Asia — East
  { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, timezone: 'Asia/Shanghai' },
  { name: 'Chengdu', country: 'China', lat: 30.5728, lng: 104.0668, timezone: 'Asia/Shanghai' },
  { name: 'Guangzhou', country: 'China', lat: 23.1291, lng: 113.2644, timezone: 'Asia/Shanghai' },
  { name: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694, timezone: 'Asia/Hong_Kong' },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, timezone: 'Asia/Shanghai' },
  { name: 'Shenzhen', country: 'China', lat: 22.5431, lng: 114.0579, timezone: 'Asia/Shanghai' },
  { name: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023, timezone: 'Asia/Tokyo' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, timezone: 'Asia/Seoul' },
  { name: 'Taipei', country: 'Taiwan', lat: 25.0330, lng: 121.5654, timezone: 'Asia/Taipei' },
  { name: 'Ulaanbaatar', country: 'Mongolia', lat: 47.8864, lng: 106.9057, timezone: 'Asia/Ulaanbaatar' },

  // Asia — South
  { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, timezone: 'Asia/Kolkata' },
  { name: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata' },
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, timezone: 'Asia/Dhaka' },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011, timezone: 'Asia/Karachi' },
  { name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lng: 85.3240, timezone: 'Asia/Kathmandu' },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639, timezone: 'Asia/Kolkata' },
  { name: 'Lahore', country: 'Pakistan', lat: 31.5204, lng: 74.3587, timezone: 'Asia/Karachi' },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata' },

  // Asia — Southeast
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, timezone: 'Asia/Bangkok' },
  { name: 'Hanoi', country: 'Vietnam', lat: 21.0278, lng: 105.8342, timezone: 'Asia/Ho_Chi_Minh' },
  { name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297, timezone: 'Asia/Ho_Chi_Minh' },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta' },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
  { name: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842, timezone: 'Asia/Manila' },
  { name: 'Phnom Penh', country: 'Cambodia', lat: 11.5564, lng: 104.9282, timezone: 'Asia/Phnom_Penh' },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Yangon', country: 'Myanmar', lat: 16.8661, lng: 96.1951, timezone: 'Asia/Rangoon' },

  // Asia — West & Central
  { name: 'Almaty', country: 'Kazakhstan', lat: 43.2220, lng: 76.8512, timezone: 'Asia/Almaty' },
  { name: 'Baku', country: 'Azerbaijan', lat: 40.4093, lng: 49.8671, timezone: 'Asia/Baku' },
  { name: 'Baghdad', country: 'Iraq', lat: 33.3152, lng: 44.3661, timezone: 'Asia/Baghdad' },
  { name: 'Beirut', country: 'Lebanon', lat: 33.8938, lng: 35.5018, timezone: 'Asia/Beirut' },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul' },
  { name: 'Jerusalem', country: 'Israel', lat: 31.7683, lng: 35.2137, timezone: 'Asia/Jerusalem' },
  { name: 'Kabul', country: 'Afghanistan', lat: 34.5553, lng: 69.2075, timezone: 'Asia/Kabul' },
  { name: 'Kuwait City', country: 'Kuwait', lat: 29.3759, lng: 47.9774, timezone: 'Asia/Kuwait' },
  { name: 'Muscat', country: 'Oman', lat: 23.5880, lng: 58.3829, timezone: 'Asia/Muscat' },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.6877, lng: 46.7219, timezone: 'Asia/Riyadh' },
  { name: 'Tashkent', country: 'Uzbekistan', lat: 41.2995, lng: 69.2401, timezone: 'Asia/Tashkent' },
  { name: 'Tehran', country: 'Iran', lat: 35.6892, lng: 51.3890, timezone: 'Asia/Tehran' },
  { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818, timezone: 'Asia/Jerusalem' },

  // Europe
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, timezone: 'Europe/Amsterdam' },
  { name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, timezone: 'Europe/Athens' },
  { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734, timezone: 'Europe/Madrid' },
  { name: 'Belgrade', country: 'Serbia', lat: 44.8176, lng: 20.4569, timezone: 'Europe/Belgrade' },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, timezone: 'Europe/Berlin' },
  { name: 'Brussels', country: 'Belgium', lat: 50.8503, lng: 4.3517, timezone: 'Europe/Brussels' },
  { name: 'Bucharest', country: 'Romania', lat: 44.4268, lng: 26.1025, timezone: 'Europe/Bucharest' },
  { name: 'Budapest', country: 'Hungary', lat: 47.4979, lng: 19.0402, timezone: 'Europe/Budapest' },
  { name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683, timezone: 'Europe/Copenhagen' },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, timezone: 'Europe/Dublin' },
  { name: 'Edinburgh', country: 'UK', lat: 55.9533, lng: -3.1883, timezone: 'Europe/London' },
  { name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, timezone: 'Europe/Berlin' },
  { name: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384, timezone: 'Europe/Helsinki' },
  { name: 'Kyiv', country: 'Ukraine', lat: 50.4501, lng: 30.5234, timezone: 'Europe/Kyiv' },
  { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, timezone: 'Europe/Lisbon' },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, timezone: 'Europe/Madrid' },
  { name: 'Milan', country: 'Italy', lat: 45.4654, lng: 9.1859, timezone: 'Europe/Rome' },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, timezone: 'Europe/Moscow' },
  { name: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.5820, timezone: 'Europe/Berlin' },
  { name: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, timezone: 'Europe/Oslo' },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378, timezone: 'Europe/Prague' },
  { name: 'Reykjavik', country: 'Iceland', lat: 64.1355, lng: -21.8954, timezone: 'Atlantic/Reykjavik' },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, timezone: 'Europe/Rome' },
  { name: 'Sofia', country: 'Bulgaria', lat: 42.6977, lng: 23.3219, timezone: 'Europe/Sofia' },
  { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, timezone: 'Europe/Stockholm' },
  { name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, timezone: 'Europe/Vienna' },
  { name: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122, timezone: 'Europe/Warsaw' },
  { name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, timezone: 'Europe/Zurich' },

  // Oceania
  { name: 'Adelaide', country: 'Australia', lat: -34.9285, lng: 138.6007, timezone: 'Australia/Adelaide' },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, timezone: 'Pacific/Auckland' },
  { name: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251, timezone: 'Australia/Brisbane' },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, timezone: 'Australia/Melbourne' },
  { name: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605, timezone: 'Australia/Perth' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Wellington', country: 'New Zealand', lat: -41.2865, lng: 174.7762, timezone: 'Pacific/Auckland' },
  { name: 'Suva', country: 'Fiji', lat: -18.1416, lng: 178.4419, timezone: 'Pacific/Fiji' },
]

export function searchCities(query: string, limit = 20): City[] {
  const q = query.toLowerCase()
  return CITIES.filter(
    c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
  ).slice(0, limit)
}
