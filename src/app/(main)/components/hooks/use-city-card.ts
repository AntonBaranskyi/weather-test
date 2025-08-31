import { useRefreshCityWeather } from '@/shared/hooks';
import { useCities } from '@/store/weather.hooks';
import { useRouter } from 'next/navigation';

export const useCityCard = (cityId: string) => {
  const refreshCityWeather = useRefreshCityWeather();
  const { removeCity } = useCities();

  const router = useRouter();
  const handleCityClick = () => {
    router.push(`/city/${cityId}`);
  };

  const handleRefreshCity = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await refreshCityWeather(cityId);
  };

  const handleRemoveCity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeCity(cityId);
  };

  return {
    handleCityClick,
    handleRefreshCity,
    handleRemoveCity,
  };
};
