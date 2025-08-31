'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCities } from '@/store/weather.hooks';
import { useDetailedWeather, useRefreshCityWeather } from '@/shared/hooks/queries';

export const useCityDetailsTanStack = (cityId: string) => {
  const router = useRouter();
  
  // Zustand hooks
  const { getCityById } = useCities();
  
  const city = getCityById(cityId);
  const refreshCityWeather = useRefreshCityWeather();

  // TanStack Query для детальних даних
  const {
    data: detailedWeatherData,
    isLoading,
    isRefetching,
    error,
    refetch,
    isFetching
  } = useDetailedWeather(city!, !!city);

  const handleRefresh = useCallback(async () => {
    if (!city) return;

  
      await refetch();
      await refreshCityWeather(cityId);
  }, [city, refetch, refreshCityWeather, cityId]);

  const handleGoBack = () => {
    router.push('/');
  }

  return {
    // Data
    city,
    detailedWeatherData,
    
    // States
    isLoading: isLoading || (!detailedWeatherData && !error && !!city),
    refreshing: isFetching || isRefetching,
    error: error?.message || (!city ? 'Місто не знайдено' : null),
    
    // Actions
    handleRefresh,
    handleGoBack,
    
    // Query utilities
    refetch
  };
};

