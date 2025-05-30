import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar 
        style="light" 
        backgroundColor="#000000" 
        translucent={Platform.OS === 'android'}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
