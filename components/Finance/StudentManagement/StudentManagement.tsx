"use client";
import React, { useEffect, useState } from "react";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllStatus } from "@/components/reusable/AllStatus";
import DynamicTable from "@/components/reusable/DynamicTable";
import { PaymentTypeFilter } from "@/components/SuperAdmin/student-management/PaymentTypeFilter";
import { AllStudentsFilter } from "@/components/SuperAdmin/student-management/StudentsFilter";
import { studentManagementData } from "@/public/demoData/StudentManagementData";
import Link from "next/link";
import { financeStudentManagementColumns } from "@/components/columns/financeStudentManagementColumns";
import { parseCookies } from "nookies";
import { FinanceService } from "@/service/finance/finance.service";
import { showErrorToast } from "@/lib/hotToast";

type AllStudentRow = {
  userId: string;
  username: string;
  transactionId: string;
  amount: string | number;
  date: string;
  paymentType: string;
  paymentPlan: string;
};

export default function StudentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [studentType, setStudentType] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [paymentType, setPaymentType] = useState("all");
  const [allStudentManagementData, setAllStudentManagementData] = useState<
    AllStudentRow[]
  >([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, search, studentType, paymentStatus, paymentType]);

  useEffect(() => {
    const loadsetAllPaymentsTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await FinanceService.getStudentManagement({
          token,
          search,
          studentType,
          paymentStatus,
          paymentType,
          // paymentType: paymentType === "all" ? "" : paymentType,
          page: currentPage,
          limit: itemsPerPage,
        });

        const studentManagementData = response?.data?.data || [];
        const pagination = response?.data?.pagination || {};
        setAllStudentManagementData(studentManagementData);
        // setStudents(studentsData.map(mapStudentRow));
        setTotalItems(pagination.total ?? studentManagementData.length);
        setTotalPages(
          pagination.totalPages ??
            Math.ceil(
              (pagination.total ?? studentManagementData.length) / itemsPerPage,
            ),
        );
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load students";
        setAllStudentManagementData([]);
        setTotalItems(0);
        setTotalPages(0);
        setError(message);
        showErrorToast(message);
      } finally {
        setLoading(false);
      }
    };

    loadsetAllPaymentsTransactions();
  }, [
    currentPage,
    itemsPerPage,
    search,
    studentType,
    paymentStatus,
    paymentType,
  ]);

  console.log("allStudentManagementData===", allStudentManagementData);

  // Use studentManagementData instead of demoData
  // const totalItems = studentManagementData.length;
  // const totalPages = Math.ceil(totalItems / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentData = studentManagementData.slice(startIndex, endIndex);

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
          data={allStudentManagementData}
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
