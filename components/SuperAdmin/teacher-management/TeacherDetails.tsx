"use client";

import React, { useEffect, useState } from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Image from "next/image";
import Link from "next/link";
import teacherImg from "@/public/admin-dashboard/teacher-profile.png";
import EmailIcon from "@/components/icons/others/EmailIcon";
import PhoneIcon from "@/components/icons/others/PhoneIcon";
import CalenderIcon3 from "@/components/icons/others/CalenderIcon3";
import UserIcon from "@/components/icons/others/UserIcon";
import UsersWhiteIcon from "@/components/icons/others/UsersWhiteIcon";
import ClockWhiteIcon from "@/components/icons/others/ClockWhiteIcon";
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import { UserService } from "@/service/user/user.service";
import { showErrorToast } from "@/lib/hotToast";
import { Skeleton } from "@/components/ui/skeleton";

type InstructorCourse = {
  id: string;
  title: string;
  course_overview?: string | null;
  fee?: string | number | null;
  status?: string | null;
  duration?: string | null;
  start_date?: string | null;
  seat_capacity?: string | number | null;
  created_at?: string;
  updated_at?: string;
  _count?: {
    enrollments?: number;
  };
};

type InstructorDetails = {
  id: string;
  name: string;
  email: string;
  phone_number?: string | null;
  avatar?: string | null;
  experience_level?: string | null;
  status?: string | null;
  joined_at?: string | null;
  created_at?: string;
  Course?: InstructorCourse[];
};

const statusColors: Record<string, string> = {
  active: "bg-[#2a3d2e] text-[#18CC3F]",
  inactive: "bg-[#402b2b] text-[#E9201D]",
  pending: "bg-[#443c29] text-[#ECAD11]",
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatStatus = (value?: string | null) =>
  value ? value.toLowerCase().replaceAll("_", " ") : "-";

const formatExperience = (value?: string | null) =>
  value ? value.toLowerCase().replaceAll("_", " ") : "-";

const TeacherDetailsSkeleton = () => (
  <div>
    <Skeleton className="h-6 w-72 bg-[#1d2a3e]" />
    <Skeleton className="mt-8 h-8 w-52 bg-[#1d2a3e]" />
    <Skeleton className="mt-5 h-52 rounded-2xl bg-[#1d2a3e]" />
    <Skeleton className="mt-5 h-72 rounded-2xl bg-[#1d2a3e]" />
  </div>
);

export default function TeacherDetails() {
  const params = useParams<{ id: string }>();
  const instructorId = params?.id;
  const [teacher, setTeacher] = useState<InstructorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeacherDetails = async () => {
      if (!instructorId) return;

      setLoading(true);
      setError("");

      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await UserService.getInstructorDetailsById({
          instructorId,
          token,
        });

        setTeacher(response?.data?.data || null);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load teacher details";
        setError(message);
        setTeacher(null);
        showErrorToast(message);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherDetails();
  }, [instructorId]);

  if (loading) {
    return <TeacherDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  const courses = teacher?.Course || [];
  const normalizedStatus = teacher?.status?.toLowerCase() || "";
  const statusClass =
    statusColors[normalizedStatus] || "bg-[#443c29] text-[#ECAD11]";

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/teacher-management"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Teacher Management
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">Teacher Details</p>
      </div>

      <h2 className="mt-7.5 mb-5 text-2xl font-semibold text-[#E6E7E8]">
        Teacher Details
      </h2>

      <div className="rounded-2xl bg-[#0a1929] p-4">
        <h3 className="text-lg font-medium text-white">Personal Information</h3>

        <div className="mt-4 rounded-[10px] bg-[#07121d] p-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              {teacher?.avatar ? (
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <Image src={teacherImg} alt="Teacher Image" />
              )}
              <div>
                <h3 className="text-lg font-medium text-white">
                  {teacher?.name || "-"}{" "}
                  <span
                    className={`rounded-full px-2.5 py-2 text-xs capitalize ${statusClass}`}
                  >
                    {formatStatus(teacher?.status)}
                  </span>
                </h3>
                <div className="mt-1 flex items-center gap-1.5">
                  <EmailIcon />
                  <p className="text-sm text-[#A5A5AB]">
                    {teacher?.email || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <PhoneIcon />
                <p className="text-sm text-[#A5A5AB]">
                  {teacher?.phone_number || "-"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <CalenderIcon3 />
                <p className="text-sm text-[#A5A5AB]">
                  {formatDate(teacher?.joined_at || teacher?.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <CalenderIcon3 />
                <p className="text-sm capitalize text-[#A5A5AB]">
                  {formatExperience(teacher?.experience_level)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-1.5 text-xs font-medium text-[#585E66]">Courses</p>
            <h3 className="text-sm text-[#DFE1E7]">
              {courses.length
                ? courses.map((course) => course.title).join(", ")
                : "No courses assigned"}
            </h3>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="mt-4.5 rounded-2xl bg-[#0a1929] p-8 text-center text-[#A5A5AB]">
          No assigned courses found.
        </div>
      ) : (
        <div className="mt-4.5 space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="rounded-2xl bg-[#0a1929] p-4">
              <h1 className="text-xl font-medium text-white">{course.title}</h1>
              <div className="mt-4 space-y-4 rounded-[10px] bg-[#07121d] p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:flex lg:justify-between lg:gap-0">
                  <div>
                    <div className="flex items-center gap-1">
                      <UserIcon />
                      <p className="text-xs font-medium text-[#A5A5AB]">
                        Teacher
                      </p>
                    </div>
                    <h4 className="mt-1.5 text-sm font-medium text-white">
                      {teacher?.name || "-"}
                    </h4>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <UsersWhiteIcon />
                      <p className="text-xs font-medium text-[#A5A5AB]">
                        Students
                      </p>
                    </div>
                    <h4 className="mt-1.5 text-sm font-medium text-white">
                      {course._count?.enrollments ?? 0}/{course.seat_capacity ?? "-"} students
                    </h4>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <ClockWhiteIcon />
                      <p className="text-xs font-medium text-[#A5A5AB]">
                        Duration
                      </p>
                    </div>
                    <h4 className="mt-1.5 text-sm font-medium text-white">
                      {course.duration || "-"}
                    </h4>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <CalenderIcon3 />
                      <p className="text-xs font-medium text-[#A5A5AB]">Date</p>
                    </div>
                    <h4 className="mt-1.5 text-sm font-medium text-white">
                      {formatDate(course.start_date)}
                    </h4>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white">
                    Course Overview
                  </h3>
                  {course.course_overview ? (
                    <div
                      className="mt-2.5 text-sm text-[#D2D2D5]"
                      dangerouslySetInnerHTML={{
                        __html: course.course_overview,
                      }}
                    />
                  ) : (
                    <p className="mt-2.5 text-sm text-[#D2D2D5]">
                      No overview available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
