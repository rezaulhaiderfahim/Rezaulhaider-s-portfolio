import React, { useState, useEffect, useRef } from 'react';
import { NotePost } from '../../types';
import { useData } from '../../context/DataContext';

interface EditNoteModalProps {
  isOpen: boolean;
  note: NotePost | null;
  onClose: () => void;
}

export const EditNoteModal: React.FC<EditNoteModalProps> = ({
  isOpen,
  note,
  onClose,
}) => {
  const { addNote, updateNote } = useData();
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);

  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: '',
    category: 'Thoughts',
    tags: '',
    excerpt: '',
    readingTime: '4 min read',
    coverImage: '',
    content: '',
  });

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        slug: note.slug || '',
        date: note.date || '',
        category: note.category || 'Thoughts',
        tags: (note.tags || []).join(', '),
        excerpt: note.excerpt || '',
        readingTime: note.readingTime || '4 min read',
        coverImage: note.coverImage || '',
        content: note.content || '',
      });
    } else {
      const today = new Date();
      const formatted = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setFormData({
        title: '',
        slug: '',
        date: formatted,
        category: 'Thoughts',
        tags: '',
        excerpt: '',
        readingTime: '4 min read',
        coverImage: '',
        content: '',
      });
    }
  }, [note, isOpen]);

  // Utility to compress and convert image file to optimized base64 data URL
  const compressImageFile = (
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality = 0.85
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(img.src);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Cover Image File Upload Handler
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 800, 0.85);
      setFormData((prev) => ({ ...prev, coverImage: compressedDataUrl }));
    } catch (err) {
      console.error('Error uploading cover photo:', err);
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Inline Image File Upload Handler (inserts markdown tag into textarea)
  const handleInlineImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingInline(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1000, 900, 0.82);
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const markdownImage = `\n\n![${cleanFileName || 'Illustration'}](${compressedDataUrl})\n\n`;

      const textarea = contentTextareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = formData.content;
        const newContent =
          currentContent.substring(0, start) +
          markdownImage +
          currentContent.substring(end);

        setFormData((prev) => ({ ...prev, content: newContent }));

        // Restore cursor after inserted content
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + markdownImage.length,
            start + markdownImage.length
          );
        }, 50);
      } else {
        setFormData((prev) => ({
          ...prev,
          content: prev.content + markdownImage,
        }));
      }
    } catch (err) {
      console.error('Error inserting inline photo:', err);
    } finally {
      setUploadingInline(false);
      if (inlineImageInputRef.current) inlineImageInputRef.current.value = '';
    }
  };

  // Quick Markdown formatting helpers
  const insertMarkdownFormatting = (prefix: string, suffix = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formData.content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent =
      formData.content.substring(0, start) +
      replacement +
      formData.content.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 50);
  };

  if (!isOpen) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || !note ? autoSlug : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const generatedSlug =
        formData.slug.trim() ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

      const payload = {
        title: formData.title,
        slug: generatedSlug,
        date: formData.date || '2026',
        publishedAt: new Date().toISOString().split('T')[0],
        category: formData.category || 'Thoughts',
        tags: tagsArray,
        excerpt: formData.excerpt,
        readingTime: formData.readingTime || '4 min read',
        coverImage: formData.coverImage,
        content: formData.content,
      };

      if (note?.id) {
        await updateNote(note.id, payload);
      } else {
        await addNote(payload);
      }
      onClose();
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF9F6] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 border border-[#e5e2db]">
        <div className="flex justify-between items-center pb-3 border-b border-[#e5e2db]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004c4c] text-2xl">
              edit_note
            </span>
            <h3 className="font-headline text-xl font-bold text-[#004c4c]">
              {note ? 'Edit Note' : 'Write New Note'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-[#eeece5] cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-body">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. What I Learned From Applying for Scholarships"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004c4c]"
            />
          </div>

          {/* Slug & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="what-i-learned-from-applying"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004c4c] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Display Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="21 Aug 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004c4c]"
              />
            </div>
          </div>

          {/* Category & Reading Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004c4c]"
              >
                <option value="Thoughts">Thoughts</option>
                <option value="Research">Research</option>
                <option value="Economics">Economics</option>
                <option value="Study Abroad">Study Abroad</option>
                <option value="Learning">Learning</option>
                <option value="Life">Life</option>
                <option value="Career">Career</option>
                <option value="Notes">Notes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Reading Time
              </label>
              <input
                type="text"
                value={formData.readingTime}
                onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                placeholder="e.g. 5 min read"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004c4c]"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Short Excerpt (1–2 sentences)
            </label>
            <textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief preview displayed in the Notes archive list..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004c4c]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Scholarships, Higher Education, Applications"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004c4c]"
            />
          </div>

          {/* Cover Image Manager with Device Upload */}
          <div className="p-4 rounded-2xl bg-white/80 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#004c4c] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">image</span>
                <span>Note Cover Image</span>
              </label>
              {formData.coverImage && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, coverImage: '' })}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>Remove Cover</span>
                </button>
              )}
            </div>

            {/* Hidden file input for cover */}
            <input
              type="file"
              ref={coverInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleCoverFileUpload}
              className="hidden"
              id="note-cover-upload-input"
            />

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <label
                htmlFor="note-cover-upload-input"
                className="px-4 py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-base">upload</span>
                <span>{uploadingCover ? 'Optimizing image...' : 'Upload Cover from Device'}</span>
              </label>

              <div className="text-xs text-gray-500 font-medium">or paste direct image URL:</div>

              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="flex-grow w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#004c4c]"
              />
            </div>

            {/* Cover Image Thumbnail Preview */}
            {formData.coverImage && (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 max-h-40 bg-gray-100 mt-2">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-36 object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] backdrop-blur-xs">
                  Cover Preview
                </div>
              </div>
            )}
          </div>

          {/* Article Body with Markdown and Device Photo Insertion Toolbar */}
          <div className="space-y-2">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <label className="block text-xs font-semibold text-gray-700">
                Article Body (Markdown supported)
              </label>
              <span className="text-[11px] text-gray-400">
                Use formatting toolbar below or write raw markdown
              </span>
            </div>

            {/* Hidden inline image input */}
            <input
              type="file"
              ref={inlineImageInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleInlineImageFileUpload}
              className="hidden"
              id="note-inline-image-upload-input"
            />

            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-white border border-gray-200 text-xs">
              <label
                htmlFor="note-inline-image-upload-input"
                className="px-2.5 py-1.5 rounded-lg bg-teal-50 text-[#004c4c] hover:bg-teal-100 font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-teal-200"
                title="Add and insert photo from your device"
              >
                <span className="material-symbols-outlined text-base text-[#004c4c]">
                  add_photo_alternate
                </span>
                <span>{uploadingInline ? 'Inserting...' : 'Add Photo from Device'}</span>
              </label>

              <div className="h-4 w-[1px] bg-gray-300 mx-1 hidden sm:block"></div>

              <button
                type="button"
                onClick={() => insertMarkdownFormatting('## ', '\n')}
                className="px-2 py-1 rounded hover:bg-gray-100 font-bold text-gray-700 cursor-pointer"
                title="Heading 2"
              >
                H2
              </button>

              <button
                type="button"
                onClick={() => insertMarkdownFormatting('### ', '\n')}
                className="px-2 py-1 rounded hover:bg-gray-100 font-bold text-gray-700 cursor-pointer"
                title="Heading 3"
              >
                H3
              </button>

              <button
                type="button"
                onClick={() => insertMarkdownFormatting('**', '**')}
                className="px-2 py-1 rounded hover:bg-gray-100 font-bold text-gray-700 cursor-pointer"
                title="Bold"
              >
                B
              </button>

              <button
                type="button"
                onClick={() => insertMarkdownFormatting('*', '*')}
                className="px-2 py-1 rounded hover:bg-gray-100 italic text-gray-700 cursor-pointer"
                title="Italic"
              >
                I
              </button>

              <button
                type="button"
                onClick={() => insertMarkdownFormatting('> ', '\n')}
                className="px-2 py-1 rounded hover:bg-gray-100 font-serif text-gray-700 cursor-pointer"
                title="Quote Block"
              >
                Quote
              </button>

              <button
                type="button"
                onClick={() => insertMarkdownFormatting('- ')}
                className="px-2 py-1 rounded hover:bg-gray-100 text-gray-700 cursor-pointer"
                title="Bullet List"
              >
                List
              </button>

              <button
                type="button"
                onClick={() => insertMarkdownFormatting('```\n', '\n```')}
                className="px-2 py-1 rounded hover:bg-gray-100 font-mono text-gray-700 cursor-pointer"
                title="Code Block"
              >
                Code
              </button>

              <button
                type="button"
                onClick={() => insertMarkdownFormatting('[link text](', ')')}
                className="px-2 py-1 rounded hover:bg-gray-100 text-gray-700 cursor-pointer"
                title="Hyperlink"
              >
                Link
              </button>
            </div>

            {/* Content Textarea */}
            <textarea
              ref={contentTextareaRef}
              rows={11}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your note, thoughts, code blocks, or observations here..."
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004c4c] font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingCover || uploadingInline}
              className="px-5 py-2.5 rounded-xl bg-[#004c4c] text-white font-medium hover:bg-[#006666] flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading && (
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
              )}
              <span>{note ? 'Save Changes' : 'Publish Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
