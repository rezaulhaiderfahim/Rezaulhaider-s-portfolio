import React, { useState } from 'react';
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
  const { currentUser, isAdmin, loginWithGoogle, loginWithEmail, logout, authError, clearAuthError } = useAuth();
  const {
    personalInfo,
    publications = [],
    researchTimeline = [],
    awards = [],
    experience = [],
    notes = [],
    messages = [],
    deletePublication,
    deleteResearchTimeline,
    deleteAward,
    deleteExperience,
    deleteNote,
    markMessageRead,
    deleteMessage,
  } = useData();

  const [activeTab, setActiveTab] = useState<
    'inbox' | 'publications' | 'notes' | 'timeline' | 'experience' | 'awards' | 'profile'
  >('inbox');

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Login form states if not logged in
  const [email, setEmail] = useState('Fahimhaider0124@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const unreadMessages = (messages || []).filter((m) => !m.read);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearAuthError();
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      console.error(err);
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
      <div className="w-full max-w-md mx-auto px-6 py-16 md:py-24">
        <div className="bg-[#f7f9fc] rounded-2xl p-8 neumorphic-card border border-white/80 space-y-6 shadow-xl">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full neumorphic-inset flex items-center justify-center text-[#004c4c]">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#004c4c]">
              Administrator Portal
            </h1>
            <p className="text-xs text-[#486363]">
              Please authenticate with your administrator credentials to access management tools.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
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
              <span>Sign In with Google</span>
            </button>

            <div className="flex items-center my-3">
              <div className="flex-grow border-t border-[#d8dadd]"></div>
              <span className="px-3 text-[11px] text-[#486363] uppercase tracking-wider font-semibold">
                Or with password
              </span>
              <div className="flex-grow border-t border-[#d8dadd]"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#004c4c] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#004c4c] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs transition-colors cursor-pointer shadow disabled:opacity-50 mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                onClick={onNavigateHome}
                className="text-xs text-[#486363] hover:text-[#004c4c] hover:underline cursor-pointer"
              >
                ← Return to Public Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1140px] mx-auto px-6 md:px-12 py-10 md:py-16 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#d8dadd]">
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
                URL: /fahim1211
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
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-[#d8dadd]/60">
        {[
          { id: 'inbox', label: `Inbox Messages (${unreadMessages.length})`, icon: 'mail' },
          { id: 'publications', label: `Publications (${publications?.length || 0})`, icon: 'menu_book' },
          { id: 'notes', label: `Notes & Archive (${notes?.length || 0})`, icon: 'edit_note' },
          { id: 'timeline', label: `Research Timeline (${researchTimeline?.length || 0})`, icon: 'history_edu' },
          { id: 'experience', label: `Experience (${experience?.length || 0})`, icon: 'work' },
          { id: 'awards', label: `Awards & Honors (${awards?.length || 0})`, icon: 'military_tech' },
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
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="neumorphic-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-50 text-[#004c4c] border border-teal-200 uppercase">
                      {pub.status}
                    </span>
                    <span className="text-xs font-semibold text-[#486363]">{pub.year}</span>
                  </div>
                  <h4 className="font-headline text-sm md:text-base font-bold text-[#191c1e]">
                    {pub.title}
                  </h4>
                  <p className="text-xs text-[#486363] italic">{pub.journal || 'Working Paper'}</p>
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
            ))}
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

      {/* Tab 6: Home Page & Bio Management */}
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
                onClick={() => onOpenProfileModal('photo')}
                className="px-3 py-1.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
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
        </div>
      )}
    </div>
  );
};
