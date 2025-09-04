import { WeatherType } from './weatherTypes';

export type RootStackParamList = {
  CityList: undefined;
  WeatherDetails: { weatherData: WeatherType };
};
