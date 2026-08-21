import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    isAdmin,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    authError,
    clearAuthError,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('Fahimhaider0124@gmail.com');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('Muhammad Rezaul Haider');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    clearAuthError();
    try {
      await loginWithGoogle();
      setSuccessMsg('Successfully signed in!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearAuthError();
    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        setSuccessMsg('Logged in successfully!');
      } else {
        await registerWithEmail(email, password, displayName);
        setSuccessMsg('Account registered and signed in!');
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f7f9fc] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/80 p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d8dadd] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full neumorphic-inset flex items-center justify-center text-[#004c4c]">
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#004c4c]">
                {currentUser ? 'Admin Account' : 'Admin Login'}
              </h2>
              <p className="text-xs text-[#486363]">
                {currentUser ? 'Manage your portfolio status' : 'Sign in to edit & delete content'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {currentUser ? (
          /* Already Signed In state */
          <div className="space-y-6 text-center py-4">
            <div className="neumorphic-inset-box p-5 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-[#004c4c] border border-teal-300">
                {isAdmin ? '🛡️ Administrator Access Active' : 'User (Viewer)'}
              </span>
              <p className="text-sm font-semibold text-[#191c1e] break-all">{currentUser.email}</p>
              <p className="text-xs text-[#486363]">
                You have full access to edit, add, and delete portfolio data and view visitor messages.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs transition-colors cursor-pointer"
              >
                Continue to Portfolio
              </button>
              <button
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl neumorphic-btn text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="space-y-5">
            {/* Quick Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl neumorphic-btn flex items-center justify-center gap-3 text-xs md:text-sm font-bold text-[#191c1e] hover:text-[#004c4c] transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-[#d8dadd]"></div>
              <span className="px-3 text-xs text-[#486363] uppercase tracking-wider font-semibold">
                Or with email
              </span>
              <div className="flex-grow border-t border-[#d8dadd]"></div>
            </div>

            {/* Mode switch */}
            <div className="flex rounded-xl neumorphic-inset p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  clearAuthError();
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin' ? 'bg-[#004c4c] text-white shadow-sm' : 'text-[#486363]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  clearAuthError();
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup' ? 'bg-[#004c4c] text-white shadow-sm' : 'text-[#486363]'
                }`}
              >
                Create Admin Account
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-sm shrink-0">error</span>
                <span>{authError}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-[#004c4c] text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Muhammad Rezaul Haider"
                    className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Fahimhaider0124@gmail.com"
                  className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
                  <span>{mode === 'signin' ? 'Sign In as Admin' : 'Register & Grant Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
