/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, Publication, ResearchExperience, AwardItem, ExperienceItem } from './types';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/screens/HomeScreen';
import { ResearchScreen } from './components/screens/ResearchScreen';
import { AwardsScreen } from './components/screens/AwardsScreen';
import { ContactScreen } from './components/screens/ContactScreen';
import { NotesScreen } from './components/screens/NotesScreen';
import { AdminPageScreen } from './components/screens/AdminPageScreen';
import { PublicationModal } from './components/modals/PublicationModal';
import { CvModal } from './components/modals/CvModal';
import { ComposeModal } from './components/modals/ComposeModal';
import { EditProfileModal, ProfileModalTab } from './components/admin/EditProfileModal';
import { EditPublicationModal } from './components/admin/EditPublicationModal';
import { EditTimelineModal } from './components/admin/EditTimelineModal';
import { EditAwardModal } from './components/admin/EditAwardModal';
import { EditExperienceModal } from './components/admin/EditExperienceModal';
import { EditNoteModal } from './components/admin/EditNoteModal';
import { NotePost } from './types';

function PortfolioApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  // Editing state modals (used by Admin Page)
  const [profileModalState, setProfileModalState] = useState<{
    isOpen: boolean;
    tab: ProfileModalTab;
  }>({
    isOpen: false,
    tab: 'bio',
  });
  const [editingPublication, setEditingPublication] = useState<{ isOpen: boolean; pub: Publication | null }>({
    isOpen: false,
    pub: null,
  });
  const [editingTimeline, setEditingTimeline] = useState<{ isOpen: boolean; item: ResearchExperience | null }>({
    isOpen: false,
    item: null,
  });
  const [editingAward, setEditingAward] = useState<{ isOpen: boolean; award: AwardItem | null }>({
    isOpen: false,
    award: null,
  });
  const [editingExperience, setEditingExperience] = useState<{ isOpen: boolean; exp: ExperienceItem | null }>({
    isOpen: false,
    exp: null,
  });
  const [editingNote, setEditingNote] = useState<{ isOpen: boolean; note: NotePost | null }>({
    isOpen: false,
    note: null,
  });

  const handleOpenProfileModal = (tab: ProfileModalTab = 'bio') => {
    setProfileModalState({ isOpen: true, tab });
  };

  // Sync with URL pathname and hash (e.g. /fahim1211 or #fahim1211 or #admin or #notes)
  useEffect(() => {
    const handleUrlRoute = () => {
      const pathname = window.location.pathname.replace('/', '').toLowerCase();
      const hash = window.location.hash.replace('#', '').toLowerCase();

      // Check if URL is fahim1211 (either path /fahim1211 or hash #fahim1211 or #admin)
      if (pathname === 'fahim1211' || hash === 'fahim1211' || hash === 'admin') {
        setActiveTab('admin');
        return;
      }

      if (['home', 'research', 'awards', 'contact', 'notes'].includes(hash)) {
        setActiveTab(hash as TabType);
      } else if (['home', 'research', 'awards', 'contact', 'notes'].includes(pathname)) {
        setActiveTab(pathname as TabType);
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'admin') {
      window.location.hash = 'fahim1211';
    } else {
      window.location.hash = tab;
    }
  };

  return (
    <div className="bg-[#f7f9fc] text-[#191c1e] font-body min-h-screen flex flex-col antialiased selection:bg-[#004c4c] selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* Main Content Area */}
      <main className="flex-grow w-full">
        {activeTab === 'home' && (
          <HomeScreen
            setActiveTab={handleTabChange}
            onOpenCvModal={() => setIsCvModalOpen(true)}
          />
        )}

        {activeTab === 'research' && (
          <ResearchScreen
            onSelectPublication={(pub) => setSelectedPublication(pub)}
          />
        )}

        {activeTab === 'awards' && (
          <AwardsScreen />
        )}

        {activeTab === 'contact' && (
          <ContactScreen
            onOpenComposeModal={() => setIsComposeModalOpen(true)}
          />
        )}

        {activeTab === 'notes' && (
          <NotesScreen />
        )}

        {activeTab === 'admin' && (
          <AdminPageScreen
            onOpenProfileModal={handleOpenProfileModal}
            onOpenNewPublicationModal={() => setEditingPublication({ isOpen: true, pub: null })}
            onEditPublication={(pub) => setEditingPublication({ isOpen: true, pub })}
            onOpenNewTimelineModal={() => setEditingTimeline({ isOpen: true, item: null })}
            onEditTimeline={(item) => setEditingTimeline({ isOpen: true, item })}
            onOpenNewAwardModal={() => setEditingAward({ isOpen: true, award: null })}
            onEditAward={(award) => setEditingAward({ isOpen: true, award })}
            onOpenNewExperienceModal={() => setEditingExperience({ isOpen: true, exp: null })}
            onEditExperience={(exp) => setEditingExperience({ isOpen: true, exp })}
            onOpenNewNoteModal={() => setEditingNote({ isOpen: true, note: null })}
            onEditNote={(note) => setEditingNote({ isOpen: true, note })}
            onNavigateHome={() => handleTabChange('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* Standard Modals */}
      <PublicationModal
        publication={selectedPublication}
        onClose={() => setSelectedPublication(null)}
      />

      <CvModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
      />

      <ComposeModal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
      />

      {/* Admin Modals triggered from Admin Page */}
      <EditProfileModal
        isOpen={profileModalState.isOpen}
        initialTab={profileModalState.tab}
        onClose={() => setProfileModalState({ isOpen: false, tab: 'bio' })}
      />

      <EditPublicationModal
        publication={editingPublication.pub}
        isOpen={editingPublication.isOpen}
        onClose={() => setEditingPublication({ isOpen: false, pub: null })}
      />

      <EditTimelineModal
        item={editingTimeline.item}
        isOpen={editingTimeline.isOpen}
        onClose={() => setEditingTimeline({ isOpen: false, item: null })}
      />

      <EditAwardModal
        award={editingAward.award}
        isOpen={editingAward.isOpen}
        onClose={() => setEditingAward({ isOpen: false, award: null })}
      />

      <EditExperienceModal
        experience={editingExperience.exp}
        isOpen={editingExperience.isOpen}
        onClose={() => setEditingExperience({ isOpen: false, exp: null })}
      />

      <EditNoteModal
        note={editingNote.note}
        isOpen={editingNote.isOpen}
        onClose={() => setEditingNote({ isOpen: false, note: null })}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <PortfolioApp />
      </DataProvider>
    </AuthProvider>
  );
}
