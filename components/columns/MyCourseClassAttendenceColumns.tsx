"use client";

import { useState, type ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DropDownIcon from "../icons/others/DropDownIcon";

type AttendanceStatus = "present" | "absent" | "late";

export interface AttendenceListRow {
  id: number;
  studentName: string;
  studentId: string;
  date: string;
  status: AttendanceStatus | string;
  attendence_by: string;
}

interface AttendanceColumn {
  label: string;
  accessor: keyof AttendenceListRow;
  width: string;
  formatter?: (value: string, row: AttendenceListRow) => ReactNode;
}

const attendanceStatusColors: Record<AttendanceStatus, string> = {
  present: "bg-[#082420] text-[#18CC3F]",
  absent: "bg-[#1d131d] text-[#E9201D]",
  late: "bg-[#443c29] text-[#ECAD11]",
};

type ChangeAttendanceStatus = "present" | "late" | "absent";

function ChangeAttendenceSelect({ initialStatus }: { initialStatus: string }) {
  const normalizedStatus: ChangeAttendanceStatus =
    initialStatus === "present" ? "present" : "absent";
  const [status, setStatus] =
    useState<ChangeAttendanceStatus>(normalizedStatus);

  const triggerColorClass =
    status === "present"
      ? "bg-[#082420] text-white"
      : "bg-[#1d131d] text-white";

  return (
    <Select
      value={status}
      onValueChange={(value) => setStatus(value as ChangeAttendanceStatus)}
    >
      <SelectTrigger
        className={`h-8 min-w-30 border-[#3D4566] capitalize [&>svg]:hidden ${triggerColorClass}`}
      >
        <div className="flex items-center justify-between w-full">
          <SelectValue placeholder="Select" />
          <DropDownIcon className="h-4 w-4" />
        </div>
      </SelectTrigger>
      <SelectContent className="border-none bg-[#082420] text-[#777980]">
        <SelectItem
          value="present"
          className="capitalize text-[#18CC3F] data-highlighted:text-[#18CC3F]"
        >
          present
        </SelectItem>
        <SelectItem
          value="late"
          className="capitalize text-[#E92] data-highlighted:text-[#E92]"
        >
          late
        </SelectItem>
        <SelectItem
          value="absent"
          className="capitalize text-[#E9201D] data-highlighted:text-[#E9201D]"
        >
          absent
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export const MyCourseClassAttendenceColumns: AttendanceColumn[] = [
  {
    label: "Student Name",
    accessor: "studentName",
    width: "220px",
    formatter: (value: string) => (
      <span className="text-base text-white font-medium">{value}</span>
    ),
  },
  {
    label: "Student ID",
    accessor: "studentId",
    width: "130px",
    formatter: (value: string) => (
      <span className="text-sm text-[#D2D2D5]  ">{value}</span>
    ),
  },

  {
    label: "Status",
    accessor: "status",
    width: "120px",
    formatter: (value: string) => (
      <span
        className={`capitalize px-2.5 py-1 rounded-full text-sm font-medium ${
          attendanceStatusColors[value] || "bg-[#2b2d40] text-[#6774FF]"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    label: "Change Attendence",
    accessor: "status",
    width: "170px",
    formatter: (value: string) => (
      <ChangeAttendenceSelect initialStatus={value} />
    ),
  },
];
