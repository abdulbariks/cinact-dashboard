"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow"; // Ensure correct path
import { useRouter } from "next/navigation";
import { ChatsService } from "@/service/chats/chats.service";

// interface User {
//   id: string;
//   name: string | null;
//   email: string;
//   role_users: { role: { name: string } }[];
// }

interface User {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  avatar_url: string | null;
  status: string;
  type: "student" | "teacher" | "admin" | "su_admin";
  phone_number: string;
}

const getAvatarText = (name: string) => {
  return name.replace(/\s+/g, "").slice(0, 2).toUpperCase();
};

export default function NewMessage() {
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [admin, setAdmin] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const fetchAllUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await ChatsService.getAllUsers({ token });
       console.log("response============", response);

      if (response?.data?.success) {
        const allUsers: User[] = response.data.data;

        const studentList = allUsers.filter((user) => user.type === "student");
        const teacherList = allUsers.filter((user) => user.type === "teacher");
        const adminList = allUsers.filter((user) => user.type === "teacher");

        setStudents(studentList);
        setTeachers(teacherList);
        setAdmin(adminList);

        // setStudents(
        //   allUsers.filter((u) =>
        //     u.role_users?.some((r) => r.role.name === "STUDENT"),
        //   ),
        // );
        // setTeachers(
        //   allUsers.filter((u) =>
        //     u.role_users?.some((r) => r.role.name === "TEACHER"),
        //   ),
        // );
        // setAdmin(
        //   allUsers.filter((u) =>
        //     u.role_users?.some((r) => r.role.name === "su_admin"),
        //   ),
        // );
      }
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleCreateDM = async (userId: string) => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      const payload = { otherUserId: userId };

      const response = await ChatsService.createDM({
        data: payload,
        token: token,
      });

      showSuccessToast("Conversation started");
      // Use the ID returned from the created or existing DM
      const chatId = response?.data?.id;
      router.push(`/tutor-dashboard/chats/${chatId}`);
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Failed to start conversation",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const filterBySearch = (list: User[]) =>
    list.filter((u) =>
      (u.name || u.email).toLowerCase().includes(searchQuery.toLowerCase()),
    );

  // Render User Item
  const renderUserItem = (user: User) => (
    <button
      key={user.id}
      onClick={() => handleCreateDM(user.id)}
      disabled={isCreating}
      className="w-full flex items-center gap-2.5 text-left py-2 text-sm text-[#E6E7E8] hover:bg-[#1a2336] px-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
    >
      <span className="size-9 shrink-0 rounded-full bg-[#1a2336] text-white text-xs font-semibold grid place-items-center border border-[#3D4566]">
        {getAvatarText(user.name || "UN")}
      </span>
      <div className="flex flex-col">
        <span className="font-medium">{user.name || "Unknown User"}</span>
        <span className="text-[10px] text-[#5F6CA0]">{user.email}</span>
      </div>
    </button>
  );

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/tutor-dashboard/chats"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Chat
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">New Message</p>
      </div>

      <div className="p-8 bg-[#0a1726] rounded-2xl max-w-[700px] min-h-[70vh] mx-auto">
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
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Link
          href="/tutor-dashboard/create-group"
          className="block w-full text-center text-sm text-white font-medium rounded-xl bg-[#E9201D] py-4 hover:bg-[#cc1c1a] transition-colors"
        >
          Create Group Chat
        </Link>

        <p className="text-sm text-[#B2B5B8] my-4">Suggested</p>

        <Tabs defaultValue="students">
          <TabsList className="grid h-auto grid-cols-3 bg-transparent p-1 gap-1.5">
            {["students", "teachers", "su_admin"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-sm text-[#B2B5B8] data-[state=active]:text-white data-[state=active]:bg-[#3d4566] rounded-full py-1.5 border border-[#1F283D] capitalize"
              >
                {tab === "su_admin" ? "Admin" : tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
            <TabsContent value="students" className="space-y-2">
              {filterBySearch(students).map(renderUserItem)}
            </TabsContent>
            <TabsContent value="teachers" className="space-y-2">
              {filterBySearch(teachers).map(renderUserItem)}
            </TabsContent>
            <TabsContent value="su_admin" className="space-y-2">
              {filterBySearch(admin).map(renderUserItem)}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
