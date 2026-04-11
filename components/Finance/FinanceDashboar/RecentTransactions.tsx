"use client";

import { recentTransactionsColumns } from "@/components/columns/recentTransactionsColumns";
import DynamicTable from "@/components/reusable/DynamicTable";
import { recentTransactionsData } from "@/public/demoData/recentTransactionsData";
import React from "react";
import { FinanceDashboardOverviewResponse } from "./FinanceDashboard";
type RecentTransactionsItem =
  FinanceDashboardOverviewResponse["getRecentTransactions"][number];
export default function RecentTransactions({
  items,
  loading = false,
}: {
  items: RecentTransactionsItem[];
  loading?: boolean;
}) {
  return (
    <div className=" bg-[#0a1929] p-4 rounded-2xl">
      <h2 className=" text-lg text-white font-medium">Recent Transactions</h2>
      <div className=" space-y-3 mt-4">
        <DynamicTable
          columns={recentTransactionsColumns}
          data={items}
          noDataMessage="No students found"
          loading={false}
        />
      </div>
    </div>
  );
}
