import React from "react";
import RedGradHat from "@/components/icons/SuperAdmindashboard/RedGradHat";
import RedTeacherIcon from "@/components/icons/SuperAdmindashboard/RedTeacherIcon";
import RedUsers from "@/components/icons/SuperAdmindashboard/RedUsers";
import bgImg from "@/public/admin-dashboard/stats-bg.png";
import Image from "next/image";

type StatItem = {
  title: string;
  value: number | string;
  percentage?: string;
  icon: React.ComponentType<{ className?: string }>;
};

const statsData: StatItem[] = [
  {
    title: "My Students",
    value: 127,
    icon: RedUsers,
  },
  {
    title: "Active Courses",
    value: 42,
    icon: RedGradHat,
  },
  {
    title: "Assignments",
    value: "12",
    icon: RedGradHat,
  },
  {
    title: "Completion",
    value: "127",
    icon: RedTeacherIcon,
  },
];

export default function StatsCard() {
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
          <div></div>
        </div>
      ))}
    </div>
  );
}
