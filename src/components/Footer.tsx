import React from 'react';
import { TabType } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { personalInfo } = useData();
  const { isAdmin } = useAuth();

  const navItems: { id: TabType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'research', label: 'Research' },
    { id: 'awards', label: 'Awards' },
    { id: 'contact', label: 'Contact' },
    { id: 'notes', label: 'Notes' },
  ];

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full mt-24 md:mt-32 bg-[#f7f9fc] border-t border-[#d8dadd]/30 py-16 md:py-20">
      <div className="flex flex-col items-center justify-center max-w-[1140px] mx-auto px-6 md:px-12 text-center">
        {/* Name */}
        <button
          onClick={() => handleTabClick('home')}
          className="font-display text-xl md:text-2xl font-bold text-[#004c4c] mb-6 hover:text-[#006666] transition-colors cursor-pointer"
        >
          {personalInfo.shortName || 'M. R. Haider'}
        </button>

        {/* Footer Nav */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-8 font-body text-base">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`transition-colors cursor-pointer ${
                activeTab === item.id
                  ? 'text-[#004c4c] font-semibold'
                  : 'text-[#486363] hover:text-[#004c4c]'
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => handleTabClick('admin')}
              className={`transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                activeTab === 'admin'
                  ? 'bg-[#004c4c] text-white'
                  : 'bg-teal-50 text-[#004c4c] border border-teal-200 hover:bg-teal-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              <span>Admin Panel</span>
            </button>
          )}
        </div>

        {/* Copyright & Discreet Admin Access */}
        <div className="space-y-2 flex flex-col items-center">
          <p className="font-body text-sm md:text-base text-[#486363] opacity-75">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
          <button
            onClick={() => handleTabClick('admin')}
            title="Administrator access"
            className="text-[11px] text-[#486363]/40 hover:text-[#004c4c] transition-colors flex items-center gap-1 cursor-pointer pt-1"
          >
            <span className="material-symbols-outlined text-[13px]">lock</span>
            <span>Admin</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
