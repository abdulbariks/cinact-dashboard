"use client";

import React, { useState } from "react";
import Image from "next/image";
import statsImg from "@/public/admin-dashboard/stats-bg.png";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllStatus } from "@/components/reusable/AllStatus";
import DynamicTable from "@/components/reusable/DynamicTable";
import attendenceListData from "@/public/demoData/AttendenceListData";
import { attendenceListColumns } from "@/components/columns/AttendenceListColumn";
import VerticalAttendenceCalendar from "@/components/SuperAdmin/attendence/VerticalAttendenceCalendar";

export default function Attendence() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = attendenceListData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = attendenceListData.slice(startIndex, endIndex);

  return (
    <div>
      <div className=" p-6 bg-[#0a1726] rounded-2xl">
        <div className=" flex items-center justify-between">
          <h3 className=" text-white text-xl font-semibold">Attendance List</h3>
          <div className=" flex items-center gap-2">
            <div className=" relative w-80">
              <input
                type="text"
                name="search"
                // value={search}
                // onChange={handleChange}
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
            columns={attendenceListColumns}
            data={attendenceListData}
            // currentPage={currentPage}
            // itemsPerPage={itemsPerPage}
            // totalpage={totalPages}
            // totalItems={totalItems}
            // onPageChange={setCurrentPage}
            // setItemsPerPage={setItemsPerPage}
            noDataMessage="No attendance found"
            loading={false}
          />
          <div className="xl:sticky xl:top-4">
            <VerticalAttendenceCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}
