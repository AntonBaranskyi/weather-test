import { useQueryClient } from '@tanstack/react-query';
import { WEATHER_QUERY_KEYS } from '../constants/query-keys.constants';

export * from './queries';

export * from '../../store/weather.hooks';

export const useRefreshCityWeather = (cityId: string) => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: [WEATHER_QUERY_KEYS.city(cityId)] });
  }
}

