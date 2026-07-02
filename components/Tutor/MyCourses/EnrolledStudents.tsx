import Image from "next/image";
import React from "react";
import { TEnrolledUser } from "@/types/tutor.mycourse";

type EnrolledStudentsProps = {
  enrolledUsers: TEnrolledUser[];
};

export default function EnrolledStudents({
  enrolledUsers,
}: EnrolledStudentsProps) {
  return (
    <div className="">
      <h2 className=" text-lg text-white font-medium">
        Enrolled Students ({enrolledUsers.length})
      </h2>
      <div className=" space-y-3 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {enrolledUsers.map((item) => (
          <div
            key={item.id}
            className="bg-[#0A1621] p-5 rounded-[20px] border border-[#3D4566] w-full"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="basis-[15%] flex justify-center">
                <div className="relative w-12 h-12 overflow-hidden rounded-full">
                  <Image
                    src={item.avatar_url || "/admin-dashboard/avatar-1.png"}
                    alt="avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              <div className="basis-[85%]">
                <h3 className="text-white text-lg font-medium leading-tight">
                  {item.name}
                </h3>
                <p className="text-[#A1AAB3] text-sm mt-3">
                  ID: {item.student_id}
                </p>
                <div className="flex gap-4 text-[#7B8AB8] text-sm mt-3 font-medium">
                  <p>Progress: {item.attendance_percentage}%</p>
                  <p>
                    Assignments: {item.assignments_completed}/
                    {item.total_assignments}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="grow h-2.5 bg-[#242D3D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6D79A8] rounded-full transition-all duration-300"
                      style={{ width: `${item.attendance_percentage}%` }}
                    />
                  </div>
                  <span className="text-[#109334] font-medium text-sm min-w-7.5">
                    {item.attendance_percentage}%
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
