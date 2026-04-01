import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X, Calendar, Clock } from "lucide-react";

export function AddClassModal() {
  const inputStyles =
    "w-full bg-transparent border border-[#242D3D] rounded-[12px] p-4 text-[#505B86] placeholder:text-[#374261] focus:outline-none focus:border-[#505B86] transition-all";
  const labelStyles = "text-[#A1AAB3] text-sm mb-2 block";

  return (
    <Dialog>
      {/* Trigger Button (Your provided code) */}
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full bg-[#07121d] p-4 rounded-[12px] border border-dashed border-[#505B86] min-h-30 flex flex-col items-center justify-center text-white hover:bg-[#0b1b2b] transition-colors cursor-pointer"
        >
          <span className="text-3xl leading-none">+</span>
          <span className="mt-2 text-lg font-medium">Add Class</span>
        </button>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="sm:max-w-137.5 bg-[#07121D] border-none text-white p-8 rounded-[20px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-[#1C2632] pb-4 mb-6">
          <DialogTitle className="text-2xl font-semibold">
            Add New Class
          </DialogTitle>
          <DialogClose className="bg-[#414B6F]/30 p-2 rounded-md hover:bg-[#414B6F]/50 transition-colors">
            <X className="h-5 w-5 text-[#8D9CDC]" />
          </DialogClose>
        </DialogHeader>

        <form className="space-y-5">
          {/* Class Title */}
          <div>
            <label className={labelStyles}>Class Title</label>
            <input
              type="text"
              placeholder="Enter Class Title"
              className={inputStyles}
            />
          </div>

          {/* Class Name */}
          <div>
            <label className={labelStyles}>Class Name</label>
            <input
              type="text"
              placeholder="Enter Class Name"
              className={inputStyles}
            />
          </div>

          {/* Class Overview */}
          <div>
            <label className={labelStyles}>Class Overview</label>
            <textarea
              placeholder="Describe the Class overview..."
              rows={4}
              className={`${inputStyles} resize-none`}
            />
          </div>

          {/* Duration */}
          <div>
            <label className={labelStyles}>Duration</label>
            <input
              type="text"
              placeholder="Enter Class Duration"
              className={inputStyles}
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Start Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="mm/ dd /yyyy"
                  className={inputStyles}
                />
                <Calendar className="absolute right-4 top-4 h-5 w-5 text-[#505B86]" />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Class Time</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="00.00"
                  className={inputStyles}
                />
                <Clock className="absolute right-4 top-4 h-5 w-5 text-[#505B86]" />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <DialogClose asChild>
              <button
                type="button"
                className="px-10 py-3 bg-[#414B6F]/40 hover:bg-[#414B6F]/60 rounded-[12px] font-medium transition-colors"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="px-10 py-3 bg-[#EE2D24] hover:bg-[#d12820] rounded-[12px] font-medium transition-colors"
            >
              Add Class
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
