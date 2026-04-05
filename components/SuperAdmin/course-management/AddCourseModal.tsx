"use client";

import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";

// Dynamically import Jodit for Next.js
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const courseSchema = z.object({
  courseTitle: z.string().min(1, "Title is required"),
  courseOverview: z.string().min(1, "Overview is required"),
  moduleDetails: z.string().min(1, "Module details are required"),
  startDate: z.string().min(1, "Date is required"),
  classTime: z.string().min(1, "Time is required"),
  instructor: z.string().min(1, "Instructor is required"),
  courseFee: z.string().min(1, "Fee is required"),
  installmentProcess: z.string().min(1, "Installment details are required"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export function AddCourseModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
  });

  const config = useMemo(
    () => ({
      readonly: false,
      theme: "dark",
      toolbarAdaptive: false,
      buttons: "bold,italic,underline,brush,|,ul,ol,|,align,link,image",
      height: 150,
      placeholder: "Write here...",
      style: {
        background: "transparent",
        color: "#fff",
      },
    }),
    [],
  );

  const onSubmit = (data: CourseFormValues) => {
    console.log("Form Submitted:", data);
    reset();
    onOpenChange(false);
  };

  const inputStyles =
    "w-full bg-transparent border border-[#242D3D] rounded-[12px] p-4 text-white placeholder:text-[#374261] focus:outline-none focus:border-[#505B86] transition-all mt-2";
  const labelStyles = "text-[#A1AAB3] text-sm font-medium";
  const errorStyles = "text-red-500 text-xs mt-1";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0A1726] border-none text-white p-8 rounded-[20px] shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        <div className="flex items-center justify-between border-b border-[#1C2632] pb-6 mb-6">
          <DialogTitle className="text-2xl font-semibold">
            Add New Course
          </DialogTitle>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 1. Course Title */}
          <div>
            <label className={labelStyles}>Course Title</label>
            <input
              {...register("courseTitle")}
              placeholder="Enter Course name"
              className={inputStyles}
            />
            {errors.courseTitle && (
              <p className={errorStyles}>{errors.courseTitle.message}</p>
            )}
          </div>

          {/* 2. Course Overview */}
          <div>
            <label className={labelStyles}>Course Overview</label>
            <div className="mt-2 border border-[#242D3D] rounded-[12px] overflow-hidden">
              <Controller
                name="courseOverview"
                control={control}
                render={({ field }) => (
                  <JoditEditor
                    value={field.value}
                    config={config}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.courseOverview && (
              <p className={errorStyles}>{errors.courseOverview.message}</p>
            )}
          </div>

          {/* 3. Course Module Details */}
          <div>
            <label className={labelStyles}>Course Module Details</label>
            <div className="mt-2 border border-[#242D3D] rounded-[12px] overflow-hidden">
              <Controller
                name="moduleDetails"
                control={control}
                render={({ field }) => (
                  <JoditEditor
                    value={field.value}
                    config={config}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.moduleDetails && (
              <p className={errorStyles}>{errors.moduleDetails.message}</p>
            )}
          </div>

          {/* 4 & 5. Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Start Date</label>
              <div className="relative mt-2">
                <input
                  type="date"
                  {...register("startDate")}
                  className={`${inputStyles} mt-0`}
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Class Time</label>
              <div className="relative mt-2">
                <input
                  type="time"
                  {...register("classTime")}
                  className={`${inputStyles} mt-0`}
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </div>
          </div>

          {/* 6. Assign Instructor */}
          <div>
            <label className={labelStyles}>Assign Instructor</label>
            <div className="relative">
              <select
                {...register("instructor")}
                className={`${inputStyles} appearance-none cursor-pointer`}
              >
                <option value="" className="bg-[#0A1726]">
                  Select teacher
                </option>
                <option value="instructor1" className="bg-[#0A1726]">
                  Instructor Name 1
                </option>
              </select>
              <ChevronDown className="absolute right-4 top-6 h-5 w-5 text-[#505B86] pointer-events-none" />
            </div>
          </div>

          {/* 7. Course Fee */}
          <div>
            <label className={labelStyles}>Course Fee</label>
            <input
              {...register("courseFee")}
              placeholder="Course price"
              className={inputStyles}
            />
          </div>

          {/* 8. Installment Process */}
          <div>
            <label className={labelStyles}>Installment Process</label>
            <div className="mt-2 border border-[#242D3D] rounded-[12px] overflow-hidden">
              <Controller
                name="installmentProcess"
                control={control}
                render={({ field }) => (
                  <JoditEditor
                    value={field.value}
                    config={config}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.installmentProcess && (
              <p className={errorStyles}>{errors.installmentProcess.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-4 bg-[#343D4E] hover:bg-[#404b5e] rounded-[15px] font-semibold text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-[#F23030] hover:bg-[#d42a2a] rounded-[15px] font-semibold text-white transition-all"
            >
              Create Course
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
