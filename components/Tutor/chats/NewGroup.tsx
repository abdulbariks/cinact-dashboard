"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { parseCookies } from "nookies";
import { ChatsService } from "@/service/chats/chats.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  type: string;
}

const getAvatarText = (name: string) => {
  return name.replace(/\s+/g, "").slice(0, 2).toUpperCase();
};

export default function NewGroup() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await ChatsService.getAllUsers({ token });

      if (response?.data?.success) {
        const allData: User[] = response.data.data;
        setUsers(allData);
      }
    } catch (error: any) {
      showErrorToast("Failed to fetch users for group");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const selectedUsers = users.filter((user) =>
    selectedUserIds.includes(user.id),
  );

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUserIds.length < 2) {
      showErrorToast(
        "Please provide a group name and select at least 2 members.",
      );
      return;
    }

    const payload = {
      type: "GROUP",
      title: groupName,
      participant_ids: selectedUserIds,
    };

    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      const response = await ChatsService.createDM({
        data: payload,
        token,
      });

      showSuccessToast("Group created successfully!");
      const newChatId = response?.data?.data?.id;
      router.push(`/tutor-dashboard/chats/${newChatId}`);
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          "An error occurred while creating the group",
      );
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.name || user.email || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

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
        <p className="text-base font-medium text-[#8D9CDC]">New Group</p>
      </div>

      <div className=" p-8 bg-[#0a1726] rounded-2xl max-w-173.75 h-[80vh]  mx-auto mt-10">
        <div className="flex items-center justify-between pb-4 border-b border-[#141B34]">
          <h2 className="text-2xl text-white font-semibold">New Group</h2>
          {selectedUserIds.length >= 2 && (
            <button
              type="button"
              onClick={handleCreateGroup}
              className="text-sm text-white rounded-full bg-[#E9201D] px-4 py-2 cursor-pointer"
            >
              Create
            </button>
          )}
        </div>

        <div className="relative mt-4 mb-5">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#3D4566] ">
            Group Name:
          </span>
          <input
            className="pl-28  pr-4 py-3.5 w-full border border-[#3D4566] rounded-[12px] placeholder:text-[#8C9196] placeholder:text-sm text-white"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />
        </div>

        <div className="relative mt-4 mb-5">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#3D4566] ">
            <SearchIcon />
          </div>
          <input
            className="pl-11  pr-4 py-3.5 w-full border border-[#3D4566] rounded-full placeholder:text-[#3D4566] placeholder:text-sm text-white"
            type="text"
            placeholder="Search members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {selectedUsers.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {selectedUsers.map((user) => (
              <div key={user.id} className="relative">
                <span className="size-10 rounded-full bg-[#1a2336] text-white text-xs font-semibold grid place-items-center border border-[#3D4566]">
                  {getAvatarText(user.name || "Unknown User")}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleUser(user.id)}
                  className="absolute -top-1 -right-1 inline-grid size-4 place-items-center rounded-full bg-[#8D9CDC] text-white hover:opacity-90 cursor-pointer"
                  aria-label={`Remove ${user.name}`}
                >
                  <X className="size-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className=" text-sm text-[#B2B5B8] my-4">Suggested</p>

        <div className="max-h-[40vh] overflow-y-auto pr-1 space-y-4">
          {isLoading ? (
            <p className="text-center text-[#3D4566] py-10">Loading users...</p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers?.map((user) => {
              const isChecked = selectedUserIds.includes(user.id);
              return (
                <label
                  key={user.id}
                  className="w-full flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-left py-1 text-sm text-[#E6E7E8]">
                    <span className="size-9 rounded-full bg-[#1a2336] text-white text-xs font-semibold grid place-items-center">
                      {getAvatarText(user.name || "Unknown User")}
                    </span>
                    <span>{user.name}</span>
                  </div>

                  <span className="relative inline-grid place-items-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleUser(user.id)}
                      className="peer size-5 appearance-none rounded-full border border-[#5F6CA0] bg-transparent checked:border-[#8D9CDC] checked:bg-[#8D9CDC] cursor-pointer"
                    />
                    {isChecked && (
                      <Check className="pointer-events-none absolute size-3 text-white" />
                    )}
                  </span>
                </label>
              );
            })
          ) : (
            <p className="text-center text-[#3D4566] py-10">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
