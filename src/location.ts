import {NativeEventEmitter} from 'react-native';
import NativeLocation from './NativeLocation';

export type {GeoPosition} from './NativeLocation';

const emitter = new NativeEventEmitter(NativeLocation as any);

export async function requestAuthorization(whenInUse: boolean = true) {
  return NativeLocation.requestAuthorization(whenInUse);
}

export async function getCurrentPosition(timeoutMs?: number) {
  return NativeLocation.getCurrentPosition(timeoutMs);
}

export function watchPosition(
  options: {intervalMs?: number} | null,
  listener: (pos: any) => void,
) {
  const sub = emitter.addListener('locationUpdated', listener);
  const id = NativeLocation.watchPosition(options ?? null);
  return {
    remove() {
      sub.remove();
      NativeLocation.clearWatch(id);
    },
  };
}

