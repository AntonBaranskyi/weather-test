'use client';

import {
  LoadingSpinner,
  PageHeader,
  AddCityForm,
  CitiesList
} from './(main)/components';
import { useHomePageTanStack } from './(main)/components/hooks/useHomePageTanStack';
import styles from './styles/components/home.module.scss';

export default function Home() {
  const {
    cities,
    searchingCity,
    error,
    handleAddCity,
  } = useHomePageTanStack();

  return (
    <div className={styles.container}>
      <PageHeader 
        title="Погода у ваших містах"
        subtitle="Додайте міста та слідкуйте за погодою"
      />

      <main className={styles.main}>
        <AddCityForm
          onAddCity={handleAddCity}
          isLoading={searchingCity}
          error={error}
        />

        <CitiesList
          cities={cities}
        />
      </main>
    </div>
  );
}
