import React, { useState } from 'react';
import { TabType } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { personalInfo } = useData();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: TabType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'research', label: 'Research' },
    { id: 'awards', label: 'Awards' },
    { id: 'contact', label: 'Contact' },
    { id: 'notes', label: 'Notes' },
  ];

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="w-full sticky top-0 z-40 bg-[#f7f9fc] shadow-[-6px_-6px_12px_#FFFFFF,6px_6px_12px_#D1D9E6] transition-all duration-300">
      <div className="flex justify-between items-center max-w-[1140px] mx-auto px-6 md:px-12 py-4 md:py-5">
        {/* Brand Name */}
        <button
          onClick={() => handleTabClick('home')}
          className="font-display text-2xl md:text-[26px] font-bold text-[#004c4c] tracking-tight hover:text-[#006666] transition-colors text-left cursor-pointer"
        >
          {personalInfo.shortName || 'M. R. Haider'}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 font-body text-base">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#004c4c] font-bold after:content-[""] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-[#004c4c] after:rounded-full neumorphic-inset'
                    : 'text-[#486363] hover:text-[#004c4c] hover:shadow-[inset_-3px_-3px_6px_#FFFFFF,inset_3px_3px_6px_#D1D9E6]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => handleTabClick('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#004c4c] text-white shadow-md'
                  : 'bg-teal-50 text-[#004c4c] border border-teal-300 hover:bg-teal-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              <span>Admin</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          {isAdmin && (
            <button
              onClick={() => handleTabClick('admin')}
              aria-label="Admin panel"
              className="text-[#004c4c] bg-teal-50 p-2 rounded-full border border-teal-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="text-[#004c4c] neumorphic-btn p-2.5 rounded-full flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f7f9fc] border-t border-[#d8dadd]/50 px-6 py-4 space-y-2 shadow-[inset_0_4px_6px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between font-medium transition-all ${
                  isActive
                    ? 'text-[#004c4c] font-bold neumorphic-inset'
                    : 'text-[#486363] hover:text-[#004c4c] hover:bg-slate-100/50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#004c4c]"></span>
                )}
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => handleTabClick('admin')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-[#004c4c] text-white'
                  : 'bg-teal-50 text-[#004c4c] border border-teal-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                <span>Admin Panel (/fahim1211)</span>
              </div>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
