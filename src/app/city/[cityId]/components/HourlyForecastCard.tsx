'use client';

import SafeTimeDisplay from '@/app/(main)/components/SafeTimeDisplay';
import styles from '@/app/styles/components/city-details.module.scss';

interface HourlyForecastCardProps {
  hourlyForecast: {
    list: Array<{
      dt: number;
      main: {
        temp: number;
      };
      weather: Array<{
        description: string;
        icon: string;
      }>;
      pop: number;
    }>;
  };
}

export default function HourlyForecastCard({ hourlyForecast }: HourlyForecastCardProps) {
  return (
    <div className={styles.forecastCard}>
      <h2 className={styles.cardTitle}>Погодинний прогноз на сьогодні</h2>
      
      <div className={styles.forecastGrid}>
        {hourlyForecast.list.slice(0, 8).map((item, index) => (
          <div key={index} className={styles.forecastItem}>
            <div className={styles.time}>
              <SafeTimeDisplay
                timestamp={item.dt * 1000}
                format="time"
              />
            </div>
            
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
              className={styles.icon}
            />
            
            <div className={styles.temp}>
              {Math.round(item.main.temp)}°C
            </div>
            
            <div className={styles.description}>
              {item.weather[0].description}
            </div>
            
            {item.pop > 0 && (
              <div className={styles.precipitation}>
                {Math.round(item.pop * 100)}% дощ
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
