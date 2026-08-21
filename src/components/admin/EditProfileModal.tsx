import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { PersonalInfo, QuantitativeTool, SkillItem, SocialLink } from '../../types';
import { ToolkitLogo } from '../ToolkitLogos';
import { ImageCropModal } from './ImageCropModal';

export type ProfileModalTab = 'photo' | 'bio' | 'education' | 'interests' | 'toolkit' | 'skills' | 'social';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ProfileModalTab;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'bio',
}) => {
  const { personalInfo, updatePersonalInfo } = useData();

  const [activeTab, setActiveTab] = useState<ProfileModalTab>(initialTab);
  const [formData, setFormData] = useState<PersonalInfo>(personalInfo);
  
  // Research interests local state
  const [interestInput, setInterestInput] = useState('');
  
  // Toolkit local state for adding/editing a tool
  const [newTool, setNewTool] = useState<QuantitativeTool>({
    name: '',
    desc: '',
    icon: 'code',
  });
  const [editingToolIndex, setEditingToolIndex] = useState<number | null>(null);

  // Skill local state for adding/editing a skill
  const [newSkill, setNewSkill] = useState<SkillItem>({
    id: '',
    title: '',
    icon: 'analytics',
    description: '',
  });
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  // Social link local state
  const [newSocial, setNewSocial] = useState<SocialLink>({
    name: '',
    handle: '',
    url: '',
    icon: 'link',
    desc: '',
  });
  const [editingSocialIndex, setEditingSocialIndex] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Interactive Image Cropper & Adjuster state
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Sync state whenever modal opens or personalInfo updates
  useEffect(() => {
    if (isOpen) {
      setFormData(personalInfo);
      setActiveTab(initialTab);
      setErrorMsg(null);
    }
  }, [isOpen, personalInfo, initialTab]);

  if (!isOpen) return null;

  // --- Profile Photo Upload & Resize Handler ---
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCropSourceImage(dataUrl);
        setCropModalOpen(true);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdjustCrop = (sourceUrl?: string) => {
    const target = sourceUrl || formData.avatarUrl;
    if (target) {
      setCropSourceImage(target);
      setCropModalOpen(true);
    }
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setFormData((prev) => ({ ...prev, avatarUrl: croppedDataUrl }));
    setCropModalOpen(false);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'MRH';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    if (parts.length >= 3)
      return (parts[0][0] + parts[1][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // --- Research Interests Handlers ---
  const handleAddInterest = () => {
    const trimmed = interestInput.trim();
    if (!trimmed) return;
    if (formData.researchInterests.includes(trimmed)) {
      setErrorMsg('This research interest already exists');
      return;
    }
    setFormData({
      ...formData,
      researchInterests: [...formData.researchInterests, trimmed],
    });
    setInterestInput('');
    setErrorMsg(null);
  };

  const handleRemoveInterest = (indexToRemove: number) => {
    setFormData({
      ...formData,
      researchInterests: formData.researchInterests.filter((_, idx) => idx !== indexToRemove),
    });
  };

  // --- Quantitative Toolkit Handlers ---
  const handleSaveTool = () => {
    if (!newTool.name.trim() || !newTool.desc.trim()) {
      setErrorMsg('Tool name and description are required.');
      return;
    }

    let updatedTools = [...(formData.quantitativeToolkit || [])];
    if (editingToolIndex !== null) {
      updatedTools[editingToolIndex] = { ...newTool };
    } else {
      updatedTools.push({ ...newTool });
    }

    setFormData({
      ...formData,
      quantitativeToolkit: updatedTools,
    });

    // Reset tool form
    setNewTool({ name: '', desc: '', icon: 'code' });
    setEditingToolIndex(null);
    setErrorMsg(null);
  };

  const handleEditTool = (index: number) => {
    setEditingToolIndex(index);
    setNewTool({ ...formData.quantitativeToolkit[index] });
  };

  const handleDeleteTool = (indexToDelete: number) => {
    setFormData({
      ...formData,
      quantitativeToolkit: formData.quantitativeToolkit.filter((_, idx) => idx !== indexToDelete),
    });
    if (editingToolIndex === indexToDelete) {
      setEditingToolIndex(null);
      setNewTool({ name: '', desc: '', icon: 'code' });
    }
  };

  // --- Skills Handlers ---
  const handleSaveSkill = () => {
    if (!newSkill.title.trim() || !newSkill.description.trim()) {
      setErrorMsg('Skill title and description are required.');
      return;
    }

    let updatedSkills = [...(formData.skills || [])];
    if (editingSkillId) {
      updatedSkills = updatedSkills.map((s) => (s.id === editingSkillId ? { ...newSkill } : s));
    } else {
      const id = newSkill.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      updatedSkills.push({ ...newSkill, id });
    }

    setFormData({
      ...formData,
      skills: updatedSkills,
    });

    setNewSkill({ id: '', title: '', icon: 'analytics', description: '' });
    setEditingSkillId(null);
    setErrorMsg(null);
  };

  const handleEditSkill = (skill: SkillItem) => {
    setEditingSkillId(skill.id);
    setNewSkill({ ...skill });
  };

  const handleDeleteSkill = (skillIdToDelete: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s.id !== skillIdToDelete),
    });
    if (editingSkillId === skillIdToDelete) {
      setEditingSkillId(null);
      setNewSkill({ id: '', title: '', icon: 'analytics', description: '' });
    }
  };

  // --- Social Links Handlers ---
  const handleSaveSocial = () => {
    if (!newSocial.name.trim() || !newSocial.url.trim()) {
      setErrorMsg('Social platform name and URL are required.');
      return;
    }

    let updated = [...(formData.socialLinks || [])];
    if (editingSocialIndex !== null) {
      updated[editingSocialIndex] = { ...newSocial };
    } else {
      updated.push({ ...newSocial });
    }

    setFormData({
      ...formData,
      socialLinks: updated,
    });

    setNewSocial({ name: '', handle: '', url: '', icon: 'link', desc: '' });
    setEditingSocialIndex(null);
    setErrorMsg(null);
  };

  const handleDeleteSocial = (index: number) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((_, idx) => idx !== index),
    });
  };

  // --- Submit Entire Personal Profile to Firestore ---
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      await updatePersonalInfo(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 900);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save profile. Please check permissions.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f7f9fc] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-white/80">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d8dadd] bg-[#f7f9fc] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl neumorphic-inset flex items-center justify-center text-[#004c4c]">
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#004c4c]">
                Home Page & Profile Admin Panel
              </h2>
              <p className="text-xs text-[#486363]">
                Manage Bio, Education, Research Interests, Quantitative Toolkit, and Skills.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-[#d8dadd] px-6 bg-[#f7f9fc] shrink-0 gap-1 sm:gap-2">
          {[
            { id: 'photo', label: 'Profile Picture', icon: 'account_circle' },
            { id: 'bio', label: 'Bio & Info', icon: 'person' },
            { id: 'education', label: 'Education', icon: 'school' },
            {
              id: 'interests',
              label: `Research Interests (${formData.researchInterests?.length || 0})`,
              icon: 'psychology_alt',
            },
            {
              id: 'toolkit',
              label: `Quantitative Toolkit (${formData.quantitativeToolkit?.length || 0})`,
              icon: 'terminal',
            },
            {
              id: 'skills',
              label: `Skills (${formData.skills?.length || 0})`,
              icon: 'bar_chart',
            },
            {
              id: 'social',
              label: `Social & Profiles (${formData.socialLinks?.length || 0})`,
              icon: 'share',
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ProfileModalTab)}
                className={`px-3 sm:px-4 py-3 text-xs md:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#004c4c] text-[#004c4c] bg-teal-50/40'
                    : 'border-transparent text-[#486363] hover:text-[#004c4c]'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveAll} className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 text-sm">
            {success && (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-[#004c4c] text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>All changes saved and synchronized to Firestore successfully!</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 0: PROFILE PICTURE / PHOTO */}
            {activeTab === 'photo' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-white/70 border border-gray-200 shadow-sm">
                  {/* Live Avatar Preview */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="w-36 h-36 md:w-44 md:h-44 rounded-full p-2 bg-[#f7f9fc] shadow-[-5px_-5px_12px_#ffffff,5px_5px_12px_#d1d9e6] flex items-center justify-center relative">
                      <div className="w-full h-full rounded-full overflow-hidden shadow-[inset_-3px_-3px_6px_#ffffff,inset_3px_3px_6px_#d1d9e6] flex items-center justify-center bg-[#e8eef3]">
                        {formData.avatarUrl ? (
                          <img
                            src={formData.avatarUrl}
                            alt={formData.name || 'Profile Picture'}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#004c4c] to-[#006666] text-white">
                            <span className="font-display font-bold text-3xl md:text-4xl tracking-wider">
                              {getInitials(formData.name)}
                            </span>
                            <span className="text-[10px] text-teal-100 uppercase tracking-widest mt-1">
                              Monogram
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-[#486363]">
                      {formData.avatarUrl ? 'Active Photo' : 'No Photo (Monogram)'}
                    </span>
                  </div>

                  {/* Actions & Upload Options */}
                  <div className="flex-grow space-y-4 text-left w-full">
                    <div>
                      <h4 className="font-headline text-base font-bold text-[#004c4c]">
                        Profile Picture Manager
                      </h4>
                      <p className="text-xs text-[#486363] leading-relaxed">
                        Upload a photo from your computer or phone, paste an image link, or remove your photo anytime.
                      </p>
                    </div>

                    {/* Action Buttons: Upload, Adjust & Remove */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleImageFileUpload}
                        className="hidden"
                        id="profile-picture-upload-input"
                      />

                      <label
                        htmlFor="profile-picture-upload-input"
                        className="px-4 py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                      >
                        <span className="material-symbols-outlined text-base">upload</span>
                        <span>Upload Photo from Device</span>
                      </label>

                      {formData.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => handleOpenAdjustCrop()}
                          className="px-3.5 py-2.5 rounded-xl bg-teal-50 text-[#004c4c] hover:bg-teal-100 border border-teal-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                          title="Drag to center face, zoom, or rotate"
                        >
                          <span className="material-symbols-outlined text-base">crop</span>
                          <span>Drag & Adjust Framing</span>
                        </button>
                      )}

                      {formData.avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                          <span>Remove Photo</span>
                        </button>
                      )}
                    </div>

                    {/* Image URL Input Field */}
                    <div className="space-y-1.5 pt-2">
                      <label className="block text-xs font-semibold text-[#004c4c]">
                        Or Set Direct Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.avatarUrl || ''}
                          onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                          placeholder="https://example.com/my-headshot.jpg"
                          className="flex-grow px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] font-mono"
                        />
                        {formData.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                            className="px-3 py-2 text-xs text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-200 cursor-pointer"
                            title="Clear URL"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-[#486363]">
                        Supports direct links from Unsplash, Google Drive, Imgur, Cloudinary, LinkedIn, GitHub, or any public host.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preset Quick Options */}
                <div className="p-5 rounded-2xl bg-[#f0f4f8] border border-gray-200 space-y-3">
                  <h5 className="font-semibold text-xs text-[#004c4c] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">palette</span>
                    <span>Quick Preset Avatars</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          avatarUrl:
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                        })
                      }
                      className="p-3 rounded-xl bg-white hover:bg-teal-50/50 border border-gray-200 text-left flex items-center gap-3 cursor-pointer transition-all"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                        alt="Academic Headshot"
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-xs text-[#191c1e]">Academic Headshot</p>
                        <p className="text-[10px] text-gray-500">Professional portrait</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          avatarUrl:
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
                        })
                      }
                      className="p-3 rounded-xl bg-white hover:bg-teal-50/50 border border-gray-200 text-left flex items-center gap-3 cursor-pointer transition-all"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                        alt="Classic Scholar"
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-xs text-[#191c1e]">Classic Scholar</p>
                        <p className="text-[10px] text-gray-500">Formal headshot</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-3 rounded-xl bg-white hover:bg-teal-50/50 border border-gray-200 text-left flex items-center gap-3 cursor-pointer transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#004c4c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {getInitials(formData.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-[#191c1e]">Initials Monogram</p>
                        <p className="text-[10px] text-gray-500">Clean typography badge</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: BIO & PERSONAL INFO */}
            {activeTab === 'bio' && (
              <div className="space-y-5">
                {/* Quick Avatar Bar in Bio Tab */}
                <div className="p-4 rounded-xl bg-white/70 border border-gray-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden neumorphic-inset flex items-center justify-center bg-[#e8eef3] shrink-0">
                      {formData.avatarUrl ? (
                        <img
                          src={formData.avatarUrl}
                          alt={formData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#004c4c] text-white flex items-center justify-center font-bold text-sm">
                          {getInitials(formData.name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[#191c1e]">Profile Picture</p>
                      <p className="text-[11px] text-[#486363]">
                        {formData.avatarUrl ? 'Custom photo set' : 'Initials monogram displayed'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('photo')}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 text-[#004c4c] hover:bg-teal-100 font-semibold text-xs border border-teal-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>Change / Upload Photo</span>
                    </button>
                    {formData.avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                      Full Academic Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                      Short Name / Brand Display
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shortName}
                      onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                    Headline Title (e.g. MS Economics Candidate | Applied Econometrics Researcher)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                      Academic Affiliation / Department
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.affiliation}
                      onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                      Primary Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                      Geographic Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                      Avatar Profile Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.avatarUrl || ''}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      placeholder="Upload in Profile Picture tab or paste URL"
                      className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                    Primary Academic Biography
                  </label>
                  <textarea
                    rows={5}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] resize-y"
                    placeholder="Provide your main research focus, educational background, methodology expertise..."
                  />
                </div>
              </div>
            )}

            {/* TAB 2: EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="neumorphic-inset-box p-5 space-y-4">
                  <h4 className="font-semibold text-xs text-[#004c4c] uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">school</span>
                    <span>Current Highest Degree & Academic Standing</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        Degree Title
                      </label>
                      <input
                        type="text"
                        value={formData.education.degree}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            education: { ...formData.education, degree: e.target.value },
                          })
                        }
                        placeholder="Master of Science in Economics"
                        className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        University / Institution
                      </label>
                      <input
                        type="text"
                        value={formData.education.institution}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            education: { ...formData.education, institution: e.target.value },
                          })
                        }
                        placeholder="Quaid-i-Azam University, Islamabad"
                        className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        Academic Period
                      </label>
                      <input
                        type="text"
                        value={formData.education.period}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            education: { ...formData.education, period: e.target.value },
                          })
                        }
                        placeholder="2023 – 2025"
                        className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        Academic Standing / GPA
                      </label>
                      <input
                        type="text"
                        value={formData.education.gpa}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            education: { ...formData.education, gpa: e.target.value },
                          })
                        }
                        placeholder="CGPA 3.84 / 4.00 (Distinction)"
                        className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#486363] mb-1">
                      Academic Specialization / Concentration
                    </label>
                    <input
                      type="text"
                      value={formData.education.focus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          education: { ...formData.education, focus: e.target.value },
                        })
                      }
                      placeholder="Applied Econometrics, Labor Economics, Institutional Economics"
                      className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RESEARCH INTERESTS */}
            {activeTab === 'interests' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-headline text-base font-bold text-[#004c4c]">
                    Research Interests & Fields
                  </h3>
                  <p className="text-xs text-[#486363]">
                    These appear as interactive badges on your home page and research overview.
                  </p>
                </div>

                {/* Add Interest Box */}
                <div className="neumorphic-card p-4 flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-grow w-full">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddInterest();
                        }
                      }}
                      placeholder="Type research topic (e.g. Spatial Econometrics, Microfinance)..."
                      className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Add Tag</span>
                  </button>
                </div>

                {/* Tag List */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#004c4c] block">
                    Current Research Interests ({formData.researchInterests.length}):
                  </span>
                  <div className="flex flex-wrap gap-2.5 p-4 neumorphic-inset-box rounded-xl">
                    {formData.researchInterests.length === 0 ? (
                      <span className="text-xs text-[#486363] italic">
                        No research interests added yet. Add one above.
                      </span>
                    ) : (
                      formData.researchInterests.map((interest, idx) => (
                        <div
                          key={idx}
                          className="neumorphic-card px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium text-[#004c4c]"
                        >
                          <span>{interest}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(idx)}
                            className="text-[#486363] hover:text-rose-600 cursor-pointer p-0.5 rounded transition-colors"
                            title="Remove interest"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Bulk Edit by Comma */}
                <div className="neumorphic-inset-box p-4 space-y-2">
                  <span className="text-xs font-bold text-[#004c4c] block uppercase tracking-wider">
                    Bulk Comma-Separated Editor
                  </span>
                  <textarea
                    rows={3}
                    value={formData.researchInterests.join(', ')}
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0);
                      setFormData({ ...formData, researchInterests: tags });
                    }}
                    placeholder="Applied Panel Econometrics, Labor Economics, Institutional Economics..."
                    className="w-full px-3 py-2 rounded-lg text-xs neumorphic-input text-[#191c1e]"
                  />
                  <p className="text-[11px] text-[#486363]">
                    Tip: Separate entries with commas. Changes automatically sync to the tags above.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: QUANTITATIVE TOOLKIT */}
            {activeTab === 'toolkit' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-headline text-base font-bold text-[#004c4c]">
                    Quantitative Software & Econometric Toolkit
                  </h3>
                  <p className="text-xs text-[#486363]">
                    Configure software tools displayed on the home page. Official logos (STATA, EViews, R, Python, SPSS) render automatically.
                  </p>
                </div>

                {/* Add / Edit Tool Card Form */}
                <div className="neumorphic-card p-5 space-y-4 border border-teal-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-[#004c4c] uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        {editingToolIndex !== null ? 'edit' : 'add_circle'}
                      </span>
                      <span>
                        {editingToolIndex !== null ? `Editing: ${newTool.name}` : 'Add New Software Tool'}
                      </span>
                    </h4>
                    {editingToolIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingToolIndex(null);
                          setNewTool({ name: '', desc: '', icon: 'code' });
                        }}
                        className="text-xs text-[#486363] hover:underline"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        Software / Tool Name
                      </label>
                      <input
                        type="text"
                        value={newTool.name}
                        onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                        placeholder="e.g. STATA, EViews, R, Python, SPSS, Julia"
                        className="w-full px-3 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        Methods & Packages Description
                      </label>
                      <input
                        type="text"
                        value={newTool.desc}
                        onChange={(e) => setNewTool({ ...newTool, desc: e.target.value })}
                        placeholder="e.g. Panel models, Fixed Effects, 2SLS IV"
                        className="w-full px-3 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#d8dadd]/60">
                    <div className="flex items-center gap-2 text-xs text-[#486363]">
                      <span>Live Logo Preview:</span>
                      <div className="p-1 rounded bg-white shadow-sm flex items-center justify-center">
                        <ToolkitLogo name={newTool.name || 'Tool'} className="w-6 h-6" />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveTool}
                      className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {editingToolIndex !== null ? 'check' : 'add'}
                      </span>
                      <span>{editingToolIndex !== null ? 'Update Tool' : 'Add to Toolkit'}</span>
                    </button>
                  </div>
                </div>

                {/* Existing Tools Grid */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#004c4c] uppercase tracking-wider block">
                    Current Toolkit Items ({formData.quantitativeToolkit?.length || 0}):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.quantitativeToolkit?.map((tool, index) => (
                      <div
                        key={index}
                        className="neumorphic-inset-box p-3.5 flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ToolkitLogo name={tool.name} className="w-8 h-8 shrink-0" />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-[#004c4c] truncate">{tool.name}</h5>
                            <p className="text-[11px] text-[#486363] truncate">{tool.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditTool(index)}
                            className="p-1 text-[#004c4c] hover:bg-slate-200/80 rounded cursor-pointer"
                            title="Edit Tool"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTool(index)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete Tool"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SKILLS SECTION */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-headline text-base font-bold text-[#004c4c]">
                    Skills & Methodological Competencies
                  </h3>
                  <p className="text-xs text-[#486363]">
                    Manage the 3-column skill cards displayed in the Skills section of your home page.
                  </p>
                </div>

                {/* Add / Edit Skill Form */}
                <div className="neumorphic-card p-5 space-y-4 border border-teal-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-[#004c4c] uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        {editingSkillId ? 'edit' : 'add_circle'}
                      </span>
                      <span>
                        {editingSkillId ? `Editing Skill: ${newSkill.title}` : 'Add New Skill Card'}
                      </span>
                    </h4>
                    {editingSkillId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSkillId(null);
                          setNewSkill({ id: '', title: '', icon: 'analytics', description: '' });
                        }}
                        className="text-xs text-[#486363] hover:underline"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        Skill Title
                      </label>
                      <input
                        type="text"
                        value={newSkill.title}
                        onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                        placeholder="e.g. Econometric Modeling"
                        className="w-full px-3 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        Icon (Material Symbol)
                      </label>
                      <input
                        type="text"
                        value={newSkill.icon}
                        onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                        placeholder="analytics, monitoring, table_chart, code..."
                        className="w-full px-3 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#486363] mb-1">
                      Skill Description
                    </label>
                    <textarea
                      rows={3}
                      value={newSkill.description}
                      onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                      placeholder="Detailed methodological description..."
                      className="w-full px-3.5 py-2 rounded-xl text-xs md:text-sm neumorphic-input text-[#191c1e] resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#d8dadd]/60">
                    <div className="flex items-center gap-2 text-xs text-[#486363]">
                      <span>Icon Preview:</span>
                      <div className="w-8 h-8 rounded-full neumorphic-inset flex items-center justify-center text-[#004c4c]">
                        <span className="material-symbols-outlined text-base">
                          {newSkill.icon || 'analytics'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveSkill}
                      className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {editingSkillId ? 'check' : 'add'}
                      </span>
                      <span>{editingSkillId ? 'Update Skill Card' : 'Add Skill Card'}</span>
                    </button>
                  </div>
                </div>

                {/* Existing Skills List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#004c4c] uppercase tracking-wider block">
                    Current Skill Cards ({formData.skills?.length || 0}):
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.skills?.map((skill) => (
                      <div
                        key={skill.id}
                        className="neumorphic-card p-4 flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="neumorphic-inset w-10 h-10 rounded-full flex items-center justify-center text-[#004c4c] shrink-0">
                            <span className="material-symbols-outlined text-lg">{skill.icon}</span>
                          </div>
                          <div>
                            <h5 className="font-bold text-xs md:text-sm text-[#004c4c]">
                              {skill.title}
                            </h5>
                            <p className="text-xs text-[#486363] line-clamp-2 mt-0.5">
                              {skill.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditSkill(skill)}
                            className="p-1 text-[#004c4c] hover:bg-slate-200 rounded cursor-pointer"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SOCIAL & ACADEMIC PROFILES */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-headline text-base font-bold text-[#004c4c]">
                    Social Media & Academic Profiles
                  </h3>
                  <p className="text-xs text-[#486363]">
                    Manage links for Google Scholar, GitHub, LinkedIn, ResearchGate, Twitter, and Email.
                  </p>
                </div>

                {/* Add / Edit Social Form */}
                <div className="neumorphic-card p-5 space-y-4 border border-teal-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={newSocial.name}
                        onChange={(e) => setNewSocial({ ...newSocial, name: e.target.value })}
                        placeholder="e.g. Google Scholar, LinkedIn, GitHub"
                        className="w-full px-3 py-2 rounded-xl text-xs neumorphic-input text-[#191c1e]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        Handle / Display Username
                      </label>
                      <input
                        type="text"
                        value={newSocial.handle}
                        onChange={(e) => setNewSocial({ ...newSocial, handle: e.target.value })}
                        placeholder="e.g. fahim-haider-econ"
                        className="w-full px-3 py-2 rounded-xl text-xs neumorphic-input text-[#191c1e]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#486363] mb-1">
                        Full Web URL
                      </label>
                      <input
                        type="url"
                        value={newSocial.url}
                        onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                        placeholder="https://scholar.google.com/..."
                        className="w-full px-3 py-2 rounded-xl text-xs neumorphic-input text-[#191c1e]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-[#d8dadd]/60">
                    <button
                      type="button"
                      onClick={handleSaveSocial}
                      className="px-4 py-2 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Add Social Link</span>
                    </button>
                  </div>
                </div>

                {/* Existing Social Links */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#004c4c] uppercase tracking-wider block">
                    Active Profiles ({formData.socialLinks?.length || 0}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.socialLinks?.map((link, idx) => (
                      <div
                        key={idx}
                        className="neumorphic-inset-box p-3.5 flex items-center justify-between gap-2"
                      >
                        <div>
                          <h5 className="font-bold text-xs text-[#004c4c]">{link.name}</h5>
                          <p className="text-[11px] text-[#486363] truncate">{link.handle || link.url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSocial(idx)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#d8dadd] bg-[#f7f9fc] shrink-0">
            <div className="text-xs text-[#486363] hidden sm:block">
              All edits update live in Firestore & sync across devices.
            </div>

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
                {saving && (
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                )}
                <span className="material-symbols-outlined text-sm">save</span>
                <span>Save All Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Interactive Image Cropper / Framing Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={cropSourceImage}
        onCropComplete={handleCropComplete}
        onClose={() => setCropModalOpen(false)}
      />
    </div>
  );
};
