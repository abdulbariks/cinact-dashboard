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
import EnrolledStudents from "./EnrolledStudents";

type StudentsProps = {
  courseId?: string;
};

export default function Students({ courseId }: StudentsProps) {
  const [enrolledUsers, setEnrolledUsers] = useState<TEnrolledUser[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("enrolledUsers====", enrolledUsers);

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

  return <EnrolledStudents enrolledUsers={enrolledUsers} />;
}
