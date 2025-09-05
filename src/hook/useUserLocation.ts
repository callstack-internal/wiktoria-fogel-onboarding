import NativeLocationService, {
  LocationDetails,
} from '../../native/NativeLocationService';
import { useQuery } from '@tanstack/react-query';

async function getLocation(): Promise<LocationDetails> {
  return NativeLocationService.getCurrentLocationDetails();
}

export function useLocationQuery() {
  const {
    data: location,
    isLoading,
    error,
    refetch,
  } = useQuery<LocationDetails>({
    queryKey: ['location'],
    queryFn: getLocation,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  return { location, isLoading, error, refetch };
}
