"use client";

import React, { useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ChevronDown, Plus } from "lucide-react";
import UploadIcon from "@/components/icons/SuperAdmindashboard/UploadIcon";

type AddAssetsData = {
  file: File | null;
};

type AddAssignmentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetsData: AddAssetsData;
  setAssetsData: React.Dispatch<React.SetStateAction<AddAssetsData>>;
  onAddAssets: () => Promise<void>;
};

export default function AddAssetsModal({
  open,
  onOpenChange,
  assetsData,
  setAssetsData,
  onAddAssets,
}: AddAssignmentModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAssetsData((prev) => ({ ...prev, file: e.target.files![0] }));
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
                {assetsData.file
                  ? assetsData.file.name
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
              onClick={onAddAssets}
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
