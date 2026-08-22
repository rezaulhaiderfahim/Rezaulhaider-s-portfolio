import React from 'react';
import { Publication } from '../../types';
import { useData } from '../../context/DataContext';

interface ResearchScreenProps {
  onSelectPublication: (pub: Publication) => void;
}

export const ResearchScreen: React.FC<ResearchScreenProps> = ({
  onSelectPublication,
}) => {
  const { researchTimeline = [], publications = [] } = useData();

  const underReviewPubs = (publications || []).filter((p) => p.status === 'under_review');
  const publishedPubs = (publications || []).filter((p) => p.status === 'published');
  const workingPapers = (publications || []).filter((p) => p.status === 'working_paper');

  return (
    <div className="w-full max-w-[1140px] mx-auto px-6 md:px-12 py-12 md:py-20 space-y-16 md:space-y-24">
      {/* Header Section */}
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-[42px] font-bold text-[#004c4c] tracking-tight leading-tight">
          Research & Scholarship
        </h1>
        <p className="font-body text-base md:text-lg text-[#486363] leading-relaxed">
          A methodical exploration into applied microeconometrics, focusing on green economy initiatives and visual cognition modeling.
        </p>
      </header>

      {/* Section 1: Research Experience */}
      <section className="space-y-12">
        <div className="flex items-center justify-center relative">
          <h2 className="font-headline text-2xl md:text-3xl font-semibold text-[#004c4c] text-center">
            Research Experience
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Vertical Line */}
          <div className="absolute left-[39px] md:left-1/2 top-4 bottom-4 w-0.5 bg-[#e5e2db] -translate-x-1/2 rounded-full hidden md:block"></div>

          <div className="space-y-12 md:space-y-16 relative">
            {researchTimeline.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 w-full"
                >
                  {/* Left Column (date on even, card on odd for desktop) */}
                  <div
                    className={`w-full md:w-[45%] ${
                      isEven ? 'text-left md:text-right hidden md:block order-2 md:order-1' : 'order-3 md:order-1'
                    }`}
                  >
                    {isEven ? (
                      <span className="font-label-caps text-xs text-[#486363] uppercase tracking-widest font-semibold">
                        {item.period}
                      </span>
                    ) : (
                      <div className="neumorphic-card p-6 md:p-8 space-y-2 text-left md:text-right relative">
                        <span className="font-label-caps text-xs text-[#486363] uppercase tracking-widest block md:hidden font-semibold">
                          {item.period}
                        </span>
                        <h3 className="font-headline text-lg md:text-xl font-bold text-[#191c1e] leading-snug">
                          {item.title}
                        </h3>
                        <p className="font-body text-xs md:text-sm text-[#486363]">
                          {item.supervisorOrRole}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Node Icon */}
                  <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center neumorphic-card rounded-full mx-auto md:mx-0 order-1 md:order-2">
                    <span className="material-symbols-outlined text-[#004c4c] text-2xl md:text-3xl">
                      {item.icon || 'biotech'}
                    </span>
                  </div>

                  {/* Right Column (card on even, date on odd for desktop) */}
                  <div
                    className={`w-full md:w-[45%] ${
                      isEven ? 'order-3 md:order-3' : 'text-left hidden md:block order-2 md:order-3'
                    }`}
                  >
                    {isEven ? (
                      <div className="neumorphic-card p-6 md:p-8 space-y-2 relative">
                        <span className="font-label-caps text-xs text-[#486363] uppercase tracking-widest block md:hidden font-semibold">
                          {item.period}
                        </span>
                        <h3 className="font-headline text-lg md:text-xl font-bold text-[#191c1e] leading-snug">
                          {item.title}
                        </h3>
                        <p className="font-body text-xs md:text-sm text-[#486363]">
                          {item.supervisorOrRole}
                        </p>
                      </div>
                    ) : (
                      <span className="font-label-caps text-xs text-[#486363] uppercase tracking-widest font-semibold">
                        {item.period}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Publications */}
      <section className="space-y-10 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl md:text-3xl font-semibold text-[#004c4c] text-center w-full relative">
            Publications & Working Papers
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Under Review / Working Paper Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-[#004c4c] text-2xl">
                hourglass_empty
              </span>
              <h3 className="font-headline text-xl font-bold text-[#191c1e]">
                Under Review & Working Papers
              </h3>
            </div>

            <div className="space-y-5">
              {[...underReviewPubs, ...workingPapers].map((pub) => (
                <div
                  key={pub.id}
                  onClick={() => onSelectPublication(pub)}
                  className="neumorphic-card p-6 md:p-7 space-y-3 cursor-pointer hover:shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.9),inset_4px_4px_8px_#dedbd2] transition-all duration-300 group relative"
                >
                  <div className="flex justify-between items-start pr-4">
                    <div className="flex items-center gap-2">
                      <span className="neumorphic-inset px-3 py-1 font-label-caps text-xs font-semibold text-[#006666]">
                        {pub.status === 'under_review' ? 'Under Review' : 'Working Paper'}
                      </span>
                      {pub.pdfUrl && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100/80 text-[#004c4c] flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">picture_as_pdf</span>
                          PDF
                        </span>
                      )}
                    </div>
                    <span className="font-label-caps text-xs font-semibold text-[#486363]">
                      {pub.year}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display text-base md:text-lg font-bold text-[#191c1e] group-hover:text-[#004c4c] transition-colors">
                      {pub.title}
                    </h4>
                    <p className="font-body text-xs md:text-sm text-[#486363] mt-1.5 leading-relaxed">
                      {pub.authors} {pub.journalOrVenue ? `· ${pub.journalOrVenue}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] font-semibold text-[#004c4c] group-hover:underline flex items-center gap-1">
                      View Abstract & Econometrics
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Published Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-[#004c4c] text-2xl">
                menu_book
              </span>
              <h3 className="font-headline text-xl font-bold text-[#191c1e]">
                Published
              </h3>
            </div>

            <div className="space-y-5">
              {publishedPubs.map((pub) => (
                <div
                  key={pub.id}
                  className="neumorphic-card p-6 md:p-7 space-y-4 transition-all duration-300 relative"
                >
                  <div className="flex justify-between items-start pr-4">
                    <div className="flex items-center gap-2">
                      <span className="neumorphic-inset px-3 py-1 font-label-caps text-xs font-semibold text-[#004c4c]">
                        Published
                      </span>
                      {pub.pdfUrl && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100/80 text-[#004c4c] flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">picture_as_pdf</span>
                          PDF
                        </span>
                      )}
                    </div>
                    <span className="font-label-caps text-xs font-semibold text-[#486363]">
                      {pub.year}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display text-base md:text-lg font-bold text-[#191c1e]">
                      {pub.title}
                    </h4>
                    <p className="font-body text-xs md:text-sm text-[#486363] mt-1.5 leading-relaxed">
                      {pub.authors} {pub.journalOrVenue ? `· ${pub.journalOrVenue}` : ''}
                    </p>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => onSelectPublication(pub)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#004c4c] hover:text-[#006666] tracking-wider uppercase cursor-pointer"
                    >
                      <span>Read Publication</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
