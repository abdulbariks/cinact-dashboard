"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type CallType = "audio" | "video";

type CallDialogProps = {
  type: CallType;
  chatId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function CallDialog({ type, chatId, isOpen, onClose }: CallDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-[#0a1929] border-[#1a2336] text-white max-w-md"
        hideCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            {type === "audio" ? "Audio call" : "Video call"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-6 text-center">
            <p className="text-white">
              Call functionality is handled directly in the chat interface.
              Use the call buttons in the header to start a call.
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="p-3 rounded-full border border-[#1a2336] text-sm text-white hover:bg-[#1a2336] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
    };

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, [isOpen, chatId]);

  const handleStartCall = async () => {
    try {
      setIsConnecting(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      await ChatsService.startCall({
        conversationId: chatId,
        token,
        data: {
          kind: getCallKind(type),
        },
      });

      onClose();
    } catch (error) {
      console.error("Failed to start call", error);
      showErrorToast("Failed to start call");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-[#0a1929] border-[#1a2336] text-white max-w-md"
        hideCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-[#5F6CA0]">Loading members...</div>
          ) : (
            <div className="max-h-[40vh] overflow-y-auto custom-scrollbar space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#17212c]"
                >
                  <div className="relative size-10 rounded-full overflow-hidden bg-[#5f6ca0] flex items-center justify-center text-white font-semibold">
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                        unoptimized
                      />
                    ) : (
                      <span className="text-sm">{initials(member.name)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {member.name}
                    </p>
                    {member.role && (
                      <p className="text-[10px] text-[#B2B5B8] uppercase">{member.role}</p>
                    )}
                  </div>
                </div>
              ))}

              {members.length === 0 && (
                <div className="p-4 text-center text-xs text-[#5F6CA0]">No members to call</div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-full border border-[#1a2336] text-sm text-white hover:bg-[#1a2336] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartCall}
              disabled={isConnecting || members.length === 0}
              className="flex-1 h-10 rounded-full bg-[#E9201D] text-sm text-white hover:bg-[#c71b18] transition-colors disabled:opacity-50"
            >
              {isConnecting ? "Starting..." : `Start ${type === "audio" ? "Audio" : "Video"} Call`}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
