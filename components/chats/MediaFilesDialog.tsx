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

export default function MediaFilesDialog({ chatId, trigger }: MediaFilesDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMedia = useCallback(async () => {
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
    fetchMedia();
  }, [fetchMedia]);

  const mediaMessages = messages.filter(msg => 
    msg.kind === "FILE" && msg.attachments && msg.attachments.length > 0
  );

  const allImages = mediaMessages.flatMap(msg => 
    msg.attachments.map(att => ({
      url: att.file_path,
      name: att.file_name,
      date: msg.created_at,
      sender: msg.sender.name,
    }))
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
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-[#5F6CA0]">Loading...</div>
          ) : allImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 p-2">
              {allImages.map((image, index) => (
                <div key={`${image.url}-${index}`} className="group relative aspect-square rounded-lg overflow-hidden bg-[#17212c]">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    <p className="text-xs text-white truncate">{image.name}</p>
                    <p className="text-[10px] text-gray-300">
                      {formatDistanceToNow(new Date(image.date), { addSuffix: true })}
                    </p>
                  </div>
                  <a
                    href={image.url}
                    download
                    className="absolute top-2 right-2 p-1 bg-[#E9201D] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DownloadIcon />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[#5F6CA0]">No media files found</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}