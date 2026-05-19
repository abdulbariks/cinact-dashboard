"use client";

import React, { useCallback, useEffect, useState } from "react";
import ClockIcon from "@/components/icons/course-management/ClockIcon";
import EnrollmentIcon from "@/components/icons/course-management/EnrollmentIcon";
import PeriodIcon from "@/components/icons/course-management/PeriodIcon";
import TeacherIcon from "@/components/icons/course-management/TeacherIcon";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import ModuleIcon from "@/components/icons/course-management/ModuleIcon";
import StudentsIcon from "@/components/icons/course-management/StudentsIcon";
import ModuleSecondaryIcon from "@/components/icons/course-management/ModuleSecondaryIcon";
import StudentSecondaryIcon from "@/components/icons/course-management/StudentsSecondaryIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import AddClassModal from "./AddClassModal";
import AddModuleModal from "./AddModuleModal";
import Modules from "./Modules";
import Students from "./Students";
import EditCourseModal from "./EditCourseModal";
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import { AdminCourseManagementService } from "@/service/user/user.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { TGetCourseByIdResponse } from "@/types/tutor.mycourse";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (value?: string) => {
  if (!value) return "No Date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function CourseDetails() {
  const [activeTab, setActiveTab] = useState("modules");
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId;
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [editCourseData, setEditCourseData] = useState({
    courseTitle: "",
    instructor: "",
    startDate: "",
    classTime: "",
    status: "DRAFT",
    students: "",
  });
  const [classData, setClassData] = useState({
    classTitle: "",
    className: "",
    classOverview: "",
    duration: "",
    class_date: "",
    class_time: "",
  });

  const [moduleData, setModuleData] = useState({
    moduleTitle: "",
    moduleName: "",
    moduleOverview: "",
  });
  const [course, setCourse] = useState<TGetCourseByIdResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCourse = useCallback(async () => {
    if (!courseId) return;

    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminCourseManagementService.getCourseById({
        courseId,
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
  }, [courseId]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleAddModule = async () => {
    if (!courseId) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminCourseManagementService.createCourseModule({
        courseId,
        token,
        payload: {
          module_title: moduleData.moduleTitle,
          module_name: moduleData.moduleName,
          module_overview: moduleData.moduleOverview,
        },
      });

      showSuccessToast(response?.data?.message || "Module added successfully");
      setModuleData({ moduleTitle: "", moduleName: "", moduleOverview: "" });
      setIsAddModuleOpen(false);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to add module");
    }
  };

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

  if (loading) {
    return (
      <div>
        <Skeleton className="h-6 w-72 bg-[#1d2a3e]" />
        <Skeleton className="mt-8 h-8 w-52 bg-[#1d2a3e]" />
        <Skeleton className="mt-5 h-64 rounded-2xl bg-[#1d2a3e]" />
        <Skeleton className="mt-6 h-96 rounded-2xl bg-[#1d2a3e]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/course-management"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Course Management
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
                {course?.data?.title || "Course"}
              </h3>

              <button
                onClick={() => setIsEditCourseOpen(true)}
                className="bg-[#5f6ca0] text-sm  text-white font-medium  p-3 rounded-[12px] hover:bg-[#5F6CA0] flex items-center gap-2 cursor-pointer"
              >
                <PlusIcon />
                Edit Course
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
                  {course?.data?.instructor?.name || "-"}
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <EnrollmentIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Enrollment</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {course?.data?.total_enrollments || 0} students
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <PeriodIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Duration</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {course?.data?.duration || "-"}
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <ClockIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Period</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {formatDate(course?.data?.start_date)}
                </h3>
              </div>
            </div>
            {/* item-3 */}
            <div>
              <h3 className=" text-xl text-white font-medium">
                Course Overview
              </h3>
              {course?.data?.course_overview ? (
                <div
                  className="mt-2.5 text-sm text-[#D2D2D5]"
                  dangerouslySetInnerHTML={{
                    __html: course.data.course_overview,
                  }}
                />
              ) : (
                <p className="mt-2.5 text-sm text-[#D2D2D5]">
                  No overview available.
                </p>
              )}
            </div>
            {/* item-4 */}
            <div>
              <div className="flex items-center justify-between mt-4">
                <h4 className="text-base text-white font-medium">
                  Course Progress
                </h4>
                <p className="text-sm text-white ">65%</p>
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
              <div className="flex items-center gap-3">
                {/* <button
                  onClick={() => setIsAddClassOpen(true)}
                  className="bg-[#5f6ca0] text-sm text-white font-medium px-4 py-2.5 rounded-[10px] hover:bg-[#6b78ad] flex items-center gap-2 cursor-pointer"
                >
                  <PlusIcon />
                  Add Class
                </button> */}
                <button
                  onClick={() => setIsAddModuleOpen(true)}
                  className="bg-[#5f6ca0] text-sm text-white font-medium px-4 py-2.5 rounded-[10px] hover:bg-[#6b78ad] flex items-center gap-2 cursor-pointer"
                >
                  <PlusIcon />
                  Add Module
                </button>
              </div>
            </div>

            <TabsContent value="modules" className="mt-4">
              <Modules courseId={courseId} />
            </TabsContent>

            <TabsContent value="students" className="mt-4">
              <Students />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <EditCourseModal
        open={isEditCourseOpen}
        onOpenChange={setIsEditCourseOpen}
        editCourseData={editCourseData}
        setEditCourseData={setEditCourseData}
        course={course?.data}
        onCourseUpdated={loadCourse}
      />

      <AddClassModal
        open={isAddClassOpen}
        onOpenChange={setIsAddClassOpen}
        classData={classData}
        setClassData={setClassData}
      />

      <AddModuleModal
        open={isAddModuleOpen}
        onOpenChange={setIsAddModuleOpen}
        moduleData={moduleData}
        setModuleData={setModuleData}
        onAddModule={handleAddModule}
      />
    </div>
  );
}
