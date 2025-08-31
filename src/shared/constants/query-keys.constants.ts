enum QUERY_KEYS {
    WEATHER_CITY = 'weather-city',
    WEATHER_QUERY_KEYS = 'weather-query-keys',
    WEATHER_CITIES = 'weather-cities',
    CURRENT_WEATHER = 'current-weather',
    HOURLY_FORECAST = 'hourly-forecast',
    DETAILED_WEATHER = 'detailed-weather',
    SEARCH = 'search',
}

export const WEATHER_QUERY_KEYS = {
  all: [QUERY_KEYS.WEATHER_QUERY_KEYS] as const,
  cities: () => [...WEATHER_QUERY_KEYS.all, QUERY_KEYS.WEATHER_CITIES] as const,
  city: (cityId: string) => [...WEATHER_QUERY_KEYS.cities(), cityId] as const,

  currentWeather: (cityId: string) => [...WEATHER_QUERY_KEYS.city(cityId), QUERY_KEYS.CURRENT_WEATHER] as const,
  hourlyForecast: (cityId: string) => [...WEATHER_QUERY_KEYS.city(cityId), QUERY_KEYS.HOURLY_FORECAST] as const,
  detailedWeather: (cityId: string) => [...WEATHER_QUERY_KEYS.city(cityId), QUERY_KEYS.DETAILED_WEATHER] as const,
  search: (query: string) => [...WEATHER_QUERY_KEYS.all, QUERY_KEYS.SEARCH, query] as const,
} as const;