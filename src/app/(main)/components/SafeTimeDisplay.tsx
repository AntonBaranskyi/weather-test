'use client';

import { useState, useEffect } from 'react';

interface SafeTimeDisplayProps {
  timestamp: number;
  format?: 'time' | 'date' | 'datetime';
  prefix?: string;
  className?: string;
}

export default function SafeTimeDisplay({ 
  timestamp, 
  format = 'time', 
  prefix = '',
  className = ''
}: SafeTimeDisplayProps) {
  const [timeString, setTimeString] = useState<string | null>(null);

  useEffect(() => {
    // Виконуємо форматування тільки на клієнті після гідратації
    const date = new Date(timestamp);
    let formatted: string;

    switch (format) {
      case 'time':
        formatted = date.toLocaleTimeString('uk-UA', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        break;
      case 'date':
        formatted = date.toLocaleDateString('uk-UA', {
          day: 'numeric',
          month: 'short'
        });
        break;
      case 'datetime':
        formatted = date.toLocaleString('uk-UA', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
        break;
      default:
        formatted = date.toLocaleString('uk-UA');
    }

    setTimeString(formatted);
  }, [timestamp, format]);

  // Під час SSR або до гідратації показуємо загальний формат
  if (timeString === null) {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return (
          <span className={className}>
            {prefix}Невідомий час
          </span>
        );
      }
      return (
        <span className={className}>
          {prefix}
          {/* Показуємо ISO строку як fallback для SSR */}
          {date.toISOString().split('T')[1].slice(0, 5)}
        </span>
      );
    } catch (error) {
      return (
        <span className={className}>
          {prefix}Невідомий час
        </span>
      );
    }
  }

  return (
    <span className={className}>
      {prefix}{timeString}
    </span>
  );
}

