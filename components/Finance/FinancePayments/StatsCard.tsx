import React from "react";
import bgImg from "@/public/admin-dashboard/stats-bg.png";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import RedRevenueIcon from "@/components/icons/SuperAdmindashboard/RedRevenueIcon";
import RedUsersIcon from "@/components/icons/SuperAdmindashboard/RedUsersIcon";
import RedCardIcon from "@/components/icons/SuperAdmindashboard/RedCardIcon";

type StatItem = {
  title: string;
  value: number | string;
  percentage: string;
  icon: React.ComponentType<{ className?: string }>;
};

const formatCurrency = (value: number | string) => {
  const num = typeof value === "number" ? value : parseFloat(value) || 0;
  return `$${num.toLocaleString()}`;
};

export default function StatsCard({
  data,
  loading = false,
}: {
  data: {
    total_revenue?: number;
    total_course_revenue?: number;
    total_event_revenue?: number;
    current_month_revenue?: number;
  } | null;
  loading?: boolean;
}) {
  const statsData: StatItem[] = [
    {
      title: "Total Revenue",
      value: formatCurrency(data?.total_revenue ?? 0),
      percentage: "0%",
      icon: RedRevenueIcon,
    },
    {
      title: "Course Revenue",
      value: formatCurrency(data?.total_course_revenue ?? 0),
      percentage: "0%",
      icon: RedCardIcon,
    },
    {
      title: "Events Revenue",
      value: formatCurrency(data?.total_event_revenue ?? 0),
      percentage: "0%",
      icon: RedUsersIcon,
    },
    {
      title: "This Month",
      value: formatCurrency(data?.current_month_revenue ?? 0),
      percentage: "0%",
      icon: RedRevenueIcon,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-[#09141f] p-4 md:p-6 rounded-2xl relative overflow-hidden"
          >
            <Skeleton className="h-3 md:h-4 w-24 md:w-28 bg-[#1d2a3e]" />
            <Skeleton className="h-7 md:h-9 w-20 md:w-24 mt-4 md:mt-6 bg-[#1d2a3e]" />
            <div className="mt-3 md:mt-4 flex items-center gap-2">
              <Skeleton className="h-5 md:h-6 w-14 md:w-18 rounded-full bg-[#1d2a3e]" />
              <Skeleton className="h-3 md:h-4 w-16 md:w-24 bg-[#1d2a3e]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statsData.map((item, index) => (
        <div
          key={index}
          className="bg-[#09141f] p-4 md:p-6 rounded-2xl relative overflow-hidden"
        >
          <Image
            src={bgImg}
            alt="bg img"
            className="absolute top-0 right-0 w-24 h-24 md:w-auto md:h-auto"
          />
          <div className="flex items-center justify-between">
            <h3 className="text-white text-sm md:text-base">{item?.title}</h3>
            <item.icon className="w-5 h-5 md:w-auto md:h-auto" />
          </div>
          <h2 className="text-white text-2xl md:text-[32px] font-semibold mt-4 md:mt-6">
            {item?.value}
          </h2>
          <div>
            <p className="mt-1.5 flex items-center gap-2">
              <span
                className={`text-xs md:text-sm font-semibold py-1 px-2.5 bg-[#323541] rounded-full text-[#18CC3F]`}
              >
                {item?.percentage}
              </span>
              <span className="text-sm md:text-base text-[#8D9CDC]">
                {" "}
                vs last month
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
