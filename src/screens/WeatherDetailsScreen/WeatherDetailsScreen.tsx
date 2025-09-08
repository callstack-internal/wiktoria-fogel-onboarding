import React from 'react';
import { View } from 'react-native';
import { STRINGS } from '../../constants/strings';
import { WetherDatilRow } from './components/WeatherDetailRow';
import { CityWeatherBasicRow } from '../../components/CityWeatherBasicRow';
import { styles } from './weatherDetailsScreen.styles';
import { WeatherDetailsScreenProps } from './weatherDetailsScreen.types';

export default function DetailsScreen({ route }: WeatherDetailsScreenProps) {
  const { weatherData } = route.params;
  return (
    <View style={styles.mainWrapper}>
      <CityWeatherBasicRow
        accessibilityLabel={'details-header'}
        icon={weatherData.weather[0].icon}
        name={weatherData.name}
        description={weatherData.weather[0].main}
        temperature={weatherData.main.temp}
      />
      <WetherDatilRow
        label={STRINGS.LABELS.humidity}
        value={`${weatherData.main.humidity}${STRINGS.UNITS.percentage}`}
      />
      <WetherDatilRow
        label={STRINGS.LABELS.pressure}
        value={`${weatherData.main.pressure} ${STRINGS.UNITS.pressure}`}
      />
      <WetherDatilRow
        label={STRINGS.LABELS.windSpeed}
        value={`${weatherData.wind.speed} ${STRINGS.UNITS.windSpeed}`}
      />
      <WetherDatilRow
        label={STRINGS.LABELS.cloudCover}
        value={`${weatherData.clouds.all}${STRINGS.UNITS.percentage}`}
      />
    </View>
  );
}
