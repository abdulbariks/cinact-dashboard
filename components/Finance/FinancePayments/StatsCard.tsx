import React from "react";
import bgImg from "@/public/admin-dashboard/stats-bg.png";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard as StatsCardType } from "./FinancePayments";
import RedRevenueIcon from "@/components/icons/SuperAdmindashboard/RedRevenueIcon";
import RedUsersIcon from "@/components/icons/SuperAdmindashboard/RedUsersIcon";
import RedCardIcon from "@/components/icons/SuperAdmindashboard/RedCardIcon";

type StatItem = {
  title: string;
  value: number | string;
  percentage: number | string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function StatsCard({
  data,
  loading = false,
}: {
  data: StatsCardType | null;
  loading?: boolean;
}) {
  const statsData: StatItem[] = [
    {
      title: "Total Revenue",
      value: data?.totalRevenueThisYear?.current ?? 0,
      percentage: data?.totalRevenueThisYear?.percentageChange,
      icon: RedRevenueIcon,
    },
    {
      title: "Course Revenue",
      value: data?.courseRevenue?.current ?? 0,
      percentage: data?.courseRevenue?.percentageChange,
      icon: RedCardIcon,
    },
    {
      title: "Events Revenue",
      value: data?.eventsRevenue?.current ?? 0,
      percentage: data?.eventsRevenue?.percentageChange,
      icon: RedUsersIcon,
    },
    {
      title: "This Month",
      value: data?.currentMonthRevenue?.current ?? 0,
      percentage: data?.currentMonthRevenue?.percentageChange,
      icon: RedRevenueIcon,
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
            <h3 className=" text-white text-base ">{item?.title}</h3>
            <item.icon />
          </div>
          <h2 className=" text-white text-[32px] font-semibold mt-6">
            {item?.value}
          </h2>
          <div>
            <p className=" mt-1.5 flex items-center gap-2">
              {" "}
              <span
                className={` text-sm font-semibold py-1 px-2.5 bg-[#323541] rounded-full ${
                  Number(item?.percentage) < 0
                    ? "text-[#E9201D]"
                    : "text-[#18CC3F]"
                }`}
              >
                {Number(item?.percentage) > 0 ? "+" : ""}
                {item?.percentage}%
              </span>{" "}
              <span className=" text-base text-[#8D9CDC]"> vs last month</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
