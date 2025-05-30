// Firebase 環境變數配置示例
// 複製此文件為 env.js 並填入您的實際 Firebase 憑證

export const FIREBASE_CONFIG = {
  apiKey: "your_api_key_here",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id",
  measurementId: "your_measurement_id" // 可選
};

// 如何獲取這些憑證：
// 1. 前往 Firebase Console (https://console.firebase.google.com/)
// 2. 選擇您的專案或創建新專案
// 3. 進入 Project Settings > General
// 4. 在 "Your apps" 部分，選擇或添加 Web 應用
// 5. 複製配置對象中的值 