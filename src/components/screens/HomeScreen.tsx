import React from 'react';
import { TabType } from '../../types';
import { useData } from '../../context/DataContext';
import { ToolkitLogo } from '../ToolkitLogos';

interface HomeScreenProps {
  setActiveTab: (tab: TabType) => void;
  onOpenCvModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  setActiveTab,
  onOpenCvModal,
}) => {
  const { personalInfo } = useData();

  const getInitials = (name: string) => {
    if (!name) return 'MRH';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    if (parts.length >= 3)
      return (parts[0][0] + parts[1][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto px-6 md:px-12 py-12 md:py-20 space-y-16 md:space-y-24">
      {/* Top Hero Profile Section */}
      <section className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-14 relative">
        {/* Avatar with Neumorphic Circular Ring */}
        <div className="shrink-0 relative group">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-2.5 bg-[#f7f9fc] shadow-[-6px_-6px_14px_#ffffff,6px_6px_14px_#d1d9e6] flex items-center justify-center">
            <div className="w-full h-full rounded-full p-1.5 shadow-[inset_-4px_-4px_8px_#ffffff,inset_4px_4px_8px_#d1d9e6] overflow-hidden flex items-center justify-center bg-[#f7f9fc]">
              {personalInfo.avatarUrl ? (
                <img
                  src={personalInfo.avatarUrl}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#004c4c] to-[#006666] text-white shadow-inner">
                  <span className="font-display font-bold text-4xl md:text-5xl tracking-wider">
                    {getInitials(personalInfo.name)}
                  </span>
                  <span className="text-[11px] text-teal-100 uppercase tracking-widest mt-1">
                    Scholar
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Bio & Info */}
        <div className="flex-grow space-y-6 text-center lg:text-left">
          <div className="space-y-3">
            <h1 className="font-display text-3xl md:text-[42px] font-bold text-[#004c4c] tracking-tight leading-tight">
              {personalInfo.name}
            </h1>
            <p className="font-body text-base md:text-lg text-[#3f4948] font-normal leading-relaxed">
              {personalInfo.title}
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-[#486363]">
              <span className="material-symbols-outlined text-base text-[#004c4c]">
                account_balance
              </span>
              <span>{personalInfo.affiliation}</span>
            </div>
          </div>

          {/* Neumorphic Bio Card */}
          <div className="neumorphic-card p-6 md:p-8 space-y-4 text-left relative">
            <p className="font-body text-sm md:text-base text-[#3f4948] leading-relaxed whitespace-pre-line">
              {personalInfo.bio}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onOpenCvModal}
              className="neumorphic-btn px-6 py-3 rounded-full text-xs font-semibold text-[#004c4c] tracking-wider uppercase flex items-center gap-2 cursor-pointer hover:text-[#006666]"
            >
              <span className="material-symbols-outlined text-base">description</span>
              Show CV
            </button>

            <button
              onClick={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="neumorphic-btn px-6 py-3 rounded-full text-xs font-semibold text-[#004c4c] tracking-wider uppercase flex items-center gap-2 cursor-pointer hover:text-[#006666]"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-6 relative">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl md:text-3xl font-semibold text-[#004c4c] flex items-center gap-3">
            <span className="material-symbols-outlined text-[#004c4c] text-2xl md:text-3xl">
              school
            </span>
            <span>Education</span>
          </h2>
        </div>

        <div className="neumorphic-card p-6 md:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-[#d8dadd]/60 pb-4">
            <div>
              <h3 className="font-display text-lg md:text-xl font-bold text-[#191c1e]">
                {personalInfo.education?.degree}
              </h3>
              <p className="text-sm md:text-base text-[#486363] mt-1">
                {personalInfo.education?.institution}
              </p>
            </div>
            <span className="text-xs md:text-sm font-semibold text-[#486363] neumorphic-inset px-3.5 py-1 rounded-full shrink-0">
              {personalInfo.education?.period}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-[#3f4948] pt-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#004c4c] text-base">
                workspace_premium
              </span>
              <span>
                <strong>Academic Standing:</strong> {personalInfo.education?.gpa}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#004c4c] text-base">
                psychology
              </span>
              <span>
                <strong>Specialization:</strong> {personalInfo.education?.focus}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Grid: Research Interests & Quantitative Toolkit */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Research Interests */}
        <div className="neumorphic-card p-6 md:p-8 space-y-6 flex flex-col justify-between relative">
          <div className="space-y-6">
            <h3 className="font-headline text-xl md:text-2xl font-semibold text-[#004c4c] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#004c4c] text-2xl">
                psychology_alt
              </span>
              <span>Research Interests</span>
            </h3>

            <div className="flex flex-wrap gap-2.5">
              {personalInfo.researchInterests?.map((interest) => (
                <span
                  key={interest}
                  className="neumorphic-inset px-4 py-2 text-xs md:text-sm font-medium text-[#486363] hover:text-[#004c4c] transition-colors cursor-default"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quantitative Toolkit */}
        <div className="neumorphic-card p-6 md:p-8 space-y-6 flex flex-col justify-between relative">
          <div className="space-y-6">
            <h3 className="font-headline text-xl md:text-2xl font-semibold text-[#004c4c] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#004c4c] text-2xl">
                build
              </span>
              <span>Quantitative Toolkit</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {personalInfo.quantitativeToolkit?.map((tool) => (
                <div
                  key={tool.name}
                  className="neumorphic-inset-box p-3.5 flex flex-col items-center justify-center text-center space-y-1 hover:shadow-[-3px_-3px_6px_#ffffff,3px_3px_6px_#d1d9e6] transition-all cursor-default group"
                >
                  <div className="flex items-center gap-2 text-[#004c4c] font-bold text-xs md:text-sm tracking-wide">
                    <ToolkitLogo name={tool.name} className="w-6 h-6 shrink-0" />
                    <span>{tool.name}</span>
                  </div>
                  <span className="text-[11px] text-[#486363] line-clamp-1 group-hover:line-clamp-none">
                    {tool.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-8 pt-6 relative">
        <div className="text-center space-y-3 max-w-2xl mx-auto relative">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#004c4c]">
            Skills
          </h2>
          <p className="font-body text-sm md:text-base text-[#486363]">
            Quantitative economics, empirical research, and evidence-based analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personalInfo.skills?.map((skill) => (
            <div
              key={skill.id}
              className="neumorphic-card p-8 flex flex-col items-center text-center space-y-4 hover:shadow-[inset_-4px_-4px_8px_#FFFFFF,inset_4px_4px_8px_#D1D9E6] transition-all duration-300 relative"
            >
              <div className="neumorphic-inset w-14 h-14 rounded-full flex items-center justify-center text-[#004c4c] shrink-0 mb-2">
                <span className="material-symbols-outlined text-2xl">
                  {skill.icon}
                </span>
              </div>
              <h3 className="font-headline text-lg md:text-xl font-bold text-[#191c1e]">
                {skill.title}
              </h3>
              <p className="font-body text-xs md:text-sm text-[#3f4948] leading-relaxed">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
