"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import { TutorService } from "@/service/tutor/tutor.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";

// Form Validation Schema
const remarkSchema = z.object({
  grade_number: z.string().min(1, "Required"),
  grade: z.enum(["A+", "A", "B", "C", "D", "F"], {
    required_error: "Required",
  }),
  feedback: z.string().min(5, "Feedback must be at least 5 characters"),
});

type UpdateRemarkAssignmentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string;
  studentName: string;
  grade_number?: number | string;
  grade?: "A+" | "A" | "B" | "C" | "D" | "F";
  feedback?: string;
};

export function UpdateRemarkAssignmentModal({
  open,
  onOpenChange,
  submissionId,
  studentName,
  grade_number,
  grade,
  feedback,
}: UpdateRemarkAssignmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(remarkSchema),
    defaultValues: {
      grade_number: "",
      grade: "A",
      feedback: "",
    },
  });

  // console.log("gradegrade", grade_number, grade);

  useEffect(() => {
    if (grade_number !== undefined) {
      setValue("grade_number", String(grade_number));
    }
    setValue("grade", grade || "A");
    setValue("feedback", feedback || "");
  }, [grade_number, grade, feedback, setValue]);

  // const onSubmit = (data) => {
  //   console.log("Remark Data Submitted:", data);
  //   // You can add your logic here (API call, state update, etc.)
  //   reset(); // Reset form after submission
  // };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Prepare payload with proper types
      const payload = {
        grade_number: Number(data.grade_number),
        grade: data.grade,
        feedback: data.feedback,
      };

      // Call the API
      const response = await TutorService.updateRemarkAssignment({
        submissionId,
        payload,
      });

      // Success handling
      // console.log("Remark Submitted Successfully");
      showSuccessToast(
        response?.data?.message || "Updated Remark Submitted Successfully",
      );
      reset();
      onOpenChange(false); // Close modal
    } catch (error) {
      // console.error("Failed to submit remark:", error);
      showErrorToast(error?.data?.message || "Failed to submit remark.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles =
    "w-full bg-transparent border border-[#242D3D] rounded-[12px] p-4 text-white placeholder:text-[#374261] focus:outline-none focus:border-[#505B86] transition-all mt-2";
  const labelStyles = "text-[#A1AAB3] text-sm font-medium";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 bg-[#0A1726] border-none text-white p-8 rounded-[20px] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1C2632] pb-6 mb-6">
          <DialogTitle className="text-2xl font-semibold">
            Update Remark Assignment
          </DialogTitle>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Remark Number */}
          <div className="relative">
            <label className={labelStyles}>Remark Number</label>
            <div className="relative">
              <input
                {...register("grade_number")}
                type="text"
                placeholder="Enter Number"
                className={inputStyles}
              />
              {/* <span className="absolute right-4 top-6 text-[#505B86] font-medium">
                /50
              </span> */}
            </div>
            {errors.grade_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.grade_number.message}
              </p>
            )}
          </div>

          {/* Grade Select */}
          <div>
            <label className={labelStyles}>Grade</label>
            <div className="relative">
              <select
                {...register("grade")}
                className={`${inputStyles} appearance-none cursor-pointer bg-[#505B86] border-b border-t-0 border-l-0 border-r-0 rounded-none focus:border-b-[#505B86] focus:border-t-0 focus:border-l-0 focus:border-r-0`}
              >
                <option className="bg-[#505B86]" value="A+">
                  A+
                </option>
                <option className="bg-[#505B86]" value="A">
                  A
                </option>
                <option className="bg-[#505B86]" value="B">
                  B
                </option>
                <option className="bg-[#505B86]" value="C">
                  C
                </option>
                <option className="bg-[#505B86]" value="D">
                  D
                </option>
                <option className="bg-[#505B86]" value="F">
                  F
                </option>
              </select>
              <ChevronDown className="absolute right-4 top-6 h-5 w-5 text-[#505B86] pointer-events-none" />
            </div>
          </div>

          {/* Tutor Feedback */}
          <div>
            <label className={labelStyles}>Tutor Feedback</label>
            <textarea
              {...register("feedback")}
              placeholder="Feedback..."
              rows={5}
              className={`${inputStyles} resize-none`}
            />
            {errors.feedback && (
              <p className="text-red-500 text-xs mt-1">
                {errors.feedback.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-3 bg-[#F23030] hover:bg-[#d42a2a] rounded-[15px] font-semibold text-white transition-all cursor-pointer"
            >
              {/* Submit Remark */}
              {isSubmitting ? "Submit Remark..." : "Submit Remark"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
