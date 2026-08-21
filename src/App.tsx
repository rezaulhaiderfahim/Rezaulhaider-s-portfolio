/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TabType, Publication, ResearchExperience, AwardItem, ExperienceItem, NotePost } from './types';
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

interface SeoMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  path: string;
  robots: string;
}

const SEO_CONFIG: Record<TabType, SeoMeta> = {
  home: {
    title: 'Muhammad Rezaul Haider | Academic & Economics Research Portfolio',
    description:
      'Academic research portfolio of Muhammad Rezaul Haider – Economics researcher specializing in Applied Panel Econometrics, Labor Economics, and Gender Economics in developing Asia.',
    ogTitle: 'Muhammad Rezaul Haider | Academic & Economics Research Portfolio',
    ogDescription:
      'Academic research portfolio of Muhammad Rezaul Haider – Economics researcher specializing in Applied Panel Econometrics, Labor Economics, and Gender Economics in developing Asia.',
    path: '/',
    robots: 'index, follow',
  },
  research: {
    title: 'Research & Publications | Muhammad Rezaul Haider',
    description:
      'Empirical research manuscripts, working papers, and econometric studies by Muhammad Rezaul Haider on female labor force participation, fertility dynamics, and structural transformation.',
    ogTitle: 'Research & Publications | Muhammad Rezaul Haider',
    ogDescription:
      'Empirical research manuscripts, working papers, and econometric studies by Muhammad Rezaul Haider.',
    path: '/research',
    robots: 'index, follow',
  },
  awards: {
    title: 'Awards & Honors | Muhammad Rezaul Haider',
    description:
      'Academic honors, international research fellowships, scholarship awards, and academic achievements of Muhammad Rezaul Haider.',
    ogTitle: 'Awards & Honors | Muhammad Rezaul Haider',
    ogDescription:
      'Academic honors, international research fellowships, scholarship awards, and academic achievements of Muhammad Rezaul Haider.',
    path: '/awards',
    robots: 'index, follow',
  },
  contact: {
    title: 'Contact & Academic Inquiries | Muhammad Rezaul Haider',
    description:
      'Get in touch with Muhammad Rezaul Haider for academic collaborations, research inquiries, or econometric discussions.',
    ogTitle: 'Contact & Academic Inquiries | Muhammad Rezaul Haider',
    ogDescription:
      'Get in touch with Muhammad Rezaul Haider for academic collaborations, research inquiries, or econometric discussions.',
    path: '/contact',
    robots: 'index, follow',
  },
  notes: {
    title: 'Notes & Academic Working Thoughts | M. R. Haider',
    description:
      'Personal notes, empirical methodologies, econometrics code notes, and observations on economics and development by Muhammad Rezaul Haider.',
    ogTitle: 'Notes & Academic Working Thoughts | M. R. Haider',
    ogDescription:
      'Personal notes, empirical methodologies, econometrics code notes, and observations on economics and development by Muhammad Rezaul Haider.',
    path: '/notes',
    robots: 'index, follow',
  },
  admin: {
    title: 'Portfolio Administration | M. R. Haider',
    description: 'Portfolio content management system for Muhammad Rezaul Haider.',
    ogTitle: 'Portfolio Administration | M. R. Haider',
    ogDescription: 'Portfolio content management system for Muhammad Rezaul Haider.',
    path: '/fahim1211',
    robots: 'noindex, nofollow',
  },
};

const tabToPath = (tab: TabType): string => {
  if (tab === 'home') return '/';
  if (tab === 'admin') return '/fahim1211';
  return `/${tab}`;
};

const pathToTab = (pathname: string): TabType => {
  if (!pathname) return 'home';
  const clean = pathname.split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '').toLowerCase();
  if (clean === 'fahim1211' || clean === 'admin') return 'admin';
  if (clean === 'research') return 'research';
  if (clean === 'awards') return 'awards';
  if (clean === 'contact') return 'contact';
  if (clean === 'notes') return 'notes';
  return 'home';
};

function PortfolioApp() {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    // Determine initial tab from pathname or fallback hash
    if (typeof window !== 'undefined') {
      const pathTab = pathToTab(window.location.pathname);
      if (pathTab !== 'home') return pathTab;

      const rawHash = window.location.hash.replace(/^[#/]+/, '').toLowerCase();
      if (rawHash) {
        return pathToTab(rawHash);
      }
    }
    return 'home';
  });

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

  // Sync with browser history, popstate and hashchange events
  useEffect(() => {
    const handleUrlChange = () => {
      let tab = pathToTab(window.location.pathname);
      if (tab === 'home') {
        const hashClean = window.location.hash.replace(/^[#/]+/, '').toLowerCase();
        if (hashClean) {
          const hashTab = pathToTab(hashClean);
          if (hashTab !== 'home') {
            tab = hashTab;
          }
        }
      }
      setActiveTab(tab);
    };

    // If loaded with a legacy hash fragment (#fahim1211, #research), normalize to real path
    const hash = window.location.hash.replace(/^[#/]+/, '').toLowerCase();
    if (hash && ['home', 'research', 'awards', 'contact', 'notes', 'fahim1211', 'admin'].includes(hash)) {
      const targetTab = pathToTab(hash);
      const targetPath = tabToPath(targetTab);
      window.history.replaceState(null, '', targetPath);
      setActiveTab(targetTab);
    }

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Update Page Title and Meta Tags per section
  useEffect(() => {
    const meta = SEO_CONFIG[activeTab] || SEO_CONFIG.home;
    const baseDomain = 'https://[MY-ACTUAL-DOMAIN]';
    const canonicalUrl = `${baseDomain}${meta.path === '/' ? '/' : meta.path}`;

    // Document Title
    document.title = meta.title;

    // Helper for Meta Tags
    const setMetaTag = (selector: string, attr: string, value: string, createAttr?: { key: string; val: string }) => {
      let el = document.querySelector(selector);
      if (!el && createAttr) {
        el = document.createElement('meta');
        el.setAttribute(createAttr.key, createAttr.val);
        document.head.appendChild(el);
      }
      if (el) {
        el.setAttribute(attr, value);
      }
    };

    // Helper for Link Tags
    const setLinkTag = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    setMetaTag('meta[name="description"]', 'content', meta.description, { key: 'name', val: 'description' });
    setMetaTag('meta[name="title"]', 'content', meta.title, { key: 'name', val: 'title' });
    setMetaTag('meta[name="robots"]', 'content', meta.robots, { key: 'name', val: 'robots' });

    setMetaTag('meta[property="og:title"]', 'content', meta.ogTitle, { key: 'property', val: 'og:title' });
    setMetaTag('meta[property="og:description"]', 'content', meta.ogDescription, { key: 'property', val: 'og:description' });
    setMetaTag('meta[property="og:url"]', 'content', canonicalUrl, { key: 'property', val: 'og:url' });

    setMetaTag('meta[name="twitter:title"]', 'content', meta.ogTitle, { key: 'name', val: 'twitter:title' });
    setMetaTag('meta[name="twitter:description"]', 'content', meta.ogDescription, { key: 'name', val: 'twitter:description' });
    setMetaTag('meta[name="twitter:url"]', 'content', canonicalUrl, { key: 'name', val: 'twitter:url' });

    setLinkTag('canonical', canonicalUrl);
  }, [activeTab]);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    const targetPath = tabToPath(tab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, []);

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
