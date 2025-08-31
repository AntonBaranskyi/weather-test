import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'OpenWeatherMap API key is not configured' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const units = searchParams.get('units') || 'metric';
  const lang = searchParams.get('lang') || 'uk';
  const cnt = searchParams.get('cnt');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Coordinates (lat, lon) are required for forecast' },
      { status: 400 }
    );
  }

  try {
    const url = new URL(`${BASE_URL}/forecast`);
    
    url.searchParams.append('lat', lat);
    url.searchParams.append('lon', lon);
    url.searchParams.append('appid', API_KEY);
    url.searchParams.append('units', units);
    url.searchParams.append('lang', lang);
    
    if (cnt) {
      url.searchParams.append('cnt', cnt);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forecast data' },
      { status: 500 }
    );
  }
}

