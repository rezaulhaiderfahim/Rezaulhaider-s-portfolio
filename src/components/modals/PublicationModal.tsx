import React, { useState } from 'react';
import { Publication, PublicationType } from '../../types';

interface PublicationModalProps {
  publication: Publication | null;
  onClose: () => void;
}

export const PublicationModal: React.FC<PublicationModalProps> = ({ publication, onClose }) => {
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  if (!publication) return null;

  const handleCopyBibtex = () => {
    if (publication.bibtex) {
      navigator.clipboard.writeText(publication.bibtex);
      setCopiedBibtex(true);
      setTimeout(() => setCopiedBibtex(false), 2500);
    }
  };

  const getTypeMeta = (type?: PublicationType, status?: string) => {
    switch (type) {
      case 'conference_paper':
        return {
          label: 'Conference Paper',
          icon: 'co_present',
          color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'book':
        return {
          label: 'Book / Monograph',
          icon: 'auto_stories',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'book_chapter':
        return {
          label: 'Book Chapter',
          icon: 'import_contacts',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
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
          color: 'bg-teal-50 text-[#004c4c] border-teal-200',
        };
    }
  };

  const typeMeta = getTypeMeta(publication.publicationType, publication.status);

  const getStatusLabel = () => {
    if (publication.status === 'published') return 'Published';
    if (publication.status === 'under_review') return 'Under Review';
    return 'Working Paper / Preprint';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[#e5e2db]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e2db] bg-[#FAF9F6]">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${typeMeta.color}`}
            >
              <span className="material-symbols-outlined text-sm">{typeMeta.icon}</span>
              <span>{typeMeta.label}</span>
            </span>

            <span className="neumorphic-inset px-3 py-1 font-label-caps text-xs text-[#004c4c] font-semibold">
              {getStatusLabel()} ({publication.year})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-[#eeece5] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6 text-[#191c1e] font-body text-sm md:text-base">
          {/* Title & Authors */}
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[#004c4c] leading-tight">
              {publication.title}
            </h2>
            <p className="text-base text-[#486363] mt-2 font-medium">
              {publication.authors}
            </p>
            {publication.journalOrVenue && (
              <p className="text-xs text-[#004c4c] font-semibold mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">{typeMeta.icon}</span>
                <span>{publication.journalOrVenue}</span>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {publication.doi && (
                <p className="text-xs text-[#486363] font-mono">
                  DOI / ISBN:{' '}
                  {publication.doi.startsWith('10.') ? (
                    <a
                      href={`https://doi.org/${publication.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-700 underline"
                    >
                      {publication.doi}
                    </a>
                  ) : (
                    <span className="text-[#191c1e] font-semibold">{publication.doi}</span>
                  )}
                </p>
              )}
              {publication.pdfUrl && (
                <a
                  href={publication.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={publication.pdfUrl.startsWith('data:') ? `${publication.title.substring(0, 30)}.pdf` : undefined}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#004c4c] text-white text-xs font-semibold hover:bg-[#006666] transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  <span>View / Download Manuscript PDF</span>
                </a>
              )}
            </div>
          </div>

          {/* Abstract */}
          {publication.abstract && (
            <div className="neumorphic-inset-box p-5 space-y-2 bg-[#F7F6F2]">
              <h4 className="font-semibold text-xs text-[#004c4c] uppercase tracking-wider">
                Abstract / Synopsis
              </h4>
              <p className="text-sm text-[#3f4948] leading-relaxed">
                {publication.abstract}
              </p>
            </div>
          )}

          {/* Methodology & Data */}
          {(publication.methodology || publication.dataset) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publication.methodology && (
                <div className="neumorphic-card-subtle p-4 space-y-1">
                  <span className="text-xs font-bold text-[#004c4c] uppercase tracking-wider block">
                    Econometric Methodology
                  </span>
                  <p className="text-xs text-[#3f4948] leading-relaxed">
                    {publication.methodology}
                  </p>
                </div>
              )}
              {publication.dataset && (
                <div className="neumorphic-card-subtle p-4 space-y-1">
                  <span className="text-xs font-bold text-[#004c4c] uppercase tracking-wider block">
                    Primary Dataset
                  </span>
                  <p className="text-xs text-[#3f4948] leading-relaxed">
                    {publication.dataset}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Key Findings */}
          {publication.keyFindings && publication.keyFindings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-[#004c4c] uppercase tracking-wider">
                Key Empirical Insights & Findings
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-[#3f4948]">
                {publication.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#004c4c] text-sm shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bibtex Citation */}
          {publication.bibtex && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-[#004c4c] uppercase tracking-wider">
                  BibTeX Citation
                </h4>
                <button
                  onClick={handleCopyBibtex}
                  className="text-xs font-bold text-[#004c4c] hover:text-[#006666] flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedBibtex ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedBibtex ? 'Copied!' : 'Copy BibTeX'}</span>
                </button>
              </div>
              <div className="bg-[#1e293b] text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-700">
                <pre>{publication.bibtex}</pre>
              </div>
            </div>
          )}

          {/* Tags */}
          {publication.tags && publication.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#e5e2db]">
              {publication.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#eeece5] text-[#3f4948]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
