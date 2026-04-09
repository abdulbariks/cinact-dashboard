import DecreaseIcon from "@/components/icons/SuperAdmindashboard/DecreaseIcon";
import IncreaseIcon from "@/components/icons/SuperAdmindashboard/IncreaseIcon";
import React from "react";
import { DashboardOverviewResponse } from "./SuperAdminHome";
import { Skeleton } from "@/components/ui/skeleton";

type AttendanceItem = DashboardOverviewResponse["attendanceTracking"][number];

const getPercentage = (totalStudents: number, totalEnrollments: number) => {
  if (!totalEnrollments) return 0;
  return Math.round((totalStudents / totalEnrollments) * 100);
};

export default function AttendenceTracking({
  items,
  loading = false,
}: {
  items: AttendanceItem[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className=" bg-[#0a1929] p-4 rounded-2xl">
        <Skeleton className="h-6 w-44 bg-[#1d2a3e]" />
        <div className="space-y-3 rounded-[10px] mt-4">
          {Array?.from({ length: 6 })?.map((_, index) => (
            <div key={index} className="p-4 bg-[#07121d] rounded-[10px]">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 bg-[#1d2a3e]" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-5 w-20 rounded-full bg-[#1d2a3e]" />
                  <Skeleton className="h-5 w-14 rounded-full bg-[#1d2a3e]" />
                </div>
              </div>
              <Skeleton className="h-2 w-full rounded-full mt-3 bg-[#1d2a3e]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-[#0a1929] p-4 rounded-2xl">
      <h2 className=" text-lg text-white font-medium">Attendance Tracking</h2>
      <div className=" space-y-3 rounded-[10px] mt-4">
        {items?.length === 0 && (
          <div className="p-4 bg-[#07121d] rounded-[10px] text-sm text-[#D2D2D5]">
            No attendance data.
          </div>
        )}

        {items?.map((item, index) => {
          const percentage = getPercentage(
            item.totalStudents || 0,
            item.totalEnrollments || 0,
          );
          const percentText = `${percentage}%`;

          return (
            <div key={index} className=" p-4 bg-[#07121d] rounded-[10px] ">
              <div className=" flex items-center justify-between">
                <h3 className=" text-sm text-white">{item.classTitle}</h3>
                <div className=" flex items-center gap-1">
                  <p className=" text-xs text-[#18CC3F] bg-[#1a2538] py-1 px-1.5 inline-block rounded-full">
                    {item.totalStudents} students
                  </p>
                  <div className=" bg-[#1a2538] inline-flex items-center gap-1 py-1 px-1.5 rounded-full">
                    <p
                      className={` text-xs  ${percentage < 50 ? "text-[#E9201D]" : "text-white"}`}
                    >
                      {percentText}
                    </p>
                    {percentage > 50 ? <IncreaseIcon /> : <DecreaseIcon />}
                  </div>
                </div>
              </div>
              <div className="w-full bg-[#202a3f] rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 bg-[#5f6ca0] `}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
