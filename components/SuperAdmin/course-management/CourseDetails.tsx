"use client";

import React, { useState } from "react";
import ClockIcon from "@/components/icons/course-management/ClockIcon";
import EnrollmentIcon from "@/components/icons/course-management/EnrollmentIcon";
import PeriodIcon from "@/components/icons/course-management/PeriodIcon";
import TeacherIcon from "@/components/icons/course-management/TeacherIcon";
import CalenderIcon2 from "@/components/icons/others/CalenderIcon2";
import DropDownIcon from "@/components/icons/others/DropDownIcon";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import ModuleIcon from "@/components/icons/course-management/ModuleIcon";
import StudentsIcon from "@/components/icons/course-management/StudentsIcon";
import ModuleSecondaryIcon from "@/components/icons/course-management/ModuleSecondaryIcon";
import StudentSecondaryIcon from "@/components/icons/course-management/StudentsSecondaryIcon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Modules from "./Modules";
import Students from "./Students";

export default function CourseDetails() {
  const [activeTab, setActiveTab] = useState("modules");
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [editCourseData, setEditCourseData] = useState({
    courseTitle: "",
    instructor: "",
    startDate: "",
    classTime: "",
    assignInstructor: "",
    students: "",
  });

  const instructorOptions = ["Wade Warren", "Jane Cooper", "Devon Lane", "Bessie Cooper"];

  const inputClassName =
    "w-full rounded-2xl border border-[#3D4566] bg-transparent px-4 py-3 text-white placeholder:text-[#3D4566] outline-none focus:border-[#5F6CA0]";
  const labelClassName = "mb-2 block text-sm text-[#B2B5B8]";

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
                1 year program ( adult)
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
                  <TeacherIcon/>
                  <p className=" text-xs text-[#A5A5AB] ">Teacher</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">Wade Warren</h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <EnrollmentIcon/>
                  <p className=" text-xs text-[#A5A5AB] ">Enrollment</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">45 students</h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <PeriodIcon/>
                  <p className=" text-xs text-[#A5A5AB] ">Duration</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">12 weeks</h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                 <ClockIcon/>
                  <p className=" text-xs text-[#A5A5AB] ">Period</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">2024-08-01 - 2024-10-24</h3>
              </div>
            </div>
          {/* item-3 */}
            <div>
                <h3 className=" text-xl text-white font-medium">
               Course Overview
              </h3>
              <p className=" mt-2.5 text-sm text-[#D2D2D5]">This course consists of a 2-year period trajectory that runs 1 day a week on Sunday takes place.</p>
            </div>
            {/* item-4 */}
            <div>
              <div className=" flex items-center justify-between mt-4">
              <h4 className=" text-base text-white font-medium">Course Progress</h4>
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
              <div className="flex items-center gap-3">
                <button className="bg-[#5f6ca0] text-sm text-white font-medium px-4 py-2.5 rounded-[10px] hover:bg-[#6b78ad] flex items-center gap-2 cursor-pointer">
                  <PlusIcon />
                  Add Class
                </button>
                <button className="bg-[#5f6ca0] text-sm text-white font-medium px-4 py-2.5 rounded-[10px] hover:bg-[#6b78ad] flex items-center gap-2 cursor-pointer">
                  <PlusIcon />
                  Add Module
                </button>
              </div>
            </div>

            <TabsContent value="modules" className="mt-4">
            <Modules/>
            </TabsContent>

            <TabsContent value="students" className="mt-4">
            <Students/>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
        <DialogContent className="w-170 max-w-[95vw] rounded-2xl border-none bg-[#0A1726] p-6 text-white">
          <DialogHeader className="mb-2 border-b border-[#141B34] pb-4">
            <DialogTitle className="text-xl font-semibold text-white">Edit Course</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-5">
            <div>
              <label className={labelClassName}>Course Title</label>
              <input
                name="courseTitle"
                value={editCourseData.courseTitle}
                onChange={(e) =>
                  setEditCourseData((prev) => ({ ...prev, courseTitle: e.target.value }))
                }
                placeholder="Enter course title"
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>Assign Instructor</label>
              <Select
                value={editCourseData.instructor}
                onValueChange={(value) =>
                  setEditCourseData((prev) => ({ ...prev, instructor: value }))
                }
              >
                <SelectTrigger
                  icon={<DropDownIcon className="h-4 w-4" />}
                  className="w-full rounded-2xl border-[#3D4566] px-4 py-6 text-white"
                >
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent className="border-[#3D4566] bg-[#07121d] text-white">
                  {instructorOptions.map((instructor) => (
                    <SelectItem key={instructor} value={instructor}>
                      {instructor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClassName}>Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={editCourseData.startDate}
                    onChange={(e) =>
                      setEditCourseData((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    onClick={(e) => {
                      const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                      input.showPicker?.();
                    }}
                    onFocus={(e) => {
                      const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                      input.showPicker?.();
                    }}
                    className={`${inputClassName} pr-12 scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                  />
                  <CalenderIcon2 className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className={labelClassName}>Class Time</label>
                <div className="relative">
                  <input
                    type="time"
                    value={editCourseData.classTime}
                    onChange={(e) =>
                      setEditCourseData((prev) => ({ ...prev, classTime: e.target.value }))
                    }
                    onClick={(e) => {
                      const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                      input.showPicker?.();
                    }}
                    onFocus={(e) => {
                      const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                      input.showPicker?.();
                    }}
                    className={`${inputClassName} pr-12 scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    <ClockIcon />
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClassName}>Assign Instructor</label>
                <input
                  value={editCourseData.assignInstructor}
                  onChange={(e) =>
                    setEditCourseData((prev) => ({ ...prev, assignInstructor: e.target.value }))
                  }
                  placeholder="Assign instructor"
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>Students</label>
                <input
                  value={editCourseData.students}
                  onChange={(e) =>
                    setEditCourseData((prev) => ({ ...prev, students: e.target.value }))
                  }
                  placeholder="Enter students"
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditCourseOpen(false)}
                className=" rounded-[16px] bg-[#3D4566] py-4 px-11 text-base text-white font-medium hover:bg-[#5F6CA0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsEditCourseOpen(false)}
                className=" bg-[#E9201D] rounded-[16px] py-4 px-11 text-base text-white font-medium hover:bg-[#ff3b1f] transition-colors cursor-pointer flex items-center gap-2"
              >
                Edit Course
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      
    </div>
  );
}
