import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ExperienceItem } from '../../types';

interface EditExperienceModalProps {
  experience: ExperienceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  experience,
  isOpen,
  onClose,
}) => {
  const { addExperience, updateExperience, deleteExperience } = useData();

  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('');
  const [period, setPeriod] = useState('');
  const [category, setCategory] = useState<'research' | 'teaching' | 'leadership' | 'fellowship'>('teaching');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [icon, setIcon] = useState('school');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (experience) {
      setRole(experience.role || '');
      setOrganization(experience.organization || '');
      setLocation(experience.location || '');
      setPeriod(experience.period || '');
      setCategory(experience.category || 'teaching');
      setDescriptionInput(experience.description ? experience.description.join('\n') : '');
      setSkillsInput(experience.skills ? experience.skills.join(', ') : '');
      setIcon(experience.icon || 'school');
    } else {
      setRole('');
      setOrganization('');
      setLocation('Yogyakarta, Indonesia');
      setPeriod('2024 - Present');
      setCategory('teaching');
      setDescriptionInput('');
      setSkillsInput('Stata, Applied Econometrics, Panel Data');
      setIcon('school');
    }
  }, [experience, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const description = descriptionInput
        .split('\n')
        .map((d) => d.trim())
        .filter((d) => d.length > 0);

      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const expData: Omit<ExperienceItem, 'id'> = {
        role,
        organization,
        location,
        period,
        category,
        description,
        skills,
        icon,
      };

      if (experience?.id) {
        await updateExperience(experience.id, expData);
      } else {
        await addExperience(expData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!experience?.id) return;
    if (window.confirm('Delete this experience entry?')) {
      setSaving(true);
      try {
        await deleteExperience(experience.id);
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
            <span className="material-symbols-outlined text-[#004c4c]">work</span>
            <h2 className="font-display text-xl font-bold text-[#004c4c]">
              {experience ? 'Edit Experience Item' : 'Add Experience Item'}
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
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as any;
                  setCategory(cat);
                  if (cat === 'teaching') setIcon('school');
                  else if (cat === 'fellowship') setIcon('biotech');
                  else if (cat === 'leadership') setIcon('groups');
                  else setIcon('analytics');
                }}
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] bg-[#f7f9fc]"
              >
                <option value="teaching">Teaching & Lab</option>
                <option value="fellowship">International Fellowships</option>
                <option value="leadership">Academic Leadership</option>
                <option value="research">Research Appointments</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Period *
              </label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="2024 - Present or Aug 2025 - Oct 2025"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Role / Position Title *
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Graduate Research & Teaching Assistant"
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Organization / Department *
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Department of Economics, UMY"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Yogyakarta, Indonesia / Tainan, Taiwan"
                className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Key Responsibilities / Bullets (One per line) *
            </label>
            <textarea
              rows={4}
              required
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              placeholder="Conducted laboratory tutorial sessions for undergraduate Econometrics...&#10;Assisted 90+ students in mastering panel data..."
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004c4c] mb-1">
              Skills Acquired / Applied (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Stata, Applied Econometrics, Panel Data, Tutoring"
              className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#d8dadd]">
            {experience?.id ? (
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
                <span>{experience ? 'Save Changes' : 'Add Experience'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
