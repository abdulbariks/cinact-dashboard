import StatCards from "@/components/Dashboard/StateCards";
import React from "react";
import StatssCard from "./StatssCard";
import RecentEnrollments from "./RecentEnrollments";
import UpcomingClasses from "./UpcomingClasses";
import AttendenceTracking from "./AttendenceTracking";

export default function SuperAdminHome() {
  return (
    <div>
      <StatssCard />
      <div className=" mt-4.5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RecentEnrollments />
        <UpcomingClasses />
        <AttendenceTracking />
      </div>
    </div>
  );
}
