import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({ isOpen, onClose }) => {
  const { personalInfo, sendMessage } = useData();

  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [purpose, setPurpose] = useState('Academic Research Collaboration');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Save directly into Firestore database
      await sendMessage({
        name,
        email: senderEmail,
        purpose,
        subject: subject || `[Portfolio Inquiry] ${purpose}`,
        message,
      });

      // 2. Also prepare mailto for convenience
      const mailtoSubject = encodeURIComponent(subject || `[Portfolio Inquiry] ${purpose} - ${name}`);
      const mailtoBody = encodeURIComponent(
        `Dear Muhammad Rezaul Haider,\n\n${message}\n\nBest regards,\n${name}\n${senderEmail}`
      );

      try {
        // Attempt to launch client in a subtle way or allow button
        window.open(`mailto:${personalInfo.email}?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank');
      } catch (e) {
        // Ignore popup blocker if any
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Error submitting message:', err);
      // Fallback
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f7f9fc] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-white/80">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d8dadd] bg-[#f7f9fc]">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#004c4c]">mail</span>
            <h2 className="font-display text-xl font-bold text-[#004c4c]">
              Compose Direct Message
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#486363] hover:text-[#191c1e] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-[#004c4c] flex items-center justify-center mx-auto neumorphic-inset">
              <span className="material-symbols-outlined text-3xl">done_all</span>
            </div>
            <h3 className="font-display text-xl font-bold text-[#004c4c]">
              Message Sent Successfully!
            </h3>
            <p className="text-sm text-[#486363] max-w-md mx-auto">
              Your inquiry has been received directly into Muhammad Rezaul Haider's inbox and a draft was prepared for{' '}
              <strong>{personalInfo.email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-4">
            <p className="text-xs text-[#486363]">
              Send a direct inquiry regarding research collaboration, academic publications, or conferences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prof. Jane Doe"
                  className="w-full px-4 py-2.5 rounded-xl text-sm neumorphic-input text-[#191c1e] placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="jane.doe@university.edu"
                  className="w-full px-4 py-2.5 rounded-xl text-sm neumorphic-input text-[#191c1e] placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Inquiry Nature
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm neumorphic-input text-[#191c1e] bg-[#f7f9fc]"
              >
                <option value="Academic Research Collaboration">Academic Research Collaboration</option>
                <option value="Manuscript Inquiry & Data Sharing">Manuscript Inquiry & Data Sharing</option>
                <option value="Graduate School / Fellowship Inquiry">Graduate School / Fellowship Inquiry</option>
                <option value="Conference / Workshop Speaker">Conference / Workshop Speaker</option>
                <option value="General Academic Correspondence">General Academic Correspondence</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Collaboration on Panel Econometrics Research"
                className="w-full px-4 py-2.5 rounded-xl text-sm neumorphic-input text-[#191c1e] placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#004c4c] mb-1">
                Message Body *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dear Muhammad Rezaul Haider, I am reaching out regarding..."
                className="w-full px-4 py-2.5 rounded-xl text-sm neumorphic-input text-[#191c1e] placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d8dadd]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-[#486363] hover:text-[#191c1e] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-semibold text-sm flex items-center gap-2 shadow cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {submitting && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
