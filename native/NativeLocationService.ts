import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface LocationDetails {
  latitude: number;
  longitude: number;
  altitude: number;
  horizontalAccuracy: number;
  verticalAccuracy: number;
  timestamp: string;
}

export interface Spec extends TurboModule {
  getCurrentLocationDetails(): Promise<LocationDetails>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeLocationService');
