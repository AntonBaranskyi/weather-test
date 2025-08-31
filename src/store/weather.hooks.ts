import { useCallback } from 'react';
import { useWeatherStore } from './weather.store';
import { weatherService } from '@/service';
import { SavedCity } from '@/service/weather.types';

export const useCities = () => {
  const cities = useWeatherStore(state => state.cities);
  const addCity = useWeatherStore(state => state.addCity);
  const removeCity = useWeatherStore(state => state.removeCity);
  const isCitySaved = useWeatherStore(state => state.isCitySaved);
  const getCityById = useWeatherStore(state => state.getCityById);

  return {
    cities,
    addCity,
    removeCity,
    isCitySaved,
    getCityById
  };
};

export const useWeatherData = () => {
  const weatherData = useWeatherStore(state => state.weatherData);
  const setWeatherData = useWeatherStore(state => state.setWeatherData);
  const getWeatherData = useWeatherStore(state => state.getWeatherData);
  const removeWeatherData = useWeatherStore(state => state.removeWeatherData);

  return {
    weatherData,
    setWeatherData,
    getWeatherData,
    removeWeatherData
  };
};


export const useLoadingStates = () => {
  const loadingCities = useWeatherStore(state => state.loadingCities);
  const setCityLoading = useWeatherStore(state => state.setCityLoading);
  const isCityLoading = useWeatherStore(state => state.isCityLoading);

  return {
    loadingCities,
    setCityLoading,
    isCityLoading
  };
};

export const useErrorStates = () => {
  const error = useWeatherStore(state => state.error);
  const cityErrors = useWeatherStore(state => state.cityErrors);
  const setCityError = useWeatherStore(state => state.setCityError);
  const getCityError = useWeatherStore(state => state.getCityError);
  const clearErrors = useWeatherStore(state => state.clearErrors);

  return {
    error,
    cityErrors,
    setCityError,
    getCityError,
    clearErrors
  };
};

export const useWeatherActions = () => {
  const { cities, addCity, removeCity, getCityById } = useCities();
  const { setWeatherData, getWeatherData, removeWeatherData } = useWeatherData();
  const { setCityLoading, isCityLoading } = useLoadingStates();
  const { setCityError, getCityError } = useErrorStates();
  const initializeStore = useWeatherStore(state => state.initializeStore);

  const addCityWithWeather = useCallback(async (cityName: string) => {
    try {
      setCityLoading('search', true);
      setCityError('search', null);

      const newCity = await weatherService.searchAndCreateCity(cityName);
      
      const existingCity = getCityById(newCity.id);
      if (existingCity) {
        throw new Error('Це місто вже додано до списку');
      }

      addCity(newCity);

      await loadWeatherForCity(newCity.id);

      return newCity;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка додавання міста';
      setCityError('search', errorMessage);
      throw error;
    } finally {
      setCityLoading('search', false);
    }
  }, [addCity, getCityById, setCityLoading, setCityError]);


  const loadWeatherForCity = useCallback(async (cityId: string) => {
    try {
      setCityLoading(cityId, true);
      setCityError(cityId, null);

      const city = getCityById(cityId);
      if (!city) {
        throw new Error('Місто не знайдено');
      }

      const weatherData = await weatherService.getCityWeatherData(city);
      setWeatherData(cityId, weatherData);

      return weatherData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка завантаження погоди';
      setCityError(cityId, errorMessage);
      throw error;
    } finally {
      setCityLoading(cityId, false);
    }
  }, [getCityById, setWeatherData, setCityLoading, setCityError]);


  const refreshCityWeather = useCallback(async (cityId: string) => {
    await loadWeatherForCity(cityId);
  }, [loadWeatherForCity]);

  return {
    cities,
    getWeatherData,
    isCityLoading,
    getCityError,
    
    addCityWithWeather,
    loadWeatherForCity,
    refreshCityWeather,
    initializeStore
  };
};


