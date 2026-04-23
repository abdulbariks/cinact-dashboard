"use client";

import React, { useEffect, useState } from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { classes } from "./ModuleDetails";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import TeacherIcon from "@/components/icons/course-management/TeacherIcon";
import EnrollmentIcon from "@/components/icons/course-management/EnrollmentIcon";
import PeriodIcon from "@/components/icons/course-management/PeriodIcon";
import ClockIcon from "@/components/icons/SuperAdmindashboard/ClockIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssignmentIcon from "@/components/icons/course-management/AssignmentIcon";
import AssignmentIconSecondary from "@/components/icons/course-management/AssignmentIconSecondary";
import AssetsIcon from "@/components/icons/course-management/AssetsIcon";
import AssetsIconSecondary from "@/components/icons/course-management/AssetsIconSecondary";
import AttendenceIcon from "@/components/SuperAdmin/course-management/AttendenceIcon";
import AttendenceIconSecondary from "@/components/SuperAdmin/course-management/AttendenceIconSecondary";
import Attendence from "./Attendence";
import Assets from "./Assets";
import CameraIcon from "@/components/icons/others/CameraIcon";
import Assignments from "./Assignments";
import { parseCookies } from "nookies";
import { TutorService } from "@/service/tutor/tutor.service";
import { showErrorToast } from "@/lib/hotToast";
import { TGetClassResponse } from "@/types/tutor.mycourse";

interface ClassDetailsProps {
  courseId: string | undefined;
}
export default function ClassDetails() {
  const [activeTab, setActiveTab] = useState("assignments");
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [classData, setClassData] = useState({
    classTitle: "",
    className: "",
    classOverview: "",
    duration: "",
    date: "",
    time: "",
  });

  const path = usePathname();
  const courseId = path.split("/")[4];
  const classId = path.split("/")[5];
  // const classNo =
  //   classes.find((cls) => cls.id === path.split("/")[5])?.classNo ||
  //   "Class Details";

  // console.log("classId=================", classId);

  const [getClass, setGetClass] = useState<TGetClassResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadModules = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";

        const response = await TutorService.getClassById({
          classId: classId as string,
          token,
        });

        setGetClass(response?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load Class details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadModules();
    }
  }, [courseId]);

  // console.log("Class===============", getClass);

  const navItems = [
    {
      value: "assignments",
      label: "Assignments",
      icon: <AssignmentIcon />,
      activeIcon: <AssignmentIconSecondary />,
    },
    {
      value: "assets",
      label: "Assets",
      icon: <AssetsIcon />,
      activeIcon: <AssetsIconSecondary />,
    },
    {
      value: "attendence",
      label: "Attendence",
      icon: <AttendenceIcon />,
      activeIcon: <AttendenceIconSecondary />,
    },
  ];

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
        <Link
          href={`/tutor-dashboard/my-courses/my-courses-details/${courseId}`}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Course Details
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">
          {/* class -{classNo} Details{" "} */}
          {getClass?.data?.class_title} Details
        </p>
      </div>
      <div className=" flex items-center justify-between mt-8">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          {getClass?.data?.class_title} Details
        </h2>

        <div className=" flex items-center gap-3">
          <button
            // onClick={() => setIsEditClassOpen(true)}
            className=" p-3 rounded-2xl flex items-center gap-3 bg-[#5f6ca0] text-white font-medium cursor-pointer"
          >
            <PlusIcon /> Reschedule Class
          </button>
          <button className="p-3 rounded-2xl flex items-center gap-3 bg-[#e9201d] text-white font-medium cursor-pointer">
            <CameraIcon /> Start Class
          </button>
        </div>
      </div>

      <div className=" bg-[#0a1929] p-4 rounded-2xl mt-5">
        <h3 className=" text-xl text-white font-medium mb-4.5">
          {/* Voice & Breath Control */}
          {getClass?.data?.class_name}
        </h3>
        <div className=" bg-[#07121d] p-4 rounded-[10px] space-y-4">
          {/* item-1 */}
          <div className=" flex items-center justify-between"></div>
          {/* item-2 */}
          <div className=" flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className=" flex items-center gap-1">
                <TeacherIcon />
                <p className=" text-xs text-[#A5A5AB] ">Teacher</p>
              </div>
              <h3 className=" text-sm text-white font-medium mt-1.5">
                {/* Wade Warren */}
                {getClass?.data?.instructor?.name}
              </h3>
            </div>
            <div>
              <div className=" flex items-center gap-1">
                <EnrollmentIcon />
                <p className=" text-xs text-[#A5A5AB] ">Enrollment</p>
              </div>
              <h3 className=" text-sm text-white font-medium mt-1.5">
                {/* 45 students */}
                {getClass?.data?.enrollmentCount} students
              </h3>
            </div>
            <div>
              <div className=" flex items-center gap-1">
                <PeriodIcon />
                <p className=" text-xs text-[#A5A5AB] ">Duration</p>
              </div>
              <h3 className=" text-sm text-white font-medium mt-1.5">
                {/* 12 weeks */}
                {getClass?.data?.duration} weeks
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
            <h3 className=" text-xl text-white font-medium">Class Overview</h3>
            <p className=" mt-2.5 text-sm text-[#D2D2D5]">
              {/* This course consists of a 2-year period trajectory that runs 1 day
              a week on Sunday takes place. */}
              {getClass?.data?.class_overview}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#0a1929] p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-start border-b border-[#5F6CA0]  ">
            <TabsList className="  h-auto w-auto justify-start bg-transparent p-0 rounded-none">
              {navItems.map((item) => {
                const isActive = activeTab === item.value;

                return (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="px-5 py-5 flex items-center gap-2 whitespace-nowrap text-base font-medium rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white data-[state=active]:border-[#E9201D] text-[#8D9CDC] hover:text-white  "
                  >
                    {isActive ? item.activeIcon : item.icon}
                    <span>{item.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value="assignments" className="mt-4">
            <Assignments
              classTitle={getClass?.data?.class_title}
              subjectName={getClass?.data?.class_name}
            />
          </TabsContent>

          <TabsContent value="assets" className="mt-4">
            <Assets />
          </TabsContent>

          <TabsContent value="attendence" className="mt-4">
            <Attendence />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
