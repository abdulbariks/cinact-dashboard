import { recentEnrollmentsData } from "@/public/demoData/RecentEnrollmentData";
import Image from "next/image";
import React from "react";

export default function EnrolledStudents() {
  return (
    <div className="">
      <h2 className=" text-lg text-white font-medium">
        Enrolled Students (45)
      </h2>
      <div className=" space-y-3 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recentEnrollmentsData.map((item, index) => (
          <div
            key={index}
            className="bg-[#0A1621] p-5 rounded-[20px] border border-[#3D4566] w-full"
          >
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar with subtle border effect */}
              <div className="basis-[15%] flex justify-center">
                <Image
                  src={item.user_avatar}
                  alt="avatar"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>

              <div className="basis-[85%]">
                <h3 className="text-white text-lg font-medium leading-tight">
                  {item.user_name}
                </h3>
                <p className="text-[#A1AAB3] text-sm mt-3">ID-SP1420</p>
                <div className="flex gap-4 text-[#7B8AB8] text-sm mt-3 font-medium">
                  <p>Progress: 85%</p>
                  <p>Assignments: 8/10</p>
                </div>

                {/* Full width Progress Section */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="grow h-2.5 bg-[#242D3D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6D79A8] rounded-full transition-all duration-300"
                      style={{ width: `85%` }}
                    />
                  </div>
                  <span className="text-[#109334] font-medium text-sm min-w-7.5">
                    85%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
