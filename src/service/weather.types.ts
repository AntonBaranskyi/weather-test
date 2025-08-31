// Базові типи для координат
export interface Coordinates {
  lat: number;
  lon: number;
}

// Типи для поточної погоди (Current Weather API)
export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherInfo {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  '1h'?: number;
  '3h'?: number;
}

export interface Snow {
  '1h'?: number;
  '3h'?: number;
}

export interface Sys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: Weather[];
  base: string;
  main: MainWeatherInfo;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  rain?: Rain;
  snow?: Snow;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Типи для геокодування (Geocoding API)
export interface GeocodeResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Типи для погодинного прогнозу (Hourly Forecast API)
export interface HourlyForecastItem {
  dt: number;
  main: MainWeatherInfo;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: Rain;
  snow?: Snow;
  dt_txt: string;
}

export interface HourlyForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: HourlyForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Типи для 5-денного прогнозу (5 Day Weather Forecast API)
export interface FiveDayForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: HourlyForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Параметри для запитів
export interface WeatherRequestParams {
  q?: string; // City name
  lat?: number;
  lon?: number;
  appid: string;
  units?: 'standard' | 'metric' | 'imperial';
  lang?: string;
  [key: string]: string | number | undefined;
}

export interface ForecastRequestParams extends WeatherRequestParams {
  cnt?: number; // Number of timestamps to return
}

export interface SavedCity {
  id: string;
  name: string;
  country: string;
  coordinates: Coordinates;
  addedAt: number;
}

export interface WeatherAPIError {
  cod: string | number;
  message: string;
}

export interface CityWeatherData {
  city: SavedCity;
  currentWeather: CurrentWeatherResponse;
  lastUpdated: number;
}

export interface DetailedWeatherData extends CityWeatherData {
  hourlyForecast?: HourlyForecastResponse;
}

// Енуми для зручності
export enum WeatherUnits {
  STANDARD = 'standard',
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

export enum WeatherLanguage {
  UK = 'uk',
  EN = 'en',
  RU = 'ru'
}

// Типи для localStorage
export interface LocalStorageData {
  cities: SavedCity[];
  settings: {
    units: WeatherUnits;
    language: WeatherLanguage;
  };
}
