'use client';

import { useEffect } from 'react';
import { useWeatherActions } from '@/store/weather.hooks';


export default function StoreInitializer() {
  const { initializeStore } = useWeatherActions(); 

  useEffect(() => {
    // Ініціалізуємо store тільки на клієнті
    if (typeof window !== 'undefined') {
      initializeStore();
    }
  }, [initializeStore]);

  return null; 
}

