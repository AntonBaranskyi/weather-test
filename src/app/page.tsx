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
    const sharePage =`${window.location.origin}/share/57e7eb89-d108-4393-92d5-abd5806ac553-1761166009582`;

      const shareUrl =`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePage)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
     
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
