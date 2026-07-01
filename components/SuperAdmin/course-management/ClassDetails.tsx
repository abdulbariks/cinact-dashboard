"use client";

import React, { useCallback, useEffect, useState } from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import AttendenceIcon from "./AttendenceIcon";
import AttendenceIconSecondary from "./AttendenceIconSecondary";
import AllAssignments from "./AllAssignments";
import EditClassModal from "./EditClassModal";
import ClassAttendence from "./ClassAttendence";
import Assets from "./Assets";
import { parseCookies } from "nookies";
import { AdminCourseManagementService } from "@/service/user/user.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { TGetClassResponse } from "@/types/tutor.mycourse";

type EditClassData = {
  classTitle: string;
  className: string;
  classOverview: string;
  duration: string;
  date: string;
  time: string;
};

const emptyClassData: EditClassData = {
  classTitle: "",
  className: "",
  classOverview: "",
  duration: "",
  date: "",
  time: "",
};

const getDateInputValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const getTimeInputValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(11, 16);
};

const formatPeriod = (startAt?: string | null, endAt?: string | null) => {
  if (!startAt && !endAt) return "-";
  const start = startAt ? new Date(startAt) : null;
  const end = endAt ? new Date(endAt) : null;
  const format = (date: Date | null) =>
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("en-US")
      : "-";

  return `${format(start)} - ${format(end)}`;
};

export default function ClassDetails() {
  const [activeTab, setActiveTab] = useState("assignments");
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [classData, setClassData] = useState<EditClassData>(emptyClassData);
  const [getClass, setGetClass] = useState<TGetClassResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ courseId: string; classId: string }>();
  const courseId = params?.courseId;
  const classId = params?.classId;
  const classDetails = getClass?.data;

  const loadClass = useCallback(async () => {
    if (!classId) return;

    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminCourseManagementService.getClassById({
        classId,
        token,
      });

      const nextClass = response?.data || null;
      setGetClass(nextClass);
      if (nextClass?.data) {
        setClassData({
          classTitle: nextClass.data.class_title || "",
          className: nextClass.data.class_name || "",
          classOverview: nextClass.data.class_overview || "",
          duration: String(nextClass.data.duration ?? ""),
          date: getDateInputValue(nextClass.data.start_at),
          time: getTimeInputValue(nextClass.data.start_at),
        });
      }
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load class details",
      );
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadClass();
  }, [loadClass]);

  const handleEditClass = async () => {
    if (!classId) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const payload: Record<string, string | number> = {
        class_title: classData.classTitle,
        class_name: classData.className,
        class_overview: classData.classOverview,
        duration: Number(classData.duration),
      };

      if (classData.date) payload.class_date = classData.date;
      if (classData.time) payload.class_time = classData.time;

      const response = await AdminCourseManagementService.updateClass({
        classId,
        token,
        payload,
      });

      showSuccessToast(response?.data?.message || "Class updated successfully");
      setIsEditClassOpen(false);
      await loadClass();
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Failed to update class",
      );
    }
  };

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

  if (loading) {
    return <div className="text-[#A5A5AB]">Loading class details...</div>;
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
        <Link
          href={`/dashboard/course-management/course-details/${courseId}`}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Course Details
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">
          {classDetails?.class_title || "Class"} Details
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#E6E7E8]">
          {classDetails?.class_title || "Class"} Details
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditClassOpen(true)}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[#5f6ca0] p-3 font-medium text-white"
          >
            <PlusIcon /> Edit Class
          </button>
          <button className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[#e9201d] p-3 font-medium text-white">
            <PlusIcon /> Generate QR Code
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-[#0a1929] p-4">
        <h3 className="mb-4.5 text-xl font-medium text-white">
          {classDetails?.class_name || "-"}
        </h3>
        <div className="space-y-4 rounded-[10px] bg-[#07121d] p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1">
                <TeacherIcon />
                <p className="text-xs text-[#A5A5AB]">Teacher</p>
              </div>
              <h3 className="mt-1.5 text-sm font-medium text-white">
                {classDetails?.instructor?.name || "-"}
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <EnrollmentIcon />
                <p className="text-xs text-[#A5A5AB]">Enrollment</p>
              </div>
              <h3 className="mt-1.5 text-sm font-medium text-white">
                {classDetails?.total_enrollments ?? 0} students
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <PeriodIcon />
                <p className="text-xs text-[#A5A5AB]">Duration</p>
              </div>
              <h3 className="mt-1.5 text-sm font-medium text-white">
                {classDetails?.duration ?? "-"} minutes
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <ClockIcon />
                <p className="text-xs text-[#A5A5AB]">Period</p>
              </div>
              <h3 className="mt-1.5 text-sm font-medium text-white">
                {formatPeriod(classDetails?.start_at, classDetails?.end_at)}
              </h3>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium text-white">Class Overview</h3>
            <p className="mt-2.5 text-sm text-[#D2D2D5]">
              {classDetails?.class_overview || "No overview available."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#0a1929] p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-start border-b border-[#5F6CA0]">
            <TabsList className="h-auto w-auto justify-start rounded-none bg-transparent p-0">
              {navItems.map((item) => {
                const isActive = activeTab === item.value;

                return (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="flex whitespace-nowrap rounded-none border-0 border-b-2 border-transparent bg-transparent px-5 py-5 text-base font-medium text-[#8D9CDC] shadow-none hover:text-white data-[state=active]:border-[#E9201D] data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    {isActive ? item.activeIcon : item.icon}
                    <span>{item.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value="assignments" className="mt-4">
            <AllAssignments />
          </TabsContent>

          <TabsContent value="assets" className="mt-4">
            <Assets />
          </TabsContent>

<TabsContent value="attendence" className="mt-4">
             <ClassAttendence classId={classId} />
           </TabsContent>
        </Tabs>
      </div>

      <EditClassModal
        open={isEditClassOpen}
        onOpenChange={setIsEditClassOpen}
        classData={classData}
        setClassData={setClassData}
        onEditClass={handleEditClass}
      />
    </div>
  );
}
