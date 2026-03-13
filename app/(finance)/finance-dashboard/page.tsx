import RecentEnrollments from "@/components/SuperAdmin/Home/RecentEnrollments";
import StatsCard from "@/components/SuperAdmin/Home/StatssCard";
import React from "react";

export default function FinanceDashboardPage() {
  return (
    <div>
      <StatsCard />
      <div className=" mt-[18px] grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentEnrollments />
      </div>
    </div>
  );
}
