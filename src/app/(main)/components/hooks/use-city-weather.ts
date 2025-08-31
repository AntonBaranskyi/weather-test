import { weatherService } from "@/service"
import { SavedCity } from "@/service/weather.types"
import { WEATHER_QUERY_KEYS } from "@/shared/constants/query-keys.constants"
import { useQuery } from "@tanstack/react-query"

export const useCityWeather = (city: SavedCity) => {
    return useQuery({
        queryKey: [WEATHER_QUERY_KEYS.city(city.id)],
        queryFn: () => weatherService.getCurrentWeatherByCoordinates(city.coordinates.lat, city.coordinates.lon),
        enabled: !!city,
        
    })
}