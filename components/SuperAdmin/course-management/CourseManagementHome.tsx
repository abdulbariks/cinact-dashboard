"use client";
import React, { useEffect, useState } from "react";
import RightArrowIcon from "@/components/icons/others/RightArrowIcon";
import {
  PaymentIcon,
  TeacherIcon,
  UsersIcon,
} from "@/components/icons/sidebar.tsx/SidebarIcons";
import CalenderIcon from "@/components/icons/SuperAdmindashboard/CalenderIcon";
import ClockIcon from "@/components/icons/SuperAdmindashboard/ClockIcon";
import SearchIcon from "@/components/icons/SuperAdmindashboard/SearchIcon";
import { AllStatus } from "./AllStatus";
import Link from "next/link";
import { AddCourseModal } from "./AddCourseModal";
import { parseCookies } from "nookies";
import { AdminCourseManagementService } from "@/service/user/user.service";
import { showErrorToast } from "@/lib/hotToast";
import { Skeleton } from "@/components/ui/skeleton";
import { TCourse } from "@/types/tutor.mycourse";
import PaginationPage from "@/components/reusable/PaginationPage";

const formatDate = (value?: string) => {
  if (!value) return "No Date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getInstructorName = (course: TCourse | any) =>
  course?.instructor?.name ||
  course?.instructor_name ||
  course?.ins_name ||
  "-";

const getInstructorMeta = (course: TCourse | any) =>
  course?.instructor?.email ||
  course?.instructor?.specialization ||
  course?.ins_specification ||
  "Instructor";

const getCourseFee = (course: TCourse | any) =>
  course?.fee || course?.course_fee || "0";

const getStatusClassName = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return "text-[#18CC3F] bg-[#2a3d2e]";
    case "INACTIVE":
      return "text-[#B2B5B8] bg-[#2B3442]";
    case "DRAFT":
      return "text-[#F3C96B] bg-[#3B3420]";
    case "UPCOMING":
      return "text-[#75B8FF] bg-[#18334F]";
    case "COMPLETED":
      return "text-[#9FD7A9] bg-[#1E3A2A]";
    default:
      return "text-[#B2B5B8] bg-[#2B3442]";
  }
};

const CourseManagementSkeleton = () => (
  <div>
    <Skeleton className="h-8 w-60 bg-[#1d2a3e]" />
    <div className="mt-5 rounded-2xl bg-[#0a1726] p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-36 bg-[#1d2a3e]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-80 rounded-xl bg-[#1d2a3e]" />
          <Skeleton className="h-10 w-48 rounded-xl bg-[#1d2a3e]" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-70 rounded-xl bg-[#1d2a3e]" />
        ))}
      </div>
    </div>
  </div>
);

export default function CourseManagementHome() {
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [courses, setCourses] = useState<TCourse[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminCourseManagementService.getAllCourses({
        token,
        search,
        status: status === "all" ? "" : status,
        page: currentPage,
        limit: itemsPerPage,
      });

      const responseData = response?.data?.data;
      const metaData = response?.data?.meta_data;
      setCourses(Array.isArray(responseData) ? responseData : []);
      setTotalItems(
        typeof metaData?.total === "number"
          ? metaData.total
          : Array.isArray(responseData)
            ? responseData.length
            : 0,
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load courses";
      setCourses([]);
      setError(message);
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [search, status, currentPage, itemsPerPage]);
  
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) {
    return <CourseManagementSkeleton />;
  }

  // console.log("courses=========", courses);

  return (
    <div>
      <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
        Course Management
      </h2>
      <div className=" bg-[#0a1726] p-6 rounded-2xl mt-5">
        <div className=" flex items-center justify-between">
          <h3 className=" text-white text-xl font-semibold">All Courses</h3>
          <div className=" flex items-center gap-2">
            <div className=" relative w-80">
              <input
                type="text"
                name="search"
                value={search}
                onChange={handleSearchChange}
                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                placeholder="Search Course"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
                <SearchIcon />
              </button>
            </div>

            <AllStatus value={status} onValueChange={handleStatusChange} />
          </div>
        </div>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {error && (
            <div className="col-span-full rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center text-red-400">
              {error}
            </div>
          )}

          {!error && courses.length === 0 && (
            <div className="col-span-full rounded-xl border border-[#3D4566] bg-[#07121d] p-8 text-center text-[#A5A5AB]">
              No courses found
            </div>
          )}

          {courses.map((course, index) => (
            <div
              key={course.id || index}
              className=" bg-[#07121d] p-4 rounded-[12px] border-t-[0.5px] border-b-[0.5px] border-r-[0.5px] border-l-3 border-[#8D9CDC]"
            >
              <h2 className=" text-white text-lg font-medium">
                {course.title || (course as any).course_name}
                <span
                  className={`py-1 px-2.5 rounded-full text-sm ml-2 ${getStatusClassName(course.status)}`}
                >
                  {course.status}
                </span>
              </h2>
              <div className=" mt-3 flex items-center gap-3">
                <div className=" border border-[#434656] bg-[#0A1A29] inline-block p-2 rounded-full">
                  <TeacherIcon />
                </div>
                <div>
                  <p className=" text-sm text-[#E6E7E8] ">
                    {/* {getInstructorName(course)} */}{" "}
                    {course?.instructor?.name || ""}
                  </p>
                  <p className=" text-xs text-[#A5A5AB] ">
                    {/* {getInstructorMeta(course)} */}
                    {course?.instructor?.email || ""}
                  </p>
                </div>
              </div>

              <div className=" my-9   flex items-center justify-between">
                <div>
                  <div className=" flex items-center gap-1">
                    <CalenderIcon />
                    <p className=" text-xs text-[#B2B5B8] ">Start Date</p>
                  </div>
                  <p className=" text-sm text-white font-medium mt-1.5">
                    {formatDate(course.start_date)}
                  </p>
                </div>
                <div>
                  <div className=" flex items-center gap-1">
                    <ClockIcon />
                    <p className=" text-xs text-[#B2B5B8] ">Duration</p>
                  </div>
                  <p className=" text-sm text-white font-medium mt-1.5">
                    {course.duration || "-"}
                  </p>
                </div>
                <div>
                  <div className=" flex items-center gap-1">
                    <UsersIcon />
                    <p className=" text-xs text-[#B2B5B8] ">Students</p>
                  </div>
                  <p className=" text-sm text-white font-medium mt-1.5">
                    {course.total_enrollments ?? 0}/
                    {course.seat_capacity ?? "-"}
                  </p>
                </div>
              </div>

              <div className=" flex items-center justify-between">
                <div>
                  <div className=" flex items-center gap-1">
                    <PaymentIcon />
                    <p className=" text-xs text-[#B2B5B8] ">Course Fee</p>
                  </div>
                  <p className=" text-sm text-white font-medium mt-1.5">
                    ${getCourseFee(course)}{" "}
                    <span className=" text-sm text-[#d1d1d1] ">
                      {(course as any).per_month_fee
                        ? `( $${(course as any).per_month_fee}/month )`
                        : ""}
                    </span>{" "}
                  </p>
                </div>
                <Link
                  href={`/dashboard/course-management/course-details/${course.id}`}
                  className=" text-white inline-flex items-center gap-3 bg-[#5F6CA0] py-3 pl-3 pr-1.5  rounded-xl"
                >
                  View Course
                  <RightArrowIcon />
                </Link>
              </div>
            </div>
          ))}
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            type="button"
            className=" bg-[#07121d] p-4 rounded-[12px] border border-dashed border-[#505B86] min-h-65 flex  items-center gap-2 justify-center text-center text-white hover:bg-[#0b1b2b] transition-colors cursor-pointer"
          >
            <span className=" text-3xl leading-none">+</span>
            <span className=" mt-2 text-lg font-medium">Add Course</span>
          </button>
          <AddCourseModal
            open={isAddCourseModalOpen}
            onOpenChange={setIsAddCourseModalOpen}
            onCourseCreated={loadCourses}
          />
        </div>
      </div>
      <div>
        <PaginationPage
          totalPages={totalPages}
          dataLength={courses.length}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
}
