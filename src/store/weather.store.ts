import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SavedCity, CityWeatherData } from "@/service/weather.types";

interface WeatherStore {
  cities: SavedCity[];
  weatherData: Map<string, CityWeatherData>;
  
  loadingCities: Set<string>;
  
  error: string | null;
  cityErrors: Map<string, string>;
  
  addCity: (city: SavedCity) => void;
  removeCity: (cityId: string) => void;
  isCitySaved: (cityId: string) => boolean;
  getCityById: (cityId: string) => SavedCity | undefined;
  
  setWeatherData: (cityId: string, data: CityWeatherData) => void;
  getWeatherData: (cityId: string) => CityWeatherData | undefined;
  removeWeatherData: (cityId: string) => void;
  
  setCityLoading: (cityId: string, loading: boolean) => void;
  isCityLoading: (cityId: string) => boolean;
  
  setCityError: (cityId: string, error: string | null) => void;
  getCityError: (cityId: string) => string | null;
  clearErrors: () => void;
  
  initializeStore: () => void;
}



export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      cities: [],
      weatherData: new Map(),
      loadingCities: new Set(),
      error: null,
      cityErrors: new Map(),

      addCity: (city: SavedCity) => set((state) => {
        const existingIndex = state.cities.findIndex(c => c.id === city.id);
        if (existingIndex !== -1) {
          const updatedCities = [...state.cities];
          updatedCities[existingIndex] = city;
          return { cities: updatedCities };
        } else {
          return { cities: [...state.cities, city] };
        }
      }),

      removeCity: (cityId: string) => set((state) => ({
        cities: state.cities.filter(city => city.id !== cityId),
        weatherData: new Map([...state.weatherData].filter(([id]) => id !== cityId)),
        loadingCities: new Set([...state.loadingCities].filter(id => id !== cityId)),
        cityErrors: new Map([...state.cityErrors].filter(([id]) => id !== cityId))
      })),



      isCitySaved: (cityId: string) => {
        return get().cities.some(city => city.id === cityId);
      },

      getCityById: (cityId: string) => {
        return get().cities.find(city => city.id === cityId);
      },

      setWeatherData: (cityId: string, data: CityWeatherData) => set((state) => {
        const newWeatherData = new Map(state.weatherData);
        newWeatherData.set(cityId, data);
        return { weatherData: newWeatherData };
      }),

      getWeatherData: (cityId: string) => {
        return get().weatherData.get(cityId);
      },

      removeWeatherData: (cityId: string) => set((state) => {
        const newWeatherData = new Map(state.weatherData);
        newWeatherData.delete(cityId);
        return { weatherData: newWeatherData };
      }),


      setCityLoading: (cityId: string, loading: boolean) => set((state) => {
        const newLoadingCities = new Set(state.loadingCities);
        if (loading) {
          newLoadingCities.add(cityId);
        } else {
          newLoadingCities.delete(cityId);
        }
        return { loadingCities: newLoadingCities };
      }),

      isCityLoading: (cityId: string) => {
        return get().loadingCities.has(cityId);
      },

      setCityError: (cityId: string, error: string | null) => set((state) => {
        const newCityErrors = new Map(state.cityErrors);
        if (error) {
          newCityErrors.set(cityId, error);
        } else {
          newCityErrors.delete(cityId);
        }
        return { cityErrors: newCityErrors };
      }),

      getCityError: (cityId: string) => {
        return get().cityErrors.get(cityId) || null;
      },

      clearErrors: () => set({ error: null, cityErrors: new Map() }),

      initializeStore: () => {
        // Тимчасово очищуємо localStorage від старих даних з Map serialization
        if (typeof window !== 'undefined') {
          const currentVersion = localStorage.getItem('weather-store-version');
          if (!currentVersion || currentVersion !== '1.0') {
            localStorage.removeItem('weather-store');
            localStorage.setItem('weather-store-version', '1.0');
          }
        }
      }
    }),
    {
      name: 'weather-store',
      storage: createJSONStorage(() => localStorage),
      
      partialize: (state) => ({
        cities: state.cities,
      }),
    }
  )
);