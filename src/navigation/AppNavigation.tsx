import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CityListScreen from '../screens/CityListScreen/CityListScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WeatherDetailsScreen from '../screens/WeatherDetailsScreen/WeatherDetailsScreen';
import { RootStackParamList } from '../types/navigation';
import { STRINGS } from '../constants/strings';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CityList"
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="CityList"
          component={CityListScreen}
          options={{
            title: STRINGS.LABELS.weather,
          }}
        />
        <Stack.Screen
          name="WeatherDetails"
          component={WeatherDetailsScreen}
          options={{
            title: STRINGS.LABELS.details,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
