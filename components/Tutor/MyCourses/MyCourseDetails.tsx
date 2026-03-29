"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  TeacherIcon,
  UsersIcon,
} from "@/components/icons/sidebar.tsx/SidebarIcons";
import CalenderIcon from "@/components/icons/SuperAdmindashboard/CalenderIcon";
import ClockIcon from "@/components/icons/SuperAdmindashboard/ClockIcon";
import { coursesData } from "@/public/demoData/CoursesData";
import Link from "next/link";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import CourseModules from "./CourseModules";
import Assignments from "./Assignments";
import Students from "./Students";

const tabs = ["Course Modules", "Assignments", "Students"];
export default function MyCourseDetails() {
  const params = useParams();
  const course = coursesData.find((c) => c.id === Number(params.id));
  const [activeTab, setActiveTab] = useState("Course Modules");
  if (!course) {
    return <p className="text-white">Course not found</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/tutor-dashboard/my-courses"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          My Courses
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">My Courses</p>
      </div>
      {/* Title */}
      <h2 className="text-2xl text-[#E6E7E8] font-semibold mt-5">
        Course Details
      </h2>

      {/* Card */}
      <div className="mt-5 bg-[#07121d] rounded-2xl p-6 border border-[#0f1f35]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-white text-xl font-semibold">
            {course.course_name}
          </h3>

          <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2">
            🎥 Start Class
          </button>
        </div>

        {/* Info Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {/* Teacher */}
          <div className="flex items-start gap-2">
            <TeacherIcon />
            <div>
              <p className="text-xs text-[#A5A5AB]">Teacher</p>
              <p className="text-sm text-white font-medium">
                {course.ins_name}
              </p>
            </div>
          </div>

          {/* Enrollment */}
          <div className="flex items-start gap-2">
            <UsersIcon />
            <div>
              <p className="text-xs text-[#A5A5AB]">Enrollment</p>
              <p className="text-sm text-white font-medium">
                {course.students} students
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-2">
            <ClockIcon />
            <div>
              <p className="text-xs text-[#A5A5AB]">Duration</p>
              <p className="text-sm text-white font-medium">
                {course.duration}
              </p>
            </div>
          </div>

          {/* Period */}
          <div className="flex items-start gap-2">
            <CalenderIcon />
            <div>
              <p className="text-xs text-[#A5A5AB]">Period</p>
              <p className="text-sm text-white font-medium">
                {course.start_date} - 2024-10-24
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="mt-6">
          <h4 className="text-white font-medium">Course Overview</h4>
          <p className="text-sm text-[#A5A5AB] mt-2">
            This course consists of a 2-year period trajectory that runs 1 day a
            week on Sunday takes place.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Course Progress</h4>
            <span className="text-sm text-white">
              {
                // course.progress ||
                65
              }
              %
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#1c2a3f] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full"
              style={{
                width: `${
                  // course.progress ||
                  65
                }%`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#1c2a3f]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium ${
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
          {activeTab === "Course Modules" && <CourseModules />}
          {activeTab === "Assignments" && <Assignments />}
          {activeTab === "Students" && <Students />}
        </div>
      </div>
    </div>
  );
}
