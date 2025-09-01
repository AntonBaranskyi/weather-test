import { render, screen } from '@testing-library/react'
import CitiesList from '../CitiesList'
import { SavedCity } from '@/service/weather.types'

jest.mock('../CityCard', () => {
  return function MockCityCard({ city }: { city: SavedCity }) {
    return <div data-testid={`city-card-${city.id}`}>{city.name}</div>
  }
})

jest.mock('../EmptyState', () => {
  return function MockEmptyState({ title, description }: { title: string; description: string }) {
    return (
      <div data-testid="empty-state">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    )
  }
})

describe('CitiesList', () => {
  const mockCities: SavedCity[] = [
    {
      id: '1',
      name: 'Київ',
      country: 'Україна',
      lat: 50.4501,
      lon: 30.5234,
      addedAt: new Date('2024-01-01T12:00:00Z').toISOString(),
    },
    {
      id: '2',
      name: 'Львів',
      country: 'Україна',
      lat: 49.8397,
      lon: 24.0297,
      addedAt: new Date('2024-01-01T13:00:00Z').toISOString(),
    },
  ]

  it('renders empty state when no cities are provided', () => {
    render(<CitiesList cities={[]} />)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('Ще немає збережених міст')).toBeInTheDocument()
    expect(screen.getByText('Додайте своє перше місто, щоб почати відстежувати погоду')).toBeInTheDocument()
  })

  it('renders city cards when cities are provided', () => {
    render(<CitiesList cities={mockCities} />)

    expect(screen.getByTestId('city-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('city-card-2')).toBeInTheDocument()
    expect(screen.getByText('Київ')).toBeInTheDocument()
    expect(screen.getByText('Львів')).toBeInTheDocument()
  })

  it('does not render empty state when cities are provided', () => {
    render(<CitiesList cities={mockCities} />)

    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
  })

  it('renders correct number of city cards', () => {
    render(<CitiesList cities={mockCities} />)

    const cityCards = screen.getAllByTestId(/city-card-/)
    expect(cityCards).toHaveLength(2)
  })

  it('passes correct props to CityCard components', () => {
    render(<CitiesList cities={mockCities} />)

    const cityCards = screen.getAllByTestId(/city-card-/)
    expect(cityCards[0]).toHaveTextContent('Київ')
    expect(cityCards[1]).toHaveTextContent('Львів')
  })

  it('renders single city correctly', () => {
    const singleCity = [mockCities[0]]
    render(<CitiesList cities={singleCity} />)

    expect(screen.getByTestId('city-card-1')).toBeInTheDocument()
    expect(screen.getByText('Київ')).toBeInTheDocument()
    expect(screen.queryByTestId('city-card-2')).not.toBeInTheDocument()
  })

  it('handles cities with special characters in names', () => {
    const citiesWithSpecialChars: SavedCity[] = [
      {
        id: '3',
        name: 'Нью-Йорк',
        country: 'США',
        lat: 40.7128,
        lon: -74.0060,
        addedAt: new Date('2024-01-01T14:00:00Z').toISOString(),
      },
    ]

    render(<CitiesList cities={citiesWithSpecialChars} />)

    expect(screen.getByTestId('city-card-3')).toBeInTheDocument()
    expect(screen.getByText('Нью-Йорк')).toBeInTheDocument()
  })
})
