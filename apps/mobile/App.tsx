import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';

import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/tokens';

export default function App() {
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('./assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('./assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSans-SemiBold': require('./assets/fonts/GoogleSans-SemiBold.ttf'),
    'GoogleSans-Bold': require('./assets/fonts/GoogleSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
