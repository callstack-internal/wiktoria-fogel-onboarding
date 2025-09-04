import { Image, StyleSheet } from 'react-native';
import { getWeatherIconUrl } from '../constants/api';

export const WeatherIcon = ({ iconCode }: { iconCode: string }) => {
  const iconUrl = getWeatherIconUrl(iconCode);

  return (
    <Image
      source={{ uri: iconUrl }}
      style={styles.container}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
  },
});
