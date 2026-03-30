import TeacherIcon from "@/components/icons/course-management/TeacherIcon";
import CameraIcon from "@/components/icons/others/CameraIcon";
import { UsersIcon } from "@/components/icons/sidebar.tsx/SidebarIcons";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import CalenderIcon from "@/components/icons/SuperAdmindashboard/CalenderIcon";
import ClockIcon from "@/components/icons/SuperAdmindashboard/ClockIcon";
import Link from "next/link";
import React, { useState } from "react";
import Assignments from "./Assignments";
import Attendence from "./Attendence";

const tabs = ["Assignments", " Assets", "Attendence"];
export default function ClassDetails({ classDetails, setClassDetails }) {
  const [activeTab, setActiveTab] = useState("Assignments");
  return (
    <div>
      {" "}
      <div className="flex items-center gap-2">
        <Link
          href={"/tutor-dashboard/my-courses"}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          My Courses
        </Link>
        <BreadCrumpRightArrow />
        <div
          onClick={() => setClassDetails(null)}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC] cursor-pointer"
        >
          Course Details
        </div>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">
          {classDetails} Details
        </p>
      </div>
      <div className="flex justify-between  items-center">
        {" "}
        {/* Title */}
        <h2 className="text-2xl text-[#E6E7E8] font-semibold mt-5">
          {classDetails} Details
        </h2>
        <div className="flex gap-2">
          <button className="bg-[#505B86] hover:bg-[#505B86]/50 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
            <span className=" text-xl leading-none">+</span> Reschedule Class
          </button>
          <button className="bg-[#E9201D] hover:bg-[#E9201D]/50 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
            <CameraIcon /> Start Class
          </button>
        </div>
      </div>
      {/* Card */}
      <div className="mt-5 bg-[#0A1929] rounded-2xl p-6 border border-[#0f1f35]">
        {/* Info Row */}
        <h3 className="text-2xl text-[#FFFFFF] my-4">Voice & Breath Control</h3>
        <div className="bg-[#07121D] rounded-2xl p-6 border border-[#0f1f35]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Teacher */}
            <div className="flex items-start gap-2">
              <TeacherIcon />
              <div>
                <p className="text-xs text-[#A5A5AB]">Teacher</p>
                <p className="text-sm text-white font-medium">
                  {/* {course.ins_name} */}
                  Wade Warren
                </p>
              </div>
            </div>
            {/* Enrollment */}
            <div className="flex items-start gap-2">
              <UsersIcon />
              <div>
                <p className="text-xs text-[#A5A5AB]">Enrollment</p>
                <p className="text-sm text-white font-medium">
                  {/* {course.students} students */}
                  45 students
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-2">
              <ClockIcon />
              <div>
                <p className="text-xs text-[#A5A5AB]">Duration</p>
                <p className="text-sm text-white font-medium">
                  {/* {course.duration} */}
                  45 Min
                </p>
              </div>
            </div>

            {/* Period */}
            <div className="flex items-start gap-2">
              <CalenderIcon />
              <div>
                <p className="text-xs text-[#A5A5AB]">Date & Time</p>
                <p className="text-sm text-white font-medium">
                  {/* {course.start_date} - 2024-10-24 */}
                  2024-08-01 ,1:30 PM
                </p>
              </div>
            </div>
          </div>
          {/* Overview */}
          <div className="mt-6">
            <h4 className="text-white font-medium">Course Overview</h4>
            <p className="text-sm text-[#A5A5AB] mt-2">
              This course consists of a 2-year period trajectory that runs 1 day
              a week on Sunday takes place.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 bg-[#0A1929] rounded-2xl p-6 border border-[#0f1f35]">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#1c2a3f]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium cursor-pointer ${
                activeTab === tab
                  ? "text-white border-b-2 border-[#E9201D]"
                  : "text-[#A5A5AB]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "Assignments" && <Assignments />}
          {activeTab === "Attendence" && <Attendence />}
        </div>
      </div>
    </div>
  );
}
