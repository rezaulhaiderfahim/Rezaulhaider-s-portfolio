import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminCvUpload?: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({ isOpen, onClose, onOpenAdminCvUpload }) => {
  const {
    personalInfo,
    publications = [],
    awards = [],
    experience = [],
  } = useData();
  const { isAdmin } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const cvDoc = personalInfo.cvDocument;
  const hasUploadedDoc = Boolean(cvDoc?.fileData || cvDoc?.fileUrl);
  const isPdf = cvDoc?.fileType === 'pdf' || (cvDoc?.fileName && cvDoc.fileName.toLowerCase().endsWith('.pdf'));
  const isWord = cvDoc?.fileType === 'word' || cvDoc?.fileType === 'docx' || cvDoc?.fileType === 'doc' || (cvDoc?.fileName && (cvDoc.fileName.toLowerCase().endsWith('.docx') || cvDoc.fileName.toLowerCase().endsWith('.doc')));

  const handleOpenFullscreenWindow = () => {
    if (cvDoc?.fileData || cvDoc?.fileUrl) {
      const targetUrl = cvDoc.fileData || cvDoc.fileUrl;
      if (targetUrl) {
        const newWindow = window.open(targetUrl, '_blank');
        if (!newWindow) {
          const link = document.createElement('a');
          link.href = targetUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.click();
        }
      }
    } else {
      setIsFullscreen((prev) => !prev);
    }
  };

  const handleDownloadOriginalDoc = () => {
    if (!cvDoc) return;
    const downloadHref = cvDoc.fileData || cvDoc.fileUrl;
    if (!downloadHref) return;

    const link = document.createElement('a');
    link.href = downloadHref;
    link.download = cvDoc.fileName || `CV_${personalInfo.shortName.replace(/\s+/g, '_')}.${isPdf ? 'pdf' : 'docx'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'} bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200`}>
      <div className={`bg-[#f7f9fc] ${isFullscreen ? 'rounded-none w-full h-full max-w-none max-h-none' : 'rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] max-h-[92vh]'} flex flex-col overflow-hidden border border-white/80 transition-all duration-200`}>
        
        {/* Modal Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#d8dadd] bg-[#f7f9fc] gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#004c4c]">
              <span className="material-symbols-outlined text-xl">
                {isPdf ? 'picture_as_pdf' : isWord ? 'description' : 'badge'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-lg font-bold text-[#004c4c]">
                  {hasUploadedDoc ? cvDoc?.fileName || 'Curriculum Vitae' : 'Curriculum Vitae'}
                </h2>
                {hasUploadedDoc && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#004c4c] text-white">
                    {isPdf ? 'PDF Document' : isWord ? 'Word Document' : 'Document'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#486363]">
                {personalInfo.name} · {personalInfo.affiliation}
                {cvDoc?.fileSize ? ` · ${cvDoc.fileSize}` : ''}
              </p>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center space-x-2">
            {/* Fullscreen Modal View Toggle Icon */}
            <button
              onClick={() => setIsFullscreen((prev) => !prev)}
              title={isFullscreen ? 'Exit Fullscreen' : 'View CV in Fullscreen'}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg neumorphic-btn text-xs font-semibold text-[#004c4c] hover:text-[#006666] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
              <span className="hidden sm:inline">
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </span>
            </button>

            {/* If uploaded document exists, allow opening in dedicated tab */}
            {hasUploadedDoc && (
              <button
                onClick={handleOpenFullscreenWindow}
                title="Open CV document in new browser tab"
                className="p-2 sm:px-3 sm:py-1.5 rounded-lg neumorphic-btn text-xs font-semibold text-[#486363] hover:text-[#004c4c] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">open_in_new</span>
                <span className="hidden md:inline">Open Tab</span>
              </button>
            )}

            {isAdmin && onOpenAdminCvUpload && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminCvUpload();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-teal-100 text-[#004c4c] hover:bg-teal-200 text-xs font-semibold flex items-center gap-1 border border-teal-300 cursor-pointer"
                title="Replace or upload new CV document"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                <span className="hidden md:inline">Update CV</span>
              </button>
            )}

            <button
              onClick={onClose}
              aria-label="Close CV Viewer"
              className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-slate-200/60 transition-colors cursor-pointer ml-1"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Uploaded Document View vs Formatted View */}
        <div className="flex-1 overflow-hidden relative bg-[#f1f3f6]">
          {hasUploadedDoc && isPdf ? (
            /* PDF Document Viewer */
            <div className="w-full h-full flex flex-col bg-slate-900">
              <iframe
                src={cvDoc?.fileData || cvDoc?.fileUrl}
                title="Curriculum Vitae PDF"
                className="w-full h-full border-0"
              />
            </div>
          ) : hasUploadedDoc && isWord ? (
            /* Word Document (.docx / .doc) Viewer Banner + Structured View */
            <div className="h-full overflow-y-auto p-4 sm:p-8 space-y-6">
              {/* Word Notice Card */}
              <div className="neumorphic-card p-5 bg-teal-50/60 border border-teal-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow">
                    W
                  </div>
                  <div>
                    <h3 className="font-bold text-[#004c4c] text-sm sm:text-base">
                      {cvDoc?.fileName || 'Official Curriculum Vitae (Word Document)'}
                    </h3>
                    <p className="text-xs text-[#486363]">
                      Uploaded by author · {cvDoc?.fileSize || 'DOCX File'} · Ready for download & offline review
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadOriginalDoc}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                    <span>Download Original .docx</span>
                  </button>
                </div>
              </div>

              {/* Formatted Academic View for Instant In-Browser Reading */}
              <div className="bg-[#f7f9fc] rounded-2xl p-6 md:p-10 space-y-8 text-[#191c1e] font-body text-sm md:text-base leading-relaxed border border-white/80 shadow-sm">
                <div className="text-center border-b border-[#d8dadd] pb-6 space-y-2">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-[#004c4c]">
                    {personalInfo.name}
                  </h1>
                  <p className="text-sm font-medium text-[#486363]">
                    Department of Economics · {personalInfo.affiliation}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm text-[#486363]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">mail</span>
                      {personalInfo.email}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {personalInfo.location}
                    </span>
                  </div>
                </div>

                {/* Education */}
                <section className="space-y-3">
                  <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                    Education
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline flex-wrap">
                      <span className="font-bold text-[#191c1e]">
                        {personalInfo.education?.degree}
                      </span>
                      <span className="text-xs font-semibold text-[#486363]">
                        {personalInfo.education?.period}
                      </span>
                    </div>
                    <p className="text-sm text-[#486363]">{personalInfo.education?.institution}</p>
                    <p className="text-xs text-[#004c4c] font-medium">
                      Academic Standing: {personalInfo.education?.gpa} · Focus: {personalInfo.education?.focus}
                    </p>
                  </div>
                </section>

                {/* Research Interests */}
                <section className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                    Research Interests
                  </h3>
                  <p className="text-sm text-[#3f4948]">
                    {personalInfo.researchInterests?.join(' · ')}
                  </p>
                </section>

                {/* Publications & Working Papers */}
                <section className="space-y-4">
                  <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                    Publications & Working Papers
                  </h3>
                  <div className="space-y-3">
                    {publications.map((pub, i) => (
                      <div key={pub.id} className="text-sm space-y-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="font-semibold text-[#191c1e]">
                              {i + 1}. {pub.authors} ({pub.year}).
                            </span>{' '}
                            <span className="italic">"{pub.title}"</span>. {pub.journalOrVenue || '(Under Review)'}
                          </div>
                          <span className="text-xs shrink-0 font-medium px-2 py-0.5 rounded bg-teal-50 text-[#004c4c] border border-teal-200">
                            {pub.status === 'published' ? 'Published' : 'Under Review'}
                          </span>
                        </div>
                        {pub.methodology && (
                          <p className="text-xs text-[#486363] pl-4">
                            <span className="font-semibold">Methodology:</span> {pub.methodology}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Research & Fellowship Experience */}
                <section className="space-y-4">
                  <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                    Research & Fellowships
                  </h3>
                  <div className="space-y-4">
                    {experience.map((exp) => (
                      <div key={exp.id} className="text-sm space-y-1">
                        <div className="flex justify-between items-baseline flex-wrap">
                          <span className="font-bold text-[#191c1e]">{exp.role}</span>
                          <span className="text-xs font-semibold text-[#486363]">{exp.period}</span>
                        </div>
                        <p className="text-xs text-[#486363]">
                          {exp.organization} — {exp.location}
                        </p>
                        <ul className="list-disc list-inside text-xs text-[#3f4948] space-y-0.5 pl-2">
                          {exp.description?.map((d, idx) => (
                            <li key={idx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Honors and Awards */}
                <section className="space-y-3">
                  <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                    Honors, Scholarships & Awards
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {awards.map((award) => (
                      <div key={award.id} className="p-3 rounded-lg bg-white/70 border border-slate-200/80">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-[#191c1e]">{award.title}</span>
                          <span className="text-teal-700 font-semibold">{award.tag}</span>
                        </div>
                        <p className="text-[#486363] mt-1">{award.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            /* Structured Academic CV view when no specific file uploaded */
            <div className="h-full overflow-y-auto p-6 md:p-10 space-y-8 text-[#191c1e] font-body text-sm md:text-base leading-relaxed bg-[#f7f9fc]">
              {isAdmin && (
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#004c4c]">
                    <span className="material-symbols-outlined text-lg">info</span>
                    <span>Admin Notice: You can upload your official PDF or Word (.docx) CV in the Admin Panel to display the exact document file here.</span>
                  </div>
                  {onOpenAdminCvUpload && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAdminCvUpload();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#004c4c] text-white hover:bg-[#006666] font-semibold shrink-0 cursor-pointer"
                    >
                      Upload PDF/Word CV
                    </button>
                  )}
                </div>
              )}

              {/* Header info */}
              <div className="text-center border-b border-[#d8dadd] pb-6 space-y-2">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-[#004c4c]">
                  {personalInfo.name}
                </h1>
                <p className="text-sm font-medium text-[#486363]">
                  Department of Economics · {personalInfo.affiliation}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm text-[#486363]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">mail</span>
                    {personalInfo.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    {personalInfo.location}
                  </span>
                </div>
              </div>

              {/* Education */}
              <section className="space-y-3">
                <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                  Education
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-[#191c1e]">
                      {personalInfo.education?.degree}
                    </span>
                    <span className="text-xs font-semibold text-[#486363]">
                      {personalInfo.education?.period}
                    </span>
                  </div>
                  <p className="text-sm text-[#486363]">{personalInfo.education?.institution}</p>
                  <p className="text-xs text-[#004c4c] font-medium">
                    Academic Standing: {personalInfo.education?.gpa} · Focus: {personalInfo.education?.focus}
                  </p>
                </div>
              </section>

              {/* Research Interests */}
              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                  Research Interests
                </h3>
                <p className="text-sm text-[#3f4948]">
                  {personalInfo.researchInterests?.join(' · ')}
                </p>
              </section>

              {/* Publications & Working Papers */}
              <section className="space-y-4">
                <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                  Publications & Working Papers
                </h3>
                <div className="space-y-3">
                  {publications.map((pub, i) => (
                    <div key={pub.id} className="text-sm space-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-semibold text-[#191c1e]">
                            {i + 1}. {pub.authors} ({pub.year}).
                          </span>{' '}
                          <span className="italic">"{pub.title}"</span>. {pub.journalOrVenue || '(Under Review)'}
                        </div>
                        <span className="text-xs shrink-0 font-medium px-2 py-0.5 rounded bg-teal-50 text-[#004c4c] border border-teal-200">
                          {pub.status === 'published' ? 'Published' : 'Under Review'}
                        </span>
                      </div>
                      {pub.methodology && (
                        <p className="text-xs text-[#486363] pl-4">
                          <span className="font-semibold">Methodology:</span> {pub.methodology}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Research & Fellowship Experience */}
              <section className="space-y-4">
                <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                  Research & Fellowships
                </h3>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="text-sm space-y-1">
                      <div className="flex justify-between items-baseline flex-wrap">
                        <span className="font-bold text-[#191c1e]">{exp.role}</span>
                        <span className="text-xs font-semibold text-[#486363]">{exp.period}</span>
                      </div>
                      <p className="text-xs text-[#486363]">
                        {exp.organization} — {exp.location}
                      </p>
                      <ul className="list-disc list-inside text-xs text-[#3f4948] space-y-0.5 pl-2">
                        {exp.description?.map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Awards and Honors */}
              <section className="space-y-3">
                <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                  Honors, Scholarships & Awards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {awards.map((award) => (
                    <div key={award.id} className="p-3 rounded-lg bg-white/70 border border-slate-200/80">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#191c1e]">{award.title}</span>
                        <span className="text-teal-700 font-semibold">{award.tag}</span>
                      </div>
                      <p className="text-[#486363] mt-1">{award.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quantitative Skills */}
              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-[#004c4c] uppercase tracking-wider border-b border-[#d8dadd]/60 pb-1">
                  Software & Quantitative Toolkit
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {personalInfo.quantitativeToolkit?.map((tool) => (
                    <span key={tool.name} className="px-2.5 py-1 rounded bg-[#eceef1] text-[#004c4c] font-medium">
                      <strong>{tool.name}:</strong> {tool.desc}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

