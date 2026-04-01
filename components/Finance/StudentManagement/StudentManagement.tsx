"use client";
import React, { useState } from "react";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllStatus } from "@/components/reusable/AllStatus";
import DynamicTable from "@/components/reusable/DynamicTable";
import { PaymentTypeFilter } from "@/components/SuperAdmin/student-management/PaymentTypeFilter";
import { AllStudentsFilter } from "@/components/SuperAdmin/student-management/StudentsFilter";
import { studentManagementData } from "@/public/demoData/StudentManagementData";
import Link from "next/link";
import { financeStudentManagementColumns } from "@/components/columns/financeStudentManagementColumns";

export default function StudentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Use studentManagementData instead of demoData
  const totalItems = studentManagementData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = studentManagementData.slice(startIndex, endIndex);

  return (
    <div>
      <div className=" flex items-center justify-between">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          Student Management
        </h2>
        <Link
          href="/finance-dashboard/student-management/add-student"
          className=" p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-[8px] cursor-pointer"
        >
          <PlusIcon />
          Add Student
        </Link>
      </div>

      <div className=" mt-5 p-6  bg-[#0A1726] rounded-2xl">
        <div className=" flex items-center justify-between mb-6">
          <h3 className=" text-white text-xl font-semibold">All Students</h3>
          <div className=" flex items-center gap-2">
            <div className=" relative w-80">
              <input
                type="text"
                name="search"
                // value={search}
                // onChange={handleChange}
                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                placeholder="Search User"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
                <SearchIcon />
              </button>
            </div>
            <AllStudentsFilter />
            <PaymentTypeFilter />
            <AllStatus />
          </div>
        </div>
        <DynamicTable
          columns={financeStudentManagementColumns}
          data={currentData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalpage={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          noDataMessage="No students found"
          loading={false}
        />
      </div>
    </div>
  );
}
