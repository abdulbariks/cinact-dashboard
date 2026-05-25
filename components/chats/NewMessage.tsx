"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { ChatsService } from "@/service/chats/chats.service";

type DiscoverUserType = "student" | "teacher" | "admin";

interface User {
  id: string;
  username: string | null;
  name: string | null;
  avatar: string | null;
}

interface UsersByType {
  student: User[];
  teacher: User[];
  admin: User[];
}

interface CursorByType {
  student: string | null;
  teacher: string | null;
  admin: string | null;
}

const USER_TYPES: { label: string; value: DiscoverUserType }[] = [
  { label: "Students", value: "student" },
  { label: "Teachers", value: "teacher" },
  { label: "Admins", value: "admin" },
];

const getAvatarText = (name: string) => {
  return name.replace(/\s+/g, "").slice(0, 2).toUpperCase();
};

export default function NewMessage() {
  const [activeType, setActiveType] = useState<DiscoverUserType>("student");
  const [usersByType, setUsersByType] = useState<UsersByType>({
    student: [],
    teacher: [],
    admin: [],
  });
  const [cursorByType, setCursorByType] = useState<CursorByType>({
    student: null,
    teacher: null,
    admin: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const fetchUsers = useCallback(
    async ({
      type,
      search,
      cursor,
      append = false,
    }: {
      type: DiscoverUserType;
      search: string;
      cursor?: string | null;
      append?: boolean;
    }) => {
      try {
        append ? setIsLoadingMore(true) : setIsLoading(true);

        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await ChatsService.getAllUsers({
          token,
          search,
          type,
          limit: 10,
          cursor: cursor || "",
        });

        if (response?.data?.success) {
          const discoveredUsers = response.data.data || [];
          const nextCursor = response.data.meta_data?.next_cursor || null;

          setUsersByType((previous) => ({
            ...previous,
            [type]: append
              ? [...previous[type], ...discoveredUsers]
              : discoveredUsers,
          }));
          setCursorByType((previous) => ({
            ...previous,
            [type]: nextCursor,
          }));
        }
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.data?.message ||
            "Failed to load users",
        );
      } finally {
        append ? setIsLoadingMore(false) : setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers({
        type: activeType,
        search: searchQuery,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [activeType, fetchUsers, searchQuery]);

  const handleLoadMore = () => {
    const nextCursor = cursorByType[activeType];

    if (!nextCursor || isLoadingMore) return;

    fetchUsers({
      type: activeType,
      search: searchQuery,
      cursor: nextCursor,
      append: true,
    });
  };

  const handleCreateDM = async (userId: string) => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const payload = {
        type: "DM",
        participant_id: userId,
      };

      const response = await ChatsService.createDM({
        data: payload,
        token,
      });

      showSuccessToast("Conversation started");
      const chatId = response?.data?.id;
      router.push(`/dashboard/chats/${chatId}`);
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Failed to start conversation",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const renderUserItem = (user: User) => (
    <button
      key={user.id}
      onClick={() => handleCreateDM(user.id)}
      disabled={isCreating}
      className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-[#E6E7E8] transition-colors hover:bg-[#1a2336] disabled:opacity-50"
    >
      <span className="size-9 shrink-0 rounded-full border border-[#3D4566] bg-[#1a2336] text-white text-xs font-semibold grid place-items-center">
        {getAvatarText(user.name || user.username || "UN")}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium">
          {user.name || "Unknown User"}
        </span>
        {user.username && (
          <span className="truncate text-[10px] text-[#5F6CA0]">
            @{user.username}
          </span>
        )}
      </div>
    </button>
  );

  const users = usersByType[activeType];
  const activeLabel =
    USER_TYPES.find((userType) => userType.value === activeType)?.label ||
    "Users";

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard/chats"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Chat
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">New Message</p>
      </div>

      <div className="p-8 bg-[#0a1726] rounded-2xl max-w-175 min-h-[70vh] mx-auto">
        <h2 className="text-2xl text-white font-semibold pb-4 border-b border-[#141B34]">
          New Message
        </h2>

        <div className="relative mt-4 mb-5">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#3D4566]">
            To:
          </span>
          <input
            className="pl-12 pr-4 py-3.5 w-full border border-[#3D4566] bg-transparent rounded-full placeholder:text-[#8C9196] text-white outline-none focus:border-[#E9201D]"
            type="text"
            placeholder="Search users"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <Link
          href="/dashboard/create-group"
          className="block w-full text-center text-sm text-white font-medium rounded-xl bg-[#E9201D] py-4 hover:bg-[#cc1c1a] transition-colors"
        >
          Create Group Chat
        </Link>

        <p className="text-sm text-[#B2B5B8] my-4">Suggested</p>

        <Tabs
          value={activeType}
          onValueChange={(value) => setActiveType(value as DiscoverUserType)}
        >
          <TabsList className="grid h-auto grid-cols-3 bg-transparent p-1 gap-1.5">
            {USER_TYPES.map((userType) => (
              <TabsTrigger
                key={userType.value}
                value={userType.value}
                className="text-sm text-[#B2B5B8] data-[state=active]:text-white data-[state=active]:bg-[#3d4566] rounded-full py-1.5 border border-[#1F283D]"
              >
                {userType.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
            {USER_TYPES.map((userType) => (
              <TabsContent
                key={userType.value}
                value={userType.value}
                className="space-y-2"
              >
                {isLoading && activeType === userType.value ? (
                  <p className="py-4 text-center text-sm text-[#B2B5B8]">
                    Loading users...
                  </p>
                ) : users.length ? (
                  <>
                    {users.map(renderUserItem)}
                    {cursorByType[activeType] && (
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="mt-3 w-full rounded-lg border border-[#3D4566] py-2 text-sm font-medium text-[#E6E7E8] transition-colors hover:bg-[#1a2336] disabled:opacity-50"
                      >
                        {isLoadingMore ? "Loading..." : "Load more"}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="py-4 text-center text-sm text-[#B2B5B8]">
                    No {activeLabel.toLowerCase()} found
                  </p>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}