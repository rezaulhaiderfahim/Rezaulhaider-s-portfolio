import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Publication, ResearchExperience, AwardItem, ExperienceItem, ContactMessage, NotePost } from '../../types';
import { ToolkitLogo } from '../ToolkitLogos';
import { ProfileModalTab } from '../admin/EditProfileModal';

interface AdminPageScreenProps {
  onOpenProfileModal: (tab?: ProfileModalTab) => void;
  onOpenNewPublicationModal: () => void;
  onEditPublication: (pub: Publication) => void;
  onOpenNewTimelineModal: () => void;
  onEditTimeline: (item: ResearchExperience) => void;
  onOpenNewAwardModal: () => void;
  onEditAward: (award: AwardItem) => void;
  onOpenNewExperienceModal: () => void;
  onEditExperience: (exp: ExperienceItem) => void;
  onOpenNewNoteModal: () => void;
  onEditNote: (note: NotePost) => void;
  onNavigateHome: () => void;
}

export const AdminPageScreen: React.FC<AdminPageScreenProps> = ({
  onOpenProfileModal,
  onOpenNewPublicationModal,
  onEditPublication,
  onOpenNewTimelineModal,
  onEditTimeline,
  onOpenNewAwardModal,
  onEditAward,
  onOpenNewExperienceModal,
  onEditExperience,
  onOpenNewNoteModal,
  onEditNote,
  onNavigateHome,
}) => {
  const {
    currentUser,
    isAdmin,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginWithSecretKey,
    logout,
    authError,
    clearAuthError,
  } = useAuth();
  const {
    personalInfo,
    publications = [],
    researchTimeline = [],
    awards = [],
    experience = [],
    notes = [],
    messages = [],
    updatePersonalInfo,
    deletePublication,
    deleteResearchTimeline,
    deleteAward,
    deleteExperience,
    deleteNote,
    markMessageRead,
    deleteMessage,
  } = useData();

  const [activeTab, setActiveTab] = useState<
    'inbox' | 'education' | 'toolkit' | 'skills' | 'publications' | 'notes' | 'timeline' | 'experience' | 'awards' | 'profiles' | 'profile'
  >('inbox');

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Education state for direct in-page editing
  const [educationForm, setEducationForm] = useState(
    personalInfo.education || {
      degree: '',
      institution: '',
      location: '',
      period: '',
      gpa: '',
      focus: '',
      thesis: '',
      honors: '',
      coursework: '',
      description: '',
      entries: [],
    }
  );
  const [savingEducation, setSavingEducation] = useState(false);
  const [educationSuccessMsg, setEducationSuccessMsg] = useState(false);
  const [educationErrorMsg, setEducationErrorMsg] = useState<string | null>(null);

  // Sync educationForm with personalInfo.education
  useEffect(() => {
    if (personalInfo.education) {
      setEducationForm(personalInfo.education);
    }
  }, [personalInfo.education]);

  const handleSaveEducation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingEducation(true);
    setEducationErrorMsg(null);
    try {
      await updatePersonalInfo({
        education: educationForm,
      });
      setEducationSuccessMsg(true);
      setTimeout(() => setEducationSuccessMsg(false), 3500);
    } catch (err: any) {
      console.error(err);
      setEducationErrorMsg(err.message || 'Failed to update education section.');
    } finally {
      setSavingEducation(false);
    }
  };

  // Academic Profiles URL state
  const canonicalProfilesConfig = [
    {
      key: 'linkedin',
      name: 'LinkedIn',
      label: 'LinkedIn',
      icon: 'work',
      desc: 'Professional Network & Updates',
      defaultUrl: 'https://linkedin.com/in/muhammad-rezaul-haider',
      placeholder: 'https://linkedin.com/in/muhammad-rezaul-haider',
    },
    {
      key: 'scholar',
      name: 'Scholar',
      label: 'Google Scholar',
      icon: 'school',
      desc: 'Citations & Academic Indexing',
      defaultUrl: 'https://scholar.google.com/citations?user=rezaulhaider',
      placeholder: 'https://scholar.google.com/citations?user=rezaulhaider',
    },
    {
      key: 'orcid',
      name: 'ORCID',
      label: 'ORCID',
      icon: 'fingerprint',
      desc: 'Unique Academic Identifier',
      defaultUrl: 'https://orcid.org/0009-0004-8192-3341',
      placeholder: 'https://orcid.org/0009-0004-8192-3341',
    },
    {
      key: 'researchgate',
      name: 'ResearchGate',
      label: 'ResearchGate',
      icon: 'science',
      desc: 'Working Papers & Preprints',
      defaultUrl: 'https://researchgate.net/profile/Muhammad-Rezaul-Haider',
      placeholder: 'https://researchgate.net/profile/Muhammad-Rezaul-Haider',
    },
  ];

  const [profileUrls, setProfileUrls] = useState<Record<string, string>>({
    linkedin: 'https://linkedin.com/in/muhammad-rezaul-haider',
    scholar: 'https://scholar.google.com/citations?user=rezaulhaider',
    orcid: 'https://orcid.org/0009-0004-8192-3341',
    researchgate: 'https://researchgate.net/profile/Muhammad-Rezaul-Haider',
  });
  const [savingProfiles, setSavingProfiles] = useState(false);
  const [profilesSuccessMsg, setProfilesSuccessMsg] = useState(false);
  const [profilesErrorMsg, setProfilesErrorMsg] = useState<string | null>(null);

  // Quantitative Toolkit in-page state
  const [newToolForm, setNewToolForm] = useState<{ name: string; desc: string; icon: string }>({
    name: '',
    desc: '',
    icon: 'code',
  });
  const [editingToolIdx, setEditingToolIdx] = useState<number | null>(null);
  const [savingToolkit, setSavingToolkit] = useState(false);
  const [toolkitSuccessMsg, setToolkitSuccessMsg] = useState<string | null>(null);
  const [toolkitErrorMsg, setToolkitErrorMsg] = useState<string | null>(null);

  // Skills in-page state
  const [newSkillForm, setNewSkillForm] = useState<{ id: string; title: string; icon: string; description: string }>({
    id: '',
    title: '',
    icon: 'analytics',
    description: '',
  });
  const [editingSkillItem, setEditingSkillItem] = useState<string | null>(null);
  const [savingSkills, setSavingSkills] = useState(false);
  const [skillsSuccessMsg, setSkillsSuccessMsg] = useState<string | null>(null);
  const [skillsErrorMsg, setSkillsErrorMsg] = useState<string | null>(null);

  // Toolkit CRUD handlers
  const handleSaveToolInAdmin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newToolForm.name.trim() || !newToolForm.desc.trim()) {
      setToolkitErrorMsg('Tool name and description are required.');
      return;
    }
    setSavingToolkit(true);
    setToolkitErrorMsg(null);
    try {
      let updated = [...(personalInfo.quantitativeToolkit || [])];
      if (editingToolIdx !== null) {
        updated[editingToolIdx] = { ...newToolForm };
      } else {
        updated.push({ ...newToolForm });
      }
      await updatePersonalInfo({ quantitativeToolkit: updated });
      setToolkitSuccessMsg(editingToolIdx !== null ? 'Tool updated successfully!' : 'New tool added successfully!');
      setNewToolForm({ name: '', desc: '', icon: 'code' });
      setEditingToolIdx(null);
      setTimeout(() => setToolkitSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setToolkitErrorMsg(err.message || 'Failed to save tool.');
    } finally {
      setSavingToolkit(false);
    }
  };

  const handleDeleteToolInAdmin = async (idxToDelete: number) => {
    if (!window.confirm('Are you sure you want to remove this tool from the Quantitative Toolkit?')) return;
    setSavingToolkit(true);
    try {
      const updated = (personalInfo.quantitativeToolkit || []).filter((_, idx) => idx !== idxToDelete);
      await updatePersonalInfo({ quantitativeToolkit: updated });
      if (editingToolIdx === idxToDelete) {
        setEditingToolIdx(null);
        setNewToolForm({ name: '', desc: '', icon: 'code' });
      }
      setToolkitSuccessMsg('Tool removed successfully.');
      setTimeout(() => setToolkitSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setToolkitErrorMsg(err.message || 'Failed to delete tool.');
    } finally {
      setSavingToolkit(false);
    }
  };

  // Skills CRUD handlers
  const handleSaveSkillInAdmin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSkillForm.title.trim() || !newSkillForm.description.trim()) {
      setSkillsErrorMsg('Skill title and description are required.');
      return;
    }
    setSavingSkills(true);
    setSkillsErrorMsg(null);
    try {
      let updated = [...(personalInfo.skills || [])];
      if (editingSkillItem) {
        updated = updated.map((s) => (s.id === editingSkillItem ? { ...newSkillForm } : s));
      } else {
        const id = newSkillForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
        updated.push({ ...newSkillForm, id });
      }
      await updatePersonalInfo({ skills: updated });
      setSkillsSuccessMsg(editingSkillItem ? 'Skill updated successfully!' : 'New skill card added successfully!');
      setNewSkillForm({ id: '', title: '', icon: 'analytics', description: '' });
      setEditingSkillItem(null);
      setTimeout(() => setSkillsSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setSkillsErrorMsg(err.message || 'Failed to save skill.');
    } finally {
      setSavingSkills(false);
    }
  };

  const handleDeleteSkillInAdmin = async (idToDelete: string) => {
    if (!window.confirm('Are you sure you want to delete this skill card?')) return;
    setSavingSkills(true);
    try {
      const updated = (personalInfo.skills || []).filter((s) => s.id !== idToDelete);
      await updatePersonalInfo({ skills: updated });
      if (editingSkillItem === idToDelete) {
        setEditingSkillItem(null);
        setNewSkillForm({ id: '', title: '', icon: 'analytics', description: '' });
      }
      setSkillsSuccessMsg('Skill card removed successfully.');
      setTimeout(() => setSkillsSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setSkillsErrorMsg(err.message || 'Failed to delete skill.');
    } finally {
      setSavingSkills(false);
    }
  };

  // Sync profile URLs from personalInfo.socialLinks whenever updated
  useEffect(() => {
    const urls: Record<string, string> = {
      linkedin: 'https://linkedin.com/in/muhammad-rezaul-haider',
      scholar: 'https://scholar.google.com/citations?user=rezaulhaider',
      orcid: 'https://orcid.org/0009-0004-8192-3341',
      researchgate: 'https://researchgate.net/profile/Muhammad-Rezaul-Haider',
    };

    if (personalInfo.socialLinks && personalInfo.socialLinks.length > 0) {
      personalInfo.socialLinks.forEach((item) => {
        const sName = (item.name || '').toLowerCase().trim();
        const sUrl = (item.url || '').toLowerCase();
        if (sName.includes('linkedin') || sUrl.includes('linkedin.com')) {
          urls.linkedin = item.url || '';
        } else if (sName.includes('scholar') || sUrl.includes('scholar.google')) {
          urls.scholar = item.url || '';
        } else if (sName.includes('orcid') || sUrl.includes('orcid.org')) {
          urls.orcid = item.url || '';
        } else if (sName.includes('researchgate') || sUrl.includes('researchgate.net')) {
          urls.researchgate = item.url || '';
        }
      });
    }

    setProfileUrls(urls);
  }, [personalInfo.socialLinks]);

  const handleSaveAcademicProfiles = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingProfiles(true);
    setProfilesErrorMsg(null);
    try {
      const updatedSocialLinks = [
        {
          name: 'LinkedIn',
          handle: 'muhammad-rezaul-haider',
          url: profileUrls.linkedin.trim() || 'https://linkedin.com/in/muhammad-rezaul-haider',
          icon: 'work',
          desc: 'Professional Network & Updates',
        },
        {
          name: 'Scholar',
          handle: 'Muhammad Rezaul Haider',
          url: profileUrls.scholar.trim() || 'https://scholar.google.com/citations?user=rezaulhaider',
          icon: 'school',
          desc: 'Citations & Academic Indexing',
        },
        {
          name: 'ORCID',
          handle: '0009-0004-8192-3341',
          url: profileUrls.orcid.trim() || 'https://orcid.org/0009-0004-8192-3341',
          icon: 'fingerprint',
          desc: 'Unique Academic Identifier',
        },
        {
          name: 'ResearchGate',
          handle: 'Muhammad-Rezaul-Haider',
          url: profileUrls.researchgate.trim() || 'https://researchgate.net/profile/Muhammad-Rezaul-Haider',
          icon: 'science',
          desc: 'Working Papers & Preprints',
        },
      ];

      await updatePersonalInfo({
        socialLinks: updatedSocialLinks,
      });

      setProfilesSuccessMsg(true);
      setTimeout(() => setProfilesSuccessMsg(false), 3500);
    } catch (err: any) {
      console.error(err);
      setProfilesErrorMsg(err.message || 'Failed to update academic profile links.');
    } finally {
      setSavingProfiles(false);
    }
  };

  // Login form states if not logged in
  const [email, setEmail] = useState('Fahimhaider0124@gmail.com');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showSecretKeyInput, setShowSecretKeyInput] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showAdvancedAuth, setShowAdvancedAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadMessages = (messages || []).filter((m) => !m.read);

  const handleSecretKeyUnlock = async (keyToUse?: string) => {
    const key = (keyToUse !== undefined ? keyToUse : secretKey).trim();
    if (!key) {
      return;
    }
    setLoading(true);
    clearAuthError();
    try {
      const success = await loginWithSecretKey(key);
      if (!success) {
        console.warn('Unlock failed');
      }
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

    // If the password entered is the secret passkey, unlock immediately!
    const cleanPass = password.trim();
    if (
      cleanPass === '@Yahoo8511' ||
      cleanPass.toLowerCase() === '@yahoo8511' ||
      cleanPass.toLowerCase() === 'yahoo8511' ||
      cleanPass.toLowerCase() === 'fahim1211' ||
      cleanPass === '0124' ||
      cleanPass === 'admin1211' ||
      cleanPass === 'fahim2026'
    ) {
      await handleSecretKeyUnlock(cleanPass);
      return;
    }

    try {
      if (isRegisterMode) {
        await registerWithEmail(email, password, 'M. R. Haider');
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error('Email authentication error:', err);
      // If Firebase blocked email/password, fallback to instant unlock helper
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    clearAuthError();
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // If user is not authenticated or is not admin
  if (!isAdmin) {
    return (
      <div className="w-full max-w-md mx-auto px-6 py-12 md:py-20">
        <div className="bg-[#FAF9F6] rounded-2xl p-8 neumorphic-card border border-[#e5e2db] space-y-6 shadow-xl">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full neumorphic-inset flex items-center justify-center text-[#004c4c]">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#004c4c]">
              Administrator Portal
            </h1>
            <p className="text-xs text-[#486363]">
              Private administration dashboard for M. R. Haider
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5 text-amber-700">info</span>
              <span className="leading-snug">{authError}</span>
            </div>
          )}

          {/* Primary Instant Unlock via Secret Master Passkey */}
          <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-3 shadow-inner">
            <div className="flex items-center gap-2 text-[#004c4c] font-bold text-xs">
              <span className="material-symbols-outlined text-base">vpn_key</span>
              <span>Instant Master Key Access</span>
            </div>
            <p className="text-[11px] text-[#486363] leading-relaxed">
              Enter your secret passkey to unlock the admin dashboard directly:
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSecretKeyUnlock();
              }}
              className="space-y-3 pt-1"
            >
              <div className="relative">
                <input
                  type={showSecretKeyInput ? 'text' : 'password'}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter your passkey"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm neumorphic-input text-[#191c1e] font-mono tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKeyInput(!showSecretKeyInput)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#486363] hover:text-[#004c4c] cursor-pointer p-1"
                  title={showSecretKeyInput ? 'Hide passkey' : 'Show passkey'}
                >
                  <span className="material-symbols-outlined text-base">
                    {showSecretKeyInput ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !secretKey.trim()}
                className="w-full py-3 px-4 rounded-xl bg-[#004c4c] text-white text-sm font-bold hover:bg-[#006666] transition-all cursor-pointer disabled:opacity-50 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">lock_open</span>
                <span>{loading ? 'Unlocking...' : 'Unlock Admin Dashboard'}</span>
              </button>
            </form>
          </div>

          {/* Advanced / Firebase Auth Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvancedAuth(!showAdvancedAuth)}
              className="w-full text-center text-xs text-[#486363] hover:text-[#004c4c] flex items-center justify-center gap-1 cursor-pointer py-1"
            >
              <span>{showAdvancedAuth ? 'Hide standard login options' : 'More login methods (Google / Email)'}</span>
              <span className="material-symbols-outlined text-sm">
                {showAdvancedAuth ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showAdvancedAuth && (
              <div className="mt-4 space-y-4 pt-4 border-t border-[#e5e2db]">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-2.5 px-3 rounded-xl neumorphic-btn flex items-center justify-center gap-2.5 text-xs font-semibold text-[#191c1e] hover:text-[#004c4c] cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Sign In with Google</span>
                </button>

                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#004c4c] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs neumorphic-input text-[#191c1e]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-[#004c4c]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegisterMode(!isRegisterMode);
                          clearAuthError();
                        }}
                        className="text-[10px] text-[#004c4c] hover:underline font-semibold cursor-pointer"
                      >
                        {isRegisterMode ? '← Sign In' : 'Setup Password'}
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder={isRegisterMode ? 'Create password' : 'Enter password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs neumorphic-input text-[#191c1e]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-3 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isRegisterMode ? 'Create Account' : 'Sign In with Email'}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-2 text-xs border-t border-[#e5e2db]/80">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-[#486363] hover:text-[#004c4c] hover:underline cursor-pointer"
            >
              ← Return to Public Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1140px] mx-auto px-6 md:px-12 py-10 md:py-16 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5e2db]">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl neumorphic-inset flex items-center justify-center text-[#004c4c]">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-[#004c4c]">
                Admin Management Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-[#004c4c] border border-teal-300">
                Authorized Session
              </span>
            </div>
            <p className="text-xs text-[#486363] mt-0.5">
              Secure admin page to manage publications, timeline, awards, experience, home page, and messages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] hover:text-[#006666] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            <span>View Public Site</span>
          </button>
          <button
            onClick={async () => {
              await logout();
              onNavigateHome();
            }}
            className="px-4 py-2 rounded-xl neumorphic-btn text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-[#e5e2db]">
        {[
          { id: 'inbox', label: `Inbox Messages (${unreadMessages.length})`, icon: 'mail' },
          { id: 'education', label: 'Education Section', icon: 'school' },
          { id: 'toolkit', label: `Quantitative Toolkit (${personalInfo.quantitativeToolkit?.length || 0})`, icon: 'build' },
          { id: 'skills', label: `Skills (${personalInfo.skills?.length || 0})`, icon: 'bar_chart' },
          { id: 'publications', label: `Publications (${publications?.length || 0})`, icon: 'menu_book' },
          { id: 'notes', label: `Notes & Archive (${notes?.length || 0})`, icon: 'edit_note' },
          { id: 'timeline', label: `Research Timeline (${researchTimeline?.length || 0})`, icon: 'history_edu' },
          { id: 'experience', label: `Experience (${experience?.length || 0})`, icon: 'work' },
          { id: 'awards', label: `Awards & Honors (${awards?.length || 0})`, icon: 'military_tech' },
          { id: 'profiles', label: 'Academic Profiles (4)', icon: 'share' },
          { id: 'profile', label: 'Home Page & Bio', icon: 'person' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'neumorphic-inset text-[#004c4c] font-bold shadow-inner'
                  : 'neumorphic-btn text-[#486363] hover:text-[#004c4c]'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Inbox */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-3">
            <h3 className="font-headline text-base font-bold text-[#004c4c] flex items-center justify-between">
              <span>Visitor Messages</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-[#004c4c]">
                {messages.length} total
              </span>
            </h3>

            {messages.length === 0 ? (
              <div className="neumorphic-inset-box p-6 text-center text-xs text-[#486363]">
                No messages received yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.read) markMessageRead(msg.id);
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      selectedMessage?.id === msg.id
                        ? 'neumorphic-inset border-l-4 border-[#004c4c]'
                        : 'neumorphic-card hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#191c1e] truncate">{msg.name}</span>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-[#486363] truncate">{msg.subject}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {selectedMessage ? (
              <div className="neumorphic-card p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#d8dadd] pb-4">
                  <div>
                    <h4 className="font-headline text-lg font-bold text-[#004c4c]">
                      {selectedMessage.subject}
                    </h4>
                    <p className="text-xs text-[#486363]">
                      From: <strong className="text-[#191c1e]">{selectedMessage.name}</strong> (
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-[#004c4c] underline"
                      >
                        {selectedMessage.email}
                      </a>
                      )
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      deleteMessage(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete Message"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>

                <div className="p-4 neumorphic-inset-box rounded-xl text-xs md:text-sm text-[#191c1e] whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>

                <div className="flex justify-end pt-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject
                    )}`}
                    className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow"
                  >
                    <span className="material-symbols-outlined text-sm">reply</span>
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="neumorphic-inset-box p-12 text-center text-xs text-[#486363] flex flex-col items-center justify-center space-y-2 h-full min-h-[300px]">
                <span className="material-symbols-outlined text-3xl text-[#486363]/60">
                  mark_email_unread
                </span>
                <span>Select a message from the left list to view details and reply.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Education Section Editor & Subsections */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c] flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">school</span>
                <span>Education Section & Subsections</span>
              </h3>
              <p className="text-xs text-[#486363]">
                Manage all fields and subsections displayed under Education on the public home page and in your CV.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onOpenProfileModal('education')}
                className="px-3 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Open in Modal</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEducationForm({
                    degree: 'Bachelor of Economics (International Program for Islamic Economics and Finance)',
                    institution: 'Universitas Muhammadiyah Yogyakarta (UMY)',
                    location: 'Faculty of Economics and Business · Yogyakarta, Indonesia',
                    period: '2022 - 2026',
                    gpa: '3.94 / 4.00 (Summa Cum Laude Track)',
                    focus: 'Applied Panel Econometrics, Labor Economics & Quantitative Methods',
                    thesis: 'Threshold Dynamics and Empirical Modeling of Female Labor Force Participation in South & Southeast Asia',
                    honors: 'Dean\'s Honor List, Academic Excellence Distinction Award',
                    coursework: 'Advanced Econometrics, Macroeconomic Theory, Mathematical Economics, Applied Panel Data Methods, Time Series Analysis',
                    description: 'Undergraduate study focused on quantitative econometrics, empirical labor dynamics, and public policy.',
                    entries: educationForm.entries || [],
                  });
                }}
                className="px-3 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#486363] hover:text-[#191c1e] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                disabled={savingEducation}
                onClick={handleSaveEducation}
                className="px-5 py-1.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
              >
                {savingEducation ? (
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">save</span>
                )}
                <span>Save Education</span>
              </button>
            </div>
          </div>

          {educationSuccessMsg && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#004c4c]">check_circle</span>
              <span className="font-semibold">
                Education section and all subsections successfully saved to Firestore! Live on Home page.
              </span>
            </div>
          )}

          {educationErrorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-rose-600">error</span>
              <span>{educationErrorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Form: All Subsections */}
            <form
              onSubmit={handleSaveEducation}
              className="lg:col-span-7 space-y-5"
            >
              {/* Subsection 1: Primary Degree & Institution */}
              <div className="neumorphic-card p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#e5e2db] pb-3">
                  <div className="w-7 h-7 rounded-full bg-[#004c4c] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-headline text-sm font-bold text-[#004c4c]">
                      Primary Degree & Institution
                    </h4>
                    <p className="text-[11px] text-[#486363]">Core program credentials</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#004c4c] mb-1">
                      Degree / Qualification Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={educationForm.degree || ''}
                      onChange={(e) =>
                        setEducationForm({ ...educationForm, degree: e.target.value })
                      }
                      placeholder="Bachelor of Economics (International Program for Islamic Economics and Finance)"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#004c4c] mb-1">
                      University / Institution Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={educationForm.institution || ''}
                      onChange={(e) =>
                        setEducationForm({ ...educationForm, institution: e.target.value })
                      }
                      placeholder="Universitas Muhammadiyah Yogyakarta (UMY)"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#486363] mb-1">
                        Academic Period / Timeline
                      </label>
                      <input
                        type="text"
                        value={educationForm.period || ''}
                        onChange={(e) =>
                          setEducationForm({ ...educationForm, period: e.target.value })
                        }
                        placeholder="2022 - 2026"
                        className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#486363] mb-1">
                        Department / Location
                      </label>
                      <input
                        type="text"
                        value={educationForm.location || ''}
                        onChange={(e) =>
                          setEducationForm({ ...educationForm, location: e.target.value })
                        }
                        placeholder="Faculty of Economics and Business · Yogyakarta, Indonesia"
                        className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subsection 2: Thesis, Honors & Coursework */}
              <div className="neumorphic-card p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#e5e2db] pb-3">
                  <div className="w-7 h-7 rounded-full bg-[#004c4c] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-headline text-sm font-bold text-[#004c4c]">
                      Thesis, Distinctions & Key Coursework
                    </h4>
                    <p className="text-[11px] text-[#486363]">Research capstone and academic achievements</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#004c4c] mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">menu_book</span>
                      <span>Undergraduate Thesis / Capstone / Research Project</span>
                    </label>
                    <input
                      type="text"
                      value={educationForm.thesis || ''}
                      onChange={(e) =>
                        setEducationForm({ ...educationForm, thesis: e.target.value })
                      }
                      placeholder="Threshold Dynamics and Empirical Modeling of Female Labor Force Participation in South & Southeast Asia"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#004c4c] mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">military_tech</span>
                      <span>Academic Honors, Awards & Distinctions</span>
                    </label>
                    <input
                      type="text"
                      value={educationForm.honors || ''}
                      onChange={(e) =>
                        setEducationForm({ ...educationForm, honors: e.target.value })
                      }
                      placeholder="Dean's Honor List, Academic Excellence Distinction Award"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#004c4c] mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">auto_stories</span>
                      <span>Relevant Coursework / Core Modules (Comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={educationForm.coursework || ''}
                      onChange={(e) =>
                        setEducationForm({ ...educationForm, coursework: e.target.value })
                      }
                      placeholder="Advanced Econometrics, Macroeconomic Theory, Mathematical Economics, Applied Panel Data Methods, Time Series Analysis"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                    />
                    <p className="text-[11px] text-[#486363] mt-1">Separate course titles with commas. Each course is rendered as a clean tag on the home page.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#486363] mb-1">
                      Additional Study Summary / Description
                    </label>
                    <textarea
                      rows={2}
                      value={educationForm.description || ''}
                      onChange={(e) =>
                        setEducationForm({ ...educationForm, description: e.target.value })
                      }
                      placeholder="Undergraduate study focused on quantitative econometrics, empirical labor dynamics, and public policy."
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#486363]">
                  All changes are saved to Firestore database.
                </span>
                <button
                  type="submit"
                  disabled={savingEducation}
                  className="px-6 py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow disabled:opacity-50"
                >
                  {savingEducation ? (
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-base">save</span>
                  )}
                  <span>Save All Education Subsections</span>
                </button>
              </div>
            </form>

            {/* Right Column: Live Card Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-headline text-sm font-bold text-[#004c4c] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">preview</span>
                  <span>Live Home Page Card Preview</span>
                </h4>
                <button
                  onClick={onNavigateHome}
                  className="text-xs text-[#004c4c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>View Live Site</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>

              {/* Preview Container */}
              <div className="neumorphic-card p-6 space-y-5 border-2 border-teal-200/80 bg-white/70">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#e5e2db] pb-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-base md:text-lg font-bold text-[#191c1e]">
                      {educationForm.degree || 'Degree Program Title'}
                    </h3>
                    <p className="text-sm font-semibold text-[#004c4c]">
                      {educationForm.institution || 'Institution Name'}
                    </p>
                    {educationForm.location && (
                      <p className="text-xs text-[#486363] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span>{educationForm.location}</span>
                      </p>
                    )}
                  </div>
                  {educationForm.period && (
                    <span className="text-xs font-semibold text-[#486363] neumorphic-inset px-3 py-1 rounded-full shrink-0">
                      {educationForm.period}
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 text-xs text-[#3f4948]">
                  {educationForm.gpa && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl neumorphic-inset-box">
                      <span className="material-symbols-outlined text-[#004c4c] text-base shrink-0">
                        workspace_premium
                      </span>
                      <div>
                        <strong className="text-[#004c4c] block text-[11px]">Academic Standing</strong>
                        <span>{educationForm.gpa}</span>
                      </div>
                    </div>
                  )}

                  {educationForm.focus && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl neumorphic-inset-box">
                      <span className="material-symbols-outlined text-[#004c4c] text-base shrink-0">
                        psychology
                      </span>
                      <div>
                        <strong className="text-[#004c4c] block text-[11px]">Specialization</strong>
                        <span>{educationForm.focus}</span>
                      </div>
                    </div>
                  )}

                  {educationForm.thesis && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl neumorphic-inset-box">
                      <span className="material-symbols-outlined text-[#004c4c] text-base shrink-0">
                        menu_book
                      </span>
                      <div>
                        <strong className="text-[#004c4c] block text-[11px]">Thesis / Research Capstone</strong>
                        <span>{educationForm.thesis}</span>
                      </div>
                    </div>
                  )}

                  {educationForm.honors && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl neumorphic-inset-box">
                      <span className="material-symbols-outlined text-[#004c4c] text-base shrink-0">
                        military_tech
                      </span>
                      <div>
                        <strong className="text-[#004c4c] block text-[11px]">Honors & Distinctions</strong>
                        <span>{educationForm.honors}</span>
                      </div>
                    </div>
                  )}
                </div>

                {educationForm.coursework && (
                  <div className="pt-2 border-t border-[#e5e2db]/70 space-y-1.5">
                    <span className="text-[11px] font-bold text-[#004c4c] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">auto_stories</span>
                      <span>Relevant Coursework:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {educationForm.coursework
                        .split(/[,;\n]+/)
                        .map((c) => c.trim())
                        .filter(Boolean)
                        .map((course, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF9F6] border border-[#e5e2db] text-[#3f4948]"
                          >
                            {course}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {educationForm.description && (
                  <p className="text-xs text-[#486363] leading-relaxed pt-1">
                    {educationForm.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Publications */}
      {activeTab === 'publications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                Research Publications
              </h3>
              <p className="text-xs text-[#486363]">Manage papers, status tags, and PDFs.</p>
            </div>
            <button
              onClick={onOpenNewPublicationModal}
              className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Publication
            </button>
          </div>

          <div className="space-y-3">
            {publications.map((pub) => {
              const getTypeLabel = () => {
                switch (pub.publicationType) {
                  case 'conference_paper':
                    return { label: 'Conference Paper', color: 'bg-indigo-100 text-indigo-900 border-indigo-200' };
                  case 'book':
                    return { label: 'Book / Monograph', color: 'bg-amber-100 text-amber-900 border-amber-200' };
                  case 'book_chapter':
                    return { label: 'Book Chapter', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
                  case 'working_paper':
                    return { label: 'Working Paper', color: 'bg-slate-100 text-slate-800 border-slate-300' };
                  case 'journal_article':
                  default:
                    return { label: 'Journal Article', color: 'bg-teal-100 text-teal-900 border-teal-200' };
                }
              };
              const typeInfo = getTypeLabel();

              return (
                <div
                  key={pub.id}
                  className="neumorphic-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-50 text-[#004c4c] border border-teal-200 uppercase">
                        {pub.status}
                      </span>
                      {pub.pdfUrl && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]">picture_as_pdf</span>
                          PDF
                        </span>
                      )}
                      <span className="text-xs font-semibold text-[#486363]">{pub.year}</span>
                    </div>
                    <h4 className="font-headline text-sm md:text-base font-bold text-[#191c1e]">
                      {pub.title}
                    </h4>
                    <p className="text-xs text-[#486363] italic">{pub.journalOrVenue || 'Working Paper'}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onEditPublication(pub)}
                      className="px-3 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deletePublication(pub.id)}
                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Notes & Writing Archive */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                Notes & Personal Writing Archive
              </h3>
              <p className="text-xs text-[#486363]">
                Manage ideas, lessons, observations, and reflections published in the Notes section.
              </p>
            </div>
            <button
              onClick={onOpenNewNoteModal}
              className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Write New Note
            </button>
          </div>

          <div className="space-y-3">
            {notes.length === 0 ? (
              <div className="neumorphic-inset-box p-8 text-center text-xs text-[#486363]">
                No notes published yet. Click "Write New Note" to create one.
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="neumorphic-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-50 text-[#004c4c] border border-teal-200">
                        {note.category}
                      </span>
                      <span className="text-xs font-semibold text-[#191c1e]">{note.date}</span>
                      <span className="text-xs text-[#486363]">· {note.readingTime || '4 min read'}</span>
                      {note.slug && (
                        <span className="text-[10px] text-gray-400 font-mono">/{note.slug}</span>
                      )}
                    </div>
                    <h4 className="font-headline text-sm md:text-base font-bold text-[#191c1e]">
                      {note.title}
                    </h4>
                    {note.excerpt && (
                      <p className="text-xs text-[#3f4948] line-clamp-2">{note.excerpt}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onEditNote(note)}
                      className="px-3 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete Note"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Research Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                Research Timeline & Projects
              </h3>
              <p className="text-xs text-[#486363]">Manage milestone timeline items.</p>
            </div>
            <button
              onClick={onOpenNewTimelineModal}
              className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Milestone
            </button>
          </div>

          <div className="space-y-3">
            {researchTimeline.map((item) => (
              <div
                key={item.id}
                className="neumorphic-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#004c4c]">{item.period}</span>
                    <span className="text-xs text-[#486363]">• {item.institution}</span>
                  </div>
                  <h4 className="font-headline text-sm md:text-base font-bold text-[#191c1e]">
                    {item.role}
                  </h4>
                  <p className="text-xs text-[#3f4948] line-clamp-2">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onEditTimeline(item)}
                    className="px-3 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteResearchTimeline(item.id)}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Experience */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                Teaching & Professional Experience
              </h3>
              <p className="text-xs text-[#486363]">Manage academic roles and assistantships.</p>
            </div>
            <button
              onClick={onOpenNewExperienceModal}
              className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Experience
            </button>
          </div>

          <div className="space-y-3">
            {experience.map((exp) => (
              <div
                key={exp.id}
                className="neumorphic-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#004c4c]">{exp.period}</span>
                    <span className="text-xs text-[#486363]">• {exp.institution}</span>
                  </div>
                  <h4 className="font-headline text-sm md:text-base font-bold text-[#191c1e]">
                    {exp.title}
                  </h4>
                  <p className="text-xs text-[#3f4948] line-clamp-2">{exp.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onEditExperience(exp)}
                    className="px-3 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Awards */}
      {activeTab === 'awards' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                Awards, Honors & Certifications
              </h3>
              <p className="text-xs text-[#486363]">Manage scholarships and distinctions.</p>
            </div>
            <button
              onClick={onOpenNewAwardModal}
              className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Award
            </button>
          </div>

          <div className="space-y-3">
            {awards.map((award) => (
              <div
                key={award.id}
                className="neumorphic-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-50 text-[#004c4c] border border-teal-200">
                      {award.category}
                    </span>
                    <span className="text-xs font-semibold text-[#486363]">{award.year}</span>
                  </div>
                  <h4 className="font-headline text-sm md:text-base font-bold text-[#191c1e]">
                    {award.title}
                  </h4>
                  <p className="text-xs text-[#486363]">{award.issuer}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onEditAward(award)}
                    className="px-3 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteAward(award.id)}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Academic & Professional Profiles Management */}
      {activeTab === 'profiles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                Academic & Professional Profiles
              </h3>
              <p className="text-xs text-[#486363]">
                Configure and save live URLs for the four academic profiles. Changes are saved to persistent Firestore storage and update the public contact section immediately.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setProfileUrls({
                    linkedin: 'https://linkedin.com/in/muhammad-rezaul-haider',
                    scholar: 'https://scholar.google.com/citations?user=rezaulhaider',
                    orcid: 'https://orcid.org/0009-0004-8192-3341',
                    researchgate: 'https://researchgate.net/profile/Muhammad-Rezaul-Haider',
                  });
                }}
                className="px-3 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#486363] hover:text-[#191c1e] cursor-pointer"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={() => onOpenProfileModal('social')}
                className="px-3.5 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Open in Modal</span>
              </button>
            </div>
          </div>

          {profilesSuccessMsg && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-[#004c4c] text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Academic & Professional Profiles saved successfully and updated live across the website!</span>
            </div>
          )}

          {profilesErrorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{profilesErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveAcademicProfiles} className="space-y-4">
            {canonicalProfilesConfig.map((item) => {
              const currentVal = profileUrls[item.key] ?? item.defaultUrl;
              return (
                <div
                  key={item.key}
                  className="neumorphic-card p-6 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#004c4c] border border-[#e5e2db] shadow-[-3px_-3px_7px_rgba(255,255,255,0.9),3px_3px_7px_#dedbd2] shrink-0">
                        <span className="material-symbols-outlined text-2xl">
                          {item.icon}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline text-base font-bold text-[#004c4c]">
                            {item.label}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#004c4c] border border-teal-200">
                            {item.desc}
                          </span>
                        </div>
                        <p className="text-xs text-[#486363]">Icon: <code className="text-[#004c4c] font-mono">{item.icon}</code></p>
                      </div>
                    </div>

                    {currentVal && (
                      <a
                        href={currentVal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#004c4c] hover:underline font-semibold self-start sm:self-auto py-1 px-2.5 rounded-lg hover:bg-teal-50/60"
                      >
                        <span>Test Saved Link</span>
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#486363] mb-1.5">
                      {item.label} Profile URL:
                    </label>
                    <input
                      type="url"
                      required
                      value={currentVal}
                      onChange={(e) =>
                        setProfileUrls({
                          ...profileUrls,
                          [item.key]: e.target.value,
                        })
                      }
                      placeholder={item.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-between pt-4 border-t border-[#e5e2db]">
              <span className="text-xs text-[#486363] hidden sm:inline">
                Clicking save writes changes directly to persistent database.
              </span>
              <button
                type="submit"
                disabled={savingProfiles}
                className="px-6 py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow disabled:opacity-50"
              >
                {savingProfiles ? (
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">save</span>
                )}
                <span>Save Profile URLs</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Quantitative Toolkit Management */}
      {activeTab === 'toolkit' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                Quantitative Toolkit Management
              </h3>
              <p className="text-xs text-[#486363]">
                Manage econometric, statistical, and programming software tools displayed on your home page.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenProfileModal('toolkit')}
                className="px-3.5 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Open in Modal</span>
              </button>
            </div>
          </div>

          {toolkitSuccessMsg && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-[#004c4c] text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{toolkitSuccessMsg}</span>
            </div>
          )}

          {toolkitErrorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{toolkitErrorMsg}</span>
            </div>
          )}

          {/* Add / Edit Tool Card Form */}
          <form onSubmit={handleSaveToolInAdmin} className="neumorphic-card p-6 space-y-4 border border-teal-100/60">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs text-[#004c4c] uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  {editingToolIdx !== null ? 'edit' : 'add_circle'}
                </span>
                <span>
                  {editingToolIdx !== null
                    ? `Editing Tool: ${newToolForm.name}`
                    : 'Add New Tool to Quantitative Toolkit'}
                </span>
              </h4>
              {editingToolIdx !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingToolIdx(null);
                    setNewToolForm({ name: '', desc: '', icon: 'code' });
                  }}
                  className="text-xs text-[#486363] hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#486363] mb-1">
                  Tool / Software Name (e.g., Stata, R, Python, GIS, EViews, SPSS)
                </label>
                <input
                  type="text"
                  required
                  value={newToolForm.name}
                  onChange={(e) => setNewToolForm({ ...newToolForm, name: e.target.value })}
                  placeholder="e.g. Stata, R, Python, MATLAB..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#486363] mb-1">
                  Short Description / Specialization
                </label>
                <input
                  type="text"
                  required
                  value={newToolForm.desc}
                  onChange={(e) => setNewToolForm({ ...newToolForm, desc: e.target.value })}
                  placeholder="e.g. Econometric Modeling, Panel Data, Microeconometrics"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#e5e2db]">
              <div className="flex items-center gap-2 text-xs text-[#486363]">
                <span>Live Logo Preview:</span>
                <div className="p-1 rounded bg-white shadow-sm flex items-center justify-center border border-[#e5e2db]">
                  <ToolkitLogo name={newToolForm.name || 'Tool'} className="w-6 h-6" />
                </div>
                <span className="font-semibold text-[#004c4c]">{newToolForm.name || 'Preview'}</span>
              </div>

              <button
                type="submit"
                disabled={savingToolkit}
                className="px-5 py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow disabled:opacity-50"
              >
                {savingToolkit ? (
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">
                    {editingToolIdx !== null ? 'check' : 'add'}
                  </span>
                )}
                <span>{editingToolIdx !== null ? 'Update Tool' : 'Add to Toolkit'}</span>
              </button>
            </div>
          </form>

          {/* Current Tools Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#004c4c] uppercase tracking-wider">
              Current Quantitative Toolkit Items ({personalInfo.quantitativeToolkit?.length || 0}):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {personalInfo.quantitativeToolkit?.map((tool, idx) => (
                <div
                  key={idx}
                  className="neumorphic-card p-4 flex items-center justify-between gap-3 border border-[#e5e2db]/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ToolkitLogo name={tool.name} className="w-8 h-8 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-xs md:text-sm text-[#004c4c] block truncate">
                        {tool.name}
                      </span>
                      <span className="text-[11px] text-[#486363] block truncate">{tool.desc}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingToolIdx(idx);
                        setNewToolForm({ ...tool });
                        window.scrollTo({ top: 200, behavior: 'smooth' });
                      }}
                      className="p-1.5 text-[#004c4c] hover:bg-teal-50 rounded-lg cursor-pointer transition-colors"
                      title="Edit Tool"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteToolInAdmin(idx)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete Tool"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Skills Management */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                Skills & Methodological Competencies
              </h3>
              <p className="text-xs text-[#486363]">
                Manage the 3-column skill cards displayed in the Skills section of your home page.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenProfileModal('skills')}
                className="px-3.5 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Open in Modal</span>
              </button>
            </div>
          </div>

          {skillsSuccessMsg && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-[#004c4c] text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{skillsSuccessMsg}</span>
            </div>
          )}

          {skillsErrorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{skillsErrorMsg}</span>
            </div>
          )}

          {/* Add / Edit Skill Card Form */}
          <form onSubmit={handleSaveSkillInAdmin} className="neumorphic-card p-6 space-y-4 border border-teal-100/60">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs text-[#004c4c] uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  {editingSkillItem ? 'edit' : 'add_circle'}
                </span>
                <span>
                  {editingSkillItem
                    ? `Editing Skill: ${newSkillForm.title}`
                    : 'Add New Skill Card'}
                </span>
              </h4>
              {editingSkillItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkillItem(null);
                    setNewSkillForm({ id: '', title: '', icon: 'analytics', description: '' });
                  }}
                  className="text-xs text-[#486363] hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#486363] mb-1">
                  Skill Title
                </label>
                <input
                  type="text"
                  required
                  value={newSkillForm.title}
                  onChange={(e) => setNewSkillForm({ ...newSkillForm, title: e.target.value })}
                  placeholder="e.g. Econometric Modeling, Panel Data, Survey Design"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#486363] mb-1">
                  Icon (Material Symbol)
                </label>
                <input
                  type="text"
                  value={newSkillForm.icon}
                  onChange={(e) => setNewSkillForm({ ...newSkillForm, icon: e.target.value })}
                  placeholder="analytics, query_stats, psychology..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#486363] mb-1">
                Skill Description / Methodological Competency
              </label>
              <textarea
                rows={3}
                required
                value={newSkillForm.description}
                onChange={(e) => setNewSkillForm({ ...newSkillForm, description: e.target.value })}
                placeholder="Detailed methodological description of techniques, frameworks, and empirical procedures..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#FAF9F6] border border-[#e5e2db] resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#e5e2db]">
              <div className="flex items-center gap-2 text-xs text-[#486363]">
                <span>Icon Preview:</span>
                <div className="w-8 h-8 rounded-full neumorphic-inset flex items-center justify-center text-[#004c4c]">
                  <span className="material-symbols-outlined text-base">
                    {newSkillForm.icon || 'analytics'}
                  </span>
                </div>
                <span className="font-semibold text-[#004c4c]">{newSkillForm.title || 'Preview'}</span>
              </div>

              <button
                type="submit"
                disabled={savingSkills}
                className="px-5 py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow disabled:opacity-50"
              >
                {savingSkills ? (
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">
                    {editingSkillItem ? 'check' : 'add'}
                  </span>
                )}
                <span>{editingSkillItem ? 'Update Skill Card' : 'Add Skill Card'}</span>
              </button>
            </div>
          </form>

          {/* Current Skills List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#004c4c] uppercase tracking-wider">
              Current Skill Cards ({personalInfo.skills?.length || 0}):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personalInfo.skills?.map((skill) => (
                <div
                  key={skill.id}
                  className="neumorphic-card p-5 flex flex-col justify-between space-y-4 border border-[#e5e2db]/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="neumorphic-inset w-10 h-10 rounded-full flex items-center justify-center text-[#004c4c]">
                        <span className="material-symbols-outlined text-lg">{skill.icon}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSkillItem(skill.id);
                            setNewSkillForm({ ...skill });
                            window.scrollTo({ top: 200, behavior: 'smooth' });
                          }}
                          className="p-1.5 text-[#004c4c] hover:bg-teal-50 rounded-lg cursor-pointer transition-colors"
                          title="Edit Skill"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkillInAdmin(skill.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete Skill"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                    <h5 className="font-headline font-bold text-sm text-[#004c4c]">
                      {skill.title}
                    </h5>
                    <p className="text-xs text-[#486363] leading-relaxed line-clamp-4">
                      {skill.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Home Page & Bio Management */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                Home Page & Profile Management
              </h3>
              <p className="text-xs text-[#486363]">
                Manage all sections displayed on the public home page.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('education')}
                className="px-3 py-1.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">school</span>
                <span>Edit Education</span>
              </button>
              <button
                onClick={() => onOpenProfileModal('cv')}
                className="px-3 py-1.5 rounded-xl bg-teal-800 text-white hover:bg-teal-700 font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">description</span>
                <span>Manage / Upload CV</span>
              </button>
              <button
                onClick={() => onOpenProfileModal('photo')}
                className="px-3 py-1.5 rounded-xl bg-teal-800 text-white hover:bg-teal-700 font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">account_circle</span>
                <span>Change Photo</span>
              </button>
              <button
                onClick={() => onOpenProfileModal('bio')}
                className="px-3 py-1.5 rounded-xl bg-teal-800 text-white hover:bg-teal-700 font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Edit Bio & Info</span>
              </button>
              <button
                onClick={() => onOpenProfileModal('interests')}
                className="px-3 py-1.5 rounded-xl bg-teal-800 text-white hover:bg-teal-700 font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">psychology_alt</span>
                <span>Edit Interests</span>
              </button>
              <button
                onClick={() => onOpenProfileModal('toolkit')}
                className="px-3 py-1.5 rounded-xl bg-teal-800 text-white hover:bg-teal-700 font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">build</span>
                <span>Edit Toolkit</span>
              </button>
              <button
                onClick={() => onOpenProfileModal('skills')}
                className="px-3 py-1.5 rounded-xl bg-teal-800 text-white hover:bg-teal-700 font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">bar_chart</span>
                <span>Edit Skills</span>
              </button>
              <button
                onClick={() => setActiveTab('profiles')}
                className="px-3 py-1.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span>Academic Profiles</span>
              </button>
            </div>
          </div>

          {/* Profile Overview Card */}
          <div className="neumorphic-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  onClick={() => onOpenProfileModal('photo')}
                  className="relative group cursor-pointer shrink-0"
                  title="Click to change or remove profile picture"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden neumorphic-inset p-1 bg-[#f7f9fc] flex items-center justify-center">
                    {personalInfo.avatarUrl ? (
                      <img
                        src={personalInfo.avatarUrl}
                        alt={personalInfo.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#004c4c] text-white flex items-center justify-center font-bold text-base">
                        {personalInfo.name
                          ? personalInfo.name.split(' ').map((w) => w[0]).slice(0, 3).join('').toUpperCase()
                          : 'MRH'}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-[#004c4c]">
                    {personalInfo.name}
                  </h4>
                  <p className="text-xs text-[#486363]">{personalInfo.title}</p>
                  <p className="text-xs text-[#004c4c] font-medium">{personalInfo.affiliation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenProfileModal('photo')}
                  className="px-3 py-1.5 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  <span>{personalInfo.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs md:text-sm text-[#3f4948] leading-relaxed p-4 neumorphic-inset-box rounded-xl">
              {personalInfo.bio}
            </p>
          </div>

          {/* Curriculum Vitae (CV) Document Card */}
          <div className="neumorphic-card p-6 space-y-4 border border-teal-200/60 bg-white/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#004c4c]">
                  <span className="material-symbols-outlined text-2xl">
                    {personalInfo.cvDocument?.fileType === 'pdf' || personalInfo.cvDocument?.fileName?.toLowerCase().endsWith('.pdf')
                      ? 'picture_as_pdf'
                      : 'description'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline text-base font-bold text-[#004c4c]">
                      {personalInfo.cvDocument?.fileName || 'Official Curriculum Vitae'}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#004c4c] text-white">
                      {personalInfo.cvDocument ? personalInfo.cvDocument.fileType?.toUpperCase() || 'CUSTOM FILE' : 'AUTO-GENERATED'}
                    </span>
                  </div>
                  <p className="text-xs text-[#486363] mt-0.5">
                    {personalInfo.cvDocument?.fileData || personalInfo.cvDocument?.fileUrl
                      ? `${personalInfo.cvDocument.fileSize || ''} · Uploaded ${personalInfo.cvDocument.uploadedAt || ''} · Displayed on "Show CV" click`
                      : 'No custom document uploaded. Portfolio currently generates standard CV from profile.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenProfileModal('cv')}
                  className="px-3.5 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] text-xs font-semibold flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">upload_file</span>
                  <span>{personalInfo.cvDocument ? 'Replace / Edit CV' : 'Upload Word/PDF CV'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Education Section Summary Card */}
          <div className="neumorphic-card p-6 space-y-4 border border-teal-200/60 bg-white/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#004c4c]">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <div>
                  <h4 className="font-headline text-base font-bold text-[#004c4c]">
                    Education Section & Subsections
                  </h4>
                  <p className="text-xs text-[#486363] mt-0.5">
                    {personalInfo.education?.degree} · {personalInfo.education?.institution}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenProfileModal('education')}
                  className="px-3.5 py-2 rounded-xl neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  <span>Modal Edit</span>
                </button>
                <button
                  onClick={() => setActiveTab('education')}
                  className="px-3.5 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] text-xs font-semibold flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit All Subsections</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="neumorphic-inset-box p-3 rounded-xl">
                <span className="text-[10px] font-bold text-[#486363] uppercase block">Standing / GPA</span>
                <span className="text-xs font-semibold text-[#191c1e] truncate block">
                  {personalInfo.education?.gpa || 'Not set'}
                </span>
              </div>
              <div className="neumorphic-inset-box p-3 rounded-xl">
                <span className="text-[10px] font-bold text-[#486363] uppercase block">Specialization</span>
                <span className="text-xs font-semibold text-[#191c1e] truncate block">
                  {personalInfo.education?.focus || 'Not set'}
                </span>
              </div>
              <div className="neumorphic-inset-box p-3 rounded-xl">
                <span className="text-[10px] font-bold text-[#486363] uppercase block">Period</span>
                <span className="text-xs font-semibold text-[#191c1e] truncate block">
                  {personalInfo.education?.period || 'Not set'}
                </span>
              </div>
              <div className="neumorphic-inset-box p-3 rounded-xl">
                <span className="text-[10px] font-bold text-[#486363] uppercase block">Honors</span>
                <span className="text-xs font-semibold text-[#191c1e] truncate block">
                  {personalInfo.education?.honors || 'Not set'}
                </span>
              </div>
            </div>

            {personalInfo.education?.thesis && (
              <div className="p-3 rounded-xl neumorphic-inset-box text-xs text-[#3f4948]">
                <strong className="text-[#004c4c]">Thesis Capstone:</strong> {personalInfo.education.thesis}
              </div>
            )}
          </div>

          {/* Research Interests List */}
          <div className="neumorphic-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-headline text-base font-bold text-[#004c4c] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">psychology_alt</span>
                <span>Research Interests ({personalInfo.researchInterests?.length || 0})</span>
              </h4>
              <button
                onClick={() => onOpenProfileModal('interests')}
                className="text-xs font-semibold text-[#004c4c] hover:underline"
              >
                Edit Interests →
              </button>
            </div>
            <div className="flex flex-wrap gap-2 p-3 neumorphic-inset-box rounded-xl">
              {personalInfo.researchInterests?.map((interest, idx) => (
                <span
                  key={idx}
                  className="neumorphic-card px-3 py-1 rounded-lg text-xs font-medium text-[#004c4c]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Quantitative Toolkit List */}
          <div className="neumorphic-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-headline text-base font-bold text-[#004c4c] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">build</span>
                <span>Quantitative Toolkit ({personalInfo.quantitativeToolkit?.length || 0})</span>
              </h4>
              <button
                onClick={() => onOpenProfileModal('toolkit')}
                className="text-xs font-semibold text-[#004c4c] hover:underline"
              >
                Edit Toolkit →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {personalInfo.quantitativeToolkit?.map((tool, idx) => (
                <div key={idx} className="neumorphic-inset-box p-3 flex items-center gap-3">
                  <ToolkitLogo name={tool.name} className="w-7 h-7 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#004c4c] block truncate">
                      {tool.name}
                    </span>
                    <span className="text-[11px] text-[#486363] block truncate">{tool.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic & Professional Profiles Overview Card */}
          <div className="neumorphic-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-headline text-base font-bold text-[#004c4c] flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">share</span>
                  <span>Academic & Professional Profiles (4)</span>
                </h4>
                <p className="text-xs text-[#486363] mt-0.5">
                  Live URLs for LinkedIn, Google Scholar, ORCID, and ResearchGate.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('profiles')}
                className="text-xs font-semibold text-[#004c4c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Edit All URLs</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {canonicalProfilesConfig.map((item) => {
                const currentVal = profileUrls[item.key] ?? item.defaultUrl;
                return (
                  <div key={item.key} className="neumorphic-inset-box p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#004c4c] border border-[#e5e2db] shrink-0">
                        <span className="material-symbols-outlined text-base">{item.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-[#004c4c] block">{item.label}</span>
                        <span className="text-[11px] text-[#486363] block truncate">{currentVal}</span>
                      </div>
                    </div>
                    {currentVal && (
                      <a
                        href={currentVal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#004c4c] hover:text-[#006666] shrink-0 p-1"
                        title="Open Link"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
