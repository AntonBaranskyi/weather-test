'use client';

import { useEffect } from 'react';
import { useWeatherActions } from '@/store/weather.hooks';


export default function StoreInitializer() {
  const { initializeStore } = useWeatherActions(); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeStore();
    }
  }, [initializeStore]);

  return null; 
}

