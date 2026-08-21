import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({ isOpen, onClose }) => {
  const {
    personalInfo,
    publications = [],
    awards = [],
    experience = [],
  } = useData();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    // Generate clean text/markdown representation for direct download
    const cvContent = `CURRICULUM VITAE
==================================================
${personalInfo.name.toUpperCase()}
${personalInfo.title}
Email: ${personalInfo.email}
Affiliation: ${personalInfo.affiliation}
Location: ${personalInfo.location}
==================================================

EDUCATION
--------------------------------------------------
${personalInfo.education?.degree}
${personalInfo.education?.institution} (${personalInfo.education?.period})
GPA: ${personalInfo.education?.gpa}
Focus: ${personalInfo.education?.focus}

RESEARCH INTERESTS
--------------------------------------------------
${personalInfo.researchInterests?.map((r) => `• ${r}`).join('\n')}

PUBLICATIONS & WORKING PAPERS
--------------------------------------------------
${publications
  .map(
    (p, idx) =>
      `${idx + 1}. [${p.status.toUpperCase()}] ${p.authors} (${p.year}). "${p.title}". ${p.journalOrVenue || 'Working Paper'}.\n   Methodology: ${p.methodology || 'Quantitative'}`
  )
  .join('\n\n')}

RESEARCH & ACADEMIC EXPERIENCE
--------------------------------------------------
${experience
  .map(
    (e) =>
      `• ${e.role} | ${e.organization} (${e.period})\n  ${e.description?.join(' ')}`
  )
  .join('\n\n')}

HONORS, AWARDS & FELLOWSHIPS
--------------------------------------------------
${awards
  .map((a) => `• [${a.year || 'Academic'}] ${a.title} - ${a.organization || ''} (${a.description})`)
  .join('\n')}

QUANTITATIVE TOOLKIT
--------------------------------------------------
${personalInfo.quantitativeToolkit?.map((t) => `• ${t.name}: ${t.desc}`).join('\n')}
`;

    const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_Muhammad_Rezaul_Haider.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f7f9fc] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-white/60">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d8dadd] bg-[#f7f9fc]">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#004c4c]">description</span>
            <h2 className="font-display text-xl font-bold text-[#004c4c]">
              Curriculum Vitae Preview
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg neumorphic-btn text-xs font-semibold text-[#486363] hover:text-[#004c4c] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-[#004c4c] text-white hover:bg-[#006666] transition-colors text-xs font-semibold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              {downloadSuccess ? 'Downloaded!' : 'Download CV'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body - CV Content */}
        <div className="overflow-y-auto p-6 md:p-10 space-y-8 text-[#191c1e] font-body text-sm md:text-base leading-relaxed bg-[#f7f9fc]">
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
      </div>
    </div>
  );
};
