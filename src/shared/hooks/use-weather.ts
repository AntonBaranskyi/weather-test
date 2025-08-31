import { useQuery } from "@tanstack/react-query"
import { WEATHER_QUERY_KEYS } from "@/shared/constants/query-keys.constants"
import { SavedCity, weatherService } from "@/service"

export const useWeatherCity = (city:SavedCity) => {
    return useQuery({
        queryKey: [WEATHER_QUERY_KEYS.city(city.id)],
        queryFn: () => weatherService.getCityWeatherData(city),
        enabled: !!city,
        
    })
}