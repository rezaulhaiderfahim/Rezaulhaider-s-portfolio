import React, { useState, useMemo } from 'react';
import { Publication, PublicationType } from '../../types';
import { useData } from '../../context/DataContext';

interface ResearchScreenProps {
  onSelectPublication: (pub: Publication) => void;
}

type FilterCategory = 'all' | 'journal_article' | 'conference_paper' | 'book' | 'working_paper';

export const ResearchScreen: React.FC<ResearchScreenProps> = ({
  onSelectPublication,
}) => {
  const { researchTimeline = [], publications = [] } = useData();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to normalize publication type with robust fallback
  const getPubType = (pub: Publication): 'journal_article' | 'conference_paper' | 'book' | 'working_paper' => {
    if (pub.publicationType === 'conference_paper') return 'conference_paper';
    if (pub.publicationType === 'book' || pub.publicationType === 'book_chapter') return 'book';
    if (pub.publicationType === 'working_paper') return 'working_paper';
    if (pub.publicationType === 'journal_article') return 'journal_article';

    // Inferred fallback for legacy or unstamped entries
    const venue = (pub.journalOrVenue || '').toLowerCase();
    if (venue.includes('conference') || venue.includes('proceedings') || venue.includes('symposium') || venue.includes('seminar')) {
      return 'conference_paper';
    }
    if (venue.includes('book') || venue.includes('press') || venue.includes('springer') || venue.includes('routledge') || venue.includes('palgrave') || venue.includes('handbook')) {
      return 'book';
    }
    if (pub.status === 'working_paper') {
      return 'working_paper';
    }
    return 'journal_article';
  };

  const getPubTypeBadge = (pub: Publication) => {
    const type = getPubType(pub);
    switch (type) {
      case 'conference_paper':
        return {
          label: 'Conference Paper',
          icon: 'co_present',
          color: 'bg-indigo-100/90 text-indigo-900 border-indigo-200',
        };
      case 'book':
        return {
          label: pub.publicationType === 'book_chapter' ? 'Book Chapter' : 'Book / Monograph',
          icon: 'auto_stories',
          color: 'bg-amber-100/90 text-amber-900 border-amber-200',
        };
      case 'working_paper':
        return {
          label: 'Working Paper',
          icon: 'hourglass_empty',
          color: 'bg-slate-100 text-slate-800 border-slate-300',
        };
      case 'journal_article':
      default:
        return {
          label: 'Journal Article',
          icon: 'menu_book',
          color: 'bg-teal-100/90 text-[#004c4c] border-teal-200',
        };
    }
  };

  // Filtered publications based on search query
  const filteredPubs = useMemo(() => {
    let list = publications || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.authors?.toLowerCase().includes(q) ||
          p.journalOrVenue?.toLowerCase().includes(q) ||
          p.abstract?.toLowerCase().includes(q) ||
          p.methodology?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [publications, searchQuery]);

  // Split into categorical subsets
  const journalArticles = useMemo(
    () => filteredPubs.filter((p) => getPubType(p) === 'journal_article'),
    [filteredPubs]
  );
  const conferencePapers = useMemo(
    () => filteredPubs.filter((p) => getPubType(p) === 'conference_paper'),
    [filteredPubs]
  );
  const booksAndChapters = useMemo(
    () => filteredPubs.filter((p) => getPubType(p) === 'book'),
    [filteredPubs]
  );
  const workingPapers = useMemo(
    () => filteredPubs.filter((p) => getPubType(p) === 'working_paper'),
    [filteredPubs]
  );

  // Total counts
  const counts = {
    all: (publications || []).length,
    journal_article: (publications || []).filter((p) => getPubType(p) === 'journal_article').length,
    conference_paper: (publications || []).filter((p) => getPubType(p) === 'conference_paper').length,
    book: (publications || []).filter((p) => getPubType(p) === 'book').length,
    working_paper: (publications || []).filter((p) => getPubType(p) === 'working_paper').length,
  };

  const renderPublicationCard = (pub: Publication) => {
    const badge = getPubTypeBadge(pub);
    const isPublished = pub.status === 'published';
    const isUnderReview = pub.status === 'under_review';

    return (
      <div
        key={pub.id}
        onClick={() => onSelectPublication(pub)}
        className="neumorphic-card p-6 md:p-7 space-y-4 cursor-pointer hover:shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.9),inset_4px_4px_8px_#dedbd2] transition-all duration-300 group relative border border-[#e5e2db]/60 hover:border-teal-600/30"
      >
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Tag */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.color}`}
            >
              <span className="material-symbols-outlined text-xs">{badge.icon}</span>
              <span>{badge.label}</span>
            </span>

            {/* Status Tag */}
            <span
              className={`px-2.5 py-0.5 rounded-full font-label-caps text-[10px] font-bold tracking-wider uppercase ${
                isPublished
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : isUnderReview
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              {isPublished ? 'Published' : isUnderReview ? 'Under Review' : 'Working Paper'}
            </span>

            {/* PDF Badge */}
            {pub.pdfUrl && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white shadow-xs">
                <span className="material-symbols-outlined text-xs">picture_as_pdf</span>
                <span>PDF Available</span>
              </span>
            )}
          </div>

          <span className="font-label-caps text-xs font-bold text-[#486363] bg-[#eeece5] px-2.5 py-0.5 rounded-md">
            {pub.year}
          </span>
        </div>

        {/* Paper Title & Authors */}
        <div className="space-y-1.5">
          <h4 className="font-display text-base md:text-lg font-bold text-[#191c1e] group-hover:text-[#004c4c] transition-colors leading-snug">
            {pub.title}
          </h4>
          <p className="font-body text-xs md:text-sm text-[#486363] leading-relaxed">
            <span className="font-medium text-[#191c1e]">{pub.authors}</span>
            {pub.journalOrVenue && (
              <span className="text-[#004c4c] font-semibold"> · {pub.journalOrVenue}</span>
            )}
          </p>
        </div>

        {/* Abstract Snippet */}
        {pub.abstract && (
          <p className="font-body text-xs text-[#3f4948] line-clamp-2 leading-relaxed bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e2db]/50">
            {pub.abstract}
          </p>
        )}

        {/* Methodology / Dataset tags */}
        {(pub.methodology || (pub.tags && pub.tags.length > 0)) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {pub.methodology && (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-teal-50 text-teal-900 border border-teal-100 flex items-center gap-1">
                <span className="material-symbols-outlined text-[11px] text-teal-700">analytics</span>
                <span>{pub.methodology.split(',')[0]}</span>
              </span>
            )}
            {pub.tags?.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#eeece5] text-[#486363]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action button footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#e5e2db]/70">
          <span className="text-xs font-bold text-[#004c4c] group-hover:text-[#006666] flex items-center gap-1.5 tracking-wide">
            <span>View Abstract & Details</span>
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </span>

          {pub.doi && (
            <span className="text-[11px] font-mono text-[#486363] truncate max-w-[140px]">
              DOI: {pub.doi}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto px-6 md:px-12 py-12 md:py-20 space-y-16 md:space-y-24">
      {/* Header Section */}
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-[42px] font-bold text-[#004c4c] tracking-tight leading-tight">
          Research & Scholarship
        </h1>
        <p className="font-body text-base md:text-lg text-[#486363] leading-relaxed">
          A methodical exploration into applied microeconometrics, focusing on green economy initiatives, labor markets, and visual cognition modeling.
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
                  {/* Left Column */}
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

                  {/* Right Column */}
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

      {/* Section 2: Publications & Working Papers */}
      <section className="space-y-8 pt-8">
        <div className="text-center space-y-3">
          <h2 className="font-headline text-2xl md:text-3xl font-semibold text-[#004c4c]">
            Publications & Working Papers
          </h2>
          <p className="text-xs md:text-sm text-[#486363] max-w-2xl mx-auto">
            Explore published articles, peer-reviewed conference proceedings, scholarly books, and ongoing working papers.
          </p>
        </div>

        {/* Interactive Filter Bar & Search */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-[#FAF9F6] rounded-2xl border border-[#e5e2db]">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-[#004c4c] text-white shadow-sm'
                    : 'text-[#486363] hover:text-[#191c1e] hover:bg-[#eeece5]'
                }`}
              >
                <span>All Works</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-[#e5e2db] text-[#486363]'
                  }`}
                >
                  {counts.all}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('journal_article')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeCategory === 'journal_article'
                    ? 'bg-[#004c4c] text-white shadow-sm'
                    : 'text-[#486363] hover:text-[#191c1e] hover:bg-[#eeece5]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">menu_book</span>
                <span>Journal Articles</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeCategory === 'journal_article' ? 'bg-white/20 text-white' : 'bg-[#e5e2db] text-[#486363]'
                  }`}
                >
                  {counts.journal_article}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('conference_paper')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeCategory === 'conference_paper'
                    ? 'bg-[#004c4c] text-white shadow-sm'
                    : 'text-[#486363] hover:text-[#191c1e] hover:bg-[#eeece5]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">co_present</span>
                <span>Conference Papers</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeCategory === 'conference_paper' ? 'bg-white/20 text-white' : 'bg-[#e5e2db] text-[#486363]'
                  }`}
                >
                  {counts.conference_paper}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('book')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeCategory === 'book'
                    ? 'bg-[#004c4c] text-white shadow-sm'
                    : 'text-[#486363] hover:text-[#191c1e] hover:bg-[#eeece5]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">auto_stories</span>
                <span>Books & Chapters</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeCategory === 'book' ? 'bg-white/20 text-white' : 'bg-[#e5e2db] text-[#486363]'
                  }`}
                >
                  {counts.book}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('working_paper')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeCategory === 'working_paper'
                    ? 'bg-[#004c4c] text-white shadow-sm'
                    : 'text-[#486363] hover:text-[#191c1e] hover:bg-[#eeece5]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                <span>Working Papers</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeCategory === 'working_paper' ? 'bg-white/20 text-white' : 'bg-[#e5e2db] text-[#486363]'
                  }`}
                >
                  {counts.working_paper}
                </span>
              </button>
            </div>

            {/* Keyword search input */}
            <div className="relative shrink-0 px-2 md:w-64">
              <span className="material-symbols-outlined absolute left-4.5 top-1/2 -translate-y-1/2 text-[#486363] text-base">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search publications..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs neumorphic-input bg-white text-[#191c1e]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#486363] hover:text-[#191c1e]"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Publications Render View */}
        <div className="space-y-12">
          {/* SECTION A: JOURNAL ARTICLES */}
          {(activeCategory === 'all' || activeCategory === 'journal_article') && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-[#e5e2db] pb-3">
                <span className="p-2 rounded-xl bg-teal-50 text-[#004c4c] flex items-center justify-center border border-teal-200/80">
                  <span className="material-symbols-outlined text-xl">menu_book</span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline text-lg md:text-xl font-bold text-[#004c4c]">
                      Journal Articles
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-[#004c4c]">
                      {journalArticles.length}
                    </span>
                  </div>
                  <p className="text-xs text-[#486363]">
                    Peer-reviewed scholarly papers published or accepted in academic journals.
                  </p>
                </div>
              </div>

              {journalArticles.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF9F6] rounded-2xl border border-dashed border-[#e5e2db] text-[#486363] text-xs">
                  No journal articles found matching the current criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {journalArticles.map(renderPublicationCard)}
                </div>
              )}
            </div>
          )}

          {/* SECTION B: CONFERENCE PAPERS */}
          {(activeCategory === 'all' || activeCategory === 'conference_paper') && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-[#e5e2db] pb-3">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center border border-indigo-200">
                  <span className="material-symbols-outlined text-xl">co_present</span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline text-lg md:text-xl font-bold text-indigo-950">
                      Conference Papers & Proceedings
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900">
                      {conferencePapers.length}
                    </span>
                  </div>
                  <p className="text-xs text-[#486363]">
                    Refereed international conference papers, presentations, and proceedings.
                  </p>
                </div>
              </div>

              {conferencePapers.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF9F6] rounded-2xl border border-dashed border-[#e5e2db] text-[#486363] text-xs">
                  No conference papers registered yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {conferencePapers.map(renderPublicationCard)}
                </div>
              )}
            </div>
          )}

          {/* SECTION C: BOOKS & CHAPTERS */}
          {(activeCategory === 'all' || activeCategory === 'book') && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-[#e5e2db] pb-3">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
                  <span className="material-symbols-outlined text-xl">auto_stories</span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline text-lg md:text-xl font-bold text-amber-950">
                      Books & Book Chapters
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                      {booksAndChapters.length}
                    </span>
                  </div>
                  <p className="text-xs text-[#486363]">
                    Scholarly books, academic monographs, and contributed chapters in edited volumes.
                  </p>
                </div>
              </div>

              {booksAndChapters.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF9F6] rounded-2xl border border-dashed border-[#e5e2db] text-[#486363] text-xs">
                  No books or book chapters registered yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {booksAndChapters.map(renderPublicationCard)}
                </div>
              )}
            </div>
          )}

          {/* SECTION D: WORKING PAPERS & PREPRINTS */}
          {(activeCategory === 'all' || activeCategory === 'working_paper') && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-[#e5e2db] pb-3">
                <span className="p-2 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-300">
                  <span className="material-symbols-outlined text-xl">hourglass_empty</span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline text-lg md:text-xl font-bold text-slate-900">
                      Working Papers & Preprints
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                      {workingPapers.length}
                    </span>
                  </div>
                  <p className="text-xs text-[#486363]">
                    Manuscripts under review, discussion drafts, and work-in-progress research.
                  </p>
                </div>
              </div>

              {workingPapers.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF9F6] rounded-2xl border border-dashed border-[#e5e2db] text-[#486363] text-xs">
                  No working papers currently listed.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workingPapers.map(renderPublicationCard)}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
