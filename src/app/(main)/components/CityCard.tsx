'use client';

import { SavedCity } from '@/service';
import { useCityCard } from './hooks/use-city-card';
import { useCityWeather } from './hooks/use-city-weather';
import MiniSpinner from './MiniSpinner';

import cardStyles from '../../styles/components/city-card.module.scss';
import SafeTimeDisplay from './SafeTimeDisplay';


interface CityCardProps {
  city: SavedCity;
}

export default function CityCard({
  city,
  
}: CityCardProps) {
  const { data: weatherData, isLoading: isLoadingWeather, dataUpdatedAt } = useCityWeather(city);

  const { handleRefreshCity, handleRemoveCity, handleCityClick } = useCityCard(city.id);

  return (
    <div className={cardStyles.cityCard} onClick={handleCityClick}>
      <div className={cardStyles.cardContent}>
        <div className={cardStyles.cardHeader}>
          <div className={cardStyles.cityInfo}>
            <h3 className={cardStyles.cityName}>{city.name}</h3>
            <p className={cardStyles.cityCountry}>{city.country}</p>
          </div>
          
          <div className={cardStyles.cardActions}>
            <button
              onClick={handleRefreshCity}
              disabled={isLoadingWeather}
              className={`${cardStyles.actionButton} ${cardStyles.refreshButton}`}
              title="Оновити погоду"
            >
              <svg 
                className={`${cardStyles.icon} ${isLoadingWeather ? cardStyles.iconSpin : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <button
              onClick={handleRemoveCity}
              className={`${cardStyles.actionButton} ${cardStyles.deleteButton}`}
              title="Видалити місто"
            >
              <svg className={cardStyles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className={cardStyles.weatherContent}>
          {isLoadingWeather ? (
            <div className={cardStyles.loadingContainer}>
              <MiniSpinner size="medium" />
            </div>
          )    : weatherData ? (
            <div className={cardStyles.weatherData}>
              <div className={cardStyles.temperatureSection}>
                <div className={cardStyles.weatherIcon}>
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0]?.icon || '01d'}@2x.png`}
                    alt={weatherData.weather[0]?.description || 'Погода'}
                    className={cardStyles.icon}
                  />
                  <div className={cardStyles.tempInfo}>
                    <div className={cardStyles.temperature}>
                      {Math.round(weatherData.main.temp || 0)}°C
                    </div>
                    <div className={cardStyles.description}>
                      {weatherData.weather[0]?.description || 'Невідомо'}
                    </div>
                  </div>
                </div>
              </div>

              <div className={cardStyles.weatherDetails}>
                <div className={cardStyles.detailItem}>
                  <span className={cardStyles.label}>Відчувається:</span>
                  <div className={cardStyles.value}>{Math.round(weatherData.main.feels_like || 0)}°C</div>
                </div>
                <div className={cardStyles.detailItem}>
                  <span className={cardStyles.label}>Вологість:</span>
                  <div className={cardStyles.value}>{weatherData.main.humidity || 0}%</div>
                </div>
                <div className={cardStyles.detailItem}>
                  <span className={cardStyles.label}>Вітер:</span>
                  <div className={cardStyles.value}>{weatherData.wind?.speed || 0} м/с</div>
                </div>
                <div className={cardStyles.detailItem}>
                  <span className={cardStyles.label}>Тиск:</span>
                  <div className={cardStyles.value}>{weatherData.main.pressure || 0} гПа</div>
                </div>
              </div>

              <div className={cardStyles.lastUpdated}>
                <div className={cardStyles.updateTime}>
                  <SafeTimeDisplay
                    timestamp={dataUpdatedAt || Date.now()}
                    format="datetime"
                    prefix="Останнє оновлення: "
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={cardStyles.noDataContainer}>
              <p className={cardStyles.noDataMessage}>Немає даних про погоду</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
