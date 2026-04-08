import React, { useState } from "react";
import { DashboardOverviewResponse } from "./SuperAdminHome";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

type EnrollmentItem = DashboardOverviewResponse["recentEnrollments"][number];

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const getInitials = (name?: string | null) => {
  if (!name) return "UU";

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!words.length) return "UU";

  return words.map((word) => word[0]?.toUpperCase() || "").join("");
};

const normalizeAvatarUrl = (url?: string | null) => {
  if (!url) return "";

  const trimmed = url.trim();
  const duplicateHttpIndex = trimmed.lastIndexOf("http://");
  const duplicateHttpsIndex = trimmed.lastIndexOf("https://");
  const nestedIndex = Math.max(duplicateHttpIndex, duplicateHttpsIndex);

  if (nestedIndex > 0) {
    return trimmed.slice(nestedIndex);
  }

  return trimmed;
};

export default function RecentEnrollments({
  items,
  loading = false,
}: {
  items: EnrollmentItem[];
  loading?: boolean;
}) {
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <div className=" bg-[#0a1929] p-4 rounded-2xl">
        <Skeleton className="h-6 w-44 bg-[#1d2a3e]" />
        <div className="space-y-3 mt-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-[#07121d] p-4 rounded-[10px] min-h-[104px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-10 h-10 rounded-full bg-[#1d2a3e]" />
                  <div>
                    <Skeleton className="h-4 w-28 bg-[#1d2a3e]" />
                    <Skeleton className="h-3 w-20 mt-2 bg-[#1d2a3e]" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full bg-[#1d2a3e]" />
              </div>
              <Skeleton className="h-4 w-44 mt-3 bg-[#1d2a3e]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-[#0a1929] p-4 rounded-2xl">
      <h2 className=" text-lg text-white font-medium">Recent Enrollments</h2>
      <div className=" space-y-3 mt-4">
        {items.length === 0 && (
          <div className="bg-[#07121d] p-4 rounded-[10px] text-sm text-[#D2D2D5]">
            No recent enrollments.
          </div>
        )}

        {items.map((item) => (
          <div key={item.id} className=" bg-[#07121d] p-4 rounded-[10px] min-h-[104px]">
            <div>
              <div className=" flex items-center justify-between">
                <div className=" flex items-center gap-2">
                  {normalizeAvatarUrl(item.avatar) && !brokenImages[item.id] ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={normalizeAvatarUrl(item.avatar)}
                        alt={item.userName || "avatar"}
                        fill
                        className="object-cover"
                        onError={() => {
                          setBrokenImages((prev) => ({ ...prev, [item.id]: true }));
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1d2a3e] flex items-center justify-center text-xs font-semibold text-white">
                      {getInitials(item.userName)}
                    </div>
                  )}
                  <div>
                    <h3 className=" text-white text-base font-medium mb-1">
                      {item.userName || "Unknown User"}
                    </h3>
                    <p className=" text-sm text-[#D2D2D5] font-medium">
                      {formatDate(item.updatedAt)}
                    </p>
                  </div>
                </div>

                <p
                  className={` py-1 px-2.5 ${item.status === "Enrolled" ? "bg-[#2a3d2e] text-[#18CC3F]" : "bg-[#22251b]  text-[#ECAD11]"}  rounded-full`}
                >
                  {item.status}
                </p>
              </div>
              <p className=" text-base text-[#D2D2D5] mt-3">
                Course: {item.courseName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
