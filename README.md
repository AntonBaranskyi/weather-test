## Weather App — Test Task for ComeBack Agency

This repository contains a small weather application built as a test task for ComeBack Agency. It demonstrates a simple, production-lean implementation of a cities list with current weather, a detailed city view with charts, client-side state, and data fetching with caching.

### What was implemented

- **Home page (cities list)**: Displays saved cities with a `CityCard` showing temperature, description, wind, humidity, and pressure.
- **“Last updated” on Home**: Each `CityCard` shows the last updated time using React Query’s `dataUpdatedAt` (fallback to first fetch time), rendered via `SafeTimeDisplay`, matching the detail page wording and formatting.
- **City details page**: Header with city name, country, refresh button, and “Last updated” timestamp; current weather card; hourly forecast card; temperature chart; back-to-top for mobile.
- **Safe client-side time formatting**: `SafeTimeDisplay` formats timestamps on the client to avoid hydration issues, with SSR-safe fallback.
- **Data fetching & caching**: TanStack Query (React Query) for fetching, caching, and refetching weather data with clear query keys (`WEATHER_QUERY_KEYS`).
- **Services layer**: `WeatherService` integrates with OpenWeatherMap (current weather, geocoding, hourly forecast), typed with rich TypeScript interfaces.
- **Local store**: Zustand store for saved cities (add/remove/get), with `addedAt` timestamps and simple selectors/hooks.
- **Styling**: SCSS modules with responsive layout for home and detail pages.
- **Testing**: Jest + Testing Library tests for key UI pieces and store logic.

### Tech stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **State**: Zustand (local cities store)
- **Data**: TanStack Query v5
- **HTTP**: Axios via a tiny `HttpService`
- **Charts**: Chart.js + react-chartjs-2
- **Styles**: SCSS modules
- **Testing**: Jest, @testing-library/react, @testing-library/user-event

### Project structure (high level)

- `src/app/(main)/components` — Home UI (cards, lists, spinners, header, time display)
- `src/app/city/[cityId]` — City detail page with header, charts, and cards
- `src/shared` — Query hooks, constants, utilities, HTTP services, providers
- `src/service` — Weather domain service, DTOs/types, data utils
- `src/store` — Zustand store and selectors/hooks for cities

### Environment variables

Create a `.env.local` at the project root with your OpenWeatherMap API key:

```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
```

Notes:
- The `WeatherService` reads `NEXT_PUBLIC_WEATHER_API_KEY`.
- `HttpService` prepends the base path `/api/weather`. Adjust this or proxy as needed for your deployment.

### Getting started

1) Install dependencies

```bash
npm install
```

2) Run the development server

```bash
npm run dev
```

3) Open the app at `http://localhost:3000`.

### Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run test` — run unit tests
- `npm run test:watch` — run tests in watch mode
- `npm run test:coverage` — coverage report

### Key user flows

- **Add a city**: Use the search form to add a city; it’s stored in the local store with `addedAt` timestamp.
- **Refresh weather**: Use the refresh button on cards or in the detail header. The “Last updated” time reflects the latest successful fetch.
- **View details**: Click a city card to see detailed view with hourly forecast and temperature chart.

### Notable implementation details

- `SafeTimeDisplay` handles formatting on the client and shows an SSR-safe fallback to avoid hydration warnings.
- Query keys in `WEATHER_QUERY_KEYS` allow granular cache invalidation (current, hourly, detailed weather) and targeted refetching.
- `useCityWeather` and `useDetailedWeather` return consistent shapes and leverage `dataUpdatedAt` to surface update times to the UI.

### Tests

Component and store tests are located under `src/app/(main)/components/__tests__` and `src/store/__tests__`.

Run:

```bash
npm run test
```

### Disclaimer

This project was implemented as a test task for **ComeBack Agency**. It is a compact demo and not a production-ready application. Feel free to adapt the services or API routing strategy to your deployment environment.
