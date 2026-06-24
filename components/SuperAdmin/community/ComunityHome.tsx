"use client";

import Link from "next/link";
import React, { useState } from "react";
import PlusIcon from "../../icons/SuperAdmindashboard/PlusIcon";
import SearchIcon from "../../icons/SuperAdmindashboard/SearchIcon";
import CommunityType from "./CommunityType";
import CommunityStatus from "./CommunityStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import AllPosts from "./AllPosts";
import ModaretionRequest from "./ModaretionRequest";

export default function ComunityHome() {
  const [activeTab, setActiveTab] = useState("all-posts");
  const [search, setSearch] = useState("");
  const [communityRole, setCommunityRole] = useState("all-role");
  const [communityStatus, setCommunityStatus] = useState("all-status");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl text-[#E6E7E8] font-semibold">
          Community Management
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto">
          {/* <Link
            href="/dashboard/community/view-announcements"
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#3d4566] hover:bg-[#3d4566]/90 flex text-white items-center justify-center sm:justify-start gap-2 sm:gap-3 rounded-xl cursor-pointer text-sm sm:text-base"
          >
            View Announcements
          </Link> */}
          <Link
            href="#"
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center justify-center sm:justify-start gap-2 sm:gap-3 rounded-xl cursor-pointer text-sm sm:text-base"
          >
            <PlusIcon />
            Create Announcement
          </Link>
        </div>
      </div>

      <div className="bg-[#0a1726] p-4 sm:p-6 rounded-2xl mt-5">
        <Tabs
          defaultValue="all-posts"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <TabsList className="inline-flex items-center h-auto rounded-[6px] bg-[#31333e] p-1 overflow-x-auto w-full lg:w-auto">
              <TabsTrigger
                value="all-posts"
                className="px-3 sm:px-4 py-1.5 sm:py-2 border-0 shadow-none text-xs sm:text-sm font-medium text-[#8D9CDC] data-[state=active]:text-white data-[state=active]:bg-[#505B86] rounded-[6px] cursor-pointer whitespace-nowrap"
              >
                All posts
              </TabsTrigger>
              <TabsTrigger
                value="modaration-request"
                className="px-3 sm:px-4 py-1.5 sm:py-2 border-0 shadow-none rounded-[6px] text-xs sm:text-sm font-medium text-[#8D9CDC] data-[state=active]:text-white data-[state=active]:bg-[#505B86] cursor-pointer whitespace-nowrap"
              >
                Modaration Request
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64 md:w-72 lg:w-80">
                <input
                  type="text"
                  name="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full py-2 px-3 sm:px-4 rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white text-sm"
                  placeholder="Search User"
                />
                <button
                  type="button"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl cursor-pointer"
                >
                  <SearchIcon />
                </button>
              </div>

              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <CommunityType
                  value={communityRole}
                  onChange={setCommunityRole}
                />
                <CommunityStatus
                  value={communityStatus}
                  onChange={setCommunityStatus}
                />
              </div>
            </div>
          </div>

          <TabsContent value="all-posts" className="mt-4">
            <AllPosts
              search={search}
              selectedRole={communityRole}
              selectedStatus={communityStatus}
            />
          </TabsContent>
          <TabsContent value="modaration-request" className="mt-4">
            <ModaretionRequest
              search={search}
              selectedRole={communityRole}
              selectedStatus={communityStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
