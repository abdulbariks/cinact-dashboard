"use client";

import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AdminCourseManagementService } from "@/service/user/user.service";
import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";

// Dynamically import Jodit for Next.js
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  course_overview: z.string().min(1, "Overview is required"),
  rules_regulations: z.string().min(1, "Module details are required"),
  contract: z.string().min(1, "Module contract are required"),
  duration: z.string().min(1, "Duration is required"),
  start_date: z.string().min(1, "Date is required"),
  class_time: z.string().min(1, "Time is required"),
  fee_pence: z.string().min(1, "Fee is required"),
  seat_capacity: z.string().min(1, "Seat capacity is required"),
  installment_process: z.string().min(1, "Installment details are required"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export function AddCourseModal({
  open,
  onOpenChange,
  onCourseCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCourseCreated?: () => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      course_overview: "",
      rules_regulations: "",
      contract: "",
      duration: "",
      start_date: "",
      class_time: "",
      fee_pence: "",
      seat_capacity: "",
      installment_process: "",
    },
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

  const onSubmit = async (data: CourseFormValues) => {
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const startDate = new Date(
        `${data.start_date}T00:00:00.000Z`,
      ).toISOString();

      const response = await AdminCourseManagementService.createCourse({
        token,
        payload: {
          title: data.title,
          course_overview: data.course_overview,
          rules_regulations: data.rules_regulations,
          contract: data.contract,
          duration: data.duration,
          start_date: startDate,
          class_time: data.class_time,
          fee_pence: Number(data.fee_pence),
          installment_process: data.installment_process,
          seat_capacity: data.seat_capacity,
        },
      });

      showSuccessToast(
        response?.data?.message || "Course created successfully",
      );
      reset();
      onOpenChange(false);
      onCourseCreated?.();
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Failed to create course",
      );
    }
  };

  const inputStyles =
    "w-full bg-transparent border border-[#242D3D] rounded-[12px] p-4 text-white placeholder:text-[#374261] focus:outline-none focus:border-[#505B86] transition-all mt-2";
  const labelStyles = "text-[#A1AAB3] text-sm font-medium";
  const errorStyles = "text-red-500 text-xs mt-1";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 bg-[#0A1726] border-none text-white p-8 rounded-[20px] shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
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
              {...register("title")}
              placeholder="Enter Course name"
              className={inputStyles}
            />
            {errors.title && (
              <p className={errorStyles}>{errors.title.message}</p>
            )}
          </div>

          {/* 2. Course Overview */}
          <div>
            <label className={labelStyles}>Course Overview</label>
            <div className="mt-2 border border-[#242D3D] rounded-[12px] overflow-hidden">
              <Controller
                name="course_overview"
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
            {errors.course_overview && (
              <p className={errorStyles}>{errors.course_overview.message}</p>
            )}
          </div>

          {/* 3. Course Module Details */}
          <div>
            <label className={labelStyles}>Course Rules Regulations Details</label>
            <div className="mt-2 border border-[#242D3D] rounded-[12px] overflow-hidden">
              <Controller
                name="rules_regulations"
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
            {errors.rules_regulations && (
              <p className={errorStyles}>
                {errors.rules_regulations.message}
              </p>
            )}
          </div>

        {/* 3. Course contract Details */}
          <div>
            <label className={labelStyles}>Course Contract Details</label>
            <div className="mt-2 border border-[#242D3D] rounded-[12px] overflow-hidden">
              <Controller
                name="contract"
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
            {errors.contract && (
              <p className={errorStyles}>
                {errors.contract.message}
              </p>
            )}
          </div>

          {/* 4. Duration */}
          <div>
            <label className={labelStyles}>Duration</label>
            <input
              {...register("duration")}
              placeholder="6 weeks"
              className={inputStyles}
            />
            {errors.duration && (
              <p className={errorStyles}>{errors.duration.message}</p>
            )}
          </div>

          {/* 5 & 6. Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Start Date</label>
              <div className="relative mt-2">
                <input
                  type="date"
                  {...register("start_date")}
                  className={`${inputStyles} mt-0`}
                  style={{ colorScheme: "dark" }}
                />
                {errors.start_date && (
                  <p className={errorStyles}>{errors.start_date.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className={labelStyles}>Class Time</label>
              <div className="relative mt-2">
                <input
                  type="time"
                  {...register("class_time")}
                  className={`${inputStyles} mt-0`}
                  style={{ colorScheme: "dark" }}
                />
                {errors.class_time && (
                  <p className={errorStyles}>{errors.class_time.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 7. Course Fee */}
          <div>
            <label className={labelStyles}>Course Fee</label>
            <input
              {...register("fee_pence")}
              placeholder="Course price"
              className={inputStyles}
            />
            {errors.fee_pence && <p className={errorStyles}>{errors.fee_pence.message}</p>}
          </div>

          {/* 8. Seat Capacity */}
          <div>
            <label className={labelStyles}>Seat Capacity</label>
            <input
              {...register("seat_capacity")}
              placeholder="100"
              className={inputStyles}
            />
            {errors.seat_capacity && (
              <p className={errorStyles}>{errors.seat_capacity.message}</p>
            )}
          </div>

          {/* 9. Installment Process */}
          <div>
            <label className={labelStyles}>Installment Process</label>
            <div className="mt-2 border border-[#242D3D] rounded-[12px] overflow-hidden">
              <Controller
                name="installment_process"
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
            {errors.installment_process && (
              <p className={errorStyles}>
                {errors.installment_process.message}
              </p>
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
