import DecreaseIcon from "@/components/icons/SuperAdmindashboard/DecreaseIcon";
import IncreaseIcon from "@/components/icons/SuperAdmindashboard/IncreaseIcon";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type AttendanceItem = {
  id?: string;
  class_title?: string;
  classTitle?: string;
  module_name?: string;
  module?: string;
  module_title?: string;
  class_name?: string;
  course_id?: string;
  course?: string;
  course_title?: string;
  total_students?: number;
  totalStudents?: number;
  total_enrolled_students?: number;
  totalEnrollments?: number;
  attendance_percentage?: number;
  previous_attendance_percentage?: number | null;
  date?: string;
  class_at?: string;
  attendance_status?: string;
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
          const percentage = item.attendance_percentage ?? item.totalStudents ?? 0;
          const students = item.total_enrolled_students ?? item.totalEnrollments ?? 0;
          const percentText = `${percentage}%`;
          const isIncrease = item.attendance_status === "increment";

          return (
            <div key={index} className=" p-4 bg-[#07121d] rounded-[10px] ">
              <div className=" flex items-center justify-between">
                <h3 className=" text-sm text-white">{item.class_title || item.classTitle || "-"}</h3>
                <div className=" flex items-center gap-1">
                  <p className=" text-xs text-[#18CC3F] bg-[#1a2538] py-1 px-1.5 inline-block rounded-full">
                    {students} students
                  </p>
                  <div className=" bg-[#1a2538] inline-flex items-center gap-1 py-1 px-1.5 rounded-full">
                    <p
                      className={` text-xs  ${percentage < 50 ? "text-[#E9201D]" : "text-white"}`}
                    >
                      {percentText}
                    </p>
                    {isIncrease && <IncreaseIcon />}
                    {!isIncrease && <DecreaseIcon />}
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
