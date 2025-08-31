'use client';

import SafeTimeDisplay from '@/app/(main)/components/SafeTimeDisplay';
import styles from '@/app/styles/components/city-details.module.scss';

interface CityHeaderProps {
  city: {
    name: string;
    country: string;
  };
  lastUpdated: number;
  onGoBack: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function CityHeader({ 
  city, 
  lastUpdated, 
  onGoBack, 
  onRefresh, 
  refreshing 
}: CityHeaderProps) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.nav}>
            <button onClick={onGoBack} className={styles.backButton}>
              <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className={styles.backText}>Назад до списку</span>
            </button>
            
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className={styles.refreshButton}
            >
              <svg 
                className={`${styles.refreshIcon} ${refreshing ? styles.iconSpin : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Оновлення...' : 'Оновити'}
            </button>
          </div>
        </div>
      </header>

      <div className={styles.cityHeader}>
        <h1 className={styles.cityTitle}>
          {city.name}, {city.country}
        </h1>
        <p className={styles.lastUpdated}>
          <SafeTimeDisplay
            timestamp={lastUpdated}
            format="datetime"
            prefix="Останнє оновлення: "
          />
        </p>
      </div>
    </>
  );
}
