import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export type GeoPosition = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number | null;
    heading?: number | null;
    speed?: number | null;
  };
  timestamp: number;
};

export interface Spec extends TurboModule {
  requestAuthorization(whenInUse: boolean): Promise<boolean>;
  getCurrentPosition(timeoutMs?: number): Promise<GeoPosition>;
  watchPosition(options: {intervalMs?: number} | null): number;
  clearWatch(watchId: number): void;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Location');

