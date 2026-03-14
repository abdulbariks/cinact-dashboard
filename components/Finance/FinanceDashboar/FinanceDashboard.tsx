import RecentEnrollments from "@/components/SuperAdmin/Home/RecentEnrollments";
import StatsCard from "@/components/SuperAdmin/Home/StatssCard";
import React from "react";
import RecentTransactions from "./RecentTransactions";

export default function FinanceDashboard() {
  return (
    <div>
      {" "}
      <StatsCard />
      <div className=" mt-4.5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentEnrollments />
        <RecentTransactions />
      </div>
    </div>
  );
}
