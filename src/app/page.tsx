'use client';

import BackToTop from '@/shared/components/back-to-top';
import {
  LoadingSpinner,
  PageHeader,
  AddCityForm,
  CitiesList,
} from './(main)/components';
import { useHomePageTanStack } from './(main)/components/hooks/useHomePageTanStack';
import styles from './styles/components/home.module.scss';
import { useIsMobile } from '@/shared/hooks/use-is-mobile';

export default function Home() {
  const { cities, searchingCity, error, handleAddCity } = useHomePageTanStack();

  const isMobile = useIsMobile();

  return (
    <div className={styles.container}>
      <PageHeader
        title='Погода у ваших містах'
        subtitle='Додайте міста та слідкуйте за погодою'
      />

      <main className={styles.main}>
        <AddCityForm
          onAddCity={handleAddCity}
          isLoading={searchingCity}
          error={error}
        />

        <CitiesList cities={cities} />

        {isMobile && <BackToTop />}
      </main>
    </div>
  );
}
