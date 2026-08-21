import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Publication, ResearchExperience, AwardItem, ExperienceItem, ContactMessage } from '../../types';
import { ToolkitLogo } from '../ToolkitLogos';
import { ProfileModalTab } from './EditProfileModal';

interface AdminDashboardProps {
  onClose: () => void;
  onEditProfile: (tab?: ProfileModalTab) => void;
  onEditPublication: (pub: Publication | null) => void;
  onEditTimeline: (item: ResearchExperience | null) => void;
  onEditAward: (award: AwardItem | null) => void;
  onEditExperience: (exp: ExperienceItem | null) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onEditProfile,
  onEditPublication,
  onEditTimeline,
  onEditAward,
  onEditExperience,
}) => {
  const { currentUser, logout } = useAuth();
  const {
    personalInfo,
    publications = [],
    researchTimeline = [],
    awards = [],
    experience = [],
    messages = [],
    deletePublication,
    deleteResearchTimeline,
    deleteAward,
    deleteExperience,
    markMessageRead,
    deleteMessage,
  } = useData();

  const [activeTab, setActiveTab] = useState<
    'inbox' | 'publications' | 'timeline' | 'experience' | 'awards' | 'profile'
  >('inbox');

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const unreadMessages = (messages || []).filter((m) => !m?.read);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f7f9fc] rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden border border-white/80">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d8dadd] bg-[#f7f9fc] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl neumorphic-inset flex items-center justify-center text-[#004c4c]">
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-[#004c4c]">
                  Portfolio Admin Dashboard
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-[#004c4c] border border-teal-300">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-[#486363]">
                Full management of publications, experience, awards, profile, and visitor inbox.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-[#d8dadd] px-6 bg-[#f7f9fc] shrink-0 gap-2">
          {[
            {
              id: 'inbox',
              label: 'Visitor Messages',
              icon: 'mail',
              badge: unreadMessages.length > 0 ? unreadMessages.length : undefined,
            },
            { id: 'publications', label: `Publications (${publications.length})`, icon: 'menu_book' },
            { id: 'timeline', label: `Research Timeline (${researchTimeline.length})`, icon: 'timeline' },
            { id: 'experience', label: `Experience (${experience.length})`, icon: 'work' },
            { id: 'awards', label: `Awards & Honors (${awards.length})`, icon: 'military_tech' },
            { id: 'profile', label: 'Bio & Education', icon: 'person' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#004c4c] text-[#004c4c] bg-teal-50/40'
                    : 'border-transparent text-[#486363] hover:text-[#004c4c]'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 text-sm">
          {/* TAB 1: VISITOR INBOX */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                    Visitor Inquiries & Contact Messages
                  </h3>
                  <p className="text-xs text-[#486363]">
                    Messages submitted through the "Contact Me" and "Direct Inquiry" forms.
                  </p>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="neumorphic-card p-12 text-center space-y-3">
                  <span className="material-symbols-outlined text-4xl text-teal-700">
                    mark_email_read
                  </span>
                  <p className="text-sm font-medium text-[#486363]">
                    No visitor inquiries yet. Messages sent through your contact page will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Messages list */}
                  <div className="md:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (!msg.read) markMessageRead(msg.id, true);
                        }}
                        className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                          selectedMessage?.id === msg.id
                            ? 'bg-[#004c4c] text-white border-[#004c4c]'
                            : !msg.read
                            ? 'bg-white border-teal-300 shadow-sm font-semibold'
                            : 'bg-white/60 border-slate-200 text-[#486363]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold truncate max-w-[130px]">{msg.name}</span>
                          <span className="text-[10px] opacity-75">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleDateString()
                              : 'Recent'}
                          </span>
                        </div>
                        <p
                          className={`text-xs truncate ${
                            selectedMessage?.id === msg.id ? 'text-teal-100' : 'text-[#004c4c]'
                          }`}
                        >
                          {msg.purpose || 'General Inquiry'}
                        </p>
                        <p className="text-[11px] truncate opacity-80 mt-1">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Message Detail View */}
                  <div className="md:col-span-2 neumorphic-card p-6 flex flex-col justify-between">
                    {selectedMessage ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between border-b border-[#d8dadd] pb-3">
                          <div>
                            <h4 className="font-headline text-lg font-bold text-[#191c1e]">
                              {selectedMessage.name}
                            </h4>
                            <p className="text-xs text-[#004c4c] font-mono">
                              {selectedMessage.email}
                            </p>
                            <span className="inline-block mt-1 neumorphic-inset px-2.5 py-0.5 text-[11px] font-semibold text-[#486363]">
                              {selectedMessage.purpose}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                                selectedMessage.subject || selectedMessage.purpose
                              )}`}
                              className="px-3 py-1.5 rounded-lg bg-[#004c4c] text-white text-xs font-semibold hover:bg-[#006666] flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-xs">reply</span>
                              Reply
                            </a>
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this message?')) {
                                  deleteMessage(selectedMessage.id);
                                  setSelectedMessage(null);
                                }
                              }}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs"
                              title="Delete message"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </div>

                        {selectedMessage.subject && (
                          <div>
                            <span className="text-[11px] font-bold text-[#486363] uppercase">
                              Subject:
                            </span>
                            <p className="text-sm font-semibold text-[#191c1e]">
                              {selectedMessage.subject}
                            </p>
                          </div>
                        )}

                        <div className="bg-[#f7f9fc] p-4 rounded-xl neumorphic-inset-box">
                          <p className="text-sm text-[#191c1e] whitespace-pre-wrap leading-relaxed">
                            {selectedMessage.message}
                          </p>
                        </div>

                        <div className="text-[11px] text-[#486363]">
                          Received:{' '}
                          {selectedMessage.createdAt
                            ? new Date(selectedMessage.createdAt).toLocaleString()
                            : 'N/A'}
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-center text-[#486363]">
                        <span className="material-symbols-outlined text-3xl mb-2 text-[#004c4c]">
                          chat
                        </span>
                        <p className="text-xs">Select a message from the list to view full details</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PUBLICATIONS */}
          {activeTab === 'publications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                    Research Publications & Working Papers
                  </h3>
                  <p className="text-xs text-[#486363]">
                    Manage articles, status (Under Review / Published), abstracts, methodologies, and citations.
                  </p>
                </div>
                <button
                  onClick={() => onEditPublication(null)}
                  className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Paper
                </button>
              </div>

              <div className="space-y-3">
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="neumorphic-card p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            pub.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {pub.status === 'published' ? 'Published' : 'Under Review'}
                        </span>
                        <span className="text-xs font-semibold text-[#486363]">{pub.year}</span>
                      </div>
                      <h4 className="font-headline text-base font-bold text-[#191c1e]">
                        {pub.title}
                      </h4>
                      <p className="text-xs text-[#486363]">
                        {pub.authors} {pub.journalOrVenue ? `· ${pub.journalOrVenue}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onEditPublication(pub)}
                        className="px-3 py-1.5 rounded-lg neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${pub.title}"?`)) {
                            deletePublication(pub.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                    Research Timeline Nodes
                  </h3>
                  <p className="text-xs text-[#486363]">
                    Key research projects, thesis work, and international laboratory appointments.
                  </p>
                </div>
                <button
                  onClick={() => onEditTimeline(null)}
                  className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Timeline Node
                </button>
              </div>

              <div className="space-y-3">
                {researchTimeline.map((item) => (
                  <div
                    key={item.id}
                    className="neumorphic-card p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 max-w-2xl">
                      <div className="neumorphic-inset w-10 h-10 rounded-xl flex items-center justify-center text-[#004c4c] shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-[#004c4c]">{item.period}</span>
                        <h4 className="font-headline text-base font-bold text-[#191c1e]">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#486363]">{item.supervisorOrRole}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onEditTimeline(item)}
                        className="px-3 py-1.5 rounded-lg neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${item.title}"?`)) {
                            deleteResearchTimeline(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                    Academic & Teaching Experience
                  </h3>
                  <p className="text-xs text-[#486363]">
                    Teaching assistantships, TEEP fellowships, and student research leadership.
                  </p>
                </div>
                <button
                  onClick={() => onEditExperience(null)}
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
                    className="neumorphic-card p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 max-w-2xl">
                      <div className="neumorphic-inset w-10 h-10 rounded-xl flex items-center justify-center text-[#004c4c] shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-xl">{exp.icon}</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline text-base font-bold text-[#191c1e]">
                            {exp.role}
                          </h4>
                          <span className="neumorphic-inset px-2 py-0.5 text-[10px] font-semibold text-[#004c4c]">
                            {exp.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#486363]">
                          {exp.organization} · {exp.period}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onEditExperience(exp)}
                        className="px-3 py-1.5 rounded-lg neumorphic-btn text-xs font-semibold text-[#004c4c] flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${exp.role}"?`)) {
                            deleteExperience(exp.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AWARDS */}
          {activeTab === 'awards' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                    Awards, Honors, Conferences & Courses
                  </h3>
                  <p className="text-xs text-[#486363]">
                    Record of academic recognition, international scholarships, and certifications.
                  </p>
                </div>
                <button
                  onClick={() => onEditAward(null)}
                  className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Award / Course
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {awards.map((award) => (
                  <div
                    key={award.id}
                    className="neumorphic-card p-4 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="neumorphic-inset w-10 h-10 rounded-xl flex items-center justify-center text-[#004c4c] shrink-0">
                        <span className="material-symbols-outlined text-xl">{award.icon}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#004c4c] uppercase">
                          {award.category} · {award.tag}
                        </span>
                        <h4 className="font-headline text-sm font-bold text-[#191c1e]">
                          {award.title}
                        </h4>
                        <p className="text-xs text-[#486363] line-clamp-2 mt-0.5">
                          {award.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEditAward(award)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-[#004c4c] cursor-pointer"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${award.title}"?`)) {
                            deleteAward(award.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
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

          {/* TAB 6: HOME PAGE & PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                    Home Page & Profile Management
                  </h3>
                  <p className="text-xs text-[#486363]">
                    Live overview of all home page sections: Bio, Education, Research Interests, Quantitative Toolkit, and Skills.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onEditProfile('bio')}
                    className="px-3 py-1.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit Bio & Info</span>
                  </button>
                  <button
                    onClick={() => onEditProfile('interests')}
                    className="px-3 py-1.5 rounded-xl bg-teal-800 text-white hover:bg-teal-700 font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">psychology_alt</span>
                    <span>Edit Interests</span>
                  </button>
                  <button
                    onClick={() => onEditProfile('toolkit')}
                    className="px-3 py-1.5 rounded-xl bg-teal-800 text-white hover:bg-teal-700 font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">build</span>
                    <span>Edit Toolkit</span>
                  </button>
                  <button
                    onClick={() => onEditProfile('skills')}
                    className="px-3 py-1.5 rounded-xl bg-teal-800 text-white hover:bg-teal-700 font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">bar_chart</span>
                    <span>Edit Skills</span>
                  </button>
                  <button
                    onClick={() => onEditProfile('social')}
                    className="px-3 py-1.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                    <span>Academic Profiles</span>
                  </button>
                </div>
              </div>

              {/* Bio & Education Card */}
              <div className="neumorphic-card p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004c4c] uppercase tracking-wider">
                    Profile & Academic Biography
                  </span>
                  <button
                    onClick={() => onEditProfile('bio')}
                    className="text-xs text-[#004c4c] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    <span>Edit Bio</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={personalInfo.avatarUrl}
                    alt={personalInfo.name}
                    className="w-16 h-16 rounded-full object-cover neumorphic-inset p-1 shrink-0"
                  />
                  <div>
                    <h4 className="font-display text-xl font-bold text-[#004c4c]">
                      {personalInfo.name}
                    </h4>
                    <p className="text-xs text-[#486363] font-medium">{personalInfo.title}</p>
                    <p className="text-xs text-[#004c4c]">{personalInfo.affiliation}</p>
                  </div>
                </div>

                <div className="neumorphic-inset-box p-4">
                  <span className="text-[11px] font-bold uppercase text-[#004c4c] block mb-1">
                    Bio Summary
                  </span>
                  <p className="text-xs text-[#3f4948] leading-relaxed">{personalInfo.bio}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-[#486363]">Education Degree:</span>
                    <p className="text-[#191c1e]">{personalInfo.education?.degree}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#486363]">Institution:</span>
                    <p className="text-[#191c1e]">{personalInfo.education?.institution}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#486363]">GPA Standing:</span>
                    <p className="text-[#191c1e]">{personalInfo.education?.gpa}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#486363]">Specialization:</span>
                    <p className="text-[#191c1e]">{personalInfo.education?.focus}</p>
                  </div>
                </div>
              </div>

              {/* Research Interests Manager */}
              <div className="neumorphic-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#004c4c] text-lg">psychology_alt</span>
                    <h4 className="font-headline text-base font-bold text-[#004c4c]">
                      Research Interests ({personalInfo.researchInterests?.length || 0})
                    </h4>
                  </div>
                  <button
                    onClick={() => onEditProfile('interests')}
                    className="px-3 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-[#004c4c] text-xs font-semibold flex items-center gap-1 border border-teal-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    <span>Manage Interests</span>
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

              {/* Quantitative Toolkit Manager */}
              <div className="neumorphic-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#004c4c] text-lg">build</span>
                    <h4 className="font-headline text-base font-bold text-[#004c4c]">
                      Quantitative Toolkit ({personalInfo.quantitativeToolkit?.length || 0})
                    </h4>
                  </div>
                  <button
                    onClick={() => onEditProfile('toolkit')}
                    className="px-3 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-[#004c4c] text-xs font-semibold flex items-center gap-1 border border-teal-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    <span>Manage Toolkit</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {personalInfo.quantitativeToolkit?.map((tool, idx) => (
                    <div
                      key={idx}
                      className="neumorphic-inset-box p-3 flex items-center gap-3"
                    >
                      <ToolkitLogo name={tool.name} className="w-7 h-7 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-[#004c4c] block truncate">
                          {tool.name}
                        </span>
                        <span className="text-[11px] text-[#486363] block truncate">
                          {tool.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Cards Manager */}
              <div className="neumorphic-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#004c4c] text-lg">bar_chart</span>
                    <h4 className="font-headline text-base font-bold text-[#004c4c]">
                      Skills & Methodological Competencies ({personalInfo.skills?.length || 0})
                    </h4>
                  </div>
                  <button
                    onClick={() => onEditProfile('skills')}
                    className="px-3 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-[#004c4c] text-xs font-semibold flex items-center gap-1 border border-teal-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    <span>Manage Skills</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {personalInfo.skills?.map((skill) => (
                    <div
                      key={skill.id}
                      className="neumorphic-inset-box p-4 flex flex-col items-center text-center space-y-2"
                    >
                      <div className="neumorphic-inset w-10 h-10 rounded-full flex items-center justify-center text-[#004c4c]">
                        <span className="material-symbols-outlined text-xl">{skill.icon}</span>
                      </div>
                      <h5 className="font-bold text-xs text-[#191c1e]">{skill.title}</h5>
                      <p className="text-[11px] text-[#486363] leading-relaxed line-clamp-2">
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic & Professional Profiles Manager */}
              <div className="neumorphic-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#004c4c] text-lg">share</span>
                    <h4 className="font-headline text-base font-bold text-[#004c4c]">
                      Academic & Professional Profiles (4)
                    </h4>
                  </div>
                  <button
                    onClick={() => onEditProfile('social')}
                    className="px-3 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-[#004c4c] text-xs font-semibold flex items-center gap-1 border border-teal-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    <span>Edit Profile URLs</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      name: 'LinkedIn',
                      icon: 'work',
                      defaultUrl: 'https://linkedin.com/in/muhammad-rezaul-haider',
                    },
                    {
                      name: 'Scholar',
                      icon: 'school',
                      defaultUrl: 'https://scholar.google.com/citations?user=rezaulhaider',
                    },
                    {
                      name: 'ORCID',
                      icon: 'fingerprint',
                      defaultUrl: 'https://orcid.org/0009-0004-8192-3341',
                    },
                    {
                      name: 'ResearchGate',
                      icon: 'science',
                      defaultUrl: 'https://researchgate.net/profile/Muhammad-Rezaul-Haider',
                    },
                  ].map((cp) => {
                    const match = personalInfo.socialLinks?.find((s) => {
                      const sName = (s.name || '').toLowerCase();
                      const sUrl = (s.url || '').toLowerCase();
                      return sName.includes(cp.name.toLowerCase()) || sUrl.includes(cp.name.toLowerCase());
                    });
                    const activeUrl = match?.url || cp.defaultUrl;
                    return (
                      <div key={cp.name} className="neumorphic-inset-box p-3.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#004c4c] border border-[#e5e2db] shrink-0">
                            <span className="material-symbols-outlined text-base">{cp.icon}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-[#004c4c] block">{cp.name}</span>
                            <span className="text-[11px] text-[#486363] block truncate">{activeUrl}</span>
                          </div>
                        </div>
                        {activeUrl && (
                          <a
                            href={activeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#004c4c] hover:text-[#006666] shrink-0 p-1"
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
      </div>
    </div>
  );
};
