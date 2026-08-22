import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { AwardItem } from '../../types';

interface EditAwardModalProps {
  award: AwardItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditAwardModal: React.FC<EditAwardModalProps> = ({ award, isOpen, onClose }) => {
  const { addAward, updateAward, deleteAward } = useData();

  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'conference' | 'award' | 'course'>('award');
  const [tag, setTag] = useState('');
  const [secondaryTag, setSecondaryTag] = useState('');
  const [icon, setIcon] = useState('military_tech');
  const [year, setYear] = useState('2024');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (award) {
      setTitle(award.title || '');
      setOrganization(award.organization || '');
      setDescription(award.description || '');
      setCategory(award.category || 'award');
      setTag(award.tag || '');
      setSecondaryTag(award.secondaryTag || '');
      setIcon(award.icon || 'military_tech');
      setYear(award.year || '');
    } else {
      setTitle('');
      setOrganization('');
      setDescription('');
      setCategory('award');
      setTag('Award');
      setSecondaryTag('');
      setIcon('military_tech');
      setYear('2024');
    }
  }, [award, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const awardData: Omit<AwardItem, 'id'> = {
        title: title.trim(),
        organization: organization.trim() || '',
        description: description.trim(),
        category,
        tag: tag.trim() || 'Award',
        secondaryTag: secondaryTag.trim() || '',
        icon: icon || 'military_tech',
        iconFilled: true,
        year: year.trim() || '',
      };

      if (award?.id) {
        await updateAward(award.id, awardData);
      } else {
        await addAward(awardData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!award?.id) return;
    if (window.confirm('Delete this award/conference entry?')) {
      setSaving(true);
      try {
        await deleteAward(award.id);
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
      <div className="bg-[#FAF9F6] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-[#e5e2db]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e2db] bg-[#FAF9F6]">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#004c4c]">emoji_events</span>
            <h2 className="font-display text-xl font-bold text-[#004c4c]">
              {award ? 'Edit Award / Involvement' : 'Add Award / Involvement'}
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
          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => {
                const cat = e.target.value as any;
                setCategory(cat);
                if (cat === 'conference') setIcon('forum');
                else if (cat === 'award') setIcon('military_tech');
                else if (cat === 'course') setIcon('workspace_premium');
              }}
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#f7f9fc]"
            >
              <option value="conference">Conferences & Seminars</option>
              <option value="award">Awards & Scholarships</option>
              <option value="course">Course & Certification</option>
            </select>
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
              placeholder="e.g. HERO Call for Paper, UMY Scholarship, Advanced Econometrics"
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Organization / Provider
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Coursera / UMY / EdX"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Year / Period
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024 or 2022 - 2026"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full academic scholarship awarded based on merit and performance..."
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Primary Tag / Badge *
              </label>
              <input
                type="text"
                required
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. 2nd Place, Scholarship, Completed 2024"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Secondary Tag (Optional)
              </label>
              <input
                type="text"
                value={secondaryTag}
                onChange={(e) => setSecondaryTag(e.target.value)}
                placeholder="e.g. Research, Sustainability"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Icon Symbol
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#f7f9fc]"
            >
              <option value="military_tech">military_tech (Medal)</option>
              <option value="workspace_premium">workspace_premium (Badge / Certificate)</option>
              <option value="emoji_events">emoji_events (Trophy)</option>
              <option value="school">school (Graduation Cap)</option>
              <option value="public">public (Globe)</option>
              <option value="assured_workload">assured_workload (Institution)</option>
              <option value="history_edu">history_edu (Diploma)</option>
              <option value="analytics">analytics (Analytics)</option>
              <option value="eco">eco (Leaf)</option>
              <option value="description">description (Document)</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#d8dadd]">
            {award?.id ? (
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
                <span>{award ? 'Save Changes' : 'Add Item'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
