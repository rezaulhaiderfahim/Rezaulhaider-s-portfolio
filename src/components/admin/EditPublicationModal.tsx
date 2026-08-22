import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Publication, PublicationType } from '../../types';

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
  const [publicationType, setPublicationType] = useState<PublicationType>('journal_article');
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
      
      // Auto-detect publicationType if not previously set
      let initialType: PublicationType = publication.publicationType || 'journal_article';
      if (!publication.publicationType) {
        if (publication.status === 'working_paper') {
          initialType = 'working_paper';
        } else if (
          publication.journalOrVenue?.toLowerCase().includes('conference') ||
          publication.journalOrVenue?.toLowerCase().includes('proceedings') ||
          publication.journalOrVenue?.toLowerCase().includes('symposium')
        ) {
          initialType = 'conference_paper';
        } else if (
          publication.journalOrVenue?.toLowerCase().includes('press') ||
          publication.journalOrVenue?.toLowerCase().includes('springer') ||
          publication.journalOrVenue?.toLowerCase().includes('routledge') ||
          publication.journalOrVenue?.toLowerCase().includes('book')
        ) {
          initialType = 'book';
        }
      }

      setPublicationType(initialType);
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
      setPublicationType('journal_article');
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
        publicationType,
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

  const getVenueLabelAndPlaceholder = () => {
    switch (publicationType) {
      case 'journal_article':
        return {
          label: 'Journal Name & Volume/Issue',
          placeholder: 'e.g. Journal of Applied Economics, Vol. 18, No. 2',
        };
      case 'conference_paper':
        return {
          label: 'Conference Name, Location & Proceedings',
          placeholder: 'e.g. 15th Annual International Economics Conference, Jakarta',
        };
      case 'book':
        return {
          label: 'Book Publisher & Location / ISBN',
          placeholder: 'e.g. Routledge / Springer / Oxford University Press',
        };
      case 'book_chapter':
        return {
          label: 'Book Title & Publisher (In: ...)',
          placeholder: 'e.g. In: Handbook of Asian Development Economics, Palgrave Macmillan',
        };
      case 'working_paper':
      default:
        return {
          label: 'Working Paper Series / Institution',
          placeholder: 'e.g. UMY Economics Working Paper Series No. 24 / SSRN',
        };
    }
  };

  const venueInfo = getVenueLabelAndPlaceholder();

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
                {publication
                  ? 'Update academic manuscript details, category, data, and PDF'
                  : 'Register a Journal Article, Conference Paper, Book, or Working Paper in your portfolio'}
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
          {/* Publication Category / Type Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1.5">
              Publication Type / Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPublicationType('journal_article')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  publicationType === 'journal_article'
                    ? 'bg-[#004c4c] text-white border-[#004c4c] shadow-sm'
                    : 'bg-white text-[#486363] border-[#e5e2db] hover:border-[#004c4c]/40 hover:text-[#004c4c]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">menu_book</span>
                <span>Journal Article</span>
              </button>

              <button
                type="button"
                onClick={() => setPublicationType('conference_paper')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  publicationType === 'conference_paper'
                    ? 'bg-[#004c4c] text-white border-[#004c4c] shadow-sm'
                    : 'bg-white text-[#486363] border-[#e5e2db] hover:border-[#004c4c]/40 hover:text-[#004c4c]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">co_present</span>
                <span>Conference Paper</span>
              </button>

              <button
                type="button"
                onClick={() => setPublicationType('book')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  publicationType === 'book'
                    ? 'bg-[#004c4c] text-white border-[#004c4c] shadow-sm'
                    : 'bg-white text-[#486363] border-[#e5e2db] hover:border-[#004c4c]/40 hover:text-[#004c4c]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">auto_stories</span>
                <span>Book / Monograph</span>
              </button>

              <button
                type="button"
                onClick={() => setPublicationType('book_chapter')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  publicationType === 'book_chapter'
                    ? 'bg-[#004c4c] text-white border-[#004c4c] shadow-sm'
                    : 'bg-white text-[#486363] border-[#e5e2db] hover:border-[#004c4c]/40 hover:text-[#004c4c]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">import_contacts</span>
                <span>Book Chapter</span>
              </button>

              <button
                type="button"
                onClick={() => setPublicationType('working_paper')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                  publicationType === 'working_paper'
                    ? 'bg-[#004c4c] text-white border-[#004c4c] shadow-sm'
                    : 'bg-white text-[#486363] border-[#e5e2db] hover:border-[#004c4c]/40 hover:text-[#004c4c]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                <span>Working Paper</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Title *
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
                <option value="published">Published</option>
                <option value="under_review">Under Review</option>
                <option value="working_paper">Working Paper / Preprint</option>
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
                  placeholder="Or paste external PDF / SSRN / DOI link"
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
                {venueInfo.label}
              </label>
              <input
                type="text"
                value={journalOrVenue}
                onChange={(e) => setJournalOrVenue(e.target.value)}
                placeholder={venueInfo.placeholder}
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                DOI / ISBN Identifier (Optional)
              </label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="10.1016/j.jsustfin.2025.104291 or 978-3-16-148410-0"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Short Summary / Subtitle
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the research contribution or focus."
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Abstract / Synopsis
            </label>
            <textarea
              rows={3}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Comprehensive academic abstract or overview..."
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Econometric Methodology / Approach
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
                Primary Dataset / Sources
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
              placeholder="Labor Economics, Panel Data, Green Finance"
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              BibTeX / Citation Reference
            </label>
            <textarea
              rows={3}
              value={bibtex}
              onChange={(e) => setBibtex(e.target.value)}
              placeholder="@article{haider2026, ...} or @inproceedings{...} or @book{...}"
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
                Delete Item
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
                <span>{publication ? 'Update Publication' : 'Add Publication'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
