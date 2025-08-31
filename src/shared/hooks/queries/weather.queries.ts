'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weatherService } from '@/service';
import { 
  SavedCity, 
  CityWeatherData, 
  DetailedWeatherData,
} from '@/service/weather.types';
import { WEATHER_QUERY_KEYS } from '@/shared/constants/query-keys.constants';


export const useCurrentWeather = (city: SavedCity, enabled: boolean = true) => {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.currentWeather(city.id),
    queryFn: () => weatherService.getCurrentWeatherByCoordinates(city.coordinates.lat, city.coordinates.lon),
    enabled: enabled && !!city.id,
 
  });
};


export const useHourlyForecast = (city: SavedCity, enabled: boolean = true) => {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.hourlyForecast(city.id),
    queryFn: () => weatherService.getTodayHourlyForecast(city.coordinates.lat, city.coordinates.lon),
    enabled: enabled && !!city.id,
   
  });
};


export const useDetailedWeather = (city: SavedCity, enabled: boolean = true) => {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.detailedWeather(city.id),
    queryFn: async (): Promise<DetailedWeatherData> => {
      const [currentWeather, hourlyForecast] = await Promise.all([
        weatherService.getCurrentWeatherByCoordinates(city.coordinates.lat, city.coordinates.lon),
        weatherService.getTodayHourlyForecast(city.coordinates.lat, city.coordinates.lon)
      ]);

      return {
        city,
        currentWeather,
        hourlyForecast,
        lastUpdated: Date.now()
      };
    },
    enabled: enabled && !!city.id,
  });
};


export const useCityWeatherData = (city: SavedCity, enabled: boolean = true) => {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.city(city.id),
    queryFn: async (): Promise<CityWeatherData> => {
      const currentWeather = await weatherService.getCurrentWeatherByCoordinates(city.coordinates.lat, city.coordinates.lon);
      
      return {
        city,
        currentWeather,
        lastUpdated: Date.now()
      };
    },
    enabled: enabled && !!city.id,
   
  });
};


export const useSearchCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cityName: string): Promise<SavedCity> => {
      return await weatherService.searchAndCreateCity(cityName);
    },
    onSuccess: (newCity) => {
      queryClient.invalidateQueries({
        queryKey: WEATHER_QUERY_KEYS.all
      });
      
      queryClient.prefetchQuery({
        queryKey: WEATHER_QUERY_KEYS.city(newCity.id),
        queryFn: () => weatherService.getCurrentWeatherByCoordinates(newCity.coordinates.lat, newCity.coordinates.lon),
        
      });
    },
    retry: 1,
  });
};


export const useInvalidateCityWeather = () => {
  const queryClient = useQueryClient();

  return (cityId: string) => {
    queryClient.invalidateQueries({
      queryKey: WEATHER_QUERY_KEYS.city(cityId)
    });
  };
};


export const useRefreshCityWeather = () => {
  const queryClient = useQueryClient();

  return (cityId: string) => {
    return queryClient.refetchQueries({
      queryKey: WEATHER_QUERY_KEYS.city(cityId)
    });
  };
};
