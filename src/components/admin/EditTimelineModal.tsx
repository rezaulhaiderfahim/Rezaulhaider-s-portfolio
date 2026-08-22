import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ResearchExperience } from '../../types';

interface EditTimelineModalProps {
  item: ResearchExperience | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTimelineModal: React.FC<EditTimelineModalProps> = ({ item, isOpen, onClose }) => {
  const { addResearchTimeline, updateResearchTimeline, deleteResearchTimeline } = useData();

  const [period, setPeriod] = useState('2025 - 2026');
  const [title, setTitle] = useState('');
  const [supervisorOrRole, setSupervisorOrRole] = useState('');
  const [institution, setInstitution] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('biotech');
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setPeriod(item.period || '');
      setTitle(item.title || '');
      setSupervisorOrRole(item.supervisorOrRole || '');
      setInstitution(item.institution || '');
      setDescription(item.description || '');
      setIcon(item.icon || 'biotech');
      setTagsInput(item.tags ? item.tags.join(', ') : '');
    } else {
      setPeriod('2025 - 2026');
      setTitle('');
      setSupervisorOrRole('Supervisor: Dr. Romi Bhakti Hartarto');
      setInstitution('Universitas Muhammadiyah Yogyakarta');
      setDescription('');
      setIcon('biotech');
      setTagsInput('Panel Econometrics, Female Labor');
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const timelineData: Omit<ResearchExperience, 'id'> = {
        period: period.trim(),
        title: title.trim(),
        supervisorOrRole: supervisorOrRole.trim(),
        institution: institution.trim() || '',
        description: description.trim() || '',
        icon: icon || 'work',
        tags,
      };

      if (item?.id) {
        await updateResearchTimeline(item.id, timelineData);
      } else {
        await addResearchTimeline(timelineData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    if (window.confirm('Delete this research timeline item?')) {
      setSaving(true);
      try {
        await deleteResearchTimeline(item.id);
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
      <div className="bg-[#FAF9F6] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-[#e5e2db]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e2db] bg-[#FAF9F6]">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#004c4c]">timeline</span>
            <h2 className="font-display text-xl font-bold text-[#004c4c]">
              {item ? 'Edit Research Timeline Node' : 'Add Research Timeline Node'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-[#eeece5] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Time Period *
              </label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="2025 - 2026 or AUG - OCT 2025"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Material Icon Name
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#f7f9fc]"
              >
                <option value="biotech">biotech (Microscope)</option>
                <option value="psychology">psychology (Brain / Cognition)</option>
                <option value="eco">eco (Leaf / Green Economy)</option>
                <option value="school">school (Education)</option>
                <option value="analytics">analytics (Data)</option>
                <option value="trending_up">trending_up (Growth)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Timeline Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Undergraduate Thesis & Collaborative Research in Applied Microeconometrics"
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Supervisor or Role
              </label>
              <input
                type="text"
                value={supervisorOrRole}
                onChange={(e) => setSupervisorOrRole(e.target.value)}
                placeholder="Supervisor: Dr. Romi Bhakti Hartarto"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Institution
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Universitas Muhammadiyah Yogyakarta"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details regarding the research project or internship..."
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
              placeholder="Panel Econometrics, Female Labor, Supervisor"
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#d8dadd]">
            {item?.id ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete
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
                <span>{item ? 'Save Item' : 'Add Item'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
