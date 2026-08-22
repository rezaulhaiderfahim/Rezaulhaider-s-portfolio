import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, googleProvider, ADMIN_EMAILS } from '../firebase';
import { sha256 } from '../utils/cryptoAuth';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  userRole: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  loginWithSecretKey: (passkey: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_EMAIL = 'Fahimhaider0124@gmail.com';

/**
 * SECURITY ARCHITECTURE NOTE:
 * - Admin authorization is verified exclusively server-side via Firestore Security Rules.
 * - LocalStorage flags are NOT used as an authorization authority; arbitrary client-side tampering
 *   in DevTools will fail on any Firestore write because Firestore Security Rules enforce:
 *   1) Verified Google Admin Email (request.auth.token.email in admin list), OR
 *   2) A cryptographically verified session document in admin_sessions/{uid} where
 *      passkeyHash matches config/adminAuth.passkeyHash.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setAuthError(null);

      if (user) {
        setCurrentUser(user);
        const emailLower = (user.email || '').toLowerCase();
        const isGoogleAdmin = ADMIN_EMAILS.includes(emailLower);

        if (isGoogleAdmin) {
          setIsAdmin(true);
          setUserRole('admin');
          try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(
              userRef,
              {
                email: user.email || DEFAULT_ADMIN_EMAIL,
                displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
                photoURL: user.photoURL || '',
                role: 'admin',
                lastLogin: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (err) {
            console.warn('Profile sync notice:', err);
          }
        } else {
          // For anonymous or non-Google users, verify if an active session document exists in Firestore
          try {
            const sessionRef = doc(db, 'admin_sessions', user.uid);
            const sessionSnap = await getDoc(sessionRef);
            if (sessionSnap.exists()) {
              setIsAdmin(true);
              setUserRole('admin');
            } else {
              setIsAdmin(false);
              setUserRole(user.isAnonymous ? 'anonymous' : 'user');
            }
          } catch {
            setIsAdmin(false);
            setUserRole(user.isAnonymous ? 'anonymous' : 'user');
          }
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Cryptographic Passkey Login via Firestore Rules:
   * 1. Hashes the entered passkey using SHA-256 client-side.
   * 2. Establishes an authenticated Firebase session (e.g. anonymous auth).
   * 3. Attempts to write to admin_sessions/{uid} with the computed passkeyHash.
   * 4. Cloud Firestore Security Rules validate that passkeyHash == config/adminAuth.passkeyHash.
   * 5. If the passkey is wrong, Firestore rejects the write with permission-denied.
   * 6. If the passkey is correct, the document is written and unlocks admin privileges.
   */
  const loginWithSecretKey = async (passkey: string): Promise<boolean> => {
    setAuthError(null);
    const cleanKey = passkey.trim();
    if (!cleanKey) {
      setAuthError('Please enter a valid passkey.');
      return false;
    }

    try {
      // 1. Compute SHA-256 hash
      const computedHash = await sha256(cleanKey);

      // 2. Ensure Firebase Auth session exists for request.auth context
      let user = auth.currentUser;
      if (!user) {
        const userCredential = await signInAnonymously(auth);
        user = userCredential.user;
      }

      if (!user) {
        throw new Error('Unable to initialize authentication session.');
      }

      // 3. Attempt to establish the verified session in Firestore
      const sessionRef = doc(db, 'admin_sessions', user.uid);
      await setDoc(sessionRef, {
        passkeyHash: computedHash,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      });

      // 4. If setDoc succeeded, Firestore Rules confirmed the hash matches config/adminAuth.passkeyHash
      setCurrentUser(user);
      setIsAdmin(true);
      setUserRole('admin');
      return true;
    } catch (err: any) {
      console.error('Passkey verification error:', err);
      setIsAdmin(false);
      setUserRole(null);

      if (err?.code === 'permission-denied' || err?.message?.includes('permission-denied') || err?.message?.includes('Missing or insufficient permissions')) {
        setAuthError('Access Denied: Invalid Master Passkey or unconfigured server document (config/adminAuth).');
      } else {
        setAuthError(err?.message || 'Authentication error during passkey verification.');
      }
      return false;
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err?.code === 'auth/unauthorized-domain') {
        setAuthError(
          `Domain authorization notice: You can unlock instantly using Master Passkey below.`
        );
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was closed.');
      } else if (err?.code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by browser. Please use Master Passkey below.');
      } else {
        setAuthError(err?.message || 'Google sign-in failed. Please use Master Passkey below.');
      }
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (err: any) {
      console.error('Email Login Error:', err);
      let msg = 'Authentication failed.';
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        msg = 'Email/Password sign-in unavailable. Please use Master Passkey below.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid credentials. You can also unlock directly using Master Passkey below.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please unlock with Master Passkey.';
      } else {
        msg = err.message || 'Login error.';
      }
      setAuthError(msg);
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, displayName?: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const emailLower = (cred.user.email || '').toLowerCase();
      const isGoogleAdmin = ADMIN_EMAILS.includes(emailLower);
      const role = isGoogleAdmin ? 'admin' : 'user';

      const userRef = doc(db, 'users', cred.user.uid);
      await setDoc(userRef, {
        email: cred.user.email,
        displayName: displayName || email.split('@')[0],
        photoURL: '',
        role: role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Register Error:', err);
      let msg = err.message || 'Failed to create account.';
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        msg = 'Account creation restricted. Please use Master Passkey below to access.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please switch to Sign In or use Master Passkey.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setAuthError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        const sessionRef = doc(db, 'admin_sessions', auth.currentUser.uid);
        await deleteDoc(sessionRef).catch(() => {});
      }
      setIsAdmin(false);
      setUserRole(null);
      setCurrentUser(null);
      await fbSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        userRole,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginWithSecretKey,
        logout,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
