"use client";
import React, { useEffect, useState } from "react";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import Link from "next/link";
import RedUsers from "@/components/icons/SuperAdmindashboard/RedUsers";
import RedGradHat from "@/components/icons/SuperAdmindashboard/RedGradHat";
import RedTeacherIcon from "@/components/icons/SuperAdmindashboard/RedTeacherIcon";
import RedRevenueIcon from "@/components/icons/SuperAdmindashboard/RedRevenueIcon";
import RedCardIcon from "@/components/icons/SuperAdmindashboard/RedCardIcon";
import RedUsersIcon from "@/components/icons/SuperAdmindashboard/RedUsersIcon";
import Image from "next/image";
import statBg from "@/public/admin-dashboard/stats-bg.png";
import { transactionsData } from "@/public/demoData/transactionsData";
import DynamicTable from "@/components/reusable/DynamicTable";
import { transactionsColumns } from "@/components/columns/TransactionsColumns";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { DatePickerButton } from "@/components/reusable/DatePickerButton";
import { AllPaymentPlan } from "@/components/reusable/AllPaymentPlan";
import { showErrorToast } from "@/lib/hotToast";
import { parseCookies } from "nookies";
import { AdminPaymentsTransactionsService } from "@/service/user/user.service";
import StatsCard from "@/components/Finance/FinancePayments/StatsCard";

type StatItem = {
  title: string;
  value: number | string;
  percentage: string;
  icon: React.ComponentType<{ className?: string }>;
};

// interface StatItemInterface {
//   title: string
//   value: number | string
//   percentage: string
//   icon: React.ComponentType<{ className?: string }>
// }

// const statsData: StatItem[] = [
//   {
//     title: "Total Revenue",
//     value: "$348",
//     percentage: "+12.5%",
//     icon: RedRevenueIcon,
//   },
//   {
//     title: "Course Revenue",
//     value: "$399",
//     percentage: "+5%",
//     icon: RedCardIcon,
//   },
//   {
//     title: "Events Revenue",
//     value: "$399",
//     percentage: "+18.2%",
//     icon: RedUsersIcon,
//   },
//   {
//     title: "Total Teachers",
//     value: "$127",
//     percentage: "+12.5%",
//     icon: RedRevenueIcon,
//   },
// ];

type StatsCardData = {
  current: number;
  previous: number;
  percentageChange: number;
};

export type StatsCard = {
  courseRevenue: StatsCardData;
  currentMonthRevenue: StatsCardData;
  eventsRevenue: StatsCardData;
  totalRevenueThisYear: StatsCardData;
};

type AllPaymentsTransactionsRow = {
  userId: string;
  username: string;
  transactionId: string;
  amount: string | number;
  date: string;
  paymentType: string;
  paymentPlan: string;
};

export default function FinancePaymentsHome() {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [date, setDate] = useState<Date | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<string | null>(null);
  // // Use studentManagementData instead of demoData
  // const totalItems = transactionsData.length;
  // const totalPages = Math.ceil(totalItems / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentData = transactionsData.slice(startIndex, endIndex);

  const [statsCardData, setStatsCardData] = useState<StatsCard | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  // const [paymentPlan, setPaymentStatus] = useState("all");
  const [allPaymentsTransactions, setAllPaymentsTransactions] = useState<
    AllPaymentsTransactionsRow[]
  >([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStatsCardData = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response =
          await AdminPaymentsTransactionsService.getPaymentsStats({
            token,
          });
        setStatsCardData(response?.data || null);
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

    loadStatsCardData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, search, date, paymentPlan]);

  useEffect(() => {
    const loadsetAllPaymentsTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response =
          await AdminPaymentsTransactionsService.getAllPaymentsTransactions({
            token,
            search,
            // date: date === "undefined" ? "" : date,
            paymentPlan: paymentPlan === "all" ? "" : paymentPlan,
            page: currentPage,
            limit: itemsPerPage,
          });

        const paymentsTransactionsData = response?.data?.data || [];
        const pagination = response?.data?.pagination || {};
        setAllPaymentsTransactions(paymentsTransactionsData);

        // setStudents(studentsData.map(mapStudentRow));
        setTotalItems(pagination.total ?? paymentsTransactionsData.length);
        setTotalPages(
          pagination.totalPages ??
            Math.ceil(
              (pagination.total ?? paymentsTransactionsData.length) /
                itemsPerPage,
            ),
        );
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load students";
        setAllPaymentsTransactions([]);
        setTotalItems(0);
        setTotalPages(0);
        setError(message);
        showErrorToast(message);
      } finally {
        setLoading(false);
      }
    };

    loadsetAllPaymentsTransactions();
  }, [currentPage, itemsPerPage, search, date, paymentPlan]);

  return (
    <div>
      <div className=" flex items-center justify-between">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          Finance & Payments
        </h2>
        <Link
          href="/dashboard/finance-payments/add-payment"
          className=" p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-xl cursor-pointer"
        >
          <PlusIcon />
          Add Payment
        </Link>
      </div>
      {/* <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className=" p-6 bg-[#0A1A29] rounded-2xl relative overflow-hidden"
          >
            <Image
              src={statBg}
              alt="Stat Background"
              className=" absolute top-0 right-0  "
            />
            <div className=" flex items-center justify-between">
              <p className=" text-white text-base">{stat.title}</p>
              <stat.icon />
            </div>
            <div className=" mt-6 ">
              <h2 className=" text-[32px] text-white font-semibold">
                {stat.value}
              </h2>
            </div>
            <div className=" mt-1 flex items-center gap-2">
              <p className=" text-xs text-[#E9201D] font-semibold py-1 px-2.5 rounded-full bg-[#1c273b] inline-block">
                {stat.percentage}
              </p>

              <p className=" text-base text-[#8D9CDC]">vs last month</p>
            </div>
          </div>
        ))}
      </div> */}
      <div className="mt-5">
        <StatsCard data={statsCardData} loading={loading} />
      </div>

      <div className=" mt-5 p-6  bg-[#0A1726] rounded-2xl">
        <div className=" flex flex-col lg:flex-row items-center justify-between mb-6">
          <h3 className=" text-white text-xl font-semibold">
            {/* Transactions (44) */}
            Transactions ({allPaymentsTransactions?.length})
          </h3>
          <div className=" flex flex-col md:flex-row items-center gap-2">
            <div className=" relative w-80">
              <input
                type="text"
                name="search"
                // value={search}
                // onChange={handleChange}
                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56]"
                placeholder="Search Transaction ID"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
                <SearchIcon />
              </button>
            </div>
            <DatePickerButton date={date} setDate={setDate} />
            <AllPaymentPlan
              paymentPlan={paymentPlan}
              setPaymentPlan={setPaymentPlan}
            />
          </div>
        </div>
        <DynamicTable
          columns={transactionsColumns}
          data={allPaymentsTransactions}
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
