import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { checkFirebaseServices } from './config/firebase';

export default function App() {
  useEffect(() => {
    // 檢查 Firebase 服務狀態
    console.log('🚀 健身應用啟動...');
    
    try {
      const services = checkFirebaseServices();
      
      if (services.app) {
        console.log('✅ 應用已準備就緒');
      } else {
        console.warn('⚠️  Firebase 初始化問題，應用將以有限功能運行');
      }
    } catch (error) {
      console.error('❌ 應用初始化檢查失敗:', error);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#1a1a1a" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
