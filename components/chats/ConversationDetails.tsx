import React from "react";
import CallIcon from "../icons/chats/CallIcon";
import VideoIcon from "../icons/chats/VideoIcon";

type ConversationDetailsProps = {
  userId?: string;
};

function MuteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4Z" fill="#E9201D" />
      <path d="M5 11c0 3.866 3.134 7 7 7s7-3.134 7-7" stroke="#E9201D" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18v3M9 21h6" stroke="#E9201D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="4" fill="#E9201D" />
      <path d="M4 21c0-4 3.582-7 8-7s8 3 8 7" stroke="#E9201D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill="#B2B5B8" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill="#B2B5B8" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill="#B2B5B8" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#B2B5B8" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" stroke="#B2B5B8" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="3" stroke="#B2B5B8" strokeWidth="1.5" />
      <circle cx="18" cy="19" r="3" stroke="#B2B5B8" strokeWidth="1.5" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" stroke="#B2B5B8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Z" stroke="#B2B5B8" strokeWidth="1.5" />
      <path d="M12 8v4M12 16h.01" stroke="#B2B5B8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#E9201D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke="#E9201D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ConversationDetails({ userId }: ConversationDetailsProps) {
  return (
    <div className="flex items-start justify-center min-h-full bg-[#07121d] p-6">
      <div className="w-full max-w-sm bg-[#0a1929] rounded-2xl p-6 mt-6">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-5">
          <div className="size-20 rounded-full overflow-hidden mb-3 ring-2 ring-[#1a2336] bg-[#5f6ca0] flex items-center justify-center text-white text-2xl font-bold">
            C
          </div>
          <h2 className="text-white font-semibold text-lg">Cameron Williamson</h2>
          <p className="text-[#B2B5B8] text-sm">@cameron_williamson</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex justify-center gap-6 mb-5">
          <button className="flex flex-col items-center gap-1.5">
            <div className="size-11 bg-[#17212c] rounded-xl flex items-center justify-center">
              <CallIcon />
            </div>
            <span className="text-[#B2B5B8] text-xs">Audio</span>
          </button>
          <button className="flex flex-col items-center gap-1.5">
            <div className="size-11 bg-[#17212c] rounded-xl flex items-center justify-center">
              <VideoIcon />
            </div>
            <span className="text-[#B2B5B8] text-xs">Video</span>
          </button>
          <button className="flex flex-col items-center gap-1.5">
            <div className="size-11 bg-[#17212c] rounded-xl flex items-center justify-center">
              <MuteIcon />
            </div>
            <span className="text-[#B2B5B8] text-xs">Mute</span>
          </button>
          <button className="flex flex-col items-center gap-1.5">
            <div className="size-11 bg-[#17212c] rounded-xl flex items-center justify-center">
              <ProfileIcon />
            </div>
            <span className="text-[#B2B5B8] text-xs">Profile</span>
          </button>
        </div>

        {/* Divider */}
        <hr className="border-[#1a2336] mb-4" />

        {/* Actions List */}
        <div>
          <p className="text-[#B2B5B8] text-xs mb-3">Action</p>
          <div className="space-y-4">
            <button className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
              <MediaIcon />
              <span className="text-white text-sm">View media &amp; files</span>
            </button>
            <button className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
              <ShareIcon />
              <span className="text-white text-sm">Share contact</span>
            </button>
            <button className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
              <ReportIcon />
              <span className="text-white text-sm">Report</span>
            </button>
            <button className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
              <TrashIcon />
              <span className="text-[#E9201D] text-sm">Delete conversations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
