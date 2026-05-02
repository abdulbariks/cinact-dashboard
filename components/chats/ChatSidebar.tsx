"use client";

import React, { useMemo, useState } from "react";
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

export default function ChatSidebar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "teacher" | "student" | "groups"
  >("all");

  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      const matchTab =
        activeTab === "all"
          ? true
          : activeTab === "groups"
            ? item.type === "group"
            : item.type === activeTab;

      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

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
            name=""
            id=""
            placeholder="Search conversations..."
          />
        </div>

        <button className=" cursor-pointer">
          <FilterIcon2 />
        </button>
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={(value) =>
          setActiveTab(value as "all" | "teacher" | "student" | "groups")
        }
        className="gap-4"
      >
        <TabsList className="grid h-auto w-full grid-cols-4  bg-transparent p-1 gap-1.5">
          <TabsTrigger
            className="text-sm font-normal text-[#B2B5B8] data-[state=active]:font-medium data-[state=active]:text-white data-[state=active]:bg-[#E9201D] cursor-pointer rounded-full py-1.5 px-4 border border-[#1F283D]"
            value="all"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            className="text-sm font-normal text-[#B2B5B8] data-[state=active]:font-medium data-[state=active]:text-white data-[state=active]:bg-[#E9201D] cursor-pointer rounded-full py-1.5 px-4 border border-[#1F283D]"
            value="teacher"
          >
            Teacher
          </TabsTrigger>
          <TabsTrigger
            className="text-sm font-normal text-[#B2B5B8] data-[state=active]:font-medium data-[state=active]:text-white data-[state=active]:bg-[#E9201D] cursor-pointer rounded-full py-1.5 px-4 border border-[#1F283D]"
            value="student"
          >
            Student
          </TabsTrigger>
          <TabsTrigger
            className="text-sm font-normal text-[#B2B5B8] data-[state=active]:font-medium data-[state=active]:text-white data-[state=active]:bg-[#E9201D] cursor-pointer rounded-full py-1.5 px-4 border border-[#1F283D]"
            value="groups"
          >
            Groups
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/chats/${item.id}`}
              className={cn(
                "flex w-full items-start gap-2.5   text-left transition-colors  pt-4 px-3 rounded-[10px]  ",
                pathname?.endsWith(`/chats/${item.id}`)
                  ? "bg-[#5f6ca0]/70"
                  : "bg-transparent hover:bg-[#5f6ca0]/20 ",
              )}
            >
              <div
                className={`relative flex size-11 shrink-0 items-center justify-center rounded-full   bg-[#1a2336] text-sm font-semibold text-white ${item.status === "online" ? " border border-[#E9201D]" : "border-0 "}`}
              >
                {item.name
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")}
                {item.status === "online" ? (
                  <span className="absolute bottom-1 right-1 size-1.5 rounded-full   bg-emerald-500" />
                ) : (
                  <span className="absolute -bottom-1 -right-1 rounded-full border border-[#505B86]   px-1.5 py-0.5 text-[8px] text-[#00FA26]  leading-none shadow-sm whitespace-nowrap">
                    {item.lastActive ?? "Inactive"}
                  </span>
                )}
              </div>
              <div
                className={`min-w-0 flex-1  pb-4 ${pathname?.endsWith(`/chats/${item.id}`) ? "border-0" : "border-b border-[#121D2D]"} `}
              >
                <div className="mb-0.5 flex items-center justify-between gap-3">
                  <p className="text-base text-white font-medium">
                    {item.name}
                  </p>
                  <span className="shrink-0 text-xs text-[#777980]">
                    {item.time}
                  </span>
                </div>
                <p className="truncate text-sm text-[#B2B5B8]">
                  {item.lastMessage}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
            No conversations found.
          </div>
        )}
      </div>
    </aside>
  );
}
