"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import Image from "next/image";
import CallIcon from "../../icons/chats/CallIcon";
import VideoIcon from "../../icons/chats/VideoIcon";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import { ChatsService } from "@/service/chats/chats.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import MediaFilesDialog from "./MediaFilesDialog";
import MembersDialog from "./MembersDialog";
import CallScreen from "./CallScreen";

type ConversationDetailsProps = {
  chatId?: string;
  participantUserId?: string;
};

type Conversation = {
  id: string;
  title: string | null;
  avatar: string | null;
  type: "DM" | "GROUP";
  total_members: number;
  unread_messages: number;
  participant: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  } | null;
  is_silenced: boolean;
  muted_until: string | null;
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

function SeeMembersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05C16.19 13.89 17 14.99 17 16.5V19h5v-2.5C22 14.17 17.33 13 16 13Z" fill="#B2B5B8" />
    </svg>
  );
}

export default function ConversationDetails({ chatId, participantUserId }: ConversationDetailsProps) {
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeCall, setActiveCall] = useState<{
    type: "audio" | "video";
    isIncoming: boolean;
  } | null>(null);

  const fetchConversation = useCallback(async () => {
    if (!chatId && !participantUserId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const res = await ChatsService.getConversations({
        token,
        limit: 100,
        userId: participantUserId,
      });

      const conversations = Array.isArray(res?.data?.data) ? res.data.data : [];
      let found: Conversation | null = null;

      if (chatId) {
        found = conversations.find((c: Conversation) => c.id === chatId) || null;
      } else if (participantUserId) {
        found = conversations.find((c: Conversation) =>
          c.participant?.id === participantUserId
        ) || null;
      }

      setConversation(found);
    } catch (error) {
      setConversation(null);
    } finally {
      setIsLoading(false);
    }
  }, [chatId, participantUserId]);

  const handleDeleteConversation = useCallback(async () => {
    if (!conversation?.id) return;

    try {
      setIsDeleting(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      await ChatsService.deleteConversation({
        conversationId: conversation.id,
        token,
      });
      showSuccessToast("Conversation deleted successfully");
      router.push("/tutor-dashboard/chats");
    } catch (error: any) {
      showErrorToast(error?.message || "Failed to delete conversation");
    } finally {
      setIsDeleting(false);
    }
  }, [conversation?.id, router]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <div className="text-sm text-[#5F6CA0]">Loading...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <div className="text-sm text-[#5F6CA0]">Conversation not found</div>
      </div>
    );
  }

  const isGroup = conversation.type === "GROUP";
  const displayName = conversation.title || conversation.participant?.name || "Unknown";
  const displayAvatar = conversation.avatar || conversation.participant?.avatar;
  const initials = (displayName || "??")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/tutor-dashboard/chats"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Chat
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">
          {isGroup ? "Group" : conversation.participant?.username || displayName}
        </p>
      </div>
      <div className="flex items-start justify-center min-h-full p-6">
        <div className="w-full max-w-sm bg-[#0a1929] rounded-2xl p-6 mt-6">
          <div className="flex flex-col items-center mb-5">
            <div className="size-20 rounded-full overflow-hidden mb-3 ring-2 ring-[#1a2336] bg-[#5f6ca0] flex items-center justify-center text-white text-2xl font-bold">
              {displayAvatar ? (
                <Image
                  src={displayAvatar}
                  alt={displayName || "User Avatar"}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <h2 className="text-white font-semibold text-lg">{displayName}</h2>
            {isGroup ? (
              <p className="text-[#B2B5B8] text-sm">{conversation.total_members} members</p>
            ) : (
              <p className="text-[#B2B5B8] text-sm">@{conversation.participant?.username || "unknown"}</p>
            )}
          </div>

          <div className="flex justify-center gap-6 mb-5">
            <button
              onClick={() =>
                setActiveCall({ type: "audio", isIncoming: false })
              }
              className="flex flex-col items-center gap-1.5"
            >
              <div className="size-11 bg-[#17212c] rounded-xl flex items-center justify-center">
                <CallIcon />
              </div>
              <span className="text-[#B2B5B8] text-xs">Audio</span>
            </button>
            <button
              onClick={() =>
                setActiveCall({ type: "video", isIncoming: false })
              }
              className="flex flex-col items-center gap-1.5"
            >
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
              <span className="text-[#B2B5B8] text-xs">{isGroup ? "Group" : "Profile"}</span>
            </button>
          </div>

          <hr className="border-[#1a2336] mb-4" />

          {isGroup && (
            <>
              <div className="mb-4">
                <p className="text-[#B2B5B8] text-xs mb-3">Chat info</p>
                <MembersDialog chatId={chatId || ""} />
              </div>
              <hr className="border-[#1a2336] mb-4" />
            </>
          )}

          <div>
            <p className="text-[#B2B5B8] text-xs mb-3">Action</p>
            <div className="space-y-4">
              <MediaFilesDialog chatId={chatId || ""} />
              <button className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
                <ShareIcon />
                <span className="text-white text-sm">Share contact</span>
              </button>
              <button className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
                <ReportIcon />
                <span className="text-white text-sm">Report</span>
              </button>
              <button
                onClick={handleDeleteConversation}
                disabled={isDeleting}
                className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                <TrashIcon />
                <span className="text-[#E9201D] text-sm">
                  {isDeleting ? "Deleting..." : "Delete conversations"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {activeCall && (
        <CallScreen
          conversationId={chatId || ""}
          type={activeCall.type}
          isIncoming={activeCall.isIncoming}
          onCallEnd={() => setActiveCall(null)}
        />
      )}
    </div>
  );
}
