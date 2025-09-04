import { useQuery } from '@tanstack/react-query';
import { getCitiesWeatherById } from '../api/weatherApi';
import type { WeatherType } from '../types/weatherTypes';

export const useCitiesWeatherById = () => {
  const {
    data = [],
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<WeatherType[]>({
    queryKey: ['citiesWeatherById'],
    queryFn: getCitiesWeatherById,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return {
    cities: data,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
