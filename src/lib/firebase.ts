import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  getRedirectResult,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  deleteDoc,
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, UserFileRecord, UserStorageStats, FileCategory } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const storage = getStorage(app, firebaseConfig.storageBucket ? `gs://${firebaseConfig.storageBucket}` : undefined);
export const googleProvider = new GoogleAuthProvider();

export const SUPERADMIN_EMAIL = 'beckylove2004@gmail.com';

// Test connection to Firestore on initialization
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration / internet connectivity.");
    }
  }
}
testFirestoreConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Context: ', JSON.stringify(errInfo));
}

/**
 * Helper to translate Firebase Auth error codes to user-friendly messages in Tigrinya and English
 */
export function parseFirebaseAuthError(error: any, lang: string = 'en'): string {
  const code = error?.code || '';
  const message = error?.message || '';

  if (code === 'auth/email-already-in-use') {
    return lang === 'ti' 
      ? 'እዚ ኢመይል ኣድራሻ ኣቐዲሙ ተመዝጊቡ ኣሎ። በጃኹም ብቐጥታ እተዉ (Sign In)።'
      : 'This email is already registered. Please sign in instead.';
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return lang === 'ti'
      ? 'ዝተጋገየ ኢመይል ወይ ፓስዎርድ። በጃኹም ኣረጋጊጽኩም ደጊምኩም ፈትኑ።'
      : 'Incorrect email or password. Please verify and try again.';
  }
  if (code === 'auth/weak-password') {
    return lang === 'ti'
      ? 'ፓስዎርድ ድኹም እዩ። ብውሑዱ 6 ፊደላት ተጠቐሙ።'
      : 'Password is too weak. Please use at least 6 characters.';
  }
  if (code === 'auth/invalid-email') {
    return lang === 'ti'
      ? 'ዘይቅኑዕ ኢመይል ኣድራሻ።'
      : 'Please enter a valid email address.';
  }
  if (code === 'auth/too-many-requests') {
    return lang === 'ti'
      ? 'ብዙሕ ዘይዕዉት ፈተነታት ተገይሩ። በጃኹም ሒደት ደቓይቕ ጸኒሕኩም ፈትኑ ወይ ፓስዎርድኩም ቀይሩ።'
      : 'Access temporarily blocked due to many failed attempts. Try again later or reset password.';
  }
  if (code === 'auth/user-disabled') {
    return lang === 'ti'
      ? 'እዚ ናይ ተጠቃሚ ኣካውንት ተዓጽዩ ኣሎ።'
      : 'This user account has been disabled.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return lang === 'ti'
      ? 'ናይ ጉግል መእተዊ መስኮት ብተጠቃሚ ተዓጽዩ።'
      : 'Google sign-in popup was closed before completing.';
  }

  return message || (lang === 'ti' ? 'ናይ መእተዊ ጌጋ ኣጋጢሙ ኣሎ።' : 'Authentication error occurred.');
}

/**
 * Helper to get clean document ID for user
 */
export function getCleanUserId(emailOrUid: string): string {
  return emailOrUid.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/* =========================================================================
   1. USER AUTHENTICATION (EMAIL/PASSWORD & GOOGLE)
   ========================================================================= */

/**
 * Register a new user with Email and Password
 */
export async function registerWithFirebase(
  email: string, 
  password: string, 
  fullName: string, 
  role: string = 'Free Member'
): Promise<{ user: UserProfile; firebaseUser: FirebaseUser }> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const fbUser = userCredential.user;

  if (fullName && fbUser) {
    try {
      await updateProfile(fbUser, { displayName: fullName });
    } catch (e) {
      console.warn('Could not set displayName on Firebase user:', e);
    }
  }

  const isSuperadmin = email.trim().toLowerCase() === SUPERADMIN_EMAIL;
  const userProfile: UserProfile = {
    id: fbUser.uid || getCleanUserId(email),
    name: fullName || (isSuperadmin ? 'Becky Love (Superadmin)' : 'Axumite Member'),
    email: email.trim().toLowerCase(),
    phoneNumber: '+291 7 000000',
    isPhoneVerified: isSuperadmin,
    isEmailVerified: fbUser.emailVerified || isSuperadmin,
    avatar: isSuperadmin ? '👑' : '🦁',
    role: isSuperadmin ? 'Creator' : (role as any),
    preferredLanguage: 'ti-ER',
    isLoggedIn: true,
    joinedDate: new Date().toISOString(),
    offlineAccessEnabled: true,
    savedInsightsCount: 0,
  };

  await syncUserProfileToFirestore(userProfile);
  return { user: userProfile, firebaseUser: fbUser };
}

/**
 * Sign in existing user with Email and Password
 */
export async function loginWithFirebase(
  email: string, 
  password: string
): Promise<{ user: UserProfile; firebaseUser: FirebaseUser }> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const fbUser = userCredential.user;

  const isSuperadmin = email.trim().toLowerCase() === SUPERADMIN_EMAIL;
  let profile = await fetchUserProfileFromFirestore(email);

  if (!profile) {
    profile = {
      id: fbUser.uid || getCleanUserId(email),
      name: fbUser.displayName || (isSuperadmin ? 'Becky Love (Superadmin)' : 'Axumite User'),
      email: email.trim().toLowerCase(),
      phoneNumber: '+291 7 000000',
      isPhoneVerified: isSuperadmin,
      isEmailVerified: fbUser.emailVerified || isSuperadmin,
      avatar: isSuperadmin ? '👑' : '🦁',
      role: isSuperadmin ? 'Creator' : 'Free Member',
      preferredLanguage: 'ti-ER',
      isLoggedIn: true,
      joinedDate: new Date().toISOString(),
      offlineAccessEnabled: true,
      savedInsightsCount: 0,
    };
    await syncUserProfileToFirestore(profile);
  } else {
    profile.isLoggedIn = true;
    if (isSuperadmin) profile.role = 'Creator';
    await syncUserProfileToFirestore(profile);
  }

  return { user: profile, firebaseUser: fbUser };
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogleFirebase(): Promise<{ user: UserProfile; firebaseUser: FirebaseUser }> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;
  const email = fbUser.email || '';
  const isSuperadmin = email.trim().toLowerCase() === SUPERADMIN_EMAIL;

  let profile = await fetchUserProfileFromFirestore(email);

  if (!profile) {
    profile = {
      id: fbUser.uid || getCleanUserId(email),
      name: fbUser.displayName || (isSuperadmin ? 'Becky Love (Superadmin)' : 'Axumite User'),
      email: email.trim().toLowerCase(),
      phoneNumber: fbUser.phoneNumber || '+291 7 000000',
      isPhoneVerified: !!fbUser.phoneNumber || isSuperadmin,
      isEmailVerified: fbUser.emailVerified || isSuperadmin,
      avatar: fbUser.photoURL || (isSuperadmin ? '👑' : '🦁'),
      role: isSuperadmin ? 'Creator' : 'Free Member',
      preferredLanguage: 'ti-ER',
      isLoggedIn: true,
      joinedDate: new Date().toISOString(),
      offlineAccessEnabled: true,
      savedInsightsCount: 0,
    };
    await syncUserProfileToFirestore(profile);
  } else {
    profile.isLoggedIn = true;
    if (isSuperadmin) profile.role = 'Creator';
    if (fbUser.displayName && !profile.name) profile.name = fbUser.displayName;
    await syncUserProfileToFirestore(profile);
  }

  return { user: profile, firebaseUser: fbUser };
}

/**
 * Send password reset email
 */
export async function sendFirebasePasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to send password reset email' };
  }
}

/**
 * Log out user from Firebase and clear cloud session
 */
export async function logoutFromFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Firebase logout notice:', err);
  }
}

/**
 * Listen to Firebase Auth state changes
 */
export function onFirebaseAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Handle and resolve Firebase Auth redirect results to prevent session errors during initial login sequence
 */
export async function handleFirebaseRedirectResult(): Promise<UserProfile | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const fbUser = result.user;
      const email = fbUser.email || '';
      if (!email) return null;

      const isSuperadmin = email.trim().toLowerCase() === SUPERADMIN_EMAIL;
      let profile = await fetchUserProfileFromFirestore(email);

      if (!profile) {
        profile = {
          id: fbUser.uid || getCleanUserId(email),
          name: fbUser.displayName || (isSuperadmin ? 'Becky Love (Superadmin)' : 'Axumite Member'),
          email: email.trim().toLowerCase(),
          phoneNumber: fbUser.phoneNumber || '+291 7 000000',
          isPhoneVerified: !!fbUser.phoneNumber || isSuperadmin,
          isEmailVerified: fbUser.emailVerified || isSuperadmin,
          avatar: fbUser.photoURL || (isSuperadmin ? '👑' : '🦁'),
          role: isSuperadmin ? 'Creator' : 'Free Member',
          preferredLanguage: 'ti-ER',
          isLoggedIn: true,
          joinedDate: new Date().toISOString(),
          offlineAccessEnabled: true,
          savedInsightsCount: 0,
        };
        await syncUserProfileToFirestore(profile);
      } else {
        profile.isLoggedIn = true;
        if (isSuperadmin) profile.role = 'Creator';
        if (fbUser.displayName && !profile.name) profile.name = fbUser.displayName;
        await syncUserProfileToFirestore(profile);
      }

      return profile;
    }
  } catch (error: any) {
    // Gracefully handle redirect errors (such as user-cancelled, network timeout, or iframe restrictions)
    console.warn('Firebase Redirect Result handler note (handled gracefully):', error);
  }
  return null;
}

/* =========================================================================
   2. USER-SPECIFIC DATABASE & PROFILE MANAGEMENT
   ========================================================================= */

/**
 * Sync user profile to Firestore
 */
export async function syncUserProfileToFirestore(user: Partial<UserProfile>): Promise<void> {
  if (!user.email) return;
  try {
    const userId = getCleanUserId(user.email);
    const userDocRef = doc(db, 'users', userId);
    
    await setDoc(userDocRef, {
      ...user,
      id: user.id || userId,
      email: user.email.toLowerCase(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore sync profile notice:', error);
  }
}

/**
 * Fetch user profile from Firestore
 */
export async function fetchUserProfileFromFirestore(email: string): Promise<UserProfile | null> {
  if (!email) return null;
  try {
    const userId = getCleanUserId(email);
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (error) {
    console.warn('Firestore fetch profile notice:', error);
  }
  return null;
}

/**
 * Upload a user avatar image to Firebase Storage and update the user profile in Firestore
 */
export async function uploadAvatarToFirebaseStorage(
  fileOrBlob: File | Blob | string,
  userEmail: string,
  userId?: string
): Promise<{ success: boolean; downloadUrl: string; error?: string }> {
  const cleanId = getCleanUserId(userEmail || userId || 'guest');
  const timestamp = Date.now();
  let downloadUrl = '';

  try {
    if (typeof fileOrBlob === 'string') {
      if (fileOrBlob.startsWith('data:')) {
        const storagePath = `avatars/${cleanId}_${timestamp}`;
        const fileRef = storageRef(storage, storagePath);
        await uploadString(fileRef, fileOrBlob, 'data_url');
        downloadUrl = await getDownloadURL(fileRef);
      } else {
        downloadUrl = fileOrBlob;
      }
    } else {
      const ext = (fileOrBlob instanceof File && fileOrBlob.name.includes('.')) 
        ? fileOrBlob.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'jpg'
        : 'jpg';
      const storagePath = `avatars/${cleanId}_${timestamp}.${ext}`;
      const fileRef = storageRef(storage, storagePath);
      const contentType = fileOrBlob.type || 'image/jpeg';
      
      const uploadResult = await uploadBytes(fileRef, fileOrBlob, {
        contentType,
        customMetadata: {
          uploadedBy: userEmail || cleanId,
          type: 'user_avatar',
          updatedAt: new Date().toISOString()
        }
      });
      downloadUrl = await getDownloadURL(uploadResult.ref);
    }
  } catch (storageErr) {
    console.warn('Firebase Storage avatar upload note (applying robust fallback):', storageErr);
  }

  // If Firebase Storage did not return a URL (e.g. offline/storage config), generate safe dataUrl fallback
  if (!downloadUrl && typeof fileOrBlob !== 'string') {
    try {
      downloadUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBlob as Blob);
      });
    } catch (readErr) {
      console.warn('Fallback data URL generation error:', readErr);
    }
  } else if (!downloadUrl && typeof fileOrBlob === 'string') {
    downloadUrl = fileOrBlob;
  }

  if (!downloadUrl) {
    return { success: false, downloadUrl: '', error: 'Failed to process image' };
  }

  // 1. Update Firestore user document
  try {
    const userDocRef = doc(db, 'users', cleanId);
    await setDoc(userDocRef, {
      avatar: downloadUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (firestoreErr) {
    handleFirestoreError(firestoreErr, OperationType.UPDATE, `users/${cleanId}`);
  }

  // 2. Also update Firebase Auth profile photoURL if user is signed in
  try {
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      await updateProfile(auth.currentUser, { photoURL: downloadUrl });
    }
  } catch (authErr) {
    console.warn('Could not update Firebase Auth photoURL:', authErr);
  }

  return { success: true, downloadUrl };
}

/* =========================================================================
   3. USER FILE STORAGE & METADATA DATABASE
   ========================================================================= */

const LOCAL_STORAGE_FILES_KEY = 'axumite_user_file_vault';

/**
 * Get fallback local files
 */
function getLocalFiles(): UserFileRecord[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_FILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save fallback local files
 */
function saveLocalFiles(files: UserFileRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_FILES_KEY, JSON.stringify(files));
  } catch (e) {
    console.warn('Local storage file cache limit reached:', e);
  }
}

/**
 * Upload a File, Blob, or Data URL directly to Firebase Storage bucket and save metadata to Firestore
 */
export async function uploadFileToFirebaseStorage(
  fileOrBlob: File | Blob | string,
  fileName: string,
  userEmail: string,
  meta: {
    category: FileCategory;
    description?: string;
    tags?: string[];
    userId?: string;
    fileSize?: number;
    fileType?: string;
  }
): Promise<UserFileRecord> {
  const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const userId = getCleanUserId(userEmail || meta.userId || 'guest');
  const now = new Date().toISOString();
  
  let downloadUrl = '';
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `users/${userId}/files/${fileId}_${cleanFileName}`;
  
  let detectedType = meta.fileType || 'application/octet-stream';
  let size = meta.fileSize || 0;
  let previewData: string | undefined = undefined;

  try {
    const fileRef = storageRef(storage, storagePath);

    if (typeof fileOrBlob === 'string') {
      // It's a Data URL or base64 string
      if (fileOrBlob.startsWith('data:')) {
        await uploadString(fileRef, fileOrBlob, 'data_url');
        downloadUrl = await getDownloadURL(fileRef);
        previewData = fileOrBlob.length < 300000 ? fileOrBlob : undefined;
      }
    } else {
      // It's a File or Blob
      detectedType = fileOrBlob.type || detectedType;
      size = fileOrBlob.size || size;
      const uploadResult = await uploadBytes(fileRef, fileOrBlob, {
        contentType: detectedType,
        customMetadata: {
          originalName: fileName,
          uploadedBy: userEmail,
          category: meta.category
        }
      });
      downloadUrl = await getDownloadURL(uploadResult.ref);
    }
  } catch (storageErr) {
    console.warn('Firebase Storage upload note (persisting with local/firestore fallback):', storageErr);
  }

  // Build full record
  const fullRecord: UserFileRecord = {
    id: fileId,
    userId,
    userEmail: userEmail.toLowerCase(),
    fileName,
    fileSize: size,
    fileType: detectedType,
    category: meta.category,
    downloadUrl: downloadUrl || undefined,
    storagePath,
    fileData: previewData || (downloadUrl ? downloadUrl : (typeof fileOrBlob === 'string' ? fileOrBlob : undefined)),
    description: meta.description || `Uploaded on ${new Date().toLocaleDateString()}`,
    uploadDate: now,
    updatedAt: now,
    tags: meta.tags || [meta.category],
    isEncrypted: true,
  };

  // 1. Update local cache immediately
  const localList = getLocalFiles();
  const filtered = localList.filter(f => f.id !== fileId);
  filtered.unshift(fullRecord);
  saveLocalFiles(filtered);

  // 2. Persist to Firestore
  try {
    const userFileRef = doc(db, 'users', userId, 'files', fileId);
    await setDoc(userFileRef, fullRecord);

    const directFileRef = doc(db, 'userFiles', fileId);
    await setDoc(directFileRef, fullRecord);
  } catch (firestoreErr) {
    console.warn('Firestore file metadata upload notice:', firestoreErr);
  }

  return fullRecord;
}

/**
 * Upload and save a user file to Firestore and local vault (backward compatible & connects to storage)
 */
export async function uploadUserFileToFirestore(fileRecord: Omit<UserFileRecord, 'id' | 'uploadDate'> & { id?: string }): Promise<UserFileRecord> {
  const fileId = fileRecord.id || `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date().toISOString();
  const userId = getCleanUserId(fileRecord.userEmail || fileRecord.userId);
  const cleanFileName = fileRecord.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = fileRecord.storagePath || `users/${userId}/files/${fileId}_${cleanFileName}`;

  let downloadUrl = fileRecord.downloadUrl || '';

  // If fileData is a data_url, upload to Firebase Storage
  if (!downloadUrl && fileRecord.fileData && fileRecord.fileData.startsWith('data:')) {
    try {
      const fileRef = storageRef(storage, storagePath);
      await uploadString(fileRef, fileRecord.fileData, 'data_url');
      downloadUrl = await getDownloadURL(fileRef);
    } catch (storageErr) {
      console.warn('Firebase Storage upload string note:', storageErr);
    }
  }

  const fullRecord: UserFileRecord = {
    ...fileRecord,
    id: fileId,
    userId,
    userEmail: fileRecord.userEmail.toLowerCase(),
    downloadUrl: downloadUrl || undefined,
    storagePath,
    uploadDate: now,
    updatedAt: now,
    tags: fileRecord.tags || [fileRecord.category],
  };

  // 1. Always update local storage cache immediately for instant UI response
  const localList = getLocalFiles();
  const filtered = localList.filter(f => f.id !== fileId);
  filtered.unshift(fullRecord);
  saveLocalFiles(filtered);

  // 2. Persist to Firestore user subcollection & direct collection
  try {
    const userFileRef = doc(db, 'users', userId, 'files', fileId);
    await setDoc(userFileRef, fullRecord);

    const directFileRef = doc(db, 'userFiles', fileId);
    await setDoc(directFileRef, fullRecord);
  } catch (error) {
    console.warn('Firestore file upload notice (cached locally):', error);
  }

  return fullRecord;
}

/**
 * Fetch all files belonging to the specific user
 */
export async function fetchUserFilesFromFirestore(userEmail: string, userId?: string): Promise<UserFileRecord[]> {
  const cleanId = getCleanUserId(userEmail || userId || '');
  const localList = getLocalFiles().filter(f => 
    f.userEmail?.toLowerCase() === userEmail?.toLowerCase() || f.userId === cleanId
  );

  if (!cleanId) return localList;

  try {
    const userFilesCol = collection(db, 'users', cleanId, 'files');
    const snap = await getDocs(userFilesCol);
    
    if (!snap.empty) {
      const cloudFiles: UserFileRecord[] = [];
      snap.forEach((docSnap) => {
        cloudFiles.push(docSnap.data() as UserFileRecord);
      });

      // Merge cloud and local unique items
      const mergedMap = new Map<string, UserFileRecord>();
      cloudFiles.forEach(f => mergedMap.set(f.id, f));
      localList.forEach(f => {
        if (!mergedMap.has(f.id)) mergedMap.set(f.id, f);
      });

      const mergedList = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
      saveLocalFiles(mergedList);
      return mergedList;
    }
  } catch (error) {
    console.warn('Firestore fetch user files notice (using local files):', error);
  }

  return localList;
}

/**
 * Delete a user's file from Firestore, Firebase Storage, and local storage
 */
export async function deleteUserFileFromFirestore(userEmail: string, fileId: string, storagePath?: string): Promise<boolean> {
  const cleanId = getCleanUserId(userEmail);

  // 1. Update local storage immediately
  const localList = getLocalFiles();
  const fileToDelete = localList.find(f => f.id === fileId);
  const updated = localList.filter(f => f.id !== fileId);
  saveLocalFiles(updated);

  const pathToUse = storagePath || fileToDelete?.storagePath;

  // 2. Delete from Firebase Storage
  if (pathToUse) {
    try {
      const fileRef = storageRef(storage, pathToUse);
      await deleteObject(fileRef);
    } catch (storageErr) {
      console.warn('Firebase Storage delete notice:', storageErr);
    }
  }

  // 3. Delete from Firestore
  try {
    if (cleanId) {
      const userFileRef = doc(db, 'users', cleanId, 'files', fileId);
      await deleteDoc(userFileRef);
    }
    const directFileRef = doc(db, 'userFiles', fileId);
    await deleteDoc(directFileRef);
    return true;
  } catch (error) {
    console.warn('Firestore delete file notice:', error);
    return true;
  }
}

/**
 * Calculate user storage statistics and quota
 */
export async function getUserStorageStats(userEmail: string, role?: string): Promise<UserStorageStats> {
  const files = await fetchUserFilesFromFirestore(userEmail);
  
  // Storage Quota by role
  let quotaBytes = 50 * 1024 * 1024; // 50MB for Free Member
  if (role === 'Creator' || userEmail.toLowerCase() === SUPERADMIN_EMAIL) {
    quotaBytes = 5 * 1024 * 1024 * 1024; // 5GB for Superadmin Creator
  } else if (role === 'Axumite Sovereign Scholar' || role === 'Admin') {
    quotaBytes = 2 * 1024 * 1024 * 1024; // 2GB for Scholar / Admin
  } else if (role === 'ኣክሱማይት AI Pro') {
    quotaBytes = 500 * 1024 * 1024; // 500MB for AI Pro
  }

  let usedBytes = 0;
  const categoryBreakdown = {
    document: 0,
    image: 0,
    audio: 0,
    geez_script: 0,
    video: 0,
    other: 0,
  };

  files.forEach(f => {
    usedBytes += f.fileSize || 0;
    const cat = f.category as FileCategory;
    if (categoryBreakdown[cat] !== undefined) {
      categoryBreakdown[cat] += f.fileSize || 0;
    } else {
      categoryBreakdown.other += f.fileSize || 0;
    }
  });

  return {
    usedBytes,
    quotaBytes,
    fileCount: files.length,
    categoryBreakdown,
  };
}

/* =========================================================================
   4. CHAT HISTORY DATABASE
   ========================================================================= */

/**
 * Save chat message to Firestore
 */
export async function saveChatMessageToFirestore(
  email: string, 
  conversationId: string, 
  message: { sender: 'user' | 'assistant'; text: string; timestamp: string; tigrinyaAudio?: string }
): Promise<void> {
  if (!email) return;
  try {
    const userId = getCleanUserId(email);
    const convRef = doc(db, 'users', userId, 'conversations', conversationId);
    
    const existing = await getDoc(convRef);
    const existingMessages = existing.exists() ? (existing.data().messages || []) : [];
    
    await setDoc(convRef, {
      userId,
      userEmail: email.toLowerCase(),
      messages: [...existingMessages, message],
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore save chat notice:', error);
  }
}

