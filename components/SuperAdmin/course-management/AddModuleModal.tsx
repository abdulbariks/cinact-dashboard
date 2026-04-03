"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type AddModuleData = {
  moduleTitle: string
  moduleName: string
  moduleOverview: string
}

type AddModuleModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  moduleData: AddModuleData
  setModuleData: React.Dispatch<React.SetStateAction<AddModuleData>>
}

export default function AddModuleModal({
  open,
  onOpenChange,
  moduleData,
  setModuleData,
}: AddModuleModalProps) {
  const inputClassName =
    "w-full rounded-2xl border border-[#3D4566] bg-transparent px-4 py-3 text-white placeholder:text-[#3D4566] outline-none focus:border-[#5F6CA0]"
  const labelClassName = "mb-2 block text-sm text-[#B2B5B8]"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-170 max-w-[95vw] rounded-2xl border-none bg-[#0A1726] p-6 text-white">
        <DialogHeader className="mb-2 border-b border-[#141B34] pb-4">
          <DialogTitle className="text-xl font-semibold text-white">Add New Module</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-5">
          <div>
            <label className={labelClassName}>Module Title</label>
            <input
              name="moduleTitle"
              value={moduleData.moduleTitle}
              onChange={(e) =>
                setModuleData((prev) => ({ ...prev, moduleTitle: e.target.value }))
              }
              placeholder="Enter module title"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Module Name</label>
            <input
              name="moduleName"
              value={moduleData.moduleName}
              onChange={(e) =>
                setModuleData((prev) => ({ ...prev, moduleName: e.target.value }))
              }
              placeholder="Enter module name"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Module Overview</label>
            <textarea
              name="moduleOverview"
              value={moduleData.moduleOverview}
              onChange={(e) =>
                setModuleData((prev) => ({ ...prev, moduleOverview: e.target.value }))
              }
              rows={5}
              placeholder="Describe the module overview..."
              className={`${inputClassName} resize-none py-4`}
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl bg-[#3D4566] px-11 py-4 text-base font-medium text-white transition-colors cursor-pointer hover:bg-[#5F6CA0]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex cursor-pointer items-center gap-2 rounded-2xl bg-[#E9201D] px-11 py-4 text-base font-medium text-white transition-colors hover:bg-[#ff3b1f]"
            >
              Add Module
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
