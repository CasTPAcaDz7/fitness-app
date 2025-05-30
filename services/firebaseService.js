import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, auth, storage } from '../config/firebase';

// =================================
// Firestore 服務
// =================================

export const firestoreService = {
  // 新增文檔
  async addDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ 文檔已新增，ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ 新增文檔失敗:', error);
      throw error;
    }
  },

  // 獲取單一文檔
  async getDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log('📄 文檔不存在');
        return null;
      }
    } catch (error) {
      console.error('❌ 獲取文檔失敗:', error);
      throw error;
    }
  },

  // 獲取集合中的所有文檔
  async getCollection(collectionName, queryOptions = {}) {
    try {
      let q = collection(db, collectionName);
      
      // 添加查詢條件
      if (queryOptions.where) {
        q = query(q, where(...queryOptions.where));
      }
      if (queryOptions.orderBy) {
        q = query(q, orderBy(...queryOptions.orderBy));
      }
      if (queryOptions.limit) {
        q = query(q, limit(queryOptions.limit));
      }

      const querySnapshot = await getDocs(q);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error('❌ 獲取集合失敗:', error);
      throw error;
    }
  },

  // 更新文檔
  async updateDocument(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      console.log('✅ 文檔已更新');
    } catch (error) {
      console.error('❌ 更新文檔失敗:', error);
      throw error;
    }
  },

  // 刪除文檔
  async deleteDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      console.log('✅ 文檔已刪除');
    } catch (error) {
      console.error('❌ 刪除文檔失敗:', error);
      throw error;
    }
  },

  // 即時監聽文檔變化
  subscribeToDocument(collectionName, docId, callback) {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  },

  // 即時監聽集合變化
  subscribeToCollection(collectionName, callback, queryOptions = {}) {
    let q = collection(db, collectionName);
    
    if (queryOptions.where) {
      q = query(q, where(...queryOptions.where));
    }
    if (queryOptions.orderBy) {
      q = query(q, orderBy(...queryOptions.orderBy));
    }
    if (queryOptions.limit) {
      q = query(q, limit(queryOptions.limit));
    }

    return onSnapshot(q, (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      callback(documents);
    });
  }
};

// =================================
// Authentication 服務
// =================================

export const authService = {
  // 註冊新用戶
  async registerUser(email, password, displayName = '') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 更新用戶資料
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      console.log('✅ 用戶註冊成功:', user.uid);
      return user;
    } catch (error) {
      console.error('❌ 用戶註冊失敗:', error);
      throw error;
    }
  },

  // 用戶登入
  async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ 用戶登入成功:', user.uid);
      return user;
    } catch (error) {
      console.error('❌ 用戶登入失敗:', error);
      throw error;
    }
  },

  // 用戶登出
  async logoutUser() {
    try {
      await signOut(auth);
      console.log('✅ 用戶已登出');
    } catch (error) {
      console.error('❌ 用戶登出失敗:', error);
      throw error;
    }
  },

  // 發送密碼重置郵件
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ 密碼重置郵件已發送');
    } catch (error) {
      console.error('❌ 發送密碼重置郵件失敗:', error);
      throw error;
    }
  },

  // 更新用戶資料
  async updateUserProfile(updates) {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, updates);
        console.log('✅ 用戶資料已更新');
      }
    } catch (error) {
      console.error('❌ 更新用戶資料失敗:', error);
      throw error;
    }
  },

  // 監聽認證狀態變化
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // 獲取當前用戶
  getCurrentUser() {
    return auth.currentUser;
  }
};

// =================================
// Storage 服務
// =================================

export const storageService = {
  // 上傳文件
  async uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ 文件上傳成功:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ 文件上傳失敗:', error);
      throw error;
    }
  },

  // 上傳圖片（針對 React Native）
  async uploadImage(uri, path) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ 圖片上傳成功:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ 圖片上傳失敗:', error);
      throw error;
    }
  },

  // 獲取文件下載 URL
  async getDownloadURL(path) {
    try {
      const storageRef = ref(storage, path);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('❌ 獲取下載 URL 失敗:', error);
      throw error;
    }
  },

  // 刪除文件
  async deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      console.log('✅ 文件已刪除');
    } catch (error) {
      console.error('❌ 刪除文件失敗:', error);
      throw error;
    }
  }
};

// =================================
// 健身應用專用服務
// =================================

export const fitnessService = {
  // 用戶相關
  async createUserProfile(userId, profileData) {
    return await firestoreService.addDocument('users', {
      userId,
      ...profileData
    });
  },

  async getUserProfile(userId) {
    const users = await firestoreService.getCollection('users', {
      where: ['userId', '==', userId]
    });
    return users[0] || null;
  },

  // 訓練記錄
  async addWorkout(userId, workoutData) {
    return await firestoreService.addDocument('workouts', {
      userId,
      ...workoutData
    });
  },

  async getUserWorkouts(userId) {
    return await firestoreService.getCollection('workouts', {
      where: ['userId', '==', userId],
      orderBy: ['createdAt', 'desc']
    });
  },

  // 社群功能
  async addPost(userId, postData) {
    return await firestoreService.addDocument('posts', {
      userId,
      ...postData
    });
  },

  async getPosts(limitCount = 20) {
    return await firestoreService.getCollection('posts', {
      orderBy: ['createdAt', 'desc'],
      limit: limitCount
    });
  }
}; 