import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { WeatherType } from '../../types/weatherTypes';

export type CityListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CityList'
>;

export type RenderItemProps = {
  item: WeatherType;
};
