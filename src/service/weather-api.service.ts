import {
  CurrentWeatherResponse,
  GeocodeResponse,
  FiveDayForecastResponse,
  HourlyForecastResponse,
  WeatherUnits,
  WeatherLanguage,
  SavedCity,
  CityWeatherData,
  DetailedWeatherData
} from "./weather.types";

class WeatherAPIService {
  private readonly defaultUnits = WeatherUnits.METRIC;
  private readonly defaultLanguage = WeatherLanguage.UK;

  /**
   * Отримання поточної погоди за назвою міста
   */
  async getCurrentWeatherByCity(
    cityName: string,
    units: WeatherUnits = this.defaultUnits,
    lang: WeatherLanguage = this.defaultLanguage
  ): Promise<CurrentWeatherResponse> {
    const params = new URLSearchParams({
      q: cityName,
      units,
      lang
    });

    const response = await fetch(`/api/weather/current?${params}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch weather data');
    }

    return response.json();
  }

  /**
   * Отримання поточної погоди за координатами
   */
  async getCurrentWeatherByCoordinates(
    lat: number,
    lon: number,
    units: WeatherUnits = this.defaultUnits,
    lang: WeatherLanguage = this.defaultLanguage
  ): Promise<CurrentWeatherResponse> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      units,
      lang
    });

    const response = await fetch(`/api/weather/current?${params}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch weather data');
    }

    return response.json();
  }

  /**
   * Геокодування - пошук координат за назвою міста
   */
  async getLocationByCity(
    cityName: string,
    limit: number = 5
  ): Promise<GeocodeResponse[]> {
    const params = new URLSearchParams({
      q: cityName,
      limit: limit.toString()
    });

    const response = await fetch(`/api/weather/geocode?${params}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch location data');
    }

    return response.json();
  }

  /**
   * Зворотне геокодування - отримання назви міста за координатами
   */
  async getCityByCoordinates(
    lat: number,
    lon: number,
    limit: number = 1
  ): Promise<GeocodeResponse[]> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      limit: limit.toString()
    });

    const response = await fetch(`/api/weather/geocode?${params}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch location data');
    }

    return response.json();
  }

  /**
   * 5-денний прогноз погоди з 3-годинним інтервалом
   */
  async getFiveDayForecast(
    lat: number,
    lon: number,
    units: WeatherUnits = this.defaultUnits,
    lang: WeatherLanguage = this.defaultLanguage,
    cnt?: number
  ): Promise<FiveDayForecastResponse> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      units,
      lang
    });

    if (cnt) {
      params.append('cnt', cnt.toString());
    }

    const response = await fetch(`/api/weather/forecast?${params}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch forecast data');
    }

    return response.json();
  }

  /**
   * Отримання поточного денного прогнозу (фільтрація 5-денного прогнозу)
   */
  async getTodayHourlyForecast(
    lat: number,
    lon: number,
    units: WeatherUnits = this.defaultUnits,
    lang: WeatherLanguage = this.defaultLanguage
  ): Promise<HourlyForecastResponse> {
    const forecast = await this.getFiveDayForecast(lat, lon, units, lang);
    
    // Фільтруємо тільки сьогоднішні дані
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const todayForecasts = forecast.list.filter(item => 
      item.dt_txt.startsWith(todayStr)
    );

    return {
      cod: forecast.cod,
      message: forecast.message,
      cnt: todayForecasts.length,
      list: todayForecasts,
      city: forecast.city
    };
  }

  /**
   * Комплексне отримання всіх даних для міста
   */
  async getCityWeatherData(savedCity: SavedCity): Promise<CityWeatherData> {
    const currentWeather = await this.getCurrentWeatherByCoordinates(
      savedCity.coordinates.lat,
      savedCity.coordinates.lon
    );

    return {
      city: savedCity,
      currentWeather,
      lastUpdated: Date.now()
    };
  }

  /**
   * Детальні дані про погоду з погодинним прогнозом
   */
  async getDetailedWeatherData(savedCity: SavedCity): Promise<DetailedWeatherData> {
    const [currentWeather, hourlyForecast] = await Promise.all([
      this.getCurrentWeatherByCoordinates(
        savedCity.coordinates.lat,
        savedCity.coordinates.lon
      ),
      this.getTodayHourlyForecast(
        savedCity.coordinates.lat,
        savedCity.coordinates.lon
      )
    ]);

    return {
      city: savedCity,
      currentWeather,
      hourlyForecast,
      lastUpdated: Date.now()
    };
  }

  /**
   * Пошук міста і створення SavedCity об'єкта
   */
  async searchAndCreateCity(cityName: string): Promise<SavedCity> {
    const locations = await this.getLocationByCity(cityName, 1);
    
    if (!locations.length) {
      throw new Error(`Місто "${cityName}" не знайдено`);
    }

    const location = locations[0];
    
    return {
      id: `${location.lat}_${location.lon}`,
      name: location.name,
      country: location.country,
      coordinates: {
        lat: location.lat,
        lon: location.lon
      },
      addedAt: Date.now()
    };
  }
}

export const weatherAPIService = new WeatherAPIService();

