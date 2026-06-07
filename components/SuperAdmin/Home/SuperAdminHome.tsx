"use client";
import React, { useEffect, useState } from "react";
import StatssCard from "./StatssCard";
import RecentEnrollments from "./RecentEnrollments";
import UpcomingClasses from "./UpcomingClasses";
import AttendenceTracking from "./AttendenceTracking";
import { UserService } from "@/service/user/user.service";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";

type DashboardEnrollment = {
  id: string;
  status: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  course_id: string;
  course_title: string;
  created_at: string;
};

type DashboardClass = {
  id: string;
  class_title: string;
  class_name: string;
  duration: number;
  class_at: string;
  module_name: string;
  module_title: string;
  course_id: string;
  course_title: string;
  instructor_id?: string;
  instructor_name?: string;
};

type DashboardAttendance = {
  id: string;
  module_name: string;
  module_title: string;
  class_name: string;
  class_title: string;
  class_at: string;
  course_id: string;
  course_title: string;
  total_enrolled_students: number;
  attendance_percentage: number;
  previous_attendance_percentage: number | null;
  attendance_status: string;
};

export type DashboardOverviewResponse = {
  role: string;
  total_students: number;
  total_teachers: number;
  ongoing_courses: number;
  monthly_revenue: number;
  attendance: DashboardAttendance[];
  recent_enrollments: DashboardEnrollment[];
  upcoming_classes: DashboardClass[];
};

export default function SuperAdminHome() {
  const [overview, setOverview] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await UserService.getDashboardOverview({ token });

        console.log("Dashboard Overview Response:", response?.data?.data);
        setOverview(response?.data?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load dashboard overview"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <div>
      <StatssCard data={overview} loading={loading} />
      <div className=" mt-4.5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RecentEnrollments items={overview?.recent_enrollments || []} loading={loading} />
        <UpcomingClasses items={overview?.upcoming_classes || []} loading={loading} />
        <AttendenceTracking items={overview?.attendance || []} loading={loading} />
      </div>
    </div>
  );
}
