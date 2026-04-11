import React from "react";
import RedGradHat from "@/components/icons/SuperAdmindashboard/RedGradHat";
import RedTeacherIcon from "@/components/icons/SuperAdmindashboard/RedTeacherIcon";
import RedUsers from "@/components/icons/SuperAdmindashboard/RedUsers";
import bgImg from "@/public/admin-dashboard/stats-bg.png";
import Image from "next/image";
import { DashboardOverviewResponse } from "./SuperAdminHome";
import { Skeleton } from "@/components/ui/skeleton";

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

const formatChange = (value: number) => {
  const abs = Math.abs(value).toFixed(1);
  return `${value > 0 ? "+" : ""}${abs}%`;
};

const formatCurrency = (value: number) => {
  return `$${value.toLocaleString()}`;
};

export default function StatsCard({
  data,
  loading = false,
}: {
  data: DashboardOverviewResponse | null;
  loading?: boolean;
}) {
  const statsData: StatItem[] = [
    {
      title: "Total Students",
      value: data?.totalStudents?.current ?? 0,
      percentage: formatChange(data?.totalStudents?.percentageChange ?? 0),
      icon: RedUsers,
    },
    {
      title: "Ongoing Courses",
      value: data?.totalOngoingCourses?.current ?? 0,
      percentage: formatChange(
        data?.totalOngoingCourses?.percentageChange ?? 0,
      ),
      icon: RedGradHat,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(data?.monthlyRevenue?.current ?? 0),
      percentage: formatChange(data?.monthlyRevenue?.percentageChange ?? 0),
      icon: RedGradHat,
    },
    {
      title: "Total Teachers",
      value: data?.totalTeachers?.current ?? 0,
      percentage: formatChange(data?.totalTeachers?.percentageChange ?? 0),
      icon: RedTeacherIcon,
    },
  ];

  if (loading) {
    return (
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className=" bg-[#09141f] p-6 rounded-2xl relative overflow-hidden"
          >
            <Skeleton className="h-4 w-28 bg-[#1d2a3e]" />
            <Skeleton className="h-9 w-24 mt-6 bg-[#1d2a3e]" />
            <div className="mt-4 flex items-center gap-2">
              <Skeleton className="h-6 w-18 rounded-full bg-[#1d2a3e]" />
              <Skeleton className="h-4 w-24 bg-[#1d2a3e]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
      {statsData.map((item, index) => (
        <div
          key={index}
          className=" bg-[#09141f] p-6 rounded-2xl relative  overflow-hidden"
        >
          <Image src={bgImg} alt="bg img" className=" absolute top-0 right-0" />
          <div className=" flex items-center justify-between">
            <h3 className=" text-white text-base ">{item.title}</h3>
            <item.icon />
          </div>
          <h2 className=" text-white text-[32px] font-semibold mt-6">
            {item.value}
          </h2>
          <div>
            <p className=" mt-1.5 flex items-center gap-2">
              {" "}
              <span
                className={` text-sm font-semibold py-1 px-2.5 bg-[#323541] rounded-full ${
                  item.percentage.startsWith("-")
                    ? "text-[#E9201D]"
                    : "text-[#18CC3F]"
                }`}
              >
                {item.percentage}
              </span>{" "}
              <span className=" text-base text-[#8D9CDC]"> vs last month</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
