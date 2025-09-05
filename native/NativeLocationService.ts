import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getCurrentLocationDetails(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeLocationService');
