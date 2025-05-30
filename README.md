# FitnessApp - 健身應用程式

這是一個使用 React Native 和 Expo 開發的健身應用程式，採用暗色系現代簡約設計風格。

## 項目概述

FitnessApp 是一個全面的健身追蹤和管理應用程式，具有以下主要功能：

- 📅 **日曆** - 訓練計劃和時程管理
- 📊 **儀表板** - 運動數據和進度統計
- 👥 **社群** - 健身社群互動和分享
- 📚 **資料庫** - 運動資料庫和教學影片
- ⚙️ **設定** - 應用程式設定和個人資料

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

## 項目結構

```
FitnessApp/
├── App.js                 # 主應用程式入口
├── navigation/
│   └── AppNavigator.js    # 底部標籤導航配置 (暗色主題)
├── screens/               # 所有螢幕組件 (暗色風格)
│   ├── CalendarScreen.js
│   ├── DashboardScreen.js
│   ├── CommunityScreen.js
│   ├── LibraryScreen.js
│   └── SettingsScreen.js
├── assets/                # 圖片和其他資源
├── package.json          # 項目依賴和腳本
└── README.md             # 項目說明文件
```

## 安裝和運行

### 前置要求

- Node.js (版本 18 或以上)
- npm 或 yarn
- Expo CLI: `npm install -g expo-cli`

### 安裝步驟

1. 進入項目目錄：
   ```bash
   cd FitnessApp
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 運行應用程式：
   cd FitnessApp
   ```bash
   npm start
   ```
   或
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

### 導航依賴
- `@react-navigation/native` - React Navigation 核心
- `@react-navigation/bottom-tabs` - 底部標籤導航
- `react-native-screens` - 原生螢幕組件
- `react-native-safe-area-context` - 安全區域處理

### 圖標依賴
- `@expo/vector-icons` - Expo 圖標庫 (包含 MaterialCommunityIcons)

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