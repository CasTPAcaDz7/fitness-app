import { useState, useEffect } from 'react';
import { authService, firestoreService, storageService } from '../services/firebaseService';

// =================================
// Authentication Hooks
// =================================

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, displayName) => {
    setLoading(true);
    try {
      const user = await authService.registerUser(email, password, displayName);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const user = await authService.loginUser(email, password);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.logoutUser();
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
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
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestoreService.subscribeToDocument(
      collectionName,
      docId,
      (doc) => {
        setDocument(doc);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, docId]);

  return { document, loading, error };
}

export function useCollection(collectionName, queryOptions = {}) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firestoreService.subscribeToCollection(
      collectionName,
      (docs) => {
        setDocuments(docs);
        setLoading(false);
        setError(null);
      },
      queryOptions
    );

    return unsubscribe;
  }, [collectionName, JSON.stringify(queryOptions)]);

  return { documents, loading, error };
}

// =================================
// Storage Hooks
// =================================

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (uri, path) => {
    setUploading(true);
    setError(null);

    try {
      const downloadURL = await storageService.uploadImage(uri, path);
      return downloadURL;
    } catch (err) {
      setError(err);
      throw err;
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

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const userProfile = await firestoreService.getCollection('users', {
          where: ['userId', '==', userId]
        });
        setProfile(userProfile[0] || null);
      } catch (error) {
        console.error('獲取用戶資料失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates) => {
    if (profile) {
      try {
        await firestoreService.updateDocument('users', profile.id, updates);
        setProfile({ ...profile, ...updates });
      } catch (error) {
        console.error('更新用戶資料失敗:', error);
        throw error;
      }
    }
  };

  return { profile, loading, updateProfile };
}

export function useUserWorkouts(userId) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestoreService.subscribeToCollection(
      'workouts',
      (docs) => {
        setWorkouts(docs);
        setLoading(false);
      },
      {
        where: ['userId', '==', userId],
        orderBy: ['createdAt', 'desc']
      }
    );

    return unsubscribe;
  }, [userId]);

  const addWorkout = async (workoutData) => {
    try {
      await firestoreService.addDocument('workouts', {
        userId,
        ...workoutData
      });
    } catch (error) {
      console.error('新增訓練記錄失敗:', error);
      throw error;
    }
  };

  return { workouts, loading, addWorkout };
}

export function useCommunityPosts(limitCount = 20) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestoreService.subscribeToCollection(
      'posts',
      (docs) => {
        setPosts(docs);
        setLoading(false);
      },
      {
        orderBy: ['createdAt', 'desc'],
        limit: limitCount
      }
    );

    return unsubscribe;
  }, [limitCount]);

  const addPost = async (postData) => {
    try {
      await firestoreService.addDocument('posts', postData);
    } catch (error) {
      console.error('新增貼文失敗:', error);
      throw error;
    }
  };

  return { posts, loading, addPost };
} 