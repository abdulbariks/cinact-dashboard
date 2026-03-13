import { recentEnrollmentsData } from "@/public/demoData/RecentEnrollmentData";
import Image from "next/image";
import React from "react";

export default function RecentEnrollments() {
  return (
    <div className=" bg-[#0a1929] p-4 rounded-2xl">
      <h2 className=" text-lg text-white font-medium">Recent Enrollments</h2>
      <div className=" space-y-3 mt-4">
        {recentEnrollmentsData.map((item, index) => (
          <div key={index} className=" bg-[#07121d] p-4 rounded-[10px]">
            <div>
              <div className=" flex items-center justify-between">
                <div className=" flex items-center gap-2">
                  <Image src={item.avatar} alt="avatar" />
                  <div>
                    <h3 className=" text-white text-base font-medium mb-1">
                      {item.name}
                    </h3>
                    <p className=" text-sm text-[#D2D2D5] font-medium">
                      {item.time}
                    </p>
                  </div>
                </div>

                <p
                  className={` py-1 px-2.5 ${item.status === "Enrolled" ? "bg-[#2a3d2e] text-[#18CC3F]" : "bg-[#22251b]  text-[#ECAD11]"}  rounded-full`}
                >
                  {item.status}
                </p>
              </div>
              <p className=" text-base text-[#D2D2D5] mt-3">
                Course:{item.course}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
