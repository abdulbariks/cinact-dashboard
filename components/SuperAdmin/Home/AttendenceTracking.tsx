import DecreaseIcon from "@/components/icons/SuperAdmindashboard/DecreaseIcon";
import IncreaseIcon from "@/components/icons/SuperAdmindashboard/IncreaseIcon";
import { attendenceTrackingData } from "@/public/demoData/AttendenceTrackingData";
import React from "react";

export default function AttendenceTracking() {
  return (
    <div className=" bg-[#0a1929] p-4 rounded-2xl">
      <h2 className=" text-lg text-white font-medium">Attendance Tracking</h2>
      <div className=" space-y-3 rounded-[10px] mt-4">
        {attendenceTrackingData.map((item, index) => (
          <div key={index} className=" p-4 bg-[#07121d] rounded-[10px] ">
            <div className=" flex items-center justify-between">
              <h3 className=" text-sm text-white">{item.class}</h3>
              <div className=" flex items-center gap-1">
                <p className=" text-xs text-[#18CC3F] bg-[#1a2538] py-1 px-1.5 inline-block rounded-full">
                  {item.students} students
                </p>
                <div className=" bg-[#1a2538] inline-flex items-center gap-1 py-1 px-1.5 rounded-full">
                  <p
                    className={` text-xs  ${item.parcentage < "50" ? "text-[#E9201D]" : "text-white"}`}
                  >
                    {item.parcentage}
                  </p>
                  {item.parcentage > "50" ? <IncreaseIcon /> : <DecreaseIcon />}
                </div>
              </div>
            </div>
            <div className="w-full bg-[#202a3f] rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full transition-all duration-300 bg-[#5f6ca0] `}
                style={{ width: `${item.parcentage}` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
