"use client";
import { getAttendenceListColumns } from "@/components/columns/getAttendenceListColumns";
import { MyCourseClassAttendenceColumns } from "@/components/columns/MyCourseClassAttendenceColumns";
import DynamicTable from "@/components/reusable/DynamicTable";
import { showErrorToast } from "@/lib/hotToast";
import attendenceListData from "@/public/demoData/AttendenceListData";
import { TutorAttendanceService } from "@/service/tutor/tutor.service";
import { TAttendanceResponse } from "@/types/tutor.attendece";
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export default function Attendence() {
  const params = useParams<{ classId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const [allAttendance, setAllAttendance] =
    useState<TAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  //Wrap loadAttendance in useCallback to use it as a stable dependency
  const loadAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      const response = await TutorAttendanceService.getAttendance({
        classId: params?.classId || "",
        page: currentPage,
        limit: itemsPerPage,
        status: "",
        search: search,
        token: token,
      });

      setAllAttendance(response?.data || null);
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Failed to load Attendance",
      );
    } finally {
      setLoading(false);
    }
  }, [params?.classId, currentPage, itemsPerPage, search]);

  // Memoize the columns so they are only recreated when loadAttendance or classId changes
  const columns = useMemo(
    () => getAttendenceListColumns(loadAttendance, params?.classId || ""),
    [loadAttendance, params?.classId],
  );

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  // console.log("allAttendance========", allAttendance);

  return (
    <div>
      <h3 className="text-2xl text-white my-5">All Attendence</h3>
      <DynamicTable
        columns={columns}
        data={allAttendance?.data}
        noDataMessage="No attendance found"
        loading={false}
      />
    </div>
  );
}
