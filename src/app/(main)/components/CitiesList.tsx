import { SavedCity, CityWeatherData } from '@/service/weather.types';
import CityCard from './CityCard';
import EmptyState from './EmptyState';
import styles from '../../styles/components/home.module.scss';

interface CitiesListProps {
  cities: SavedCity[];
}

export default function CitiesList({
  cities,

}: CitiesListProps) {
  if (cities.length === 0) {
    return (
      <EmptyState
        icon="🌤️"
        title="Ще немає збережених міст"
        description="Додайте своє перше місто, щоб почати відстежувати погоду"
      />
    );
  }

  return (
    <div className={styles.citiesGrid}>
      {cities.map((city) => {

        return (
          <CityCard
            key={city.id}
            city={city}
          />
        );
      })}
    </div>
  );
}
