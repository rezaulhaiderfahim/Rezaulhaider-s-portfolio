import React from 'react';
import { NotePost } from '../../types';
import { useData } from '../../context/DataContext';

interface NoteArticleViewProps {
  note: NotePost;
  onBack: () => void;
  onNavigateNote: (note: NotePost) => void;
  allNotes: NotePost[];
}

export const NoteArticleView: React.FC<NoteArticleViewProps> = ({
  note,
  onBack,
  onNavigateNote,
  allNotes,
}) => {
  const { personalInfo } = useData();

  // Find previous and next posts in chronological sequence
  const currentIndex = allNotes.findIndex((n) => n.id === note.id);
  const prevNote = currentIndex > 0 ? allNotes[currentIndex - 1] : null;
  const nextNote =
    currentIndex >= 0 && currentIndex < allNotes.length - 1
      ? allNotes[currentIndex + 1]
      : null;

  const getAuthorInitials = (name: string) => {
    if (!name) return 'MRH';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    if (parts.length >= 3)
      return (parts[0][0] + parts[1][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Custom clean text/markdown renderer
  const renderContent = (content: string) => {
    if (!content) return null;

    const blocks = content.split(/\n\n+/);

    return blocks.map((block, bIdx) => {
      const trimmed = block.trim();

      // Standalone Markdown Image: ![Alt text](url)
      const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        const altText = imageMatch[1];
        const imgSrc = imageMatch[2];
        return (
          <figure key={bIdx} className="my-7 space-y-2">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-[#e5e2db] bg-[#FAF9F6]">
              <img
                src={imgSrc}
                alt={altText || 'Note illustration'}
                className="w-full h-auto max-h-[520px] object-cover"
                loading="lazy"
              />
            </div>
            {altText && altText.toLowerCase() !== 'illustration' && (
              <figcaption className="text-xs text-center text-[#486363] italic">
                {altText}
              </figcaption>
            )}
          </figure>
        );
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={bIdx}
            className="font-headline text-xl md:text-2xl font-bold text-[#004c4c] mt-8 mb-4 tracking-tight"
          >
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={bIdx}
            className="font-headline text-2xl md:text-3xl font-bold text-[#004c4c] mt-10 mb-5 tracking-tight border-b border-[#e5e2db] pb-2"
          >
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        );
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s*/gm, '');
        return (
          <blockquote
            key={bIdx}
            className="my-6 p-5 md:p-6 rounded-2xl bg-[#eeece5]/70 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_#dedbd2] border-l-4 border-[#004c4c] italic text-[#2c3e50] text-base md:text-lg leading-relaxed"
          >
            {quoteText}
          </blockquote>
        );
      }

      // Code Block
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const language = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');
        return (
          <div
            key={bIdx}
            className="my-6 rounded-2xl overflow-hidden bg-[#1e293b] text-[#f8fafc] text-xs md:text-sm font-mono shadow-md"
          >
            {language && (
              <div className="px-4 py-2 bg-[#0f172a] text-[#94a3b8] text-[11px] font-semibold tracking-wider uppercase flex justify-between items-center border-b border-[#334155]">
                <span>{language}</span>
                <span className="material-symbols-outlined text-xs">terminal</span>
              </div>
            )}
            <pre className="p-4 md:p-5 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed
          .split(/\n(?=[-|\*]\s)/)
          .map((item) => item.replace(/^[-|\*]\s+/, '').trim());
        return (
          <ul key={bIdx} className="my-4 space-y-2.5 list-none pl-1">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start text-sm md:text-base text-[#3f4948] leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#004c4c] mt-2 mr-3 shrink-0"></span>
                <span>{parseInline(item)}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Numbered List
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed
          .split(/\n(?=\d+\.\s)/)
          .map((item) => item.replace(/^\d+\.\s+/, '').trim());
        return (
          <ol key={bIdx} className="my-4 space-y-2.5 list-none pl-1">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start text-sm md:text-base text-[#3f4948] leading-relaxed"
              >
                <span className="font-headline font-bold text-xs text-[#004c4c] bg-teal-50 border border-teal-200 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 mr-3 shrink-0">
                  {idx + 1}
                </span>
                <span>{parseInline(item)}</span>
              </li>
            ))}
          </ol>
        );
      }

      // Regular Paragraph
      return (
        <p
          key={bIdx}
          className="font-body text-sm md:text-[16.5px] leading-relaxed text-[#3f4948] my-4"
        >
          {parseInline(trimmed)}
        </p>
      );
    });
  };

  // Inline formatter for bold, italic, inline code, links, and inline images
  const parseInline = (text: string) => {
    const parts = text.split(
      /(!\[[^\]]*\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g
    );

    return parts.map((part, idx) => {
      // Inline image inside paragraph
      if (part.startsWith('![') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (match) {
          return (
            <span key={idx} className="block my-4">
              <img
                src={match[2]}
                alt={match[1] || 'Illustration'}
                className="rounded-xl max-w-full h-auto shadow-sm border border-[#e5e2db]"
                loading="lazy"
              />
            </span>
          );
        }
      }

      // Inline code
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-[#eeece5] text-[#004c4c] font-mono text-xs md:text-[13px] font-medium"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Bold
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-[#191c1e]">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Italic
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={idx} className="italic text-[#2c3e50]">
            {part.slice(1, -1)}
          </em>
        );
      }

      // Link
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          return (
            <a
              key={idx}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#004c4c] underline decoration-teal-300 underline-offset-2 hover:text-[#006666] font-medium"
            >
              {match[1]}
            </a>
          );
        }
      }
      return part;
    });
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-6 md:px-10 py-10 md:py-16 space-y-10">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e5e2db]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[#004c4c] hover:text-[#006666] transition-colors py-1.5 px-3 rounded-full hover:bg-[#eeece5] cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>All Notes</span>
        </button>

        <span className="font-label-caps text-xs text-[#486363] uppercase tracking-wider">
          Personal Notebook
        </span>
      </div>

      {/* Article Header */}
      <header className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-[#486363]">
          <span className="font-medium text-[#191c1e]">{note.date}</span>
          <span className="text-[#a0aec0]">·</span>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-[#004c4c] font-semibold text-xs border border-teal-200/60">
            {note.category}
          </span>
          <span className="text-[#a0aec0]">·</span>
          <span>{note.readingTime || '4 min read'}</span>
        </div>

        <h1 className="font-headline text-3xl md:text-4xl lg:text-[42px] font-bold text-[#191c1e] tracking-tight leading-tight">
          {note.title}
        </h1>

        {note.excerpt && (
          <p className="font-body text-base md:text-lg text-[#486363] leading-relaxed italic pt-1">
            {note.excerpt}
          </p>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-[#486363] bg-[#eeece5] px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Optional Hero Image */}
      {note.coverImage && (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-[#e5e2db]">
          <img
            src={note.coverImage}
            alt={note.title}
            className="w-full h-auto max-h-[420px] object-cover"
          />
        </div>
      )}

      {/* Main Article Body */}
      <article className="prose prose-teal max-w-none font-body text-[#3f4948] pt-2 border-t border-[#e5e2db]">
        {renderContent(note.content)}
      </article>

      {/* Post Navigation: Previous & Next */}
      <div className="pt-10 border-t border-[#e5e2db] grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevNote ? (
          <button
            onClick={() => onNavigateNote(prevNote)}
            className="neumorphic-card p-4 text-left space-y-1 hover:shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.9),inset_3px_3px_6px_#dedbd2] transition-all cursor-pointer group"
          >
            <span className="text-[11px] font-label-caps text-[#486363] uppercase tracking-wider flex items-center gap-1 group-hover:text-[#004c4c]">
              <span className="material-symbols-outlined text-xs">arrow_back</span>
              Previous post
            </span>
            <p className="font-headline text-sm font-semibold text-[#191c1e] line-clamp-1 group-hover:text-[#004c4c]">
              {prevNote.title}
            </p>
          </button>
        ) : (
          <div />
        )}

        {nextNote ? (
          <button
            onClick={() => onNavigateNote(nextNote)}
            className="neumorphic-card p-4 text-right space-y-1 hover:shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.9),inset_3px_3px_6px_#dedbd2] transition-all cursor-pointer group sm:col-start-2"
          >
            <span className="text-[11px] font-label-caps text-[#486363] uppercase tracking-wider flex items-center justify-end gap-1 group-hover:text-[#004c4c]">
              Next post
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </span>
            <p className="font-headline text-sm font-semibold text-[#191c1e] line-clamp-1 group-hover:text-[#004c4c]">
              {nextNote.title}
            </p>
          </button>
        ) : null}
      </div>

      {/* Author Section with M.R. Haider branding */}
      <div className="neumorphic-card p-6 md:p-8 flex items-start gap-4 md:gap-5 rounded-2xl bg-[#FAF9F6] border border-[#e5e2db]">
        <div className="w-14 h-14 rounded-full overflow-hidden neumorphic-inset p-1 bg-[#F7F6F2] shrink-0 flex items-center justify-center">
          {personalInfo.avatarUrl ? (
            <img
              src={personalInfo.avatarUrl}
              alt={personalInfo.shortName || 'M. R. Haider'}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#004c4c] text-white flex items-center justify-center font-display font-bold text-base">
              {getAuthorInitials(personalInfo.name)}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h4 className="font-headline text-base md:text-lg font-bold text-[#004c4c]">
              {personalInfo.shortName || 'M. R. Haider'}
            </h4>
          </div>
          <p className="font-body text-xs md:text-sm text-[#486363] leading-relaxed">
            {personalInfo.title ||
              'Economics student specializing in applied panel econometrics, labor, and gender economics.'}
          </p>
        </div>
      </div>
    </div>
  );
};
