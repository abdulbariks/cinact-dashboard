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
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import { UserService } from "@/service/user/user.service";
import { showErrorToast } from "@/lib/hotToast";
import { Skeleton } from "@/components/ui/skeleton";

type InstructorDetails = {
  id: string;
  name: string | null;
  email: string;
  phone_number?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  experience?: string | null;
  type?: string | null;
  status?: string | null;
  approved_at?: string | null;
  joined_at?: string | null;
  created_at?: string;
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

const formatType = (value?: string | null) =>
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

  const normalizedStatus = teacher?.status?.toLowerCase() || "";
  const statusClass =
    statusColors[normalizedStatus] || "bg-[#443c29] text-[#ECAD11]";
  const avatarSrc = teacher?.avatar_url || teacher?.avatar;

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          // href="/dashboard/teacher-management"
          href="/dashboard/user-management"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          {/* Teacher Management */}
          User Management
        </Link>
        <BreadCrumpRightArrow />
        {/* <p className="text-base font-medium text-[#8D9CDC]">Teacher Details</p> */}
        <p className="text-base font-medium text-[#8D9CDC]">User Details</p>
      </div>

      <h2 className="mt-7.5 mb-5 text-2xl font-semibold text-[#E6E7E8]">
        {/* Teacher Details */}
        User Details
      </h2>

      <div className="rounded-2xl bg-[#0a1929] p-4">
        <h3 className="text-lg font-medium text-white">Personal Information</h3>

        <div className="mt-4 rounded-[10px] bg-[#07121d] p-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={teacher?.name || "User"}
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
                <UserIcon />
                <p className="text-sm capitalize text-[#A5A5AB]">
                  {formatType(teacher?.type)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <UserIcon />
                <p className="text-sm capitalize text-[#A5A5AB]">
                  {formatExperience(teacher?.experience)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-[#585E66]">
                Approved At
              </p>
              <h3 className="text-sm text-[#DFE1E7]">
                {formatDate(teacher?.approved_at)}
              </h3>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-[#585E66]">
                Created At
              </p>
              <h3 className="text-sm text-[#DFE1E7]">
                {formatDate(teacher?.created_at)}
              </h3>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-[#585E66]">
                User Type
              </p>
              <h3 className="text-sm capitalize text-[#DFE1E7]">
                {formatType(teacher?.type)}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
