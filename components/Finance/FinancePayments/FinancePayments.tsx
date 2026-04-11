"use client";
import React, { useEffect, useState } from "react";
import { transactionsColumns } from "@/components/columns/TransactionsColumns";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllPaymentPlan } from "@/components/reusable/AllPaymentPlan";
import { DatePickerButton } from "@/components/reusable/DatePickerButton";
import StatsCard from "./StatsCard";
import { transactionsData } from "@/public/demoData/transactionsData";
import DynamicTable from "@/components/reusable/DynamicTable";
import Link from "next/link";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";
import { FinanceService } from "@/service/finance/finance.service";

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

export default function FinancePayments() {
  const [statsCardData, setStatsCardData] = useState<StatsCard | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [paymentPlan, setPaymentStatus] = useState("all");
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
        const response = await FinanceService.getFinancePaymentsStats({
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
        const response = await FinanceService.getAllPaymentsTransactions({
          token,
          search,
          // date: date === "all" ? "" : date,
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

  // console.log("statsCardDatastatsCardData====", statsCardData);
  // console.log(allPaymentsTransactions);
  // console.log("plan=========", paymentPlan);
  // console.log("date=========", date);

  return (
    <div>
      <div className=" flex items-center justify-between">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          Finance & Payments
        </h2>
        <Link
          href={"/finance-dashboard/finance-payments/add-payment"}
          className=" p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-xl cursor-pointer"
        >
          <PlusIcon />
          Add Payment
        </Link>
      </div>
      <div className="mt-5">
        <StatsCard data={statsCardData} loading={loading} />
      </div>

      <div className=" mt-5 p-6  bg-[#0A1726] rounded-2xl">
        <div className=" flex flex-col lg:flex-row items-center justify-between mb-6">
          <h3 className=" text-white text-xl font-semibold">
            Transactions (44)
          </h3>
          <div className=" flex flex-col md:flex-row items-center gap-2">
            <div className=" relative w-80">
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                placeholder="Search Transaction ID"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
                <SearchIcon />
              </button>
            </div>
            <DatePickerButton date={date} setDate={setDate} />
            <AllPaymentPlan
              paymentPlan={paymentPlan}
              setPaymentPlan={setPaymentStatus}
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
          noDataMessage="No payments found"
          loading={false}
        />
      </div>
    </div>
  );
}
