import React, { useState, useMemo } from 'react';
import { NotePost } from '../../types';
import { useData } from '../../context/DataContext';
import { NoteArticleView } from './NoteArticleView';

interface NotesScreenProps {
  initialSelectedSlug?: string | null;
  onSelectSlug?: (slug: string | null) => void;
}

export const NotesScreen: React.FC<NotesScreenProps> = ({
  initialSelectedSlug,
  onSelectSlug,
}) => {
  const { notes = [] } = useData();
  const [selectedNote, setSelectedNote] = useState<NotePost | null>(() => {
    if (initialSelectedSlug) {
      return notes.find((n) => n.slug === initialSelectedSlug) || null;
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Pre-defined categories + any extra distinct category found in notes
  const categories = useMemo(() => {
    const defaultList = ['All', 'Thoughts', 'Research', 'Economics', 'Study Abroad', 'Learning', 'Life'];
    const dynamicSet = new Set(defaultList);
    notes.forEach((n) => {
      if (n.category && n.category.trim()) {
        dynamicSet.add(n.category.trim());
      }
    });
    return Array.from(dynamicSet);
  }, [notes]);

  // Filter notes based on search & category
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Category check
      if (selectedCategory !== 'All' && note.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Search query check (title, excerpt, tags, content)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = note.title?.toLowerCase().includes(q);
        const inExcerpt = note.excerpt?.toLowerCase().includes(q);
        const inTags = (note.tags || []).some((t) => t.toLowerCase().includes(q));
        const inContent = note.content?.toLowerCase().includes(q);
        return inTitle || inExcerpt || inTags || inContent;
      }

      return true;
    });
  }, [notes, selectedCategory, searchQuery]);

  const handleOpenNote = (note: NotePost) => {
    setSelectedNote(note);
    if (onSelectSlug) onSelectSlug(note.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToArchive = () => {
    setSelectedNote(null);
    if (onSelectSlug) onSelectSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If a note is currently opened, render the dedicated article view
  if (selectedNote) {
    return (
      <NoteArticleView
        note={selectedNote}
        onBack={handleBackToArchive}
        onNavigateNote={handleOpenNote}
        allNotes={notes}
      />
    );
  }

  return (
    <div className="w-full max-w-[920px] mx-auto px-6 md:px-12 py-12 md:py-20 space-y-12">
      {/* Header */}
      <header className="space-y-4 text-left border-b border-[#e5e2db] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neumorphic-inset text-[11px] font-semibold text-[#004c4c]">
          <span className="material-symbols-outlined text-sm">edit_note</span>
          <span>Writing Archive</span>
        </div>

        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-[#004c4c] tracking-tight">
          Notes
        </h1>

        <p className="font-body text-base md:text-lg text-[#3f4948] max-w-2xl leading-relaxed">
          Things I write down — ideas, observations, lessons, and questions worth remembering.
        </p>
      </header>

      {/* Search & Category Filter Bar */}
      <div className="space-y-5">
        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#486363] text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl neumorphic-inset bg-[#FAF9F6] text-[#191c1e] placeholder-[#486363]/60 text-sm md:text-base border border-[#e5e2db] focus:outline-none focus:ring-2 focus:ring-[#004c4c]/20 transition-all font-body"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#486363] hover:text-[#191c1e] cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Category Pills (Subtle, horizontally scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs md:text-sm">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#004c4c] text-white shadow-sm font-semibold'
                    : 'bg-[#eeece5] text-[#486363] hover:text-[#004c4c] hover:bg-[#e4e1d8]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chronological List of Posts */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="neumorphic-card p-10 md:p-14 text-center space-y-3 rounded-2xl">
            <span className="material-symbols-outlined text-3xl md:text-4xl text-[#004c4c]/40">
              menu_book
            </span>
            <h3 className="font-headline text-lg md:text-xl font-bold text-[#191c1e]">
              Nothing here yet.
            </h3>
            <p className="font-body text-sm md:text-base text-[#486363] max-w-md mx-auto leading-relaxed">
              I'm still collecting things worth writing down.
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs text-[#004c4c] font-semibold underline underline-offset-4 cursor-pointer pt-2"
              >
                Clear search & filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredNotes.map((note) => (
              <article
                key={note.id}
                onClick={() => handleOpenNote(note)}
                className="neumorphic-card p-6 md:p-7 rounded-2xl cursor-pointer hover:shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.9),inset_3px_3px_6px_#dedbd2] transition-all duration-300 group text-left space-y-2.5"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs md:text-[13px] text-[#486363]">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#191c1e]">{note.date}</span>
                    <span className="text-[#cbd5e1]">·</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#004c4c] text-[11px] font-semibold border border-teal-200/50">
                      {note.category}
                    </span>
                  </div>
                  <span className="text-xs text-[#486363] opacity-80">
                    {note.readingTime || '4 min read'}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-headline text-lg md:text-xl font-bold text-[#191c1e] group-hover:text-[#004c4c] transition-colors leading-snug">
                  {note.title}
                </h2>

                {/* Short 1-2 sentence excerpt */}
                {note.excerpt && (
                  <p className="font-body text-xs md:text-sm text-[#3f4948] leading-relaxed line-clamp-2">
                    {note.excerpt}
                  </p>
                )}

                {/* Optional small tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-[#486363] bg-[#eeece5] px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
