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

  const handleClick = ()=>{
      const testImageUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face';
      
      navigator.share({
        title: 'Test Share',
        text: 'Test Share',
        url: testImageUrl,
      });
     
  }

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

      <button onClick={handleClick}>Share</button>
    </div>
  );
}
