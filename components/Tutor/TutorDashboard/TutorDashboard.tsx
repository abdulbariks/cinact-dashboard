"use client";
import React, { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import UpcomingClasses from "@/components/SuperAdmin/Home/UpcomingClasses";
import AttendenceTracking from "@/components/SuperAdmin/Home/AttendenceTracking";
import { showErrorToast } from "@/lib/hotToast";
import { parseCookies } from "nookies";
import { TutorService } from "@/service/tutor/tutor.service";

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

export type TutorDashboardOverviewResponse = {
  totalStudents: string | number;
  activeCourses: string | number;
  totalAssignments: string | number;
  totalTeachers: string | number;
  recentEnrollments: DashboardEnrollment[];
  upcomingClasses: DashboardClass[];
  attendanceTracking: DashboardAttendance[];
};

export default function TutorDashboard() {
  const [overview, setOverview] =
    useState<TutorDashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await TutorService.getTutorDashboardOverview({
          token,
        });
        setOverview(response?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load dashboard overview",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);
  return (
    <div>
      <StatsCard data={overview} loading={loading} />
      <div className=" mt-4.5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UpcomingClasses
          items={overview?.upcomingClasses || []}
          loading={loading}
        />
        <AttendenceTracking
          items={overview?.attendanceTracking || []}
          loading={loading}
        />
      </div>
    </div>
  );
}
