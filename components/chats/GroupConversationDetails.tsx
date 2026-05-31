import React from "react";
import CallIcon from "../icons/chats/CallIcon";
import VideoIcon from "../icons/chats/VideoIcon";

type GroupConversationDetailsProps = {
  groupId?: string;
};

function GroupAvatarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05C16.19 13.89 17 14.99 17 16.5V19h5v-2.5C22 14.17 17.33 13 16 13Z" fill="white" opacity="0.85" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4Z" fill="#E9201D" />
      <path d="M5 11c0 3.866 3.134 7 7 7s7-3.134 7-7" stroke="#E9201D" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18v3M9 21h6" stroke="#E9201D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AddMemberIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="8" r="4" fill="#E9201D" />
      <path d="M2 20c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#E9201D" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 8v6M22 11h-6" stroke="#E9201D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SeeMembersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05C16.19 13.89 17 14.99 17 16.5V19h5v-2.5C22 14.17 17.33 13 16 13Z" fill="#B2B5B8" />
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

export default function GroupConversationDetails({ groupId }: GroupConversationDetailsProps) {
  return (
    <div className="flex items-start justify-center min-h-full bg-[#07121d] p-6">
      <div className="w-full max-w-sm bg-[#0a1929] rounded-2xl p-6 mt-6">
        {/* Title */}
        <h2 className="text-white font-semibold text-base mb-4">Group</h2>

        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-5">
          <div className="size-16 rounded-full bg-[#1a2a3a] flex items-center justify-center mb-3 ring-2 ring-[#1a2336]">
            <GroupAvatarIcon />
          </div>
          <h3 className="text-white font-semibold text-lg">1 YP A1-2025</h3>
          <p className="text-[#B2B5B8] text-xs mt-0.5">
            Created by{" "}
            <span className="text-[#4a9eff]">@cameron_williamson</span>
          </p>
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
              <AddMemberIcon />
            </div>
            <span className="text-[#B2B5B8] text-xs">Add</span>
          </button>
        </div>

        {/* Divider */}
        <hr className="border-[#1a2336] mb-4" />

        {/* Chat Info */}
        <div className="mb-4">
          <p className="text-[#B2B5B8] text-xs mb-3">Chat info</p>
          <button className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
            <SeeMembersIcon />
            <span className="text-white text-sm">See members</span>
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
