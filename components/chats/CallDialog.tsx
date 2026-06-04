"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type CallType = "audio" | "video";

type CallDialogProps = {
  type: CallType;
  chatId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function CallDialog({ type, chatId, isOpen, onClose }: CallDialogProps) {
  void chatId;

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
