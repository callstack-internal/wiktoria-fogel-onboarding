import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { WeatherIcon } from './WeatherIcon';

type CityWeatherBasicRowProps = {
  testID: string;
  name: string;
  temperature: number;
  description: string;
  icon: string;
  accessibilityLabel: string;
};

export const CityWeatherBasicRow = ({
  name,
  temperature,
  description,
  icon,
  testID,
  accessibilityLabel,
}: CityWeatherBasicRowProps) => {
  return (
    <View
      testID={testID}
      style={styles.wrapper}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.row}>
        <WeatherIcon iconCode={icon} />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <View style={styles.temperatureContainer}>
        <Text style={styles.temperature}>{`${Math.round(temperature)}${
          STRINGS.UNITS.temperature
        }`}</Text>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
  },
  temperatureContainer: {
    minWidth: 60,
    padding: 10,
    borderRadius: 20,
    backgroundColor: COLORS.details,
    alignItems: 'flex-end',
  },
  temperature: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
