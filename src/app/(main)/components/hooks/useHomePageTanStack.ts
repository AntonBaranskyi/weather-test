'use client';

import { useCallback, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCities, useErrorStates } from '@/store/weather.hooks';
import { useSearchCity, useRefreshCityWeather } from '@/shared/hooks/queries';
import { useQueries } from '@tanstack/react-query';
import { weatherService } from '@/service';
import { WEATHER_QUERY_KEYS } from '@/shared/constants/query-keys.constants';

export const useHomePageTanStack = () => {
  const router = useRouter();
  const [searchingCity, setSearchingCity] = useState(false);
  
  const { cities, addCity, removeCity } = useCities();
  const { clearErrors } = useErrorStates();

  const searchCityMutation = useSearchCity();
  const refreshCityWeather = useRefreshCityWeather();



  const handleAddCity = useCallback(async (cityName: string) => {
    if (searchingCity || !cityName.trim()) return;

    try {
      setSearchingCity(true);
      clearErrors();

      const newCity = await searchCityMutation.mutateAsync(cityName);
      
      addCity(newCity);
      
    } catch (error) {
      console.error('Error adding city:', error);
    } finally {
      setSearchingCity(false);
    }
  }, [searchingCity, searchCityMutation, addCity, clearErrors]);


  const handleClearError = useCallback(() => {
    clearErrors();
  }, [clearErrors]);

 

  const generalError = typeof window === 'undefined' ? null : (searchCityMutation.error?.message || null);

  return {
    cities,
    searchingCity,
    
    error: generalError,
    
    handleAddCity,

    handleClearError,
    
  };
};
