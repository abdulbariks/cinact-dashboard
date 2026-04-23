"use client";

import React, { useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ChevronDown, Plus } from "lucide-react";
import UploadIcon from "@/components/icons/SuperAdmindashboard/UploadIcon";

type AddAssignmentData = {
  description: string;
  date: string;
  totalMarks: string;
  file: File | null;
};

type AddAssignmentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentData: AddAssignmentData;
  setAssignmentData: React.Dispatch<React.SetStateAction<AddAssignmentData>>;
  onAddAssignment: () => Promise<void>;
};

export default function AddAssignmentModal({
  open,
  onOpenChange,
  assignmentData,
  setAssignmentData,
  onAddAssignment,
}: AddAssignmentModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAssignmentData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };
  const inputStyles =
    "w-full bg-transparent border border-[#242D3D] rounded-[12px] p-4 text-white placeholder:text-[#374261] focus:outline-none focus:border-[#505B86] transition-all mt-2";
  const labelStyles = "text-[#A1AAB3] text-sm font-medium";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-137.5 bg-[#0A1726] border-none text-white p-8 rounded-[20px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C2632] pb-6 mb-6">
          <DialogTitle className="text-2xl font-semibold">
            Add Assignment
          </DialogTitle>
        </div>

        <div className="space-y-6">
          {/* Assignment Description */}
          <div>
            <label className={labelStyles}>Assignment Description</label>
            <textarea
              placeholder="Describe the module overview..."
              rows={4}
              value={assignmentData.description}
              onChange={(e) =>
                setAssignmentData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={`${inputStyles} resize-none`}
            />
          </div>

          {/* Submissions Date */}
          <div>
            <label className={labelStyles}>Submissions Date</label>
            <div className="relative">
              <input
                type="date"
                value={assignmentData.date}
                onChange={(e) =>
                  setAssignmentData((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className={`${inputStyles} [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
              />
              <Calendar className="absolute right-4 top-6 h-5 w-5 text-[#505B86] pointer-events-none" />
            </div>
          </div>

          {/* Remark Total Number */}
          <div>
            <label className={labelStyles}>Remark Total Number</label>
            <div className="relative">
              <select
                value={assignmentData.totalMarks}
                onChange={(e) =>
                  setAssignmentData((prev) => ({
                    ...prev,
                    totalMarks: e.target.value,
                  }))
                }
                className={`${inputStyles} appearance-none cursor-pointer`}
              >
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <ChevronDown className="absolute right-4 top-6 h-5 w-5 text-[#505B86] pointer-events-none" />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className={labelStyles}>Attachments</label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 border-2 border-dashed border-[#1C2632] rounded-[12px] p-8 flex flex-col items-center justify-center bg-[#0A121E]/50 group hover:border-[#505B86] transition-colors cursor-pointer"
            >
              <UploadIcon />
              <p className="text-white font-medium">
                {assignmentData.file
                  ? assignmentData.file.name
                  : "Drag & drop file here"}
              </p>
              <p className="text-[#505B86] text-xs mt-1">
                Format: MP4, PDF document (max 5MB)
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-center gap-4 mt-8 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full py-4 bg-[#3E4766] hover:bg-[#4a557a] rounded-[15px] font-semibold text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onAddAssignment}
              className="w-full py-4 bg-[#F23030] hover:bg-[#d42a2a] rounded-[15px] font-semibold text-white transition-all cursor-pointer"
            >
              Add Assignment
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
