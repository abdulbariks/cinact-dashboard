"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pencil, Search } from "lucide-react";

import { conversations } from "@/components/chats/chat-data";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import EditIcon from "../icons/chats/EditIcon";
import SearchIcon from "../icons/SuperAdmindashboard/SearchIcon";
import FilterIcon2 from "../icons/chats/FilterIcon2";
import { parseCookies } from "nookies";
import { ChatsService } from "@/service/chats/chats.service";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export default function ChatSidebar() {
  const pathname = usePathname();
  const [conversations, setConversations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "DM" | "GROUP">("all");

  // console.log("conversations==============", conversations);

  // Fetch real data
  useEffect(() => {
    const loadData = async () => {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const res = await ChatsService.getConversations({ token });
      // console.log("res============", res);
      setConversations(res?.data);
    };
    loadData();
  }, []);

  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      // Logic for title based on type
      const displayTitle = item.type === "DM" ? item.receiverTitle : item.title;
      const matchTab = activeTab === "all" ? true : item.type === activeTab;
      const matchSearch = (displayTitle || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [activeTab, search, conversations]);

  // Helper to get last message preview
  const getLastMessage = (item: any) => {
    const lastMsg = item.messages?.[0];
    if (!lastMsg) return "No messages yet";
    if (lastMsg.kind === "IMAGE") return "📷 Photo";
    return lastMsg.content?.text || "Attachment";
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl bg-[#0a1726] p-5 text-card-foreground">
      <div className=" flex items-center justify-between">
        <h2 className="text-lg text-white font-medium ">Conversations</h2>
        <button
          type="button"
          aria-label="Edit conversations"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <EditIcon />
        </button>
      </div>

      <div className=" flex items-center gap-2 my-5">
        <div className="relative  flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="pl-12 pr-4 py-3.5 w-full border border-[#3D4566] rounded-full placeholder:text-[#3D4566] text-white"
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className=" cursor-pointer">
          <FilterIcon2 />
        </button>
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={(v) => setActiveTab(v as any)}
        className="gap-4"
      >
        <TabsList className="grid h-auto w-full grid-cols-3 bg-transparent p-1 gap-1.5">
          {["all", "DM", "GROUP"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="text-sm font-normal text-[#B2B5B8] data-[state=active]:text-white data-[state=active]:bg-[#E9201D] cursor-pointer rounded-full py-1.5 border border-[#1F283D] capitalize"
            >
              {tab === "DM" ? "Messages" : tab.toLowerCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((item) => {
            const displayTitle =
              item.type === "DM" ? item.receiverTitle : item.title;
            const initials = (displayTitle || "??")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const avatar = item.otherUserAvatar || item.participant?.avatar;

            return (
              <Link
                key={item.id}
                href={`/dashboard/chats/${item.id}`}
                className={cn(
                  "flex w-full items-start gap-2.5 text-left transition-colors pt-4 px-3 rounded-[10px]",
                  pathname?.includes(item.id)
                    ? "bg-[#5f6ca0]/40"
                    : "bg-transparent hover:bg-[#5f6ca0]/20",
                )}
              >
                <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1a2336] border border-[#1F283D] overflow-hidden">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={displayTitle || "User Avatar"}
                      fill
                      className="object-cover"
                      sizes="44px"
                      unoptimized
                    />
                  ) : (
                    <span className="text-sm font-semibold text-white">
                      {initials}
                    </span>
                  )}
                </div>

                <div
                  className={cn(
                    "min-w-0 flex-1 pb-4",
                    pathname?.includes(item.id)
                      ? "border-0"
                      : "border-b border-[#121D2D]",
                  )}
                >
                  <div className="mb-0.5 flex items-center justify-between gap-3">
                    <p className="text-base text-white font-medium truncate">
                      {displayTitle || "Unknown"}
                    </p>
                    <span className="shrink-0 text-[10px] text-[#777980]">
                      {item.updatedAt
                        ? formatDistanceToNow(new Date(item.updatedAt), {
                            addSuffix: false,
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="truncate text-sm text-[#B2B5B8]">
                    {getLastMessage(item)}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-10 text-center text-sm text-[#5F6CA0]">
            No conversations found.
          </div>
        )}
      </div>
    </aside>
  );
}
