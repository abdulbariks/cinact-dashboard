"use client";
import React, { useCallback, useEffect, useState } from "react";
import BreadCrumpRightArrow from "../icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { conversations } from "./chat-data";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";
import { ChatsService } from "@/service/chats/chats.service";

// const students = conversations.filter((user) => user.type === "student");
// const teachers = conversations.filter((user) => user.type === "teacher");

interface User {
  id: string;
  name: string | null;
  email: string;
  role_users: { role: { name: string } }[];
}

const getAvatarText = (name: string) => {
  return name.replace(/\s+/g, "").slice(0, 2).toUpperCase();
};
// const getAvatarText = (name: string | null, email: string | null) => {
//   const text = name || email || "";
//   if (!text) return "??";
//   return text.trim().replace(/\s+/g, "").slice(0, 2).toUpperCase();
// };

export default function NewMessage() {
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      const response = await ChatsService.getAllUsers({ token });

      // console.log("response============", response);

      // Based on your JSON, the users are inside response.data.data
      if (response?.data?.success) {
        const allUsers: User[] = response.data.data;

        // Categorize users by role
        const studentList = allUsers.filter((user) =>
          user.role_users?.some((r) => r.role.name === "STUDENT"),
        );

        const teacherList = allUsers.filter((user) =>
          user.role_users?.some((r) => r.role.name === "TEACHER"),
        );

        setStudents(studentList);
        setTeachers(teacherList);
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

  // Filtering logic for the search bar
  const filterBySearch = (list: User[]) =>
    list.filter((u) =>
      (u.name || u.email).toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const filteredStudents = filterBySearch(students);
  const filteredTeachers = filterBySearch(teachers);

  console.log("filteredStudents====", filteredStudents);
  console.log("filteredTeachers====", filteredTeachers);

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/chats"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Chat
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">New Message</p>
      </div>

      <div className=" p-8 bg-[#0a1726] rounded-2xl max-w-173.75 h-[80vh]  mx-auto mt-10">
        <h2 className=" text-2xl text-white font-semibold pb-4 border-b border-[#141B34]">
          New Message
        </h2>

        <div className="relative mt-4 mb-5">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#3D4566] ">
            To:
          </span>
          <input
            className="pl-10  pr-4 py-3.5 w-full border border-[#3D4566] rounded-full placeholder:text-[#8C9196] placeholder:text-sm text-white"
            type="text"
            placeholder="Type a user name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Link
          href="/dashboard/create-group"
          className="block w-full text-center text-sm text-white font-medium rounded-[12px] bg-[#E9201D] py-4 px-8 cursor-pointer"
        >
          Create Group Chat
        </Link>

        <p className=" text-sm text-[#B2B5B8] my-4">Suggested</p>

        <Tabs defaultValue="students">
          <TabsList className="grid h-auto   grid-cols-2 bg-transparent p-1 gap-1.5">
            <TabsTrigger
              value="students"
              className="text-sm font-normal text-[#B2B5B8] data-[state=active]:font-medium data-[state=active]:text-white data-[state=active]:bg-[#3d4566] cursor-pointer rounded-full py-1.5 px-4 border border-[#1F283D]"
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value="teachers"
              className="text-sm font-normal text-[#B2B5B8] data-[state=active]:font-medium data-[state=active]:text-white data-[state=active]:bg-[#3d4566] cursor-pointer rounded-full py-1.5 px-4 border border-[#1F283D]"
            >
              Teachers
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[40vh] overflow-y-auto pr-1">
            <TabsContent value="students" className="mt-0">
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <Link
                    href={`/dashboard/chats/${student.id}`}
                    key={student.id}
                    type="button"
                    className="w-full flex items-center gap-2.5 text-left py-2 text-sm text-[#E6E7E8] hover:text-white hover:border-[#3d4566] transition-colors cursor-pointer"
                  >
                    <span className="size-9 rounded-full bg-[#1a2336] text-white text-xs font-semibold grid place-items-center">
                      {getAvatarText(student.name || "Unknown User")}
                      {/* {student.name || student.email || "Unknown User"} */}
                    </span>
                    <span>{student.name}</span>
                  </Link>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="teachers" className="mt-0">
              <div className="space-y-4">
                {filteredTeachers?.map((teacher) => (
                  <Link
                    href={`/dashboard/chats/${teacher.id}`}
                    key={teacher.id}
                    type="button"
                    className="w-full  flex items-center gap-2.5 text-left      py-2 text-sm text-[#E6E7E8] hover:text-white hover:border-[#3d4566] transition-colors cursor-pointer"
                  >
                    <span className="size-9 rounded-full bg-[#1a2336] text-white text-xs font-semibold grid place-items-center">
                      {getAvatarText(teacher.name || "Unknown User")}
                      {/* {teacher.name || teacher.email || "Unknown User"} */}
                    </span>
                    <span>{teacher.name}</span>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
