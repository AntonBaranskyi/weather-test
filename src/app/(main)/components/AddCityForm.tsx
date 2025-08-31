'use client';

import { useState } from 'react';
import styles from '../../styles/components/home.module.scss';

interface AddCityFormProps {
  onAddCity: (cityName: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function AddCityForm({
  onAddCity,
  isLoading,
  error,
}: AddCityFormProps) {
  const [cityName, setCityName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim() || isLoading) return;

    await onAddCity(cityName.trim());
    setCityName('');
  };

  return (
    <div className={styles.addCitySection}>
      <h2 className={styles.sectionTitle}>Додати нове місто</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <input
            type='text'
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder='Назва міста (наприклад: Київ, Львів, Одеса)'
            className={styles.input}
            disabled={isLoading}
          />
        </div>
        <button
          type='submit'
          disabled={isLoading || !cityName.trim()}
          className={styles.submitButton}
        >
          {isLoading ? 'Додавання...' : 'Додати'}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
