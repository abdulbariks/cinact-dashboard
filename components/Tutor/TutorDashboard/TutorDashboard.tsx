import React from "react";
import StatsCard from "./StatsCard";
import UpcomingClasses from "@/components/SuperAdmin/Home/UpcomingClasses";
import AttendenceTracking from "@/components/SuperAdmin/Home/AttendenceTracking";

export default function TutorDashboard() {
  return (
    <div>
      <StatsCard />
      <div className=" mt-4.5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UpcomingClasses />
        <AttendenceTracking />
      </div>
    </div>
  );
}
