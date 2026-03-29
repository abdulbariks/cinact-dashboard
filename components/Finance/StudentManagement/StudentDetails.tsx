import React from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import studentProfileImg from "@/public/admin-dashboard/student-profile.png";
import Image from "next/image";
import EmailIcon from "@/components/icons/others/EmailIcon";
import ClockCalender from "@/components/icons/SuperAdmindashboard/ClockCalender";

const paymentHistoryData = [
  {
    id: 1,
    name: "Annual Tuition",
    date: "2024-08-25",
    status: "paid",
    amount: 2400,
  },
  {
    id: 2,
    name: "Annual Tuition",
    date: "2024-08-25",
    status: "paid",
    amount: 2400,
  },
  {
    id: 3,
    name: "Annual Tuition",
    date: "2024-08-25",
    status: "paid",
    amount: 2400,
  },

  {
    id: 4,
    name: "Next Payment Due",
    date: "2024-08-25",
    status: "due",
    amount: 2400,
  },
  {
    id: 5,
    name: "Annual Tuition",
    date: "2024-08-25",
    status: "paid",
    amount: 2400,
  },
  {
    id: 6,
    name: "Next Payment Due",
    date: "2024-08-25",
    status: "due",
    amount: 2400,
  },
];

export default function StudentDetails() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/finance-dashboard/student-management"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Student Management
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">Student Details</p>
      </div>

      <h2 className=" text-2xl text-[#E6E7E8] font-semibold mt-8">
        Student Details
      </h2>
      <div className=" bg-[#0A1929] p-4  rounded-2xl mt-5">
        <h3 className=" text-lg text-white font-medium">
          Personal Information
        </h3>
        <div className=" bg-[#07121D] p-4  rounded-[10px] mt-5">
          <div className=" flex flex-col lg:flex-row items-center  justify-between">
            <div className=" flex items-center gap-3">
              <Image src={studentProfileImg} alt="Student Profile" />
              <div>
                <h3 className=" text-white text-lg font-medium">
                  Sophie Lambert{" "}
                  <span className=" text-sm text-[#A5A5AB]">(6y exp)</span>{" "}
                </h3>
                <div className=" flex items-center gap-1.5 mt-1">
                  <EmailIcon />
                  <p className=" text-sm text-[#A5A5AB] ">
                    emma.witson@email.cam
                  </p>
                </div>
              </div>
            </div>
            <div className=" space-y-2.5">
              <div className="  flex items-center gap-1.5 ">
                <EmailIcon />
                <p className=" text-sm text-[#A5A5AB] ">
                  emma.witson@email.cam
                </p>
              </div>
              <div className="  flex items-center gap-1.5">
                <ClockCalender />
                <p className=" text-sm text-[#A5A5AB]">12/ 11 /2000</p>
              </div>
            </div>
          </div>

          <div className=" mt-4">
            <p className=" text-xs text-[#8C9196] ">Acting Goals / Interests</p>
            <p className=" text-sm text-[#DFE1E7] mt-1.5">
              Aspiring actor passionate about stage, screen, and voice
              performance.Currently training at CINACT to grow my performance
              skills and creative confidence.
            </p>
          </div>
        </div>
      </div>

      <div className=" bg-[#0A1929] p-4  rounded-2xl mt-4.5">
        <div className=" bg-[#07121d] p-4 rounded-[10px]">
          <h3 className=" text-xl text-white font-medium">Payment History</h3>
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {paymentHistoryData.map((item, index) => (
            <div key={index} className=" bg-[#07121D] p-4 rounded-[10px]">
              <div className=" flex items-center gap-2.5">
                <h3 className=" text-base text-white font-medium">
                  {item.name}
                </h3>
                <p
                  className={`${item.status === "paid" ? " text-[#18CC3F] bg-[#2a3d2e] " : "text-[#FFC943] bg-[#423c2f]"} py-1 px-2.5 rounded-full text-sm `}
                >
                  {item.status}
                </p>
              </div>

              <div className=" flex items-center justify-between mt-3">
                <p className=" text-sm text-[#A5A5AB]">Data: {item.date}</p>
                <p className=" text-base text-[#18CC3F] font-medium">
                  ${item.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
