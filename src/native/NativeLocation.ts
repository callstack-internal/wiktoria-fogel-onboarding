import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export type Location = {
	latitude: number;
	longitude: number;
	accuracy?: number;
	altitude?: number;
	heading?: number;
	speed?: number;
};

export interface Spec extends TurboModule {
	getCurrentLocation(): Promise<Location>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LocationModule');

