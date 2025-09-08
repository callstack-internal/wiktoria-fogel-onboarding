import React, { useMemo, useState } from 'react';
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
import { useLocationQuery } from '../../hook/useUserLocation';
import { SearchBar } from '../../components/SearchBar';
import { EmptyComponentList } from '../../components/EmptyComponentList';

export default function CityListScreen({ navigation }: CityListScreenProps) {
  const { cities, isLoading, error } = useCitiesWeatherById();
  const [searchTerm, setSearchTerm] = useState('');
  const { location } = useLocationQuery();
  console.log(location, 'LOCATION');

  const filteredCities = useMemo(() => {
    if (!searchTerm) {
      return cities;
    }
    return cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [cities, searchTerm]);

  const onCityPress = async (city: WeatherType) => {
    navigation.navigate('WeatherDetails', { weatherData: city });
  };

  const renderCityItem = ({ item }: RenderItemProps) => (
    <CityItem item={item} onPress={onCityPress} />
  );

  const renderEmptyComponent = () => (
    <EmptyComponentList title={STRINGS.ERROR.noResults} />
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" testID={'loading-indicator'} />
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
      <SearchBar value={searchTerm} onChangeText={setSearchTerm} />
      <FlatList
        data={filteredCities}
        renderItem={renderCityItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
}
