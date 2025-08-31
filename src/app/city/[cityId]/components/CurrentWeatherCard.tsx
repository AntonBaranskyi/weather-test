'use client';

import SafeTimeDisplay from '@/app/(main)/components/SafeTimeDisplay';
import styles from '@/app/styles/components/city-details.module.scss';

interface CurrentWeatherCardProps {
  currentWeather: {
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      description: string;
    }>;
    visibility: number;
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    sys: {
      sunrise: number;
      sunset: number;
    };
  };
}

export default function CurrentWeatherCard({ currentWeather }: CurrentWeatherCardProps) {
  return (
    <div className={styles.currentWeatherCard}>
      <h2 className={styles.cardTitle}>Поточна погода</h2>
      
      <div className={styles.weatherGrid}>
        <div className={styles.temperatureSection}>
          <div className={styles.mainTemp}>
            {Math.round(currentWeather.main.temp)}°C
          </div>
          <div className={styles.description}>
            {currentWeather.weather[0].description}
          </div>
          <div className={styles.feelsLike}>
            Відчувається як {Math.round(currentWeather.main.feels_like)}°C
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Деталі</h3>
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Мін/Макс:</span>
              <span className={styles.value}>{Math.round(currentWeather.main.temp_min)}° / {Math.round(currentWeather.main.temp_max)}°</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Вологість:</span>
              <span className={styles.value}>{currentWeather.main.humidity}%</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Тиск:</span>
              <span className={styles.value}>{currentWeather.main.pressure} гПа</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Видимість:</span>
              <span className={styles.value}>{(currentWeather.visibility / 1000).toFixed(1)} км</span>
            </div>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Вітер</h3>
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Швидкість:</span>
              <span className={styles.value}>{currentWeather.wind.speed} м/с</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Напрямок:</span>
              <span className={styles.value}>{currentWeather.wind.deg}°</span>
            </div>
            {currentWeather.wind.gust && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Пориви:</span>
                <span className={styles.value}>{currentWeather.wind.gust} м/с</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Сонце</h3>
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Схід:</span>
              <span className={styles.value}>
                <SafeTimeDisplay
                  timestamp={currentWeather.sys.sunrise * 1000}
                  format="time"
                />
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Захід:</span>
              <span className={styles.value}>
                <SafeTimeDisplay
                  timestamp={currentWeather.sys.sunset * 1000}
                  format="time"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
