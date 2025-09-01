import { WeatherUnits, CurrentWeatherResponse, HourlyForecastItem } from './weather.types';

export const convertTemperature = (
  temp: number,
  from: WeatherUnits,
  to: WeatherUnits
): number => {
  if (from === to) return temp;

  let kelvin: number;
  switch (from) {
    case WeatherUnits.METRIC:
      kelvin = temp + 273.15;
      break;
    case WeatherUnits.IMPERIAL:
      kelvin = (temp - 32) * 5/9 + 273.15;
      break;
    case WeatherUnits.STANDARD:
    default:
      kelvin = temp;
      break;
  }

  switch (to) {
    case WeatherUnits.METRIC:
      return kelvin - 273.15;
    case WeatherUnits.IMPERIAL:
      return (kelvin - 273.15) * 9/5 + 32;
    case WeatherUnits.STANDARD:
    default:
      return kelvin;
  }
};


export const formatTemperature = (temp: number, units: WeatherUnits): string => {
  const rounded = Math.round(temp);
  switch (units) {
    case WeatherUnits.METRIC:
      return `${rounded}°C`;
    case WeatherUnits.IMPERIAL:
      return `${rounded}°F`;
    case WeatherUnits.STANDARD:
    default:
      return `${rounded}K`;
  }
};


export const getWeatherIconUrl = (icon: string, size: '2x' | '4x' = '2x'): string => {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
};

export const formatTime = (timestamp: number, format: 'time' | 'date' | 'datetime' = 'time'): string => {
  const date = new Date(timestamp * 1000);
  
  switch (format) {
    case 'time':
      return date.toLocaleTimeString('uk-UA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    case 'date':
      return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short'
      });
    case 'datetime':
      return date.toLocaleString('uk-UA', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return date.toLocaleString('uk-UA');
  }
};


export const getWindDescription = (speed: number, units: WeatherUnits): string => {
 
  const speedMps = units === WeatherUnits.IMPERIAL ? speed * 0.44704 : speed;
  
  if (speedMps < 0.3) return 'Штиль';
  if (speedMps < 1.6) return 'Тихий';
  if (speedMps < 3.4) return 'Легкий';
  if (speedMps < 5.5) return 'Слабкий';
  if (speedMps < 8.0) return 'Помірний';
  if (speedMps < 10.8) return 'Свіжий';
  if (speedMps < 13.9) return 'Сильний';
  if (speedMps < 17.2) return 'Міцний';
  if (speedMps < 20.8) return 'Дуже міцний';
  if (speedMps < 24.5) return 'Шторм';
  if (speedMps < 28.5) return 'Сильний шторм';
  if (speedMps < 32.7) return 'Жорстокий шторм';
  if (speedMps < 37.0) return 'Ураган';
  return 'Ураган';
};


export const getWindDirection = (degrees: number): string => {
  const directions = [
    'Пн', 'ПнПнСх', 'ПнСх', 'СхПнСх',
    'Сх', 'СхПдСх', 'ПдСх', 'ПдПдСх',
    'Пд', 'ПдПдЗх', 'ПдЗх', 'ЗхПдЗх',
    'Зх', 'ЗхПнЗх', 'ПнЗх', 'ПнПнЗх'
  ];
  

  let normalizedDegrees = degrees % 360;
  if (normalizedDegrees < 0) {
    normalizedDegrees += 360;
  }
  
  const index = Math.round(normalizedDegrees / 22.5) % 16;
  return directions[index];
};


export const calculateUVIndex = (
  timestamp: number,
  sunrise: number,
  sunset: number
): number => {
  const hour = new Date(timestamp * 1000).getHours();
  const sunriseHour = new Date(sunrise * 1000).getHours();
  const sunsetHour = new Date(sunset * 1000).getHours();
  
  if (hour < sunriseHour || hour > sunsetHour) return 0;
  

  const peakHour = 12;
  const distanceFromPeak = Math.abs(hour - peakHour);
  const maxUV = 11;
  
  return Math.max(0, maxUV - distanceFromPeak * 1.5);
};


export const getTemperatureColor = (temp: number, units: WeatherUnits): string => {

  const tempC = convertTemperature(temp, units, WeatherUnits.METRIC);
  
  if (tempC < -20) return '#0066cc'; // Дуже холодно - синій
  if (tempC < -10) return '#3399ff'; // Холодно - світло-синій
  if (tempC < 0) return '#66ccff';   // Прохолодно - блакитний
  if (tempC < 10) return '#99ff99';  // Прохолодно - світло-зелений
  if (tempC < 20) return '#ffff66';  // Комфортно - жовтий
  if (tempC < 30) return '#ffcc00';  // Тепло - помаранчевий
  if (tempC < 40) return '#ff6600';  // Жарко - червоно-помаранчевий
  return '#ff0000';                  // Дуже жарко - червоний
};


export const isDayTime = (
  timestamp: number,
  sunrise: number,
  sunset: number
): boolean => {
  return timestamp >= sunrise && timestamp <= sunset;
};


export const filterDaytimeHours = (
  forecast: HourlyForecastItem[],
  sunrise: number,
  sunset: number
): HourlyForecastItem[] => {
  return forecast.filter(item => isDayTime(item.dt, sunrise, sunset));
};


export const getTemperatureRange = (forecast: HourlyForecastItem[]): {
  min: number;
  max: number;
} => {
  if (forecast.length === 0) return { min: 0, max: 0 };
  
  const temperatures = forecast.map(item => item.main.temp);
  return {
    min: Math.min(...temperatures),
    max: Math.max(...temperatures)
  };
};


export const getAirQualityDescription = (humidity: number, pressure: number): string => {
  if (pressure < 1000) {
    return 'Низький тиск, можлива погіршення самопочуття';
  }
  if (pressure > 1025) {
    return 'Високий тиск, суха погода';
  }
  if (humidity > 80) {
    return 'Висока вологість, духота';
  }
  if (humidity < 30) {
    return 'Низька вологість, сухе повітря';
  }
  return 'Комфортні умови';
};


export const calculateWindChill = (temp: number, windSpeed: number, units: WeatherUnits): number => {

  const tempC = convertTemperature(temp, units, WeatherUnits.METRIC);
  const windKmh = units === WeatherUnits.IMPERIAL ? windSpeed * 1.609 : windSpeed * 3.6;
  
  if (tempC > 10 || windKmh < 4.8) {
    return temp; 
  }
  
  const windChill = 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * tempC * Math.pow(windKmh, 0.16);
  
  if (tempC > 10 || windKmh < 4.8) {
    return temp;
  }
  
  return convertTemperature(windChill, WeatherUnits.METRIC, units);
};

