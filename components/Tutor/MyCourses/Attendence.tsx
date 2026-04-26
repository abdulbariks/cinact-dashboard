"use client";
import { MyCourseClassAttendenceColumns } from "@/components/columns/MyCourseClassAttendenceColumns";
import DynamicTable from "@/components/reusable/DynamicTable";
import { showErrorToast } from "@/lib/hotToast";
import attendenceListData from "@/public/demoData/AttendenceListData";
import { TutorAttendanceService } from "@/service/tutor/tutor.service";
import { TAttendanceResponse } from "@/types/tutor.attendece";
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";

export default function Attendence() {
  const [allAttendance, setAllAttendance] =
    useState<TAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string; classId: string }>();
  const classId = params?.classId;

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await TutorAttendanceService.getAttendance({
          classId: classId as string,
          page: 1,
          limit: 10,
          status: "",
          search: "",
          token: token,
        });
        setAllAttendance(response?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load Attendance",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  // console.log("allAttendance========", allAttendance);

  return (
    <div>
      <h3 className="text-2xl text-white my-5">All Attendence</h3>
      <DynamicTable
        columns={MyCourseClassAttendenceColumns}
        data={allAttendance?.data}
        noDataMessage="No attendance found"
        loading={false}
      />
    </div>
  );
}
