'use client';

import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HourlyForecastResponse } from '@/service/weather.types';
import SafeTimeDisplay from '@/app/(main)/components/SafeTimeDisplay';
import styles from '@/app/styles/components/temperature-chart.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TemperatureChartProps {
  hourlyForecast: HourlyForecastResponse;
  cityName: string;
}

interface ChartDataPoint {
  time: string;
  timestamp: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
}

export default function TemperatureChart({ hourlyForecast, cityName }: TemperatureChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const chartData: ChartDataPoint[] = hourlyForecast.list.slice(0, 24).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    timestamp: item.dt * 1000,
    temperature: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    description: item.weather[0].description,
    icon: item.weather[0].icon
  }));

  const data = {
    labels: chartData.map(item => item.time),
    datasets: [
      {
        label: 'Температура (°C)',
        data: chartData.map(item => item.temperature),
        borderColor: 'rgb(59, 130, 246)', // Blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Відчувається (°C)',
        data: chartData.map(item => item.feelsLike),
        borderColor: 'rgb(239, 68, 68)', // Red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
        tension: 0.4,
        borderDash: [5, 5],
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151',
          font: {
            size: 14,
            family: 'system-ui, -apple-system, sans-serif'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: `Погодинний прогноз температури - ${cityName}`,
        color: '#111827',
        font: {
          size: 18,
          weight: 'bold' as const,
          family: 'system-ui, -apple-system, sans-serif'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex;
            return chartData[dataIndex].time;
          },
          label: (context: any) => {
            const dataIndex = context.dataIndex;
            const dataPoint = chartData[dataIndex];
            
            if (context.dataset.label === 'Температура (°C)') {
              return [
                `Температура: ${dataPoint.temperature}°C`,
                `Вологість: ${dataPoint.humidity}%`,
                `Опис: ${dataPoint.description}`
              ];
            } else {
              return `Відчувається: ${dataPoint.feelsLike}°C`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          maxTicksLimit: 8
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return value + '°C';
          }
        },
        title: {
          display: true,
          text: 'Температура (°C)',
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff'
      }
    }
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartWrapper}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
      
      <div className={styles.chartInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Мін. температура:</span>
          <span className={styles.infoValue}>
            {Math.min(...chartData.map(d => d.temperature))}°C
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Макс. температура:</span>
          <span className={styles.infoValue}>
            {Math.max(...chartData.map(d => d.temperature))}°C
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Середня:</span>
          <span className={styles.infoValue}>
            {Math.round(chartData.reduce((sum, d) => sum + d.temperature, 0) / chartData.length)}°C
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Прогноз на:</span>
          <span className={styles.infoValue}>24 години</span>
        </div>
      </div>
    </div>
  );
}
