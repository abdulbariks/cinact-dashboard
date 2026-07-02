"use client";
import React, { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import UpcomingClasses from "@/components/SuperAdmin/Home/UpcomingClasses";
import AttendenceTracking from "@/components/SuperAdmin/Home/AttendenceTracking";
import { showErrorToast } from "@/lib/hotToast";
import { parseCookies } from "nookies";
import { TutorService } from "@/service/tutor/tutor.service";

type DashboardClass = {
  id?: string;
  class_title?: string;
  classTitle?: string;
  title?: string;
  course_title?: string;
  course?: string;
  date?: string;
  startTime?: string;
  time?: string;
  instructor_name?: string;
  instructorName?: string;
  inst_name?: string;
  duration?: number;
  module_name?: string;
  module?: string;
  module_title?: string;
};

type DashboardAttendance = {
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
  total_enrolled_students?: number;
  totalStudents: number;
  totalEnrollments?: number;
  attendance_percentage?: number;
  previous_attendance_percentage?: number | null;
  date?: string;
  class_at?: string;
  attendance_status?: string;
};

export type TutorDashboardOverviewResponse = {
  totalStudents: string | number;
  activeCourses: string | number;
  totalAssignments: string | number;
  totalClasses: string | number;
  upcomingClasses: DashboardClass[];
  attendanceTracking: DashboardAttendance[];
};

export default function TutorDashboard() {
  const [overview, setOverview] =
    useState<TutorDashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // console.log("overview========", overview);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await TutorService.getTutorDashboardOverview({
          token,
        });
        const apiData = response?.data?.data || {};

        const transformedData: TutorDashboardOverviewResponse = {
          totalStudents: apiData.my_total_students ?? 0,
          activeCourses: apiData.my_active_courses ?? 0,
          totalAssignments: apiData.total_assignments ?? 0,
          totalClasses: apiData.total_classes ?? 0,
          upcomingClasses: (apiData.up_coming_classes || []).map(
            (item: any) => ({
              id: item.id,
              class_title: item.class_title,
              classTitle: item.class_title,
              course_title: item.course_title,
              course: item.course_title,
              class_at: item.class_at,
              duration: item.duration,
              instructor_name: item.instructor_name,
              instructorName: item.instructor_name,
              module_name: item.module_name,
              module: item.module_name,
              module_title: item.module_title,
            }),
          ),
          attendanceTracking: (apiData.attendance || []).map((item: any) => ({
            id: item.id,
            class_title: item.class_title,
            classTitle: item.class_title,
            class_name: item.class_name,
            module_name: item.module_name,
            module: item.module_name,
            module_title: item.module_title,
            course_id: item.course_id,
            course_title: item.course_title,
            course: item.course_title,
            total_enrolled_students: item.total_enrolled_students ?? 0,
            totalStudents: item.total_enrolled_students ?? 0,
            totalEnrollments: item.total_enrolled_students ?? 0,
            attendance_percentage: item.attendance_percentage,
            previous_attendance_percentage: item.previous_attendance_percentage,
            class_at: item.class_at,
            attendance_status: item.attendance_status,
          })),
        };

        setOverview(transformedData);
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
