"use client";

import React, { useEffect, useState } from "react";
import ClockIcon from "@/components/icons/course-management/ClockIcon";
import EnrollmentIcon from "@/components/icons/course-management/EnrollmentIcon";
import PeriodIcon from "@/components/icons/course-management/PeriodIcon";
import TeacherIcon from "@/components/icons/course-management/TeacherIcon";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import ModuleIcon from "@/components/icons/course-management/ModuleIcon";
import StudentsIcon from "@/components/icons/course-management/StudentsIcon";
import ModuleSecondaryIcon from "@/components/icons/course-management/ModuleSecondaryIcon";
import StudentSecondaryIcon from "@/components/icons/course-management/StudentsSecondaryIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import CourseModules from "./CourseModules";
import CameraIcon from "@/components/icons/others/CameraIcon";
import Students from "./Students";
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import { TutorService } from "@/service/tutor/tutor.service";
import { showErrorToast } from "@/lib/hotToast";
import { TGetCourseByIdResponse } from "@/types/tutor.mycourse";

export default function CourseDetails() {
  const [activeTab, setActiveTab] = useState("modules");
  const params = useParams();
  const courseId = params?.id;
  // console.log(courseId);

  const [course, setCourse] = useState<TGetCourseByIdResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";

        const response = await TutorService.getCourseById({
          courseId: courseId as string,
          token,
        });

        setCourse(response?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load course details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const navItems = [
    {
      value: "modules",
      label: "Course Modules",
      icon: <ModuleIcon />,
      activeIcon: <ModuleSecondaryIcon />,
    },
    {
      value: "students",
      label: "Students",
      icon: <StudentsIcon />,
      activeIcon: <StudentSecondaryIcon />,
    },
  ];
  console.log("course=====", course?.data);

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
        <p className="text-base font-medium text-[#8D9CDC]">Course Details</p>
      </div>
      <div className=" mt-6">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          Course Details
        </h2>
        <div className=" bg-[#0a1929] p-4 rounded-2xl mt-5">
          <div className=" bg-[#07121d] p-4 rounded-[10px] space-y-4">
            {/* item-1 */}
            <div className=" flex items-center justify-between">
              <h3 className=" text-xl text-white font-medium">
                {/* 1 year program ( adult) */}
                {course?.data?.title}
              </h3>

              <button className="bg-[#E9201D]  text-sm  text-white font-medium  p-3 rounded-[12px] hover:bg-[#E9201D]/80 flex items-center gap-2 cursor-pointer">
                <CameraIcon />
                Start Class
              </button>
            </div>
            {/* item-2 */}
            <div className=" flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className=" flex items-center gap-1">
                  <TeacherIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Teacher</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {/* Wade Warren */}
                  {course?.data?.instructor?.name}
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <EnrollmentIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Enrollment</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {/* 45 students */}
                  {course?.data?.total_enrollments} students
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <PeriodIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Duration</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {/* 12 weeks */}
                  {course?.data?.duration} weeks
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <ClockIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Period</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  2024-08-01 - 2024-10-24
                </h3>
              </div>
            </div>
            {/* item-3 */}
            <div>
              <h3 className=" text-xl text-white font-medium">
                Course Overview
              </h3>
              <p className=" mt-2.5 text-sm text-[#D2D2D5]">
                {/* This course consists of a 2-year period trajectory that runs 1
                day a week on Sunday takes place. */}
                {course?.data?.course_overview}
              </p>
            </div>
            {/* item-4 */}
            <div>
              <div className=" flex items-center justify-between mt-4">
                <h4 className=" text-base text-white font-medium">
                  Course Progress
                </h4>
                <p className=" text-sm text-white ">65%</p>
              </div>

              <div className="mt-3 h-2 w-full rounded-full bg-[#202a3f] overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[#ffc943]"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* last section  */}
        <div className="mt-6 rounded-2xl bg-[#0a1929] p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between gap-4 border-b border-[#5F6CA0]">
              <TabsList className="h-auto w-auto justify-start bg-transparent p-0 rounded-none">
                {navItems.map((item) => {
                  const isActive = activeTab === item.value;

                  return (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className="px-5 py-5 flex items-center gap-2 whitespace-nowrap text-base font-medium rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white data-[state=active]:border-[#E9201D] text-[#8D9CDC] hover:text-white"
                    >
                      {isActive ? item.activeIcon : item.icon}
                      <span>{item.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <TabsContent value="modules" className="mt-4">
              <CourseModules courseId={course?.data?.id} />
            </TabsContent>
            <TabsContent value="students" className="mt-4">
              <Students />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
