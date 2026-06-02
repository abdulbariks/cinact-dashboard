"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChatsService } from "@/service/chats/chats.service";
import { parseCookies } from "nookies";

type MembersDialogProps = {
  chatId: string;
  trigger?: React.ReactNode;
};

type Member = {
  member_id: string;
  user_id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  role: string;
  is_me: boolean;
};

function SeeMembersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05C16.19 13.89 17 14.99 17 16.5V19h5v-2.5C22 14.17 17.33 13 16 13Z" fill="#B2B5B8" />
    </svg>
  );
}

export default function MembersDialog({ chatId, trigger }: MembersDialogProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!chatId) return;
    
    try {
      setIsLoading(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const res = await ChatsService.getConversationMembers({
        conversationId: chatId,
        token,
      });

      const membersData = Array.isArray(res?.data?.data) ? res.data.data : [];
      setMembers(membersData);
    } catch (error) {
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const initials = (name: string = "??") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
            <SeeMembersIcon />
            <span className="text-white text-sm">See members</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#0a1929] border-[#1a2336] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            Members ({members.length})
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-[#5F6CA0]">Loading...</div>
          ) : members.length > 0 ? (
            <div className="space-y-3 p-2">
              {members.map((member) => (
                <div 
                  key={member.member_id} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#17212c]"
                >
                  <div className="size-10 rounded-full overflow-hidden bg-[#5f6ca0] flex items-center justify-center text-white font-semibold">
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
                    <p className="text-xs text-[#B2B5B8]">
                      {member.username ? `@${member.username}` : member.role}
                    </p>
                  </div>
                  {member.role === "ADMIN" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E9201D] text-white">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[#5F6CA0]">No members found</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}