import CalenderIcon from "@/components/icons/SuperAdmindashboard/CalenderIcon";
import ClockIcon from "@/components/icons/SuperAdmindashboard/ClockIcon";
import React from "react";
import { DashboardOverviewResponse } from "./SuperAdminHome";
import { Skeleton } from "@/components/ui/skeleton";

type UpcomingClassItem = DashboardOverviewResponse["upcoming_classes"][number];

const formatDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

const formatTime = (value?: string, fallbackDate?: string) => {
  if (value) return value;
  if (!fallbackDate) return "-";

  const date = new Date(fallbackDate);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function UpcomingClasses({
  items,
  loading = false,
}: {
  items: UpcomingClassItem[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className=" bg-[#0a1929] p-4 rounded-2xl">
        <Skeleton className="h-6 w-40 bg-[#1d2a3e]" />
        <div className="space-y-3 mt-4">
          {Array?.from({ length: 5 })?.map((_, index) => (
            <div key={index} className="bg-[#07121d] p-4 rounded-[10px]">
              <Skeleton className="h-4 w-32 bg-[#1d2a3e]" />
              <Skeleton className="h-3 w-24 mt-2 bg-[#1d2a3e]" />
              <div className="flex items-center gap-3 mt-3">
                <Skeleton className="h-4 w-20 bg-[#1d2a3e]" />
                <Skeleton className="h-4 w-16 bg-[#1d2a3e]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-[#0a1929] p-4 rounded-2xl">
      <h2 className=" text-lg text-white font-medium">Upcoming Classes</h2>
      <div className=" space-y-3 mt-4">
        {items?.length === 0 && (
          <div className=" bg-[#07121d] p-4 rounded-[10px]">
            <p className=" text-sm text-[#D2D2D5]">No upcoming classes.</p>
          </div>
        )}
{items?.map((item, index) => (
           <div key={index} className=" bg-[#07121d] p-4 rounded-[10px]">
             <h2 className=" text-white text-base font-medium">
               {item.class_title || "-"}
             </h2>
             <p className=" text-sm text-[#D2D2D5] mt-1">
               {item.course_title || "-"}
             </p>
             <p className=" text-sm text-[#8D9CDC] mt-1">
               {item.instructor_name || "-"}
             </p>

             <div className=" flex items-center gap-3 mt-3">
               <div className=" flex items-center gap-1">
                 <CalenderIcon />
                 <p className=" text-white text-sm">{formatDate(item.class_at)}</p>
               </div>
               <div className=" flex items-center gap-1">
                 <ClockIcon />
                 <p className=" text-white text-sm">
                   {formatTime(undefined, item.class_at)}
                 </p>
               </div>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}
