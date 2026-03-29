import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import React from "react";

export default function ClassDetails() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/tutor-dashboard/my-courses"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          My Courses
        </Link>
        <BreadCrumpRightArrow />
        <Link
          href="/tutor-dashboard/my-courses/my-courses-details/1"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Course Details
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">Class Details</p>
      </div>
    </div>
  );
}
