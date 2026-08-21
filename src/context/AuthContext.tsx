import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isUserAdmin, ADMIN_EMAILS } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  userRole: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        const shouldBeAdmin = ADMIN_EMAILS.includes(emailLower);

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
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              photoURL: user.photoURL || '',
              role: role,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            });
          }

          setUserRole(role);
          setIsAdmin(role === 'admin' || shouldBeAdmin);
        } catch (err) {
          console.error('Error syncing user profile with Firestore:', err);
          // Fallback to local admin email check
          setIsAdmin(shouldBeAdmin);
          setUserRole(shouldBeAdmin ? 'admin' : 'user');
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

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setAuthError(err?.message || 'Google sign-in failed. Please try again.');
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
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-email'
      ) {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please wait a moment or sign in with Google.';
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
    } catch (err: any) {
      console.error('Register Error:', err);
      let msg = err.message || 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please switch to Sign In.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setAuthError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
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
