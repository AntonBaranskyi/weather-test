import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CityCard from '../CityCard'
import { SavedCity, CityWeatherData } from '@/service/weather.types'

jest.mock('../hooks/use-city-card', () => ({
  useCityCard: jest.fn(),
}))

jest.mock('../hooks/use-city-weather', () => ({
  useCityWeather: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

const mockUseCityCard = require('../hooks/use-city-card').useCityCard
const mockUseCityWeather = require('../hooks/use-city-weather').useCityWeather

describe('CityCard', () => {
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

  const mockHandlers = {
    handleRefreshCity: jest.fn(),
    handleRemoveCity: jest.fn(),
    handleCityClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCityCard.mockReturnValue(mockHandlers)
    mockUseCityWeather.mockReturnValue({
      data: null,
      isLoading: false,
    })
  })

  it('renders city information correctly', () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByText('Київ')).toBeInTheDocument()
    expect(screen.getByText('Україна')).toBeInTheDocument()
  })

  it('renders loading state when weather data is loading', () => {
    mockUseCityWeather.mockReturnValue({
      data: null,
      isLoading: true,
    })

    render(<CityCard city={mockCity} />)

    expect(screen.getByTestId('mini-spinner')).toBeInTheDocument()
  })

  it('renders weather data when available', () => {
    mockUseCityWeather.mockReturnValue({
      data: mockWeatherData,
      isLoading: false,
    })

    render(<CityCard city={mockCity} />)

    expect(screen.getByText('20°C')).toBeInTheDocument()
    expect(screen.getByText('ясно')).toBeInTheDocument()
    expect(screen.getByText('18°C')).toBeInTheDocument()
    expect(screen.getByText('65%')).toBeInTheDocument()
    expect(screen.getByText('5 м/с')).toBeInTheDocument()
    expect(screen.getByText('1013 гПа')).toBeInTheDocument()
  })

  it('renders no data message when weather data is not available', () => {
    mockUseCityWeather.mockReturnValue({
      data: null,
      isLoading: false,
    })

    render(<CityCard city={mockCity} />)

    expect(screen.getByText('Немає даних про погоду')).toBeInTheDocument()
  })

  it('handles city click correctly', async () => {
    const user = userEvent.setup()
    render(<CityCard city={mockCity} />)

    const card = screen.getByText('Київ').closest('div')
    await user.click(card!)

    expect(mockHandlers.handleCityClick).toHaveBeenCalled()
  })

  it('handles refresh button click correctly', async () => {
    const user = userEvent.setup()
    mockUseCityWeather.mockReturnValue({
      data: mockWeatherData,
      isLoading: false,
    })

    render(<CityCard city={mockCity} />)

    const refreshButton = screen.getByTitle('Оновити погоду')
    await user.click(refreshButton)

    expect(mockHandlers.handleRefreshCity).toHaveBeenCalled()
  })

  it('handles remove button click correctly', async () => {
    const user = userEvent.setup()
    render(<CityCard city={mockCity} />)

    const removeButton = screen.getByTitle('Видалити місто')
    await user.click(removeButton)

    expect(mockHandlers.handleRemoveCity).toHaveBeenCalled()
  })

  it('disables refresh button when loading', () => {
    mockUseCityWeather.mockReturnValue({
      data: null,
      isLoading: true,
    })

    render(<CityCard city={mockCity} />)

    const refreshButton = screen.getByTitle('Оновити погоду')
    expect(refreshButton).toBeDisabled()
  })

  it('shows spinning icon when loading', () => {
    mockUseCityWeather.mockReturnValue({
      data: null,
      isLoading: true,
    })

    render(<CityCard city={mockCity} />)

    const refreshButton = screen.getByTitle('Оновити погоду')
    const icon = refreshButton.querySelector('svg')
    expect(icon).toHaveClass('iconSpin')
  })

  it('displays weather icon correctly', () => {
    mockUseCityWeather.mockReturnValue({
      data: mockWeatherData,
      isLoading: false,
    })

    render(<CityCard city={mockCity} />)

    const weatherIcon = screen.getByAltText('ясно')
    expect(weatherIcon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/01d@2x.png')
  })

  it('handles missing weather description gracefully', () => {
    const weatherDataWithoutDescription = {
      ...mockWeatherData,
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: undefined,
          icon: '01d',
        },
      ],
    }

    mockUseCityWeather.mockReturnValue({
      data: weatherDataWithoutDescription,
      isLoading: false,
    })

    render(<CityCard city={mockCity} />)

    expect(screen.getByText('Невідомо')).toBeInTheDocument()
  })

  it('handles missing weather icon gracefully', () => {
    const weatherDataWithoutIcon = {
      ...mockWeatherData,
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'ясно',
          icon: undefined,
        },
      ],
    }

    mockUseCityWeather.mockReturnValue({
      data: weatherDataWithoutIcon,
      isLoading: false,
    })

    render(<CityCard city={mockCity} />)

    const weatherIcon = screen.getByAltText('ясно')
    expect(weatherIcon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/01d@2x.png')
  })

  it('rounds temperature values correctly', () => {
    const weatherDataWithDecimals = {
      ...mockWeatherData,
      main: {
        ...mockWeatherData.main,
        temp: 20.7,
        feels_like: 18.3,
      },
    }

    mockUseCityWeather.mockReturnValue({
      data: weatherDataWithDecimals,
      isLoading: false,
    })

    render(<CityCard city={mockCity} />)

    expect(screen.getByText('21°C')).toBeInTheDocument()
    expect(screen.getByText('18°C')).toBeInTheDocument()
  })

  it('handles missing weather data gracefully', () => {
    const incompleteWeatherData = {
      main: {
        temp: undefined,
        feels_like: undefined,
        humidity: undefined,
        pressure: undefined,
      },
      weather: [],
      wind: undefined,
      dt: 1704110400,
    }

    mockUseCityWeather.mockReturnValue({
      data: incompleteWeatherData,
      isLoading: false,
    })

    render(<CityCard city={mockCity} />)

    expect(screen.getAllByText('0°C')).toHaveLength(2)
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('0 м/с')).toBeInTheDocument()
    expect(screen.getByText('0 гПа')).toBeInTheDocument()
  })

  it('prevents event propagation on button clicks', async () => {
    const user = userEvent.setup()
    render(<CityCard city={mockCity} />)

    const refreshButton = screen.getByTitle('Оновити погоду')
    const removeButton = screen.getByTitle('Видалити місто')

    await user.click(refreshButton)
    await user.click(removeButton)

    expect(mockHandlers.handleRefreshCity).toHaveBeenCalled()
    expect(mockHandlers.handleRemoveCity).toHaveBeenCalled()
  })
})
