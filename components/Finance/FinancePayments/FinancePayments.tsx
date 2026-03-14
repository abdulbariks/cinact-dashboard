"use client";
import React, { useState } from "react";
import { transactionsColumns } from "@/components/columns/TransactionsColumns";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllPaymentPlan } from "@/components/reusable/AllPaymentPlan";
import { DatePickerButton } from "@/components/reusable/DatePickerButton";
import StatsCard from "@/components/SuperAdmin/Home/StatssCard";
import { transactionsData } from "@/public/demoData/transactionsData";
import DynamicTable from "@/components/reusable/DynamicTable";

export default function FinancePayments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Use studentManagementData instead of demoData
  const totalItems = transactionsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = transactionsData.slice(startIndex, endIndex);
  return (
    <div>
      <div className=" flex items-center justify-between">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          Finance & Payments
        </h2>
        <button className=" p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-[8px] cursor-pointer">
          <PlusIcon />
          Add Payment
        </button>
      </div>
      <div className="mt-5">
        <StatsCard />
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
                // value={search}
                // onChange={handleChange}
                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56]"
                placeholder="Search Transaction ID"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
                <SearchIcon />
              </button>
            </div>
            <DatePickerButton />
            <AllPaymentPlan />
          </div>
        </div>
        <DynamicTable
          columns={transactionsColumns}
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
