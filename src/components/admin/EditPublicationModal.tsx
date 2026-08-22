import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Publication } from '../../types';

interface EditPublicationModalProps {
  publication: Publication | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPublicationModal: React.FC<EditPublicationModalProps> = ({
  publication,
  isOpen,
  onClose,
}) => {
  const { addPublication, updatePublication, deletePublication } = useData();

  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('Haider, M.R.');
  const [year, setYear] = useState('2026');
  const [status, setStatus] = useState<'published' | 'under_review' | 'working_paper'>('under_review');
  const [journalOrVenue, setJournalOrVenue] = useState('');
  const [description, setDescription] = useState('');
  const [abstract, setAbstract] = useState('');
  const [methodology, setMethodology] = useState('');
  const [dataset, setDataset] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [doi, setDoi] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [findingsInput, setFindingsInput] = useState('');
  const [bibtex, setBibtex] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (publication) {
      setTitle(publication.title || '');
      setAuthors(publication.authors || 'Haider, M.R.');
      setYear(publication.year || '2026');
      setStatus(publication.status || 'under_review');
      setJournalOrVenue(publication.journalOrVenue || '');
      setDescription(publication.description || '');
      setAbstract(publication.abstract || '');
      setMethodology(publication.methodology || '');
      setDataset(publication.dataset || '');
      setTagsInput(publication.tags ? publication.tags.join(', ') : '');
      setDoi(publication.doi || '');
      setPdfUrl(publication.pdfUrl || '');
      setPdfFileName(publication.pdfUrl ? 'Paper document attached' : '');
      setFindingsInput(publication.keyFindings ? publication.keyFindings.join('\n') : '');
      setBibtex(publication.bibtex || '');
      setFormError(null);
    } else {
      setTitle('');
      setAuthors('Haider, M.R.');
      setYear(new Date().getFullYear().toString());
      setStatus('under_review');
      setJournalOrVenue('');
      setDescription('');
      setAbstract('');
      setMethodology('');
      setDataset('');
      setTagsInput('Applied Econometrics, Panel Data, Labor Economics');
      setDoi('');
      setPdfUrl('');
      setPdfFileName('');
      setFindingsInput('');
      setBibtex('');
      setFormError(null);
    }
  }, [publication, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 10MB for client base64 storage)
    if (file.size > 10 * 1024 * 1024) {
      setFormError('File size exceeds 10MB limit. Please upload a smaller PDF or provide an external URL.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPdfUrl(result);
      setPdfFileName(file.name);
      setFormError(null);
    };
    reader.onerror = () => {
      setFormError('Failed to read uploaded file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setFormError('Please enter a valid paper title.');
      return;
    }

    setSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const keyFindings = findingsInput
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const pubData: Omit<Publication, 'id'> = {
        title: cleanTitle,
        authors: authors.trim() || 'Haider, M.R.',
        year: year.trim() || new Date().getFullYear().toString(),
        status,
        journalOrVenue: journalOrVenue.trim() || '',
        description: description.trim() || cleanTitle,
        abstract: abstract.trim(),
        methodology: methodology.trim() || '',
        dataset: dataset.trim() || '',
        tags: tags.length > 0 ? tags : ['Economics', 'Panel Data'],
        doi: doi.trim() || '',
        pdfUrl: pdfUrl.trim() || '',
        keyFindings: keyFindings.length > 0 ? keyFindings : [],
        bibtex: bibtex.trim() || '',
      };

      if (publication?.id) {
        await updatePublication(publication.id, pubData);
      } else {
        await addPublication(pubData);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving publication:', err);
      setFormError(err.message || 'Failed to save publication. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!publication?.id) return;
    if (window.confirm('Are you sure you want to delete this publication? This action cannot be undone.')) {
      setSaving(true);
      try {
        await deletePublication(publication.id);
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[#e5e2db]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e2db] bg-[#FAF9F6]">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#004c4c]">
              {publication ? 'edit_document' : 'post_add'}
            </span>
            <div>
              <h2 className="font-display text-lg md:text-xl font-bold text-[#004c4c]">
                {publication ? 'Edit Publication / Paper' : 'Add New Publication / Paper'}
              </h2>
              <p className="text-[11px] text-[#486363]">
                {publication ? 'Update academic manuscript details, data, and PDF' : 'Upload or register a new research paper in your portfolio'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-[#eeece5] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <span className="material-symbols-outlined text-base shrink-0 text-rose-600">error</span>
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Paper / Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Female Labor Force Participation and Structural Transformation in Developing Asia"
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Authors *
              </label>
              <input
                type="text"
                required
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="Haider, M.R. & Hartarto, R.B."
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Year *
              </label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Publication Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#f7f9fc]"
              >
                <option value="under_review">Under Review</option>
                <option value="published">Published</option>
                <option value="working_paper">Working Paper</option>
              </select>
            </div>
          </div>

          {/* Paper Document / PDF Upload Section */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#004c4c] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                <span>Upload Paper PDF or Manuscript Document</span>
              </label>
              {pdfUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setPdfUrl('');
                    setPdfFileName('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Remove Document
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pub-pdf-file-upload"
                />
                <label
                  htmlFor="pub-pdf-file-upload"
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-teal-600/40 bg-white hover:bg-teal-50/80 transition-colors flex items-center justify-center gap-2 text-xs font-semibold text-[#004c4c] cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  <span>{pdfFileName ? 'Replace File' : 'Choose PDF Document'}</span>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={pdfUrl.startsWith('data:') ? '' : pdfUrl}
                  onChange={(e) => {
                    setPdfUrl(e.target.value);
                    setPdfFileName(e.target.value ? 'External link' : '');
                  }}
                  placeholder="Or paste external PDF / SSRN link"
                  className="w-full px-3.5 py-2 rounded-xl text-xs neumorphic-input text-[#191c1e] bg-white"
                />
              </div>
            </div>

            {pdfUrl && (
              <div className="flex items-center gap-2 text-[11px] text-teal-800 font-medium bg-teal-100/70 p-2 rounded-lg">
                <span className="material-symbols-outlined text-sm text-teal-700">task_alt</span>
                <span className="truncate">
                  {pdfUrl.startsWith('data:')
                    ? `Attached file: ${pdfFileName || 'manuscript.pdf'}`
                    : `Linked document: ${pdfUrl}`}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Journal or Conference Venue
              </label>
              <input
                type="text"
                value={journalOrVenue}
                onChange={(e) => setJournalOrVenue(e.target.value)}
                placeholder="Journal of Applied Economics (or leave empty)"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                DOI Identifier (Optional)
              </label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="10.1016/j.jsustfin.2025.104291"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Short Description / Subtitle
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the econometric research focus."
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Abstract
            </label>
            <textarea
              rows={3}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Comprehensive academic abstract..."
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Econometric Methodology
              </label>
              <input
                type="text"
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="Dynamic Panel GMM, Fixed Effects, 2SLS IV"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Primary Dataset
              </label>
              <input
                type="text"
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                placeholder="World Bank WDI, ILOSTAT, SUSENAS"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Key Empirical Findings (One per line)
            </label>
            <textarea
              rows={2}
              value={findingsInput}
              onChange={(e) => setFindingsInput(e.target.value)}
              placeholder="Finding 1: U-shaped relationship confirmed&#10;Finding 2: Education elasticity is positive"
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Labor Economics, Panel Data, Under Review"
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              BibTeX Citation
            </label>
            <textarea
              rows={3}
              value={bibtex}
              onChange={(e) => setBibtex(e.target.value)}
              placeholder="@article{haider2026, ...}"
              className="w-full px-3.5 py-2 rounded-xl text-xs font-mono neumorphic-input text-[#191c1e] resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#d8dadd]">
            {publication?.id ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete Paper
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#486363] hover:text-[#191c1e] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-2 cursor-pointer shadow disabled:opacity-50"
              >
                {saving && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
                <span>{publication ? 'Update Paper' : 'Add Paper'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
