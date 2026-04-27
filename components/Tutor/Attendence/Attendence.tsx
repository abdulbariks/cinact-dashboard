"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllStatus } from "@/components/reusable/AllStatus";
import DynamicTable from "@/components/reusable/DynamicTable";
import VerticalAttendenceCalendar from "@/components/SuperAdmin/attendence/VerticalAttendenceCalendar";
import { parseCookies } from "nookies";
import { TutorAttendanceService } from "@/service/tutor/tutor.service";
import { showErrorToast } from "@/lib/hotToast";
import { TAttendanceResponse } from "@/types/tutor.attendece";
import { useParams } from "next/navigation";
// 1. Import the factory function instead of the static array
import { getAttendenceListColumns } from "@/components/columns/getAttendenceListColumns";

export default function Attendence() {
  const params = useParams<{ classId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="p-6 bg-[#0a1726] rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-xl font-semibold">Attendance List</h3>
          <div className="flex items-center gap-2">
            <div className="relative w-80">
              <input
                type="text"
                name="search"
                value={search}
                onChange={handleSearchChange}
                className="w-full py-2 px-4 rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                placeholder="Search by student name..."
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
                <SearchIcon />
              </button>
            </div>
            <AllStatus />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <DynamicTable
            //Pass the memoized columns factory result
            columns={columns}
            data={allAttendance?.data || []}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalpage={allAttendance?.pagination?.totalPages || 1}
            totalItems={allAttendance?.pagination?.total || 0}
            onPageChange={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            noDataMessage="No attendance found"
            loading={loading}
          />
          <div className="xl:sticky xl:top-4">
            <VerticalAttendenceCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}
