"use client";

import React, { useEffect, useState } from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import DropDownIcon from "@/components/icons/others/DropDownIcon";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CalenderIcon2 from "@/components/icons/others/CalenderIcon2";
import { parseCookies } from "nookies";
import { UserService } from "@/service/user/user.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const experienceOptions = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const teacherTypeOptions = ["Full Time", "Part Time", "Guest Faculty"];
const teacherStatusOptions = ["ACTIVE", "INACTIVE"];

const formatDateInput = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const normalizeExperience = (value?: string | null) =>
  value ? value.toUpperCase() : "";

const normalizeTeacherType = (value?: string | null) => {
  if (!value) return "";
  const normalized = value.toLowerCase().replaceAll("_", " ");
  if (normalized === "full time") return "Full Time";
  if (normalized === "part time") return "Part Time";
  if (normalized === "guest faculty") return "Guest Faculty";
  return value;
};

const normalizeTeacherStatus = (value?: string | null) =>
  value ? value.toUpperCase() : "";

const EditTeacherSkeleton = () => (
  <div>
    <Skeleton className="h-6 w-60 bg-[#1d2a3e]" />
    <div className="mx-auto mt-25 max-w-175 rounded-2xl bg-[#0a1726] p-8">
      <Skeleton className="h-8 w-48 bg-[#1d2a3e]" />
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-14 rounded-2xl bg-[#1d2a3e]" />
        ))}
      </div>
    </div>
  </div>
);

export default function EditTeacher() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const instructorId = params?.id;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    experienceLevel: "",
    joinDate: "",
    teacherType: "",
    teacherStatus: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const inputClassName =
    "w-full rounded-2xl border border-[#3D4566] px-4 py-3.5 text-white outline-none placeholder:text-[#3D4566] focus:border-[#5F6CA0]";
  const labelClassName = "mb-2 block text-xs text-[#B2B5B8]";

  useEffect(() => {
    const loadInstructor = async () => {
      if (!instructorId) return;

      setLoading(true);
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await UserService.getInstructorDetailsById({
          instructorId,
          token,
        });

        const instructor = response?.data?.data;
        setFormData({
          name: instructor?.name || "",
          email: instructor?.email || "",
          phone_number: instructor?.phone_number || "",
          experienceLevel: normalizeExperience(instructor?.experience_level),
          joinDate: formatDateInput(
            instructor?.joined_at || instructor?.created_at,
          ),
          teacherType: normalizeTeacherType((instructor as any)?.teacherType),
          teacherStatus: normalizeTeacherStatus(instructor?.status),
        });
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message || "Failed to load teacher details",
        );
      } finally {
        setLoading(false);
      }
    };

    loadInstructor();
  }, [instructorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!instructorId) return;

    try {
      setSubmitting(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const joinDate = formData.joinDate
        ? new Date(`${formData.joinDate}T00:00:00.000Z`).toISOString()
        : "";

      const payload: {
        name: string;
        // email: string;
        // phone_number: string;
        // teacherType: string;
        // teacherStatus: string;
        // experienceLevel: string;
        // joinDate: string;
      } = {
        name: formData.name,
        // email: formData.email,
        // phone_number: formData.phone_number,
        // teacherType: formData.teacherType,
        // teacherStatus: formData.teacherStatus,
        // experienceLevel: formData.experienceLevel,
        // joinDate,
      };

      const response = await UserService.updateInstructor({
        instructorId,
        token,
        payload,
      });

      showSuccessToast(
        response?.data?.message || "Teacher updated successfully",
      );
      router.push("/dashboard/teacher-management");
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Failed to update teacher",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <EditTeacherSkeleton />;
  }

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
        <p className="text-base font-medium text-[#8D9CDC]">Edit Teacher</p>
      </div>

      <div className="mx-auto mt-25 max-w-175 rounded-2xl bg-[#0a1726] p-8">
        <h2 className="text-2xl font-semibold text-white">Edit Teacher</h2>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClassName}>
                Teacher Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter teacher name"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClassName}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className={labelClassName}>
                Phone
              </label>
              <input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label className={labelClassName}>Experience Level</label>
              <Select
                value={formData.experienceLevel}
                onValueChange={handleSelectChange("experienceLevel")}
              >
                <SelectTrigger
                  icon={<DropDownIcon className="h-4 w-4" />}
                  className="w-full rounded-2xl border-[#3D4566] px-4 py-7 text-white"
                >
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="border-[#3D4566] bg-[#07121d] text-white">
                  {experienceOptions.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="joinDate" className={labelClassName}>
                Join Date
              </label>
              <div className="relative">
                <input
                  id="joinDate"
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className={`${inputClassName} pr-12 appearance-none scheme-dark [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                  required
                />
                <CalenderIcon2 className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className={labelClassName}>Teacher Type</label>
              <Select
                value={formData.teacherType}
                onValueChange={handleSelectChange("teacherType")}
              >
                <SelectTrigger
                  icon={<DropDownIcon className="h-4 w-4" />}
                  className="w-full rounded-2xl border-[#3D4566] px-4 py-7 text-white"
                >
                  <SelectValue placeholder="Select teacher type" />
                </SelectTrigger>
                <SelectContent className="border-[#3D4566] bg-[#07121d] text-white">
                  {teacherTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={labelClassName}>Teacher Status</label>
              <Select
                value={formData.teacherStatus}
                onValueChange={handleSelectChange("teacherStatus")}
              >
                <SelectTrigger
                  icon={<DropDownIcon className="h-4 w-4" />}
                  className="w-full rounded-2xl border-[#3D4566] px-4 py-7 text-white"
                >
                  <SelectValue placeholder="Select teacher status" />
                </SelectTrigger>
                <SelectContent className="border-[#3D4566] bg-[#07121d] text-white">
                  {teacherStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-3">
            <Link
              href="/dashboard/teacher-management"
              className="rounded-2xl bg-[#3D4566] px-8 py-3.5 text-white transition-colors hover:bg-[#111f31]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-2xl bg-[#E9201D] px-8 py-3.5 text-white transition-colors hover:bg-[#d11e1b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
