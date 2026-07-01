"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import DynamicTable from "@/components/reusable/DynamicTable";
import {
  getAttendenceListColumns,
  AttendenceListRow,
} from "@/components/columns/getAttendenceListColumns";
import { AdminAttendanceService } from "@/service/user/user.service";
import { parseCookies } from "nookies";

interface ClassAttendenceProps {
  classId?: string;
}

export default function ClassAttendence({ classId }: ClassAttendenceProps) {
  const [attendanceData, setAttendanceData] = useState<AttendenceListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const loadAttendance = useCallback(async () => {
    if (!classId) return;

    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminAttendanceService.getAttendance({
        classId,
        token,
        page: currentPage,
        limit: itemsPerPage,
      });

      const responseData = response?.data || {};
      const apiData = responseData?.data || [];
      setAttendanceData(apiData);
      setTotalItems(responseData?.meta_data?.total || 0);
    } catch (error: any) {
      console.error("Failed to load attendance:", error);
    } finally {
      setLoading(false);
    }
  }, [classId, currentPage, itemsPerPage]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const columns = useMemo(
    () => getAttendenceListColumns(loadAttendance, classId || ""),
    [loadAttendance, classId],
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <div className=" ">
      <h3 className=" text-xl text-white font-medium mb-4">All Attendence</h3>
      <div>
        <DynamicTable
          columns={columns}
          data={attendanceData}
          noDataMessage="No attendance found"
          loading={loading}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalpage={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>
    </div>
  );
}
