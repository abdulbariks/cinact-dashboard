"use client";

import React, { useEffect, useState } from "react";
import ClockIcon from "@/components/icons/course-management/ClockIcon";
import CalenderIcon2 from "@/components/icons/others/CalenderIcon2";
import DropDownIcon from "@/components/icons/others/DropDownIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminCourseManagementService,
  UserService,
} from "@/service/user/user.service";
import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { TCourse } from "@/types/tutor.mycourse";

type EditCourseData = {
  courseTitle: string;
  instructor: string;
  startDate: string;
  classTime: string;
  assignInstructor: string;
  students: string;
};

type EditCourseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editCourseData: EditCourseData;
  setEditCourseData: React.Dispatch<React.SetStateAction<EditCourseData>>;
  course?: TCourse | null;
  onCourseUpdated?: () => void;
};

type InstructorOption = {
  id: string;
  name: string;
  email?: string;
};

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export default function EditCourseModal({
  open,
  onOpenChange,
  editCourseData,
  setEditCourseData,
  course,
  onCourseUpdated,
}: EditCourseModalProps) {
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const inputClassName =
    "w-full rounded-2xl border border-[#3D4566] bg-transparent px-4 py-3 text-white placeholder:text-[#3D4566] outline-none focus:border-[#5F6CA0]";
  const labelClassName = "mb-2 block text-sm text-[#B2B5B8]";

  useEffect(() => {
    if (!open) return;

    const loadInstructors = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await UserService.getAllInstructors({
          token,
          page: 1,
          limit: 100,
        });

        const teachersData = response?.data?.data || [];
        setInstructors(
          teachersData.map((teacher: any) => ({
            id: teacher.id,
            name: teacher.name || "-",
            email: teacher.email,
          })),
        );
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load instructors",
        );
      }
    };

    loadInstructors();
  }, [open]);

  useEffect(() => {
    if (!open || !course) return;

    const selectedInstructor = instructors.find(
      (instructor) =>
        instructor.id === (course?.instructor as any)?.id ||
        instructor.email === course?.instructor?.email ||
        instructor.name === course?.instructor?.name,
    );

    setEditCourseData({
      courseTitle: course.title || "",
      instructor:
        selectedInstructor?.id || (course?.instructor as any)?.id || "",
      startDate: toDateInputValue(course.start_date),
      classTime: course.class_time || "",
      assignInstructor:
        selectedInstructor?.name || course?.instructor?.name || "",
      students: String(course.seat_capacity || ""),
    });
  }, [course, instructors, open, setEditCourseData]);

  const handleInstructorChange = (value: string) => {
    const selectedInstructor = instructors.find(
      (instructor) => instructor.id === value,
    );

    setEditCourseData((prev) => ({
      ...prev,
      instructor: value,
      assignInstructor: selectedInstructor?.name || "",
    }));
  };

  const handleEditCourse = async () => {
    if (!course?.id) return;

    setSubmitting(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const startDate = editCourseData.startDate
        ? new Date(`${editCourseData.startDate}T00:00:00.000Z`).toISOString()
        : "";

      const response = await AdminCourseManagementService.updateCourse({
        courseId: course.id,
        token,
        payload: {
          title: editCourseData.courseTitle,
          start_date: startDate,
          class_time: editCourseData.classTime,
          instructorId: editCourseData.instructor,
          assignInstructor: editCourseData.assignInstructor,
          seat_capacity: editCourseData.students,
        },
      });

      showSuccessToast(
        response?.data?.message || "Course updated successfully",
      );
      onOpenChange(false);
      onCourseUpdated?.();
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Failed to update course",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-170 max-w-[95vw] rounded-2xl border-none bg-[#0A1726] p-6 text-white">
        <DialogHeader className="mb-2 border-b border-[#141B34] pb-4">
          <DialogTitle className="text-xl font-semibold text-white">
            Edit Course
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-5">
          <div>
            <label className={labelClassName}>Course Title</label>
            <input
              name="courseTitle"
              value={editCourseData.courseTitle}
              onChange={(e) =>
                setEditCourseData((prev) => ({
                  ...prev,
                  courseTitle: e.target.value,
                }))
              }
              placeholder="Enter course title"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Assign Instructor</label>
            <Select
              value={editCourseData.instructor}
              onValueChange={handleInstructorChange}
            >
              <SelectTrigger
                icon={<DropDownIcon className="h-4 w-4" />}
                className="w-full rounded-2xl border-[#3D4566] px-4 py-6 text-white"
              >
                <SelectValue placeholder="Select instructor" />
              </SelectTrigger>
              <SelectContent className="border-[#3D4566] bg-[#07121d] text-white">
                {instructors.map((instructor) => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.name}
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
                    setEditCourseData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  onClick={(e) => {
                    const input = e.currentTarget as HTMLInputElement & {
                      showPicker?: () => void;
                    };
                    input.showPicker?.();
                  }}
                  onFocus={(e) => {
                    const input = e.currentTarget as HTMLInputElement & {
                      showPicker?: () => void;
                    };
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
                    setEditCourseData((prev) => ({
                      ...prev,
                      classTime: e.target.value,
                    }))
                  }
                  onClick={(e) => {
                    const input = e.currentTarget as HTMLInputElement & {
                      showPicker?: () => void;
                    };
                    input.showPicker?.();
                  }}
                  onFocus={(e) => {
                    const input = e.currentTarget as HTMLInputElement & {
                      showPicker?: () => void;
                    };
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
                placeholder="Assign instructor"
                readOnly
                className={`${inputClassName} cursor-not-allowed opacity-80`}
              />
            </div>
            <div>
              <label className={labelClassName}>Students</label>
              <input
                value={editCourseData.students}
                onChange={(e) =>
                  setEditCourseData((prev) => ({
                    ...prev,
                    students: e.target.value,
                  }))
                }
                placeholder="Enter students"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className=" rounded-2xl bg-[#3D4566] py-4 px-11 text-base text-white font-medium hover:bg-[#5F6CA0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditCourse}
              disabled={submitting}
              className=" bg-[#E9201D] rounded-2xl py-4 px-11 text-base text-white font-medium hover:bg-[#ff3b1f] transition-colors cursor-pointer flex items-center gap-2"
            >
              {submitting ? "Saving..." : "Edit Course"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
