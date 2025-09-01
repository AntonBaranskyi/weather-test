import { renderHook, act } from '@testing-library/react'
import { useWeatherStore } from '../weather.store'
import { SavedCity, CityWeatherData } from '@/service/weather.types'

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

describe('weather.store', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset store to initial state
    act(() => {
      useWeatherStore.getState().initializeStore()
    })
  })

  const mockCity: SavedCity = {
    id: '1',
    name: 'Київ',
    country: 'Україна',
    lat: 50.4501,
    lon: 30.5234,
    addedAt: new Date('2024-01-01T12:00:00Z').toISOString(),
  }

  const mockWeatherData: CityWeatherData = {
    main: {
      temp: 20,
      feels_like: 18,
      humidity: 65,
      pressure: 1013,
    },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'ясно',
        icon: '01d',
      },
    ],
    wind: {
      speed: 5,
      deg: 180,
    },
    dt: 1704110400,
  }

  describe('cities management', () => {
    it('adds a new city correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.addCity(mockCity)
      })

      expect(result.current.cities).toHaveLength(1)
      expect(result.current.cities[0]).toEqual(mockCity)
    })

    it('updates existing city when adding city with same ID', () => {
      const { result } = renderHook(() => useWeatherStore())
      const updatedCity = { ...mockCity, name: 'Київ оновлений' }

      act(() => {
        result.current.addCity(mockCity)
        result.current.addCity(updatedCity)
      })

      expect(result.current.cities).toHaveLength(1)
      expect(result.current.cities[0]).toEqual(updatedCity)
    })

    it('removes city correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.addCity(mockCity)
        result.current.removeCity(mockCity.id)
      })

      expect(result.current.cities).toHaveLength(0)
    })

    it('checks if city is saved correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.addCity(mockCity)
      })

      expect(result.current.isCitySaved(mockCity.id)).toBe(true)
      expect(result.current.isCitySaved('non-existent')).toBe(false)
    })

    it('gets city by ID correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.addCity(mockCity)
      })

      expect(result.current.getCityById(mockCity.id)).toEqual(mockCity)
      expect(result.current.getCityById('non-existent')).toBeUndefined()
    })
  })

  describe('weather data management', () => {
    it('sets weather data correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setWeatherData(mockCity.id, mockWeatherData)
      })

      expect(result.current.getWeatherData(mockCity.id)).toEqual(mockWeatherData)
    })

    it('gets weather data correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setWeatherData(mockCity.id, mockWeatherData)
      })

      expect(result.current.getWeatherData(mockCity.id)).toEqual(mockWeatherData)
      expect(result.current.getWeatherData('non-existent')).toBeUndefined()
    })

    it('removes weather data correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setWeatherData(mockCity.id, mockWeatherData)
        result.current.removeWeatherData(mockCity.id)
      })

      expect(result.current.getWeatherData(mockCity.id)).toBeUndefined()
    })
  })

  describe('loading state management', () => {
    it('sets city loading state correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setCityLoading(mockCity.id, true)
      })

      expect(result.current.isCityLoading(mockCity.id)).toBe(true)

      act(() => {
        result.current.setCityLoading(mockCity.id, false)
      })

      expect(result.current.isCityLoading(mockCity.id)).toBe(false)
    })

    it('checks city loading state correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      expect(result.current.isCityLoading(mockCity.id)).toBe(false)

      act(() => {
        result.current.setCityLoading(mockCity.id, true)
      })

      expect(result.current.isCityLoading(mockCity.id)).toBe(true)
    })
  })

  describe('error management', () => {
    it('sets city error correctly', () => {
      const { result } = renderHook(() => useWeatherStore())
      const errorMessage = 'Помилка завантаження'

      act(() => {
        result.current.setCityError(mockCity.id, errorMessage)
      })

      expect(result.current.getCityError(mockCity.id)).toBe(errorMessage)
    })

    it('gets city error correctly', () => {
      const { result } = renderHook(() => useWeatherStore())
      const errorMessage = 'Помилка завантаження'

      act(() => {
        result.current.setCityError(mockCity.id, errorMessage)
      })

      expect(result.current.getCityError(mockCity.id)).toBe(errorMessage)
      expect(result.current.getCityError('non-existent')).toBeNull()
    })

    it('clears city error correctly', () => {
      const { result } = renderHook(() => useWeatherStore())
      const errorMessage = 'Помилка завантаження'

      act(() => {
        result.current.setCityError(mockCity.id, errorMessage)
        result.current.setCityError(mockCity.id, null)
      })

      expect(result.current.getCityError(mockCity.id)).toBeNull()
    })

    it('clears all errors correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setCityError(mockCity.id, 'Error 1')
        result.current.setCityError('city2', 'Error 2')
        result.current.clearErrors()
      })

      expect(result.current.getCityError(mockCity.id)).toBeNull()
      expect(result.current.getCityError('city2')).toBeNull()
    })
  })

  describe('removeCity cleanup', () => {
    it('removes all related data when removing city', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.addCity(mockCity)
        result.current.setWeatherData(mockCity.id, mockWeatherData)
        result.current.setCityLoading(mockCity.id, true)
        result.current.setCityError(mockCity.id, 'Error')
        result.current.removeCity(mockCity.id)
      })

      expect(result.current.cities).toHaveLength(0)
      expect(result.current.getWeatherData(mockCity.id)).toBeUndefined()
      expect(result.current.isCityLoading(mockCity.id)).toBe(false)
      expect(result.current.getCityError(mockCity.id)).toBeNull()
    })
  })

  describe('initializeStore', () => {
    it('initializes store correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.initializeStore()
      })

      expect(result.current.cities).toEqual([])
    })
  })

  describe('multiple cities management', () => {
    it('manages multiple cities correctly', () => {
      const { result } = renderHook(() => useWeatherStore())
      const city2: SavedCity = {
        id: '2',
        name: 'Львів',
        country: 'Україна',
        lat: 49.8397,
        lon: 24.0297,
        addedAt: new Date('2024-01-01T13:00:00Z').toISOString(),
      }

      act(() => {
        result.current.addCity(mockCity)
        result.current.addCity(city2)
      })

      expect(result.current.cities).toHaveLength(2)
      expect(result.current.isCitySaved(mockCity.id)).toBe(true)
      expect(result.current.isCitySaved(city2.id)).toBe(true)

      act(() => {
        result.current.removeCity(mockCity.id)
      })

      expect(result.current.cities).toHaveLength(1)
      expect(result.current.cities[0]).toEqual(city2)
    })
  })
})
