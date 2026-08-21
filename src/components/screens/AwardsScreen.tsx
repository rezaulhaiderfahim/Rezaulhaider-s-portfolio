import React, { useState } from 'react';
import { AwardItem } from '../../types';
import { useData } from '../../context/DataContext';

export const AwardsScreen: React.FC = () => {
  const { awards = [] } = useData();
  const [selectedAward, setSelectedAward] = useState<AwardItem | null>(null);

  const conferences = (awards || []).filter((a) => a.category === 'conference');
  const scholarships = (awards || []).filter((a) => a.category === 'award');
  const courses = (awards || []).filter((a) => a.category === 'course');

  return (
    <div className="w-full max-w-[1140px] mx-auto px-6 md:px-12 py-12 md:py-20 space-y-16 md:space-y-24">
      {/* Header Section */}
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-[42px] font-bold text-[#004c4c] tracking-tight leading-tight">
          Awards & Involvement
        </h1>
        <p className="font-body text-base md:text-lg text-[#3f4948] leading-relaxed">
          A record of academic recognition, conference participation, and community leadership shaping a well-rounded perspective.
        </p>
      </header>

      {/* Section 1: Conferences & Seminars */}
      <section className="space-y-8">
        <h2 className="font-headline text-2xl md:text-3xl font-semibold text-[#004c4c] flex items-center space-x-4">
          <span className="material-symbols-outlined text-[#486363] text-2xl md:text-3xl">
            forum
          </span>
          <span>Conferences & Seminars</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {conferences.map((conf) => (
            <div
              key={conf.id}
              onClick={() => setSelectedAward(conf)}
              className="neumorphic-card p-6 md:p-8 flex flex-col h-full space-y-4 hover:shadow-[inset_-4px_-4px_8px_#FFFFFF,inset_4px_4px_8px_#D1D9E6] transition-all duration-300 cursor-pointer group relative"
            >
              <div className="neumorphic-inset w-12 h-12 flex items-center justify-center text-[#004c4c] mb-2 shrink-0">
                <span className="material-symbols-outlined">{conf.icon || 'forum'}</span>
              </div>
              <h3 className="font-headline text-lg md:text-xl font-semibold text-[#191c1e] group-hover:text-[#004c4c] transition-colors leading-snug">
                {conf.title}
              </h3>
              <p className="font-body text-xs md:text-sm text-[#3f4948] flex-grow leading-relaxed">
                {conf.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-4">
                <span className="neumorphic-inset px-3 py-1 font-label-caps text-xs font-semibold text-[#486363]">
                  {conf.tag}
                </span>
                {conf.secondaryTag && (
                  <span className="neumorphic-inset px-3 py-1 font-label-caps text-xs font-semibold text-[#486363]">
                    {conf.secondaryTag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Awards & Scholarships */}
      <section className="space-y-8">
        <h2 className="font-headline text-2xl md:text-3xl font-semibold text-[#004c4c] flex items-center space-x-4">
          <span className="material-symbols-outlined text-[#486363] text-2xl md:text-3xl">
            school
          </span>
          <span>Awards & Scholarships</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {scholarships.map((award) => (
            <div
              key={award.id}
              onClick={() => setSelectedAward(award)}
              className="neumorphic-card p-6 md:p-8 flex items-start space-x-5 md:space-x-6 hover:shadow-[inset_-4px_-4px_8px_#FFFFFF,inset_4px_4px_8px_#D1D9E6] transition-all duration-300 cursor-pointer group relative"
            >
              <div className="neumorphic-inset min-w-[56px] md:min-w-[64px] h-14 md:h-16 flex items-center justify-center text-[#004c4c] rounded-xl shrink-0">
                <span className="material-symbols-outlined text-2xl md:text-3xl">
                  {award.icon || 'military_tech'}
                </span>
              </div>
              <div className="space-y-1.5 flex-grow">
                <h3 className="font-headline text-lg md:text-xl font-semibold text-[#191c1e] group-hover:text-[#004c4c] transition-colors leading-snug">
                  {award.title}
                </h3>
                <p className="font-body text-xs md:text-sm text-[#3f4948] leading-relaxed">
                  {award.description}
                </p>
                <div className="pt-2">
                  <span className="neumorphic-inset px-3 py-1 font-label-caps text-xs font-semibold text-[#486363] inline-block">
                    {award.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Course & Certification */}
      <section className="space-y-8">
        <h2 className="font-headline text-2xl md:text-3xl font-semibold text-[#004c4c] flex items-center space-x-4">
          <span className="material-symbols-outlined text-[#486363] text-2xl md:text-3xl">
            workspace_premium
          </span>
          <span>Course & Certification</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedAward(course)}
              className="neumorphic-card p-6 md:p-8 flex items-start space-x-5 md:space-x-6 hover:shadow-[inset_-4px_-4px_8px_#FFFFFF,inset_4px_4px_8px_#D1D9E6] transition-all duration-300 cursor-pointer group relative"
            >
              <div className="neumorphic-inset min-w-[56px] md:min-w-[64px] h-14 md:h-16 flex items-center justify-center text-[#004c4c] rounded-xl shrink-0">
                <span className="material-symbols-outlined text-2xl md:text-3xl">
                  {course.icon || 'history_edu'}
                </span>
              </div>
              <div className="space-y-1.5 flex-grow">
                <h3 className="font-headline text-lg md:text-xl font-semibold text-[#191c1e] group-hover:text-[#004c4c] transition-colors leading-snug">
                  {course.title}
                </h3>
                <p className="font-body text-xs md:text-sm text-[#3f4948] leading-relaxed">
                  {course.description}
                </p>
                <div className="pt-2">
                  <span className="neumorphic-inset px-3 py-1 font-label-caps text-xs font-semibold text-[#486363] inline-block">
                    {course.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Detail Modal for Awards/Conferences */}
      {selectedAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#f7f9fc] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/80 p-6 md:p-8 space-y-5">
            <div className="flex justify-between items-start">
              <div className="neumorphic-inset w-12 h-12 rounded-xl flex items-center justify-center text-[#004c4c]">
                <span className="material-symbols-outlined text-2xl">{selectedAward.icon}</span>
              </div>
              <button
                onClick={() => setSelectedAward(null)}
                className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <span className="neumorphic-inset px-3 py-1 font-label-caps text-xs font-semibold text-[#004c4c]">
                {selectedAward.tag} {selectedAward.year ? `· ${selectedAward.year}` : ''}
              </span>
              <h3 className="font-display text-xl font-bold text-[#004c4c]">
                {selectedAward.title}
              </h3>
              {selectedAward.organization && (
                <p className="text-xs font-semibold text-[#486363]">
                  Host / Organization: {selectedAward.organization}
                </p>
              )}
            </div>

            <p className="text-sm text-[#3f4948] leading-relaxed bg-[#eceef1]/40 p-4 rounded-xl">
              {selectedAward.description}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAward(null)}
                className="px-5 py-2 rounded-full neumorphic-btn text-xs font-semibold text-[#004c4c] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
