"use client";

import DropDownIcon from "@/components/icons/others/DropDownIcon";
import { UserService } from "@/service/user/user.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseCookies } from "nookies";
import React, { useEffect, useMemo, useState } from "react";

type StudentInformationData = {
  course: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  enrollmentType: string;
  installmentCount: string;
};

type StudentInformationErrors = Partial<
  Record<keyof StudentInformationData, string>
>;

type StudentInformationFormProps = {
  formData: StudentInformationData;
  errors: StudentInformationErrors;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleCourseChange: (value: string) => void;
  handleEnrollmentTypeChange: (value: string) => void;
  inputClassName: string;
  labelClassName: string;
};

const enrollmentTypeOptions = ["ONE_TIME", "INSTALLMENT"];

type ApiCourse = {
  id: string;
  title: string;
  course_overview?: string;
};

export default function StudentInformationForm({
  formData,
  errors,
  handleInputChange,
  handleCourseChange,
  handleEnrollmentTypeChange,
  inputClassName,
  labelClassName,
}: StudentInformationFormProps) {
  const [apiCourses, setApiCourses] = useState<ApiCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await UserService.getAllCourses({ token });
        const responseData = response?.data?.data || response?.data || [];

        if (isMounted && Array.isArray(responseData)) {
          setApiCourses(responseData);
        }
      } catch (error) {
        if (isMounted) {
          setApiCourses([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCourses(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const courseItems = useMemo(() => {
    if (apiCourses.length > 0) {
      return apiCourses.map((course) => ({
        value: course.id,
        label: course.title,
      }));
    }

    return [];
  }, [apiCourses]);

  return (
    <div className="mt-6 flex flex-col gap-5">
      <div>
        <label className={labelClassName}>Select Course</label>
        <Select value={formData.course} onValueChange={handleCourseChange}>
          <SelectTrigger
            icon={<DropDownIcon className="h-4 w-4" />}
            className="w-full rounded-2xl border-[#3D4566] p-6 text-white"
            disabled={isLoadingCourses}
          >
            <SelectValue
              placeholder={
                isLoadingCourses ? "Loading courses..." : "Choose a course"
              }
              className="placeholder:text-[#3D4566]  text-white"
            />
          </SelectTrigger>
          <SelectContent className="border-[#3D4566] bg-[#07121d] text-white">
            {courseItems.map((course) => (
              <SelectItem key={course.value} value={course.value}>
                {course.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.course && (
          <p className="mt-1 text-xs text-[#ff7a7a]">{errors.course}</p>
        )}
      </div>

      <div>
        <label htmlFor="name" className={labelClassName}>
          Student Name
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter student name"
          className={inputClassName}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-[#ff7a7a]">{errors.name}</p>
        )}
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
          placeholder="Enter email"
          className={inputClassName}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-[#ff7a7a]">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className={labelClassName}>
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
          className={inputClassName}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-[#ff7a7a]">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className={labelClassName}>
          Address
        </label>
        <input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter address"
          className={inputClassName}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-[#ff7a7a]">{errors.address}</p>
        )}
      </div>

      <div>
        <label htmlFor="dateOfBirth" className={labelClassName}>
          Date of Birth
        </label>
        <input
          id="dateOfBirth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          className={inputClassName}
        />
        {errors.dateOfBirth && (
          <p className="mt-1 text-xs text-[#ff7a7a]">{errors.dateOfBirth}</p>
        )}
      </div>

      <div>
        <label className={labelClassName}>Enrollment Type</label>
        <Select
          value={formData.enrollmentType}
          onValueChange={handleEnrollmentTypeChange}
        >
          <SelectTrigger
            icon={<DropDownIcon className="h-4 w-4" />}
            className="w-full rounded-2xl border-[#3D4566] p-6 text-white"
          >
            <SelectValue placeholder="Select enrollment type" />
          </SelectTrigger>
          <SelectContent className="border-[#3D4566] bg-[#07121d] text-white">
            {enrollmentTypeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.enrollmentType && (
          <p className="mt-1 text-xs text-[#ff7a7a]">{errors.enrollmentType}</p>
        )}
      </div>

      {formData.enrollmentType === "INSTALLMENT" && (
        <div>
          <label htmlFor="installmentCount" className={labelClassName}>
            Installment Count
          </label>
          <input
            id="installmentCount"
            type="number"
            min="1"
            name="installmentCount"
            value={formData.installmentCount}
            onChange={handleInputChange}
            placeholder="Enter installment count"
            className={inputClassName}
          />
          {errors.installmentCount && (
            <p className="mt-1 text-xs text-[#ff7a7a]">
              {errors.installmentCount}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
