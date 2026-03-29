import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import Link from "next/link";
import React from "react";

export default function CourseDetails() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/course-management"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Student Management
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">Course Details</p>
      </div>
      <div className=" mt-6">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          Course Details
        </h2>
        <div className=" bg-[#0a1929] p-4 rounded-2xl mt-5">
          <div className=" bg-[#07121d] p-4 rounded-[10px]">
            <div className=" flex items-center justify-between">
              <h3 className=" text-xl text-white font-medium">
                1 year program ( adult)
              </h3>

              <button className="bg-[#5f6ca0] text-sm  text-white font-medium  p-3 rounded-[12px] hover:bg-[#5F6CA0] flex items-center gap-2 cursor-pointer">
                <PlusIcon />
                Edit Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
