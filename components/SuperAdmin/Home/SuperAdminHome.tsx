"use client";
import React, { useEffect, useState } from "react";
import StatssCard from "./StatssCard";
import RecentEnrollments from "./RecentEnrollments";
import UpcomingClasses from "./UpcomingClasses";
import AttendenceTracking from "./AttendenceTracking";
import { UserService } from "@/service/user/user.service";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";

type DashboardMetric = {
  current: number;
  previous: number;
  percentageChange: number;
};

type DashboardEnrollment = {
  id: string;
  userName: string | null;
  avatar: string | null;
  courseName: string;
  status: string;
  updatedAt: string;
};

type DashboardClass = {
  classTitle?: string;
  title?: string;
  course?: string;
  date?: string;
  startTime?: string;
  time?: string;
  instructorName?: string;
  module?: string;
  inst_name?: string;
};

type DashboardAttendance = {
  classTitle: string;
  course: string;
  totalStudents: number;
  totalEnrollments: number;
  date: string;
};

export type DashboardOverviewResponse = {
  role: string;
  totalStudents: DashboardMetric;
  totalOngoingCourses: DashboardMetric;
  monthlyRevenue: DashboardMetric;
  totalTeachers: DashboardMetric;
  recentEnrollments: DashboardEnrollment[];
  upcomingClasses: DashboardClass[];
  attendanceTracking: DashboardAttendance[];
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
        <RecentEnrollments items={overview?.recentEnrollments || []} loading={loading} />
        <UpcomingClasses items={overview?.upcomingClasses || []} loading={loading} />
        <AttendenceTracking items={overview?.attendanceTracking || []} loading={loading} />
      </div>
    </div>
  );
}
