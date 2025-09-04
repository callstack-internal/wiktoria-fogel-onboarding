import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useCitiesWeatherById } from '../../hook/useCitiesWeatherById';
import type { WeatherType } from '../../types/weatherTypes';
import { CityItem } from './components/CityItem';
import { styles } from './cityListScreen.styles';
import type {
  CityListScreenProps,
  RenderItemProps,
} from './CityListScreen.types';
import { STRINGS } from '../../constants/strings';

export default function CityListScreen({ navigation }: CityListScreenProps) {
  const { cities, isLoading, error } = useCitiesWeatherById();

  const onCityPress = async (city: WeatherType) => {
    navigation.navigate('WeatherDetails', { weatherData: city });
  };

  const renderCityItem = ({ item }: RenderItemProps) => (
    <CityItem item={item} onPress={onCityPress} />
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorWrapper}>
          <Text style={styles.errorInfo}>{STRINGS.ERROR.failedLoadCities}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cities}
        renderItem={renderCityItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}
