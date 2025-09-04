import { StyleSheet, TouchableOpacity } from 'react-native';
import { WeatherType } from '../../../types/weatherTypes';
import { COLORS } from '../../../constants/colors';
import { CityWeatherBasicRow } from '../../../components/CityWeatherBasicRow';

type CityItemProps = {
  item: WeatherType;
  onPress: (item: WeatherType) => void;
};

export const CityItem = ({ item, onPress }: CityItemProps) => {
  const { name, main, weather } = item;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      testID={'city-item'}
    >
      <CityWeatherBasicRow
        icon={weather[0].icon}
        name={name}
        description={weather[0].main}
        temperature={main.temp}
      />
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
  },
});
