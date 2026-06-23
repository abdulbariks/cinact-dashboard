"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AdminCourseManagementService } from "@/service/user/user.service";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";
import {
  TEnrolledUser,
  TGetEnrolledUsersResponse,
} from "@/types/tutor.mycourse";

type StudentsProps = {
  courseId?: string;
};

export default function Students({ courseId }: StudentsProps) {
  const [enrolledUsers, setEnrolledUsers] = useState<TEnrolledUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEnrolledUsers = useCallback(async () => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminCourseManagementService.getEnrolledUsers({
        courseId,
        token,
      });

      const data = response?.data as TGetEnrolledUsersResponse;
      setEnrolledUsers(data?.data || []);
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load enrolled users",
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadEnrolledUsers();
  }, [loadEnrolledUsers]);

  if (loading) {
    return (
      <div>
        <p className="text-white">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-lg text-white font-medium">
        Enrolled Students ({enrolledUsers.length})
      </h2>
      <div className="space-y-3 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {enrolledUsers.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-[#0A1621] p-5 rounded-[20px] border border-[#3D4566] w-full"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="basis-[15%] flex justify-center">
                <Image
                  src={item.avatar_url || "/admin-dashboard/avatar-1.png"}
                  alt="avatar"
                  width={64}
                  height={64}
                  className="object-cover rounded-full"
                />
              </div>

              <div className="basis-[85%]">
                <h3 className="text-white text-lg font-medium leading-tight">
                  {item.name}
                </h3>
                <p className="text-[#A1AAB3] text-sm mt-3">
                  ID: {item.student_id}
                </p>
                <div className="flex gap-4 text-[#7B8AB8] text-sm mt-3 font-medium">
                  <p>Progress: {item.attendance_percentage}%</p>
                  <p>
                    Assignments: {item.assignments_completed}/
                    {item.total_assignments}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="grow h-2.5 bg-[#242D3D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6D79A8] rounded-full transition-all duration-300"
                      style={{ width: `${item.attendance_percentage}%` }}
                    />
                  </div>
                  <span className="text-[#109334] font-medium text-sm min-w-7.5">
                    {item.attendance_percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
