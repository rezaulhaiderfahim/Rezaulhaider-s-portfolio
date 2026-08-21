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

export const tabToPath = (tab: TabType): string => {
  if (tab === 'home') return '/';
  if (tab === 'admin') return '/fahim1211';
  return `/${tab}`;
};

export const resolveCurrentLocationToTab = (): TabType => {
  if (typeof window === 'undefined') return 'home';

  const pathname = window.location.pathname || '';
  const search = window.location.search || '';
  const hash = window.location.hash || '';

  // 1. Check Query Parameters (?tab=fahim1211, ?page=admin, ?fahim1211, ?admin, etc.)
  if (search) {
    try {
      const searchParams = new URLSearchParams(search);
      const directKeys = ['fahim1211', 'admin', 'research', 'awards', 'notes', 'contact'];
      for (const key of directKeys) {
        if (searchParams.has(key)) {
          return key === 'fahim1211' || key === 'admin' ? 'admin' : (key as TabType);
        }
      }

      const paramValue =
        searchParams.get('tab') ||
        searchParams.get('page') ||
        searchParams.get('p') ||
        searchParams.get('section') ||
        searchParams.get('view') ||
        searchParams.get('path') ||
        searchParams.get('route') ||
        searchParams.get('screen');

      if (paramValue) {
        const val = paramValue.toLowerCase().trim().replace(/^\/+|\/+$/g, '');
        if (val === 'fahim1211' || val === 'admin' || val === 'login' || val === 'portal' || val === 'dashboard' || val === 'cms') {
          return 'admin';
        }
        if (val === 'research' || val === 'publications' || val === 'papers') return 'research';
        if (val === 'awards' || val === 'honors' || val === 'fellowships') return 'awards';
        if (val === 'contact' || val === 'inquiry' || val === 'message') return 'contact';
        if (val === 'notes' || val === 'blog' || val === 'articles') return 'notes';
        if (val === 'home' || val === '') return 'home';
      }
    } catch {
      // Ignore query param parsing errors
    }
  }

  // 2. Check Hash Fragment (#/fahim1211, #fahim1211, #/admin, #admin, etc.)
  if (hash) {
    const cleanHash = hash.replace(/^[#/]+/, '').split('?')[0].toLowerCase().trim();
    if (cleanHash === 'fahim1211' || cleanHash === 'admin' || cleanHash === 'login' || cleanHash === 'portal' || cleanHash === 'dashboard') {
      return 'admin';
    }
    if (cleanHash === 'research' || cleanHash === 'publications' || cleanHash === 'papers') return 'research';
    if (cleanHash === 'awards' || cleanHash === 'honors' || cleanHash === 'fellowships') return 'awards';
    if (cleanHash === 'contact' || cleanHash === 'inquiry' || cleanHash === 'message') return 'contact';
    if (cleanHash === 'notes' || cleanHash === 'blog' || cleanHash === 'articles') return 'notes';
    if (cleanHash === 'home') return 'home';
  }

  // 3. Check Pathname (/fahim1211, /admin, /research, /awards, etc.)
  if (pathname && pathname !== '/') {
    const rawClean = pathname.split('?')[0].split('#')[0].toLowerCase().trim();
    const segments = rawClean.split('/').filter(Boolean);

    // Exact single segment matches
    for (const seg of segments) {
      if (seg === 'fahim1211' || seg === 'admin' || seg === 'login' || seg === 'portal' || seg === 'dashboard' || seg === 'cms') {
        return 'admin';
      }
      if (seg === 'research' || seg === 'publications' || seg === 'papers') return 'research';
      if (seg === 'awards' || seg === 'honors' || seg === 'fellowships') return 'awards';
      if (seg === 'contact' || seg === 'inquiry' || seg === 'message') return 'contact';
      if (seg === 'notes' || seg === 'blog' || seg === 'articles') return 'notes';
    }

    // Substring fallback check (e.g. if embedded in preview proxy URL)
    if (rawClean.includes('fahim1211') || rawClean.endsWith('/admin')) return 'admin';
    if (rawClean.includes('research')) return 'research';
    if (rawClean.includes('awards')) return 'awards';
    if (rawClean.includes('contact')) return 'contact';
    if (rawClean.includes('notes')) return 'notes';
  }

  return 'home';
};

export const pathToTab = (pathname: string): TabType => {
  return resolveCurrentLocationToTab();
};

function PortfolioApp() {
  const [activeTab, setActiveTab] = useState<TabType>(() => resolveCurrentLocationToTab());

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

  // Sync with browser history, popstate, hashchange and URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const resolved = resolveCurrentLocationToTab();
      setActiveTab(resolved);
    };

    // Initial check on mount to ensure synchronization
    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('app-navigate' as any, handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('app-navigate' as any, handleUrlChange);
    };
  }, []);

  // Update Page Title and Meta Tags per section
  useEffect(() => {
    const meta = SEO_CONFIG[activeTab] || SEO_CONFIG.home;
    const baseDomain =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? window.location.origin
        : 'https://rezaulhaider.vercel.app';
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
    <div className="bg-[#F7F6F2] text-[#191c1e] font-body min-h-screen flex flex-col antialiased selection:bg-[#004c4c] selection:text-white">
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
            onOpenEditProfile={handleOpenProfileModal}
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
        onOpenAdminCvUpload={() => setProfileModalState({ isOpen: true, tab: 'cv' })}
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
