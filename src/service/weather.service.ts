import { HttpFactoryService } from "@/shared/services/http-factory.service";
import { HttpService } from "@/shared/services/http.service";
import {
  CurrentWeatherResponse,
  GeocodeResponse,
  HourlyForecastResponse,
  FiveDayForecastResponse,
  WeatherRequestParams,
  ForecastRequestParams,
  WeatherUnits,
  WeatherLanguage,
  SavedCity,
  CityWeatherData,
  DetailedWeatherData
} from "./weather.types";

class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.openweathermap.org";
  private readonly defaultUnits = WeatherUnits.METRIC;
  private readonly defaultLanguage = WeatherLanguage.UK;

  constructor(private readonly httpService: HttpService) {
    this.httpService = httpService;
    this.apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('OpenWeatherMap API key is not set. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to your environment variables.');
    }
  }

  /**
   * Отримання поточної погоди за назвою міста
   */
  async getCurrentWeatherByCity(
    cityName: string,
    units: WeatherUnits = this.defaultUnits,
    lang: WeatherLanguage = this.defaultLanguage
  ): Promise<CurrentWeatherResponse> {
    const params: WeatherRequestParams = {
      q: cityName,
      appid: this.apiKey,
      units,
      lang
    };

    const url = this.httpService.get<CurrentWeatherResponse>('/data/2.5/weather', {params});
    return url;
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
    const params: WeatherRequestParams = {
      lat,
      lon,
      appid: this.apiKey,
      units,
      lang
    };

    const url = this.httpService.get<CurrentWeatherResponse>('/data/2.5/weather', {params});
    return url;
  }

  /**
   * Геокодування - пошук координат за назвою міста
   */
  async getLocationByCity(
    cityName: string,
    limit: number = 5
  ): Promise<GeocodeResponse[]> {
    const params = {
      q: cityName,
      limit: limit.toString(),
      appid: this.apiKey
    };

    const url = this.httpService.get<GeocodeResponse[]>('/geo/1.0/direct', {params});
    return url;
  }

  /**
   * Зворотне геокодування - отримання назви міста за координатами
   */
  async getCityByCoordinates(
    lat: number,
    lon: number,
    limit: number = 1
  ): Promise<GeocodeResponse[]> {
    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: limit.toString(),
      appid: this.apiKey
    };

    const url = this.httpService.get<GeocodeResponse[]>('/geo/1.0/reverse', {params});
    return url;
  }

  /**
   * Погодинний прогноз на 48 годин (потрібна підписка One Call API)
   * Для безкоштовного плану використовуємо 5-денний прогноз
   */
  async getHourlyForecast(
    lat: number,
    lon: number,
    units: WeatherUnits = this.defaultUnits,
    lang: WeatherLanguage = this.defaultLanguage,
    cnt?: number
  ): Promise<FiveDayForecastResponse> {
    const params: ForecastRequestParams = {
      lat,
      lon,
      appid: this.apiKey,
      units,
      lang,
      ...(cnt && { cnt })
    };

    
    return this.httpService.get<FiveDayForecastResponse>('/data/2.5/forecast', {params});
  }

  /**
   * 5-денний прогноз погоди з 3-годинним інтервалом
   */
  async getFiveDayForecast(
    lat: number,
    lon: number,
    units: WeatherUnits = this.defaultUnits,
    lang: WeatherLanguage = this.defaultLanguage
  ): Promise<FiveDayForecastResponse> {
    return this.getHourlyForecast(lat, lon, units, lang);
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

export const weatherService = new WeatherService(
  new HttpFactoryService().createHttpService()
);