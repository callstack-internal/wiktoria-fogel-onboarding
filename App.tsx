/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import * as React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button } from 'react-native';
import * as Location from './src/location';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [pos, setPos] = React.useState<any | null>(null);

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
      <View style={{padding: 16}}>
        <Button title="Get Location" onPress={async () => {
          await Location.requestAuthorization(true);
          const p = await Location.getCurrentPosition();
          setPos(p);
        }} />
        {pos ? (
          <Text testID="locationText">{`lat: ${pos.coords.latitude}, lon: ${pos.coords.longitude}`}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
