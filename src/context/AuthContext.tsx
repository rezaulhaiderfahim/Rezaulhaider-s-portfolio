import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { sha256 } from '../utils/cryptoAuth';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  userRole: string | null;
  loading: boolean;
  loginWithSecretKey: (passkey: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * SECURITY ARCHITECTURE:
 * - Admin authorization is strictly passkey-based and verified server-side via Firestore Security Rules.
 * - Client-side state cannot be forged because all privileged Firestore operations are validated
 *   against security rules on every request (evaluating admin_sessions/{uid} vs config/adminAuth).
 * - Anonymous Firebase Authentication is used to provide the `request.auth` context required
 *   by Firestore Security Rules without requiring Google OAuth or email sign-in.
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
        // Verify if an active, valid passkey session exists in Firestore
        try {
          const sessionRef = doc(db, 'admin_sessions', user.uid);
          const sessionSnap = await getDoc(sessionRef);
          if (sessionSnap.exists()) {
            setIsAdmin(true);
            setUserRole('admin');
          } else {
            setIsAdmin(false);
            setUserRole('visitor');
          }
        } catch {
          setIsAdmin(false);
          setUserRole('visitor');
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
   * Master Passkey Authentication Flow:
   * 1. Hashes the user's entered passkey using native SHA-256 client-side.
   * 2. Establishes a Firebase Auth session (via signInAnonymously) to provide `request.auth`.
   * 3. Attempts to write to `admin_sessions/{uid}` with the computed passkeyHash.
   * 4. Cloud Firestore Security Rules validate that `request.resource.data.passkeyHash == config/adminAuth.passkeyHash`.
   * 5. If the passkey is correct, the document is written and unlocks full admin privileges.
   * 6. If wrong, Firestore rejects the write with permission-denied.
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
        try {
          const userCredential = await signInAnonymously(auth);
          user = userCredential.user;
        } catch (authErr: any) {
          console.error('Anonymous auth error:', authErr);
          if (
            authErr?.code === 'auth/admin-restricted-operation' ||
            authErr?.code === 'auth/operation-not-allowed'
          ) {
            setAuthError(
              'Anonymous sign-in is disabled in Firebase Console. Enable it under Authentication > Sign-in method > Anonymous.'
            );
          } else {
            setAuthError(
              authErr?.message || 'Authentication error: Could not initialize session.'
            );
          }
          setIsAdmin(false);
          setUserRole(null);
          return false;
        }
      }

      if (!user) {
        throw new Error('Unable to initialize authentication session.');
      }

      // 3. Attempt to establish the verified session document in Firestore
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

      if (
        err?.code === 'auth/admin-restricted-operation' ||
        err?.code === 'auth/operation-not-allowed'
      ) {
        setAuthError(
          'Anonymous sign-in is disabled in Firebase Console. Enable it under Authentication > Sign-in method > Anonymous.'
        );
      } else if (
        err?.code === 'permission-denied' ||
        err?.message?.includes('permission-denied') ||
        err?.message?.includes('Missing or insufficient permissions')
      ) {
        setAuthError(
          'Access Denied: Invalid Master Passkey or unconfigured server document (config/adminAuth).'
        );
      } else {
        setAuthError(err?.message || 'Authentication error during passkey verification.');
      }
      return false;
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
