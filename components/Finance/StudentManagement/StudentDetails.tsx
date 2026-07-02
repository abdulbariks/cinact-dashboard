"use client";
import React, { useEffect, useState } from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import Image from "next/image";
import EmailIcon from "@/components/icons/others/EmailIcon";
import ClockCalender from "@/components/icons/SuperAdmindashboard/ClockCalender";
import { useParams } from "next/navigation";
import {
  UserService,
  AdminCourseManagementService,
} from "@/service/user/user.service";
import { showErrorToast } from "@/lib/hotToast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseCookies } from "nookies";

type PaymentHistoryItem = {
  user_id: string;
  name: string;
  transaction_ref: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string;
  payment_plan: string;
  source: string;
  order?: {
    id: string;
    order_number: string;
    item_type: string;
    course?: {
      id: string;
      title: string;
    };
    event?: null;
  };
};

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);

  console.log("[student========", student);

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(
    [],
  );
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("payment-history");

  const navItems = [
    {
      value: "all-courses",
      label: "All Courses",
    },
    {
      value: "payment-history",
      label: "Payment History",
    },
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await UserService.getStudentDetails({
          id: id as string,
        });
        setStudent(response.data);
      } catch (error) {
        showErrorToast("Failed to fetch student details");
      }
    };
    if (id) fetchDetails();
  }, [id]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!id) return;
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await UserService.getPaymentHistory({
          token,
          userId: id as string,
        });
        setPaymentHistory(response?.data?.data || []);
      } catch (error) {
        showErrorToast("Failed to fetch payment history");
      }
    };
    fetchPaymentHistory();
  }, [id]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      if (!id) return;
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await AdminCourseManagementService.getCoursesByUserId({
          token,
          userId: id as string,
        });
        setAllCourses(response?.data?.data || []);
      } catch (error) {
        showErrorToast("Failed to fetch courses");
      }
    };
    fetchAllCourses();
  }, [id]);

  useEffect(() => {
    if (student) setLoading(false);
  }, [student]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!student) return <div className="p-6 text-white">Student not found.</div>;

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
              <Image
                src={
                  student?.data?.avatarUrl || "/admin-dashboard/avatar-1.png"
                }
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
                    ( {student?.data?.status})
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
                  {student?.data?.joined_at
                    ? new Date(student?.data?.joined_at).toLocaleDateString(
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between gap-4 border-b border-[#5F6CA0]">
            <TabsList className="h-auto w-auto justify-start bg-transparent p-0 rounded-none">
              {navItems.map((item) => {
                const isActive = activeTab === item.value;

                return (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="px-5 py-5 flex items-center gap-2 whitespace-nowrap text-base font-medium rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white data-[state=active]:border-[#E9201D] text-[#8D9CDC] hover:text-white"
                  >
                    <span>{item.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value="payment-history" className="mt-4">
            <div className=" bg-[#07121d] p-4 rounded-[10px]">
              <h3 className=" text-xl text-white font-medium">
                Payment History
              </h3>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {paymentHistory.length > 0 ? (
                paymentHistory.map((item, index) => (
                  <div key={index} className=" bg-[#07121D] p-4 rounded-[10px]">
                    <div className=" flex items-center gap-2.5">
                      <h3 className=" text-base text-white font-medium">
                        {item.payment_plan || "Payment"}
                      </h3>
                      <p
                        className={`${item.status === "SUCCESS" ? " text-[#18CC3F] bg-[#2a3d2e] " : "text-[#FFC943] bg-[#423c2f]"} py-1 px-2.5 rounded-full text-sm `}
                      >
                        {item.status}
                      </p>
                    </div>

                    <div className=" flex items-center justify-between mt-3">
                      <p className=" text-sm text-[#A5A5AB]">
                        Date:{" "}
                        {item.paid_at
                          ? new Date(item.paid_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "No Date"}
                      </p>
                      <p className=" text-base text-[#18CC3F] font-medium">
                        ${item.amount} {item.currency}
                      </p>
                    </div>

                    <div className=" mt-2">
                      <p className=" text-xs text-[#A5A5AB]">
                        Source: {item.source}
                      </p>
                      <p className=" text-xs text-[#A5A5AB]">
                        {item.order?.course?.title &&
                          `Course: ${item.order.course.title}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className=" text-sm text-[#A5A5AB] col-span-3">
                  No payment history found.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="all-courses" className="mt-4">
            <div className=" bg-[#07121d] p-4 rounded-[10px]">
              <h3 className=" text-xl text-white font-medium">All Courses</h3>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {allCourses.length > 0 ? (
                allCourses.map((course: any, index: number) => (
                  <div key={index} className=" bg-[#07121D] p-4 rounded-[10px]">
                    <div className=" flex items-center gap-2.5">
                      <h3 className=" text-base text-white font-medium">
                        {course.title || "Course Name"}
                      </h3>
                      <p
                        className={`${course.status === "ACTIVE" ? " text-[#18CC3F] bg-[#2a3d2e] " : "text-[#FFC943] bg-[#423c2f]"} py-1 px-2.5 rounded-full text-sm `}
                      >
                        {course.status}
                      </p>
                    </div>

                    <div className=" flex items-center justify-between mt-3">
                      <p className=" text-sm text-[#A5A5AB]">
                        Fee: ${course.fee}
                      </p>
                      <p className=" text-sm text-[#A5A5AB]">
                        Duration: {course.duration} days
                      </p>
                    </div>

                    <div className=" mt-2">
                      <p className=" text-xs text-[#A5A5AB]">
                        Enrollment: {course.enrollment_status || "N/A"}
                      </p>
                      <p className=" text-xs text-[#A5A5AB]">
                        Start Date:{" "}
                        {course.start_date
                          ? new Date(course.start_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className=" text-sm text-[#A5A5AB] col-span-3">
                  No courses found.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
