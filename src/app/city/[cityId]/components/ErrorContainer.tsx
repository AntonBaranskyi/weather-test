'use client';

import styles from '@/app/styles/components/city-details.module.scss';
import { useCityDetailHeader } from '../hooks/city-detail-header';

interface ErrorContainerProps {
  title: string;
  message?: string;
}

export default function ErrorContainer({ title, message }: ErrorContainerProps) {
  const { handleGoBack } = useCityDetailHeader();
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>{title}</h1>
        {message && <p className={styles.errorMessage}>{message}</p>}
        <button onClick={handleGoBack} className={styles.errorButton}>
          Повернутися на головну
        </button>
      </div>
    </div>
  );
}
