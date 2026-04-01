"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X, ChevronDown } from "lucide-react";

// Form Validation Schema
const remarkSchema = z.object({
  remarkNumber: z.string().min(1, "Required"),
  grade: z.string().min(1, "Required"),
  feedback: z.string().min(5, "Feedback must be at least 5 characters"),
});

export function RemarkAssignmentModal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(remarkSchema),
    defaultValues: {
      grade: "A Grade",
    },
  });

  const onSubmit = (data) => {
    console.log("Remark Data Submitted:", data);
    // You can add your logic here (API call, state update, etc.)
    reset(); // Reset form after submission
  };

  const inputStyles =
    "w-full bg-transparent border border-[#242D3D] rounded-[12px] p-4 text-white placeholder:text-[#374261] focus:outline-none focus:border-[#505B86] transition-all mt-2";
  const labelStyles = "text-[#A1AAB3] text-sm font-medium";

  return (
    <Dialog onOpenChange={(open) => !open && reset()}>
      {/* Trigger: Connect this to your 'Remark Assignment' button */}
      <DialogTrigger asChild>
        <button className="bg-[#F23030] text-white text-xs px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors cursor-pointer">
          Remark Assignment
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 bg-[#07121D] border-none text-white p-8 rounded-[20px] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1C2632] pb-6 mb-6">
          <DialogTitle className="text-2xl font-semibold">
            Remark Assignment
          </DialogTitle>
          <DialogClose className="bg-[#414B6F]/20 p-2 rounded-lg hover:bg-[#414B6F]/40 transition-colors">
            <X className="h-5 w-5 text-[#8D9CDC]" />
          </DialogClose>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Remark Number */}
          <div className="relative">
            <label className={labelStyles}>Remark Number</label>
            <div className="relative">
              <input
                {...register("remarkNumber")}
                type="text"
                placeholder="Enter Number"
                className={inputStyles}
              />
              <span className="absolute right-4 top-6 text-[#505B86] font-medium">
                /50
              </span>
            </div>
            {errors.remarkNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.remarkNumber.message}
              </p>
            )}
          </div>

          {/* Grade Select */}
          <div>
            <label className={labelStyles}>Grade</label>
            <div className="relative">
              <select
                {...register("grade")}
                className={`${inputStyles} appearance-none cursor-pointer`}
              >
                <option value="A Grade">A Grade</option>
                <option value="B Grade">B Grade</option>
                <option value="C Grade">C Grade</option>
                <option value="F Grade">F Grade</option>
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
              className="px-10 py-3 bg-[#F23030] hover:bg-[#d42a2a] rounded-[15px] font-semibold text-white transition-all cursor-pointer"
            >
              Submit Remark
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
