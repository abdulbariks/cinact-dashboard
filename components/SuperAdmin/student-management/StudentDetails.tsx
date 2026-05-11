"use client";
import React, { useEffect, useState } from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import Image from "next/image";
import EmailIcon from "@/components/icons/others/EmailIcon";
import ClockCalender from "@/components/icons/SuperAdmindashboard/ClockCalender";
import { useParams } from "next/navigation";
import { UserService } from "@/service/user/user.service";
import { showErrorToast } from "@/lib/hotToast";

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
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log("student==========", student);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await UserService.getStudentDetails({
          id: id as string,
        });
        setStudent(response.data);
      } catch (error) {
        showErrorToast("Failed to fetch student details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!student) return <div className="p-6 text-white">Student not found.</div>;

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/student-management"
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
              <Image
                src={student?.data?.avatar}
                alt="Student Profile"
                height={40}
                width={40}
                unoptimized
                className="rounded-full h-20 w-20"
              />
              <div>
                <h3 className=" text-white text-lg font-medium">
                  {student?.data?.name}
                  <span className=" text-sm text-[#A5A5AB]">
                    ( {student?.data?.experience_level})
                  </span>
                </h3>
                <div className=" flex items-center gap-1.5 mt-1">
                  <EmailIcon />
                  <p className=" text-sm text-[#A5A5AB] ">
                    {student?.data?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className=" space-y-2.5">
              <div className="  flex items-center gap-1.5 ">
                <EmailIcon />
                <p className=" text-sm text-[#A5A5AB] ">
                  {student?.data?.email}
                </p>
              </div>
              <div className="  flex items-center gap-1.5">
                <ClockCalender />
                <p className=" text-sm text-[#A5A5AB]">
                  {student?.data?.date_of_birth
                    ? new Date(student?.data?.date_of_birth).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )
                    : "No Date"}
                </p>
              </div>
            </div>
          </div>

          <div className=" mt-4">
            <p className=" text-xs text-[#8C9196] ">Acting Goals / Interests</p>
            <p className=" text-sm text-[#DFE1E7] mt-1.5">
              {student?.data?.ActingGoals?.acting_goals}
            </p>
          </div>
        </div>
      </div>

      <div className=" bg-[#0A1929] p-4  rounded-2xl mt-4.5">
        <div className=" bg-[#07121d] p-4 rounded-[10px]">
          <h3 className=" text-xl text-white font-medium">Payment History</h3>
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {student?.data?.transactions?.map((item: any, index: number) => (
            <div key={index} className=" bg-[#07121D] p-4 rounded-[10px]">
              <div className=" flex items-center gap-2.5">
                <h3 className=" text-base text-white font-medium">
                  {item.payment_method}
                </h3>
                <p
                  className={`${item.status === "SUCCESS" ? " text-[#18CC3F] bg-[#2a3d2e] " : "text-[#FFC943] bg-[#423c2f]"} py-1 px-2.5 rounded-full text-sm `}
                >
                  {item.status}
                </p>
              </div>

              <div className=" flex items-center justify-between mt-3">
                <p className=" text-sm text-[#A5A5AB]">
                  Data:{" "}
                  {item.payment_date
                    ? new Date(item.payment_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No Date"}
                </p>
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
