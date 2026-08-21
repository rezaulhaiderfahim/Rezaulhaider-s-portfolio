import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

interface ContactScreenProps {
  onOpenComposeModal: () => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ onOpenComposeModal }) => {
  const { personalInfo } = useData();
  const [copied, setCopied] = useState(false);
  const [activeProfile, setActiveProfile] = useState<string | null>(null);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col justify-center items-center space-y-12 md:space-y-16">
      {/* Header Section */}
      <div className="text-center max-w-2xl w-full space-y-4">
        <h1 className="font-display text-3xl md:text-[42px] font-bold text-[#004c4c] tracking-tight leading-tight">
          Let's Connect
        </h1>
        <p className="font-body text-base md:text-lg text-[#3f4948] leading-relaxed">
          I welcome conversations regarding ongoing economic research, potential academic collaborations, and professional inquiries. Please feel free to reach out via email or connect through the academic networks below.
        </p>
      </div>

      {/* Central Neumorphic Contact Card */}
      <div className="w-full max-w-3xl bg-[#f7f9fc] rounded-2xl shadow-[-6px_-6px_14px_#FFFFFF,6px_6px_14px_#D1D9E6] p-8 md:p-14 relative overflow-hidden">
        {/* Subtle atmospheric blob (pure CSS) */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#004c4c]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Primary Action: Email */}
        <div className="flex flex-col items-center text-center mb-12 relative z-10 space-y-6">
          <span className="font-label-caps text-xs text-[#486363] uppercase tracking-widest block w-full shadow-[inset_-4px_-4px_8px_#FFFFFF,inset_4px_4px_8px_#D1D9E6] bg-[#f7f9fc] py-2 rounded-full max-w-xs mx-auto font-semibold">
            Direct Inquiry
          </span>

          <div className="space-y-2">
            <a
              href={`mailto:${personalInfo.email}`}
              className="font-headline text-xl sm:text-2xl md:text-3xl font-bold text-[#004c4c] hover:text-[#006666] transition-colors duration-300 break-all block"
            >
              {personalInfo.email}
            </a>

            {/* Quick copy indicator */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleCopyEmail}
                className="text-xs text-[#486363] hover:text-[#004c4c] flex items-center gap-1 font-medium transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-slate-100/60"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Email copied to clipboard!' : 'Click to copy email address'}</span>
              </button>
            </div>
          </div>

          <button
            onClick={onOpenComposeModal}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#f7f9fc] rounded-full shadow-[-6px_-6px_12px_#FFFFFF,6px_6px_12px_#D1D9E6] hover:shadow-[inset_-4px_-4px_8px_#FFFFFF,inset_4px_4px_8px_#D1D9E6] transition-all duration-300 text-[#004c4c] font-body text-sm md:text-base font-semibold cursor-pointer active:scale-[0.98]"
          >
            <span
              className="material-symbols-outlined transition-transform group-hover:scale-110 text-[#004c4c]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              send
            </span>
            Compose Message
          </button>
        </div>

        {/* Neumorphic Divider */}
        <div className="w-full h-px bg-[#d8dadd]/50 shadow-[inset_0px_1px_2px_#D1D9E6,inset_0px_-1px_2px_#FFFFFF] my-10"></div>

        {/* Secondary Actions: Academic / Social Profiles */}
        <div className="text-center relative z-10 space-y-8">
          <span className="font-body text-sm md:text-base text-[#3f4948] block font-medium">
            Academic & Professional Profiles
          </span>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {personalInfo.socialLinks?.map((profile) => (
              <a
                key={profile.name}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActiveProfile(profile.name)}
                onMouseLeave={() => setActiveProfile(null)}
                aria-label={`${profile.name} Profile`}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#f7f9fc] flex items-center justify-center text-[#004c4c] shadow-[-6px_-6px_12px_#FFFFFF,6px_6px_12px_#D1D9E6] group-hover:shadow-[inset_-4px_-4px_8px_#FFFFFF,inset_4px_4px_8px_#D1D9E6] transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl md:text-3xl">
                    {profile.icon}
                  </span>
                </div>
                <span className="font-label-caps text-xs text-[#486363] group-hover:text-[#004c4c] transition-colors font-semibold">
                  {profile.name}
                </span>
              </a>
            ))}
          </div>

          {/* Helper tooltip preview */}
          {activeProfile && (
            <div className="text-xs text-[#004c4c] font-medium pt-2 transition-opacity animate-in fade-in">
              Opening {activeProfile} profile for {personalInfo.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
