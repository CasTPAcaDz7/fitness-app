import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase 配置
// 在生產環境中，請使用環境變數
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-ABCDEF"
};

// 檢查是否為有效的 Firebase 配置
const isValidConfig = firebaseConfig.apiKey !== "demo-api-key";

if (!isValidConfig) {
  console.warn('⚠️  Firebase 配置未設置，使用演示配置');
  console.warn('⚠️  請在生產環境中設置真實的 Firebase 配置');
}

// 初始化 Firebase App
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase App 已成功初始化');
} catch (error) {
  console.error('❌ Firebase App 初始化失敗:', error);
  throw error;
}

// 初始化 Firestore
export let db;
try {
  db = getFirestore(app);
  console.log('✅ Firestore 已初始化');
} catch (error) {
  console.error('❌ Firestore 初始化失敗:', error);
}

// 初始化 Authentication（針對 React Native 優化）
export let auth;
try {
  // 檢查環境是否為 React Native
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    // React Native 環境
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('✅ Auth (React Native) 已初始化');
  } else {
    // Web 環境
    auth = getAuth(app);
    console.log('✅ Auth (Web) 已初始化');
  }
} catch (error) {
  console.error('❌ Auth 初始化失敗:', error);
  // 如果 initializeAuth 失敗，嘗試使用 getAuth
  try {
    auth = getAuth(app);
    console.log('✅ Auth (fallback) 已初始化');
  } catch (fallbackError) {
    console.error('❌ Auth fallback 也失敗:', fallbackError);
  }
}

// 初始化 Storage
export let storage;
try {
  storage = getStorage(app);
  console.log('✅ Storage 已初始化');
} catch (error) {
  console.error('❌ Storage 初始化失敗:', error);
}

// 初始化 Analytics（僅在 Web 環境中支援）
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
        console.log('✅ Firebase Analytics 已初始化');
      } catch (error) {
        console.warn('⚠️  Analytics 初始化失敗:', error);
      }
    }
  }).catch((error) => {
    console.warn('⚠️  Analytics 支援檢查失敗:', error);
  });
}

// 開發環境設置（僅在開發模式下使用）
const isDevelopment = __DEV__;

if (isDevelopment && !isValidConfig) {
  console.log('🔧 開發模式：使用演示配置');
  
  // 連接到 Firebase 模擬器（如果需要）
  const useEmulator = false; // 設為 true 以使用本地模擬器
  
  if (useEmulator) {
    console.log('🔧 嘗試連接到 Firebase 模擬器...');
    
    // Firestore 模擬器
    if (db) {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('🔗 已連接到 Firestore 模擬器');
      } catch (error) {
        console.log('ℹ️  Firestore 模擬器已連接或無法連接');
      }
    }

    // Authentication 模擬器
    if (auth) {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        console.log('🔗 已連接到 Auth 模擬器');
      } catch (error) {
        console.log('ℹ️  Auth 模擬器已連接或無法連接');
      }
    }

    // Storage 模擬器
    if (storage) {
      try {
        connectStorageEmulator(storage, 'localhost', 9199);
        console.log('🔗 已連接到 Storage 模擬器');
      } catch (error) {
        console.log('ℹ️  Storage 模擬器已連接或無法連接');
      }
    }
  }
}

// 導出配置和檢查函數
export { firebaseConfig, isValidConfig };

// 導出 Firebase App
export default app;

// 輔助函數：檢查 Firebase 服務是否可用
export const checkFirebaseServices = () => {
  const services = {
    app: !!app,
    auth: !!auth,
    firestore: !!db,
    storage: !!storage,
    analytics: !!analytics
  };
  
  console.log('🔍 Firebase 服務狀態:', services);
  return services;
}; 