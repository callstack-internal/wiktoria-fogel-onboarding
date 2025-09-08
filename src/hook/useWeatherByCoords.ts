import { useQuery } from '@tanstack/react-query';
import { getWeatherByCoords } from '../api/weatherApi';
import type { WeatherType } from '../types/weatherTypes';

type Coords = {
  lat: number;
  lon: number;
};

export const useWeatherByCoords = (coords?: Coords) => {
  const { lat, lon } = coords ?? {};

  const isEnabled = lat != null && lon != null;

  const { data, error, isLoading, isFetching, refetch } = useQuery<WeatherType>(
    {
      queryKey: ['weatherByCoords', lat, lon],
      queryFn: () => getWeatherByCoords(lat!, lon!),
      enabled: isEnabled,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  );

  return {
    weather: data,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
