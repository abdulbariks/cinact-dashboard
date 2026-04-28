"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import MonthStatus from "./MonthStatus";
import Image from "next/image";
import statsImg from "@/public/admin-dashboard/stats-bg.png";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllStatus } from "@/components/reusable/AllStatus";
import DynamicTable from "@/components/reusable/DynamicTable";
import attendenceListData from "@/public/demoData/AttendenceListData";
import { attendenceListColumns } from "@/components/columns/AttendenceListColumn";
import VerticalAttendenceCalendar from "./VerticalAttendenceCalendar";
import { TAttendanceResponse } from "@/types/tutor.attendece";
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";
import { AdminAttendanceService } from "@/service/user/user.service";
import { getAttendenceListColumns } from "@/components/columns/getAttendenceListColumns";

export default function AttendenceHome() {
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

      const response = await AdminAttendanceService.getAttendance({
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

  //   console.log("allAttendance==========", allAttendance);

  const statsData = [
    {
      title: "Class Participation Rate",
      value: `${allAttendance?.card?.attendanceRate}%`,
    },
    {
      title: "Missed Classes",
      value: `${allAttendance?.card?.missedClasses}%`,
    },
    {
      title: "Active Students",
      value: `${allAttendance?.card?.presentClasses}%`,
    },
    {
      title: "Attendance Rate",
      value: `${allAttendance?.card?.totalClasses}%`,
    },
  ];

  return (
    <div>
      <div className=" flex items-center justify-between">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          Attendance Overview
        </h2>
        <MonthStatus />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {statsData.map((card) => (
          <div
            key={card.title}
            className="bg-[#09131d] p-6 rounded-2xl relative overflow-hidden"
          >
            <Image
              src={statsImg}
              alt={card.title}
              className=" absolute top-0 right-0"
            />
            <p className="text-base text-white  ">{card.title}</p>
            <h3 className="text-[24px] text-white font-semibold mt-6">
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      <div className=" p-6 bg-[#0a1726] rounded-2xl mt-8">
        <div className=" flex items-center justify-between">
          <h3 className=" text-white text-xl font-semibold">Attendance List</h3>
          <div className=" flex items-center gap-2">
            <div className=" relative w-80">
              <input
                type="text"
                name="search"
                value={search}
                onChange={handleSearchChange}
                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                placeholder="Search Transaction ID"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
                <SearchIcon />
              </button>
            </div>

            <AllStatus />
          </div>
        </div>

        <div className=" mt-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <DynamicTable
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
