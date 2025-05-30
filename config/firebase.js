import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase 配置
// 在生產環境中，請使用環境變數
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "your_api_key_here",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your_project_id.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your_project_id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your_project_id.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "your_messaging_sender_id",
  appId: process.env.FIREBASE_APP_ID || "your_app_id",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "your_measurement_id"
};

// 如果您的配置無效，提供開發用的預設配置
const isValidConfig = firebaseConfig.apiKey !== "your_api_key_here";

if (!isValidConfig) {
  console.warn('⚠️  Firebase 配置未設置，使用開發模式配置');
  // 這裡可以設置本地開發用的配置
}

// 初始化 Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase 已成功初始化');
} catch (error) {
  console.error('❌ Firebase 初始化失敗:', error);
}

// 初始化 Firebase 服務
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// 初始化 Analytics（僅在 Web 環境中支援）
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('✅ Firebase Analytics 已初始化');
    }
  });
}

// 開發環境設置（僅在開發模式下使用）
const isDevelopment = __DEV__;

if (isDevelopment && !isValidConfig) {
  // 連接到 Firebase 模擬器（如果在本地運行）
  const useEmulator = false; // 設為 true 以使用本地模擬器
  
  if (useEmulator) {
    // Firestore 模擬器
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('🔗 已連接到 Firestore 模擬器');
    } catch (error) {
      console.log('Firestore 模擬器已連接或無法連接');
    }

    // Authentication 模擬器
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      console.log('🔗 已連接到 Auth 模擬器');
    } catch (error) {
      console.log('Auth 模擬器已連接或無法連接');
    }

    // Storage 模擬器
    try {
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('🔗 已連接到 Storage 模擬器');
    } catch (error) {
      console.log('Storage 模擬器已連接或無法連接');
    }
  }
}

// 導出配置以便在其他地方使用
export { firebaseConfig };
export default app; 