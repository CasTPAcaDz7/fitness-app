import { useState, useEffect } from 'react';
import { authService, firestoreService, storageService, checkFirebaseServices } from '../services/firebaseService';

// =================================
// Authentication Hooks
// =================================

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // 檢查 Firebase 服務狀態
      const services = checkFirebaseServices();
      if (!services.auth) {
        console.warn('⚠️  Auth 服務不可用，將使用模擬狀態');
        setLoading(false);
        return;
      }

      // 監聽認證狀態變化
      const unsubscribe = authService.onAuthStateChange((user) => {
        setUser(user);
        setLoading(false);
        setError(null);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('❌ useAuth 初始化失敗:', error);
      setError(error);
      setLoading(false);
    }
  }, []);

  const signUp = async (email, password, displayName) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.registerUser(email, password, displayName);
      return user;
    } catch (error) {
      console.error('❌ 註冊失敗:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.loginUser(email, password);
      return user;
    } catch (error) {
      console.error('❌ 登入失敗:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.logoutUser();
    } catch (error) {
      console.error('❌ 登出失敗:', error);
      setError(error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (error) {
      console.error('❌ 重置密碼失敗:', error);
      setError(error);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword
  };
}

// =================================
// Firestore Hooks
// =================================

export function useDocument(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName || !docId) {
      setLoading(false);
      return;
    }

    try {
      // 檢查 Firestore 服務狀態
      const services = checkFirebaseServices();
      if (!services.firestore) {
        console.warn('⚠️  Firestore 服務不可用');
        setError(new Error('Firestore 服務不可用'));
        setLoading(false);
        return;
      }

      const unsubscribe = firestoreService.subscribeToDocument(
        collectionName,
        docId,
        (docData) => {
          setData(docData);
          setLoading(false);
          setError(null);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('❌ useDocument 初始化失敗:', error);
      setError(error);
      setLoading(false);
    }
  }, [collectionName, docId]);

  return { data, loading, error };
}

export function useCollection(collectionName, queryOptions = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) {
      setLoading(false);
      return;
    }

    try {
      // 檢查 Firestore 服務狀態
      const services = checkFirebaseServices();
      if (!services.firestore) {
        console.warn('⚠️  Firestore 服務不可用');
        setError(new Error('Firestore 服務不可用'));
        setLoading(false);
        return;
      }

      const unsubscribe = firestoreService.subscribeToCollection(
        collectionName,
        (collectionData) => {
          setData(collectionData);
          setLoading(false);
          setError(null);
        },
        queryOptions
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('❌ useCollection 初始化失敗:', error);
      setError(error);
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(queryOptions)]);

  return { data, loading, error };
}

// =================================
// Storage Hooks
// =================================

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (uri, path) => {
    try {
      // 檢查 Storage 服務狀態
      const services = checkFirebaseServices();
      if (!services.storage) {
        throw new Error('Storage 服務不可用');
      }

      setUploading(true);
      setError(null);
      const downloadURL = await storageService.uploadImage(uri, path);
      return downloadURL;
    } catch (error) {
      console.error('❌ 圖片上傳失敗:', error);
      setError(error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}

// =================================
// 健身應用專用 Hooks
// =================================

export function useUserProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const userProfile = await firestoreService.getCollection('users', {
          where: ['userId', '==', userId]
        });
        setProfile(userProfile[0] || null);
      } catch (error) {
        console.error('❌ 獲取用戶資料失敗:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates) => {
    try {
      setError(null);
      if (profile?.id) {
        await firestoreService.updateDocument('users', profile.id, updates);
        setProfile(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.error('❌ 更新用戶資料失敗:', error);
      setError(error);
      throw error;
    }
  };

  return { profile, loading, error, updateProfile };
}

export function useUserWorkouts(userId) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // 檢查 Firestore 服務狀態
      const services = checkFirebaseServices();
      if (!services.firestore) {
        console.warn('⚠️  Firestore 服務不可用');
        setError(new Error('Firestore 服務不可用'));
        setLoading(false);
        return;
      }

      const unsubscribe = firestoreService.subscribeToCollection(
        'workouts',
        (workoutData) => {
          setWorkouts(workoutData);
          setLoading(false);
          setError(null);
        },
        {
          where: ['userId', '==', userId],
          orderBy: ['createdAt', 'desc']
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('❌ useUserWorkouts 初始化失敗:', error);
      setError(error);
      setLoading(false);
    }
  }, [userId]);

  const addWorkout = async (workoutData) => {
    try {
      setError(null);
      await firestoreService.addDocument('workouts', {
        userId,
        ...workoutData
      });
    } catch (error) {
      console.error('❌ 添加訓練記錄失敗:', error);
      setError(error);
      throw error;
    }
  };

  return { workouts, loading, error, addWorkout };
}

export function useCommunityPosts(limitCount = 20) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // 檢查 Firestore 服務狀態
      const services = checkFirebaseServices();
      if (!services.firestore) {
        console.warn('⚠️  Firestore 服務不可用');
        setError(new Error('Firestore 服務不可用'));
        setLoading(false);
        return;
      }

      const unsubscribe = firestoreService.subscribeToCollection(
        'posts',
        (postData) => {
          setPosts(postData);
          setLoading(false);
          setError(null);
        },
        {
          orderBy: ['createdAt', 'desc'],
          limit: limitCount
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('❌ useCommunityPosts 初始化失敗:', error);
      setError(error);
      setLoading(false);
    }
  }, [limitCount]);

  const addPost = async (postData) => {
    try {
      setError(null);
      await firestoreService.addDocument('posts', postData);
    } catch (error) {
      console.error('❌ 添加貼文失敗:', error);
      setError(error);
      throw error;
    }
  };

  return { posts, loading, error, addPost };
} 