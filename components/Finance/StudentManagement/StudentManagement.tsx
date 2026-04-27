"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllStatus } from "@/components/reusable/AllStatus";
import DynamicTable from "@/components/reusable/DynamicTable";
import { PaymentTypeFilter } from "@/components/SuperAdmin/student-management/PaymentTypeFilter";
import { AllStudentsFilter } from "@/components/SuperAdmin/student-management/StudentsFilter";
import Link from "next/link";
import { parseCookies } from "nookies";
import { FinanceService } from "@/service/finance/finance.service";
import { showErrorToast } from "@/lib/hotToast";
import { TStudentManagementResponse } from "@/types/finance.studentmenagement";
import { getFinanceStudentManagementColumns } from "@/components/columns/getFinanceStudentManagementColumns";

export default function StudentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [studentType, setStudentType] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [paymentType, setPaymentType] = useState("all");
  const [allStudentManagementData, setAllStudentManagementData] =
    useState<TStudentManagementResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoized fetch function so it can be reused anywhere
  const fetchStudentManagement = useCallback(async () => {
    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await FinanceService.getStudentManagement({
        token,
        search,
        // studentType,
        // paymentStatus,
        // paymentType,
        page: currentPage,
        limit: itemsPerPage,
      });
      setAllStudentManagementData(response?.data || null);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to load Assets");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, search]);

  const columns = useMemo(() => {
    return getFinanceStudentManagementColumns(fetchStudentManagement);
  }, [fetchStudentManagement]);

  // Initial load
  useEffect(() => {
    fetchStudentManagement();
  }, [fetchStudentManagement]);

  console.log("allStudentManagementData===", allStudentManagementData);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  return (
    <div>
      <div className=" flex items-center justify-between">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          Student Management
        </h2>
        <Link
          href="/finance-dashboard/student-management/add-student"
          className=" p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-xl cursor-pointer"
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
                value={search}
                onChange={handleSearchChange}
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
          columns={columns}
          data={allStudentManagementData?.data || []}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalpage={allStudentManagementData?.pagination?.totalPages || 1}
          totalItems={allStudentManagementData?.pagination?.total || 0}
          onPageChange={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          noDataMessage="No students found"
          loading={loading}
        />
      </div>
    </div>
  );
}
