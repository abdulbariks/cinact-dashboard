import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X, Calendar, Upload, ChevronDown, Plus } from "lucide-react";

export function AddAssignmentModal() {
  const inputStyles =
    "w-full bg-transparent border border-[#242D3D] rounded-[12px] p-4 text-white placeholder:text-[#374261] focus:outline-none focus:border-[#505B86] transition-all mt-2";
  const labelStyles = "text-[#A1AAB3] text-sm font-medium";

  return (
    <Dialog>
      {/* Trigger Button (The dashed one from previous step) */}
      <DialogTrigger asChild>
        <button className="flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2638] rounded-[12px] p-5 min-h-35 text-[#A1AAB3] hover:text-white hover:border-[#3E4766] transition-all w-full cursor-pointer">
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add Assignment</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-137.5 bg-[#07121D] border-none text-white p-8 rounded-[20px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C2632] pb-6 mb-6">
          <DialogTitle className="text-2xl font-semibold">
            Add Assignment
          </DialogTitle>
          <DialogClose className="bg-[#414B6F]/20 p-2 rounded-lg hover:bg-[#414B6F]/40 transition-colors">
            <X className="h-5 w-5 text-[#8D9CDC]" />
          </DialogClose>
        </div>

        <form className="space-y-6">
          {/* Assignment Description */}
          <div>
            <label className={labelStyles}>Assignment Description</label>
            <textarea
              placeholder="Describe the module overview..."
              rows={4}
              className={`${inputStyles} resize-none`}
            />
          </div>

          {/* Submissions Date */}
          <div>
            <label className={labelStyles}>Submissions Date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="mm/ dd /yyyy"
                className={inputStyles}
              />
              <Calendar className="absolute right-4 top-6 h-5 w-5 text-[#505B86]" />
            </div>
          </div>

          {/* Remark Total Number (Select-style) */}
          <div>
            <label className={labelStyles}>Remark Total Number</label>
            <div className="relative">
              <select
                className={`${inputStyles} appearance-none cursor-pointer`}
              >
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <ChevronDown className="absolute right-4 top-6 h-5 w-5 text-[#505B86] pointer-events-none" />
            </div>
          </div>

          {/* Attachments Drag & Drop */}
          <div>
            <label className={labelStyles}>Attachments</label>
            <div className="mt-2 border-2 border-dashed border-[#1C2632] rounded-[12px] p-8 flex flex-col items-center justify-center bg-[#0A121E]/50 group hover:border-[#505B86] transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-[#505B86] mb-3 group-hover:text-[#8D9CDC]" />
              <p className="text-white font-medium">Drag & drop file here</p>
              <p className="text-[#505B86] text-xs mt-1">
                Format: MP4, PDF document (max 5MB)
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-center gap-4 mt-8 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                className="w-full py-4 bg-[#3E4766] hover:bg-[#4a557a] rounded-[15px] font-semibold text-white transition-all"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="w-full py-4 bg-[#F23030] hover:bg-[#d42a2a] rounded-[15px] font-semibold text-white transition-all"
            >
              Add Assignment
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
