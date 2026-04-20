"use client";
import React, { useEffect, useState } from "react";
import RightArrowIcon from "@/components/icons/others/RightArrowIcon";
import {
  PaymentIcon,
  TeacherIcon,
  UsersIcon,
} from "@/components/icons/sidebar.tsx/SidebarIcons";
import CalenderIcon from "@/components/icons/SuperAdmindashboard/CalenderIcon";
import ClockIcon from "@/components/icons/SuperAdmindashboard/ClockIcon";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllStatus } from "@/components/reusable/AllStatus";
import { coursesData } from "@/public/demoData/CoursesData";
import Link from "next/link";
import { parseCookies } from "nookies";
import { TutorService } from "@/service/tutor/tutor.service";
import { showErrorToast } from "@/lib/hotToast";
import { TGetCoursesResponse } from "@/types/tutor.mycourse";

export default function MyCourses() {
  const [allCourses, setAllCourses] = useState<TGetCoursesResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllCourses = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await TutorService.getAllCourses({
          token,
        });
        setAllCourses(response?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load dashboard overview",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAllCourses();
  }, []);

  console.log(allCourses?.data);
  return (
    <div>
      <h2 className=" text-2xl text-[#E6E7E8] font-semibold">My Courses</h2>
      <div className=" bg-[#0a1726] p-6 rounded-2xl mt-5">
        <div className=" flex flex-col gap-5 md:flex-row items-center justify-between">
          <h3 className=" text-white text-xl font-semibold">All Courses</h3>
          <div className=" flex flex-col gap-5 md:flex-row items-center">
            <div className=" relative w-80">
              <input
                type="text"
                name="search"
                // value={search}
                // onChange={handleChange}
                className=" w-full  py-2 px-4 rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                placeholder="Search Course`"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
                <SearchIcon />
              </button>
            </div>
            <AllStatus />
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-8">
          {allCourses?.data?.map((course, index) => (
            <div
              key={index}
              className=" bg-[#07121d] p-4 rounded-[12px] border-t-[0.5px] border-b-[0.5px] border-r-[0.5px] border-l-3 border-[#8D9CDC]"
            >
              <h2 className=" text-white text-lg font-medium">
                {course.title}
                <span className=" py-1 px-2.5 rounded-full text-sm text-[#18CC3F] bg-[#2a3d2e]  ml-2">
                  {course.status}
                </span>
              </h2>
              <div className=" mt-3 flex items-center gap-3">
                <div className=" border border-[#434656] bg-[#0A1A29] inline-block p-2 rounded-full">
                  <TeacherIcon />
                </div>
                <div>
                  <p className=" text-sm text-[#E6E7E8] ">
                    {course?.instructor?.name}
                  </p>
                  <p className=" text-xs text-[#A5A5AB] ">
                    {/* {course.ins_specification} */}
                    {course?.instructor?.email}
                  </p>
                </div>
              </div>
              <div className=" flex flex-col gap-5 md:flex-row items-center justify-between">
                <div className="mt-9 flex items-center gap-10">
                  <div>
                    <div className=" flex items-center gap-1">
                      <CalenderIcon />
                      <p className=" text-xs text-[#B2B5B8] ">Start Date</p>
                    </div>
                    <p className=" text-sm text-white font-medium mt-1.5">
                      {course.start_date}
                    </p>
                  </div>
                  <div>
                    <div className=" flex items-center gap-1">
                      <ClockIcon />
                      <p className=" text-xs text-[#B2B5B8] ">Duration</p>
                    </div>
                    <p className=" text-sm text-white font-medium mt-1.5">
                      {course.duration}
                    </p>
                  </div>
                  <div>
                    <div className=" flex items-center gap-1">
                      <UsersIcon />
                      <p className="text-xs text-[#B2B5B8]">Students</p>
                    </div>
                    <p className="text-sm text-white font-medium mt-1.5">
                      {course.seat_capacity}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/tutor-dashboard/my-courses/my-courses-details/${course.id}`}
                  className=" text-white inline-flex items-center gap-3 bg-[#5F6CA0] py-3 pl-3 pr-1.5  rounded-xl"
                >
                  View Course
                  <RightArrowIcon />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
