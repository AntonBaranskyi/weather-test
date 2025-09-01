export * from './queries';

export * from '../../store/weather.hooks';

export const useRefreshCityWeather = () => {
  return async (cityId: string) => {
    // Mock implementation
    console.log('Refreshing weather for city:', cityId)
  }
}

