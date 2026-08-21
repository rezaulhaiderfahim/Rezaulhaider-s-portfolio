import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface AdminBarProps {
  onOpenProfileModal: () => void;
  onOpenNewPublicationModal: () => void;
  onOpenNewTimelineModal: () => void;
  onOpenNewAwardModal: () => void;
  onOpenNewExperienceModal: () => void;
  onOpenDashboard: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  onOpenProfileModal,
  onOpenNewPublicationModal,
  onOpenNewTimelineModal,
  onOpenNewAwardModal,
  onOpenNewExperienceModal,
  onOpenDashboard,
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { messages = [] } = useData();

  if (!isAdmin) return null;

  const unreadCount = (messages || []).filter((m) => !m?.read).length;

  return (
    <div className="w-full bg-[#004c4c] text-white px-4 py-2 text-xs sticky top-0 z-50 shadow-md border-b border-teal-800">
      <div className="max-w-[1140px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold tracking-wider uppercase">Admin Mode:</span>
          <span className="text-teal-200 font-mono hidden sm:inline">
            {currentUser?.email}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenDashboard}
            className="px-2.5 py-1 rounded bg-teal-800 hover:bg-teal-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span>Admin Panel</span>
          </button>

          <button
            onClick={onOpenProfileModal}
            className="px-2.5 py-1 rounded bg-teal-800 hover:bg-teal-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">person</span>
            <span className="hidden md:inline">Edit Profile</span>
          </button>

          <button
            onClick={onOpenNewPublicationModal}
            className="px-2.5 py-1 rounded bg-teal-800 hover:bg-teal-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Paper</span>
          </button>

          <button
            onClick={onOpenNewExperienceModal}
            className="px-2.5 py-1 rounded bg-teal-800 hover:bg-teal-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer hidden sm:flex"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Experience</span>
          </button>

          <button
            onClick={onOpenDashboard}
            className="px-2.5 py-1 rounded bg-teal-800 hover:bg-teal-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer relative"
          >
            <span className="material-symbols-outlined text-sm">mail</span>
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => logout()}
            className="px-2 py-1 rounded hover:bg-rose-900/60 text-rose-200 transition-colors flex items-center gap-1 cursor-pointer ml-1"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
