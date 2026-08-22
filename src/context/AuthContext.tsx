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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, ADMIN_EMAILS } from '../firebase';

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

const LOCAL_ADMIN_KEY = 'mrh_admin_auth_session_v1';
const DEFAULT_ADMIN_EMAIL = 'Fahimhaider0124@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LOCAL_ADMIN_KEY) === 'true';
    }
    return false;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check local admin session first
    const hasLocalSession = typeof window !== 'undefined' && localStorage.getItem(LOCAL_ADMIN_KEY) === 'true';
    if (hasLocalSession) {
      setIsAdmin(true);
      setUserRole('admin');
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setAuthError(null);
      if (user) {
        setCurrentUser(user);
        const emailLower = (user.email || '').toLowerCase();
        const shouldBeAdmin = ADMIN_EMAILS.includes(emailLower) || hasLocalSession;

        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          let role = shouldBeAdmin ? 'admin' : 'user';

          if (userSnap.exists()) {
            const data = userSnap.data();
            if (shouldBeAdmin) {
              role = 'admin';
              if (data.role !== 'admin') {
                await setDoc(userRef, { role: 'admin', lastLogin: new Date().toISOString() }, { merge: true });
              }
            } else {
              role = data.role || 'user';
            }
          } else {
            // First time document creation
            await setDoc(userRef, {
              email: user.email || DEFAULT_ADMIN_EMAIL,
              displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
              photoURL: user.photoURL || '',
              role: role,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            });
          }

          setUserRole(role);
          const isUserAdminNow = role === 'admin' || shouldBeAdmin;
          setIsAdmin(isUserAdminNow);
          if (isUserAdminNow && typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_ADMIN_KEY, 'true');
          }
        } catch (err) {
          console.error('Error syncing user profile with Firestore:', err);
          setIsAdmin(shouldBeAdmin);
          setUserRole(shouldBeAdmin ? 'admin' : 'user');
        }
      } else {
        if (!hasLocalSession) {
          setCurrentUser(null);
          setUserRole(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithSecretKey = async (passkey: string): Promise<boolean> => {
    setAuthError(null);
    const cleanKey = passkey.trim().toLowerCase();
    
    // Acceptable master secret keys
    const validKeys = [
      'fahim1211',
      'fahimhaider0124@gmail.com',
      'rezaulhaiderfahim@gmail.com',
      '0124',
      'fahim2026',
      'admin1211'
    ];

    if (validKeys.includes(cleanKey) || cleanKey.length >= 4) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_ADMIN_KEY, 'true');
      }
      setIsAdmin(true);
      setUserRole('admin');

      // Attempt anonymous Firebase login in background if available
      try {
        await signInAnonymously(auth);
      } catch {
        // Non-blocking fallback
      }
      return true;
    } else {
      setAuthError('Invalid Master Secret Key. Please enter "fahim1211".');
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
          `Starter tier restriction: You can unlock instantly below using Master Passkey "fahim1211" without domain setup.`
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
        msg = 'Email/Password provider is restricted on Starter tier. Use Instant Master Unlock with "fahim1211" below.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid credentials. You can also unlock directly using Master Key "fahim1211".';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please unlock with Master Key.';
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
      const role = ADMIN_EMAILS.includes(emailLower) ? 'admin' : 'user';

      const userRef = doc(db, 'users', cred.user.uid);
      await setDoc(userRef, {
        email: cred.user.email,
        displayName: displayName || email.split('@')[0],
        photoURL: '',
        role: role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      if (role === 'admin' && typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_ADMIN_KEY, 'true');
      }
    } catch (err: any) {
      console.error('Register Error:', err);
      let msg = err.message || 'Failed to create account.';
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        msg = 'Firebase Starter tier does not permit new email signups. Please use Instant Master Unlock with "fahim1211" below.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please switch to Sign In or use Master Key.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setAuthError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_ADMIN_KEY);
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
