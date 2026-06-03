"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChatsService } from "@/service/chats/chats.service";
import { parseCookies } from "nookies";
import { formatDistanceToNow } from "date-fns";

type MediaFilesDialogProps = {
  chatId: string;
  trigger?: React.ReactNode;
};

type Message = {
  id: string;
  conversation_id: string;
  kind: string;
  content: string | { text?: string; reason?: string; status?: string; call_kind?: string; duration_seconds?: number | null };
  created_at: string;
  attachments: Array<{
    file_name: string;
    file_path: string;
    mime_type: string;
    type: string;
  }>;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

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

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type MessageAttachment = {
  url: string;
  name: string;
  date: string;
  sender: string;
  mime_type: string;
};

function ImageFileItem({ item }: { item: MessageAttachment }) {
  const isMediaItem = item.mime_type && (item.mime_type.startsWith("image/") || item.mime_type.startsWith("video/"));

  return (
    <div className="group relative aspect-square rounded-lg overflow-hidden bg-[#17212c] flex items-center justify-center">
      {isMediaItem ? (
        <Image
          src={item.url}
          alt={item.name}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <FileIcon />
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
        <p className="text-xs text-white truncate">{item.name}</p>
        <p className="text-[10px] text-gray-300">
          {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
        </p>
      </div>
      <a
        href={item.url}
        download
        className="absolute top-2 right-2 p-1 bg-[#E9201D] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <DownloadIcon />
      </a>
    </div>
  );
}

function FileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#B2B5B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2V8H20" stroke="#B2B5B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 13H8" stroke="#B2B5B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 17H8" stroke="#B2B5B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 9H9H8" stroke="#B2B5B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function MediaFilesDialog({ chatId, trigger }: MediaFilesDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"MEDIA" | "FILES">("MEDIA");

  const fetchMedia = useCallback(async (tab: "MEDIA" | "FILES") => {
    if (!chatId) return;

    try {
      setIsLoading(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const res = await ChatsService.getConversationById({
        id: chatId,
        token,
        limit: 100,
      });

      const messageData = Array.isArray(res?.data?.data) ? res.data.data : [];
      setMessages(messageData);
    } catch (error) {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMedia(activeTab);
  }, [fetchMedia, activeTab]);

  const mediaMessages = messages.filter(msg =>
    msg.kind === "FILE" && msg.attachments && msg.attachments.length > 0
  );

  const allItems = mediaMessages.flatMap(msg =>
    msg.attachments.map(att => ({
      url: att.file_path,
      name: att.file_name,
      date: msg.created_at,
      sender: msg.sender.name,
      mime_type: att.mime_type,
    }))
  );

  const isMedia = (mimeType: string) => {
    if (!mimeType) return false;
    return mimeType.startsWith("image/") || mimeType.startsWith("video/");
  };

  const filteredItems = allItems.filter(item =>
    activeTab === "MEDIA" ? isMedia(item.mime_type) : !isMedia(item.mime_type)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
            <MediaIcon />
            <span className="text-white text-sm">View media &amp; files</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#0a1929] border-[#1a2336] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Media & Files</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === "MEDIA"
                ? "bg-[#1a2336] text-white border border-[#2a3a56]"
                : "text-[#7a8ba8] hover:text-white"
            }`}
            onClick={() => setActiveTab("MEDIA")}
          >
            Media
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === "FILES"
                ? "bg-[#1a2336] text-white border border-[#2a3a56]"
                : "text-[#7a8ba8] hover:text-white"
            }`}
            onClick={() => setActiveTab("FILES")}
          >
            Files
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-[#5F6CA0]">Loading...</div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 p-2">
              {filteredItems.map((item, index) => (
                <ImageFileItem key={`${item.url}-${index}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[#5F6CA0]">
              {activeTab === "MEDIA" ? "No media found" : "No files found"}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}