# FitnessApp - 健身應用程式

這是一個使用 React Native 和 Expo 開發的健身應用程式，採用暗色系現代簡約設計風格，集成了 Firebase 作為後端服務。

## 項目概述

FitnessApp 是一個全面的健身追蹤和管理應用程式，具有以下主要功能：

- 📅 **日曆** - 訓練計劃和時程管理
- 📊 **儀表板** - 運動數據和進度統計
- 👥 **社群** - 健身社群互動和分享
- 📚 **資料庫** - 運動資料庫和教學影片
- ⚙️ **設定** - 應用程式設定和個人資料
- 🔐 **用戶認證** - Firebase Authentication
- 💾 **雲端存儲** - Firestore 數據庫
- 📂 **文件上傳** - Firebase Storage

## 設計特色

### 🌙 暗色系現代簡約風格
- **主要配色**：
  - 深色背景：`#1a1a1a`
  - 卡片背景：`#2d2d2d`
  - 邊框色彩：`#404040`
  - 強調色：`#4A90E2`
- **視覺效果**：
  - 圓角卡片設計 (16px 圓角)
  - 精緻陰影和光暈效果
  - 現代化字體排版
  - 流暢的動畫過渡

## 技術棧

- **React Native** - 跨平台移動應用框架
- **Expo** - React Native 開發工具和平台
- **React Navigation** - 導航和路由 (含暗色主題)
- **MaterialCommunityIcons** - 圖標庫
- **Firebase** - 後端即服務平台
  - Firestore - NoSQL 雲端數據庫
  - Authentication - 用戶認證服務
  - Storage - 雲端文件存儲
  - Analytics - 應用分析 (可選)

## 項目結構

```
FitnessApp/
├── App.js                 # 主應用程式入口
├── config/                # 配置文件
│   ├── firebase.js        # Firebase 配置和初始化
│   └── env.example.js     # 環境變數示例
├── services/              # 服務層
│   └── firebaseService.js # Firebase 服務封裝
├── hooks/                 # React Hooks
│   └── useFirebase.js     # Firebase 相關 hooks
├── navigation/
│   └── AppNavigator.js    # 底部標籤導航配置
├── screens/               # 所有螢幕組件
│   ├── CalendarScreen.js
│   ├── DashboardScreen.js
│   ├── CommunityScreen.js
│   ├── LibraryScreen.js
│   └── SettingsScreen.js
├── assets/                # 圖片和其他資源
├── package.json          # 項目依賴和腳本
└── README.md             # 項目說明文件
```

## Firebase 設置

### 1. 創建 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊 "Create a project" 創建新專案
3. 輸入專案名稱，例如：`fitness-app`
4. 選擇是否啟用 Google Analytics（建議啟用）
5. 完成專案創建

### 2. 設置 Firebase 服務

#### 🔐 啟用 Authentication
1. 在 Firebase Console 中選擇 "Authentication"
2. 點擊 "Get started"
3. 在 "Sign-in method" 標籤中啟用所需的登入方式：
   - Email/Password（必選）
   - Google（可選）
   - 其他第三方登入（可選）

#### 💾 設置 Firestore Database
1. 在 Firebase Console 中選擇 "Firestore Database"
2. 點擊 "Create database"
3. 選擇模式：
   - 生產模式（推薦，需要設置安全規則）
   - 測試模式（30天免費，適合開發）
4. 選擇數據庫位置（建議選擇最接近用戶的區域）

#### 📂 設置 Storage
1. 在 Firebase Console 中選擇 "Storage"
2. 點擊 "Get started"
3. 接受預設的安全規則（可後續修改）
4. 選擇存儲位置

### 3. 獲取 Firebase 配置

1. 在 Firebase Console 中點擊 ⚙️ (設置) → "Project settings"
2. 滾動到 "Your apps" 部分
3. 點擊 "Add app" → 選擇 Web 圖標 `</>`
4. 輸入應用暱稱，例如：`FitnessApp`
5. 複製顯示的配置對象

### 4. 配置應用程式

1. 複製 `config/env.example.js` 為 `config/env.js`：
   ```bash
   cp config/env.example.js config/env.js
   ```

2. 在 `config/env.js` 中填入您的 Firebase 憑證：
   ```javascript
   export const FIREBASE_CONFIG = {
     apiKey: "您的API密鑰",
     authDomain: "您的專案ID.firebaseapp.com",
     projectId: "您的專案ID",
     storageBucket: "您的專案ID.appspot.com",
     messagingSenderId: "您的發送者ID",
     appId: "您的應用ID",
     measurementId: "您的測量ID" // 可選
   };
   ```

3. 更新 `config/firebase.js` 中的配置（如果使用自定義配置文件）

## 安裝和運行

### 前置要求

- Node.js (版本 18 或以上)
- npm 或 yarn
- Expo CLI: `npm install -g expo-cli`
- Firebase 專案設置完成

### 安裝步驟

1. 進入項目目錄：
   ```bash
   cd FitnessApp
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 設置 Firebase 憑證（見上方 Firebase 設置）

4. 運行應用程式：
   ```bash
   npm start
   ```
   或
   ```bash
   npx expo start
   ```

### 運行選項

- **iOS模擬器**: `npm run ios` (需要 macOS)
- **Android模擬器**: `npm run android`
- **網頁版**: `npm run web`
- **Expo Go應用**: 掃描 QR 碼在真實設備上測試

## 已安裝的依賴

### 核心依賴
- `expo` - Expo 開發平台
- `react` - React 核心庫
- `react-native` - React Native 框架

### Firebase 依賴
- `firebase` - Firebase JavaScript SDK
- `@react-native-async-storage/async-storage` - 本地存儲（Firebase 依賴）

### 導航依賴
- `@react-navigation/native` - React Navigation 核心
- `@react-navigation/bottom-tabs` - 底部標籤導航
- `react-native-screens` - 原生螢幕組件
- `react-native-safe-area-context` - 安全區域處理

### 圖標依賴
- `@expo/vector-icons` - Expo 圖標庫 (包含 MaterialCommunityIcons)

## Firebase 使用方法

### 使用 Firebase Hooks

```javascript
import { useAuth, useUserProfile, useUserWorkouts } from './hooks/useFirebase';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  const { profile, updateProfile } = useUserProfile(user?.uid);
  const { workouts, addWorkout } = useUserWorkouts(user?.uid);

  // 使用 Firebase 功能
}
```

### 使用 Firebase 服務

```javascript
import { authService, firestoreService, storageService } from './services/firebaseService';

// 用戶認證
await authService.registerUser(email, password, displayName);
await authService.loginUser(email, password);

// Firestore 操作
await firestoreService.addDocument('workouts', workoutData);
const workouts = await firestoreService.getCollection('workouts');

// Storage 操作
const downloadURL = await storageService.uploadImage(imageUri, 'photos/profile.jpg');
```

## Firestore 數據結構

```javascript
// 用戶資料
users: {
  [documentId]: {
    userId: string,
    email: string,
    displayName: string,
    profileImage: string,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

// 訓練記錄
workouts: {
  [documentId]: {
    userId: string,
    name: string,
    exercises: array,
    duration: number,
    calories: number,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

// 社群貼文
posts: {
  [documentId]: {
    userId: string,
    content: string,
    images: array,
    likes: number,
    comments: array,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
```

## UI 設計說明

### 顏色系統
```css
/* 主要顏色 */
背景色: #1a1a1a
卡片背景: #2d2d2d
邊框色: #404040
主要文字: #ffffff
次要文字: #b0b0b0
強調色: #4A90E2
非活躍圖標: #888888
```

### 字體系統
- **主標題**: 28px, 700 weight
- **描述文字**: 16px, 400 weight
- **標籤文字**: 12px, 500 weight

### 間距系統
- **內邊距**: 20px (螢幕邊距), 32px (卡片內邊距)
- **圓角**: 16px (卡片圓角)
- **陰影**: 4px 偏移, 0.3 透明度

## 開發狀態

### 已完成 ✅
- [x] 基本項目結構
- [x] 底部標籤導航設置
- [x] 5個基本螢幕組件
- [x] 導航圖標配置
- [x] 暗色系現代簡約設計
- [x] 響應式卡片佈局
- [x] 統一的視覺風格

### 待開發 🚧
- [ ] 日曆功能實現
- [ ] 儀表板數據視覺化
- [ ] 社群功能開發
- [ ] 運動資料庫建置
- [ ] 設定頁面功能
- [ ] 數據持久化
- [ ] 用戶認證
- [ ] 推送通知

## 貢獻指南

1. Fork 此項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權

此項目使用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

## 聯絡資訊

如有問題或建議，請聯絡項目維護者。

---

**注意**: 本項目採用暗色系現代簡約設計風格，提供優雅的用戶體驗。這是項目的第一階段實現，包含基本的導航結構和暗色主題設計。

### 🗓️ 智能日曆系統
- **月曆視圖**：完整的月曆顯示，支援星期日到星期六排列
- **今日標記**：自動標記當前日期，使用藍色背景突出顯示
- **事件管理**：
  - 支援多種事件類型：健身、跑步、瑜伽、游泳、騎車、營養
  - 每種事件類型都有獨特的圖標和顏色標識
  - 事件指示器顯示有事件的日期
  - 支援添加事件標題和詳細描述
- **互動功能**：
  - 點擊日期查看當日所有事件
  - 快速添加新事件
  - 刪除現有事件
  - 左右切換月份
  - 快速回到今天按鈕
- **視覺設計**：
  - 暗色主題，黑色背景配白色文字
  - 星期標籤位於頂部
  - 其他月份日期以較淡顏色顯示
  - 現代化的模態框設計

### 📊 儀表板
- 運動數據概覽
- 進度追蹤圖表
- 個人化建議

### 👥 社群功能
- 分享健身成果
- 社群動態瀏覽
- 互動點讚和評論

### 📚 健身資料庫
- 運動指南和教學
- 營養知識庫
- 訓練計劃範本

### ⚙️ 個人設定
- 用戶資料管理
- 應用程式偏好設定
- 隱私和安全選項

## 更新日誌

### v2.0.0 (最新)
- ✨ 新增完整日曆功能
- 🎨 改進暗色主題設計
- 🔧 修復 iOS 兼容性問題
- 📱 優化移動端體驗
- 🔥 集成 Firebase 後端服務

### v1.0.0
- 🚀 初始版本發佈
- �� 基本導航結構
- 🎨 暗色主題設計 