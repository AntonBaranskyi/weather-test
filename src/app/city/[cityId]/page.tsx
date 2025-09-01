'use client';

import { useParams } from 'next/navigation';
import styles from '@/app/styles/components/city-details.module.scss';
import { LoadingSpinner } from '@/app/(main)/components';
import { useCityDetailsTanStack } from '@/app/(main)/components/hooks/useCityDetailsTanStack';
import { 
  CityHeader, 
  CurrentWeatherCard, 
  HourlyForecastCard, 
  ErrorContainer,
  TemperatureChart,
  ChartErrorBoundary
} from './components';

export default function CityPage() {
  const params = useParams();
  const cityId = params.cityId as string;

  const {
    city,
    detailedWeatherData,
    isLoading,
    refreshing,
    error,
    handleRefresh,
  } = useCityDetailsTanStack(cityId);


  if (isLoading) {
    return (
     <LoadingSpinner text='Завантаження...' />
    );
  }

  if (error) {
    return (
      <ErrorContainer 
        title="Помилка" 
        message={error} 
      />
    );
  }

  if (!detailedWeatherData || !city) {
    return (
      <ErrorContainer 
        title="Дані не знайдено" 
      />
    );
  }

  const { currentWeather, hourlyForecast } = detailedWeatherData;


  return (
    <div className={styles.container}>
      <CityHeader
        city={city}
        lastUpdated={detailedWeatherData.lastUpdated}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      <main className={styles.main}>
        <CurrentWeatherCard currentWeather={currentWeather} />

        {hourlyForecast && hourlyForecast.list.length > 0 && (
          <ChartErrorBoundary>
            <TemperatureChart 
              hourlyForecast={hourlyForecast}
              cityName={`${city.name}, ${city.country}`}
            />
          </ChartErrorBoundary>
        )}

        {hourlyForecast && hourlyForecast.list.length > 0 && (
          <HourlyForecastCard hourlyForecast={hourlyForecast} />
        )}
      </main>
    </div>
  );
}
