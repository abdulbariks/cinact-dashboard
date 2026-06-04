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
import { TutorAttendanceService } from "@/service/tutor/tutor.service";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";

// Types
type AttendanceStatus = "present" | "absent" | "late";
type ChangeAttendanceStatus = "present" | "absent";

export interface AttendenceListRow {
  id: string | null;
  student: {
    id: string;
    name: string;
  };
  created_at: string | null;
  status: string;
  attendance_by: string | null;
  class_id: string;
}

interface AttendanceColumn {
  label: string;
  accessor: keyof AttendenceListRow;
  width: string;
  formatter?: (value: any, row: any) => ReactNode;
}

const attendanceStatusColors: Record<string, string> = {
  PRESENT: "bg-[#082420] text-[#18CC3F]",
  ABSENT: "bg-[#1d131d] text-[#E9201D]",
  LATE: "bg-[#443c29] text-[#ECAD11]",
};

// --- Updated Select Component ---
function ChangeAttendenceSelect({
  initialStatus,
  studentId,
  classId,
  onUpdate,
}: {
  initialStatus: string;
  studentId: string;
  classId: string;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const normalizedStatus =
    initialStatus?.toLowerCase() === "present" ? "present" : "absent";
  const [status, setStatus] =
    useState<ChangeAttendanceStatus>(normalizedStatus);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      await TutorAttendanceService.manualAttendance({
        classId,
        studentId,
        status: newStatus.toUpperCase() as "PRESENT" | "ABSENT",
        token,
      });
      setStatus(newStatus as ChangeAttendanceStatus);
      onUpdate(); // Trigger parent re-fetch
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Failed to update attendance",
      );
    } finally {
      setLoading(false);
    }
  };

  const triggerColorClass =
    status === "present"
      ? "bg-[#082420] text-white"
      : "bg-[#1d131d] text-white";

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={loading}
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
        <SelectItem value="present" className="capitalize text-[#18CC3F]">
          Present
        </SelectItem>
        <SelectItem value="absent" className="capitalize text-[#E9201D]">
          Absent
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

// --- Updated to a Function Factory ---
export const getAttendenceListColumns = (
  onUpdate: () => void,
  classId: string,
): AttendanceColumn[] => [
  {
    label: "Student Name",
    accessor: "student",
    width: "220px",
    formatter: (value) => (
      <span className="text-base text-white font-medium">{value?.name}</span>
    ),
  },
  {
    label: "Student ID",
    accessor: "student",
    width: "130px",
    formatter: (value) => (
      <span className="text-sm text-[#D2D2D5]">{value?.id}</span>
    ),
  },
  {
    label: "Date",
    accessor: "created_at",
    width: "150px",
    formatter: (value) => {
      if (!value) return <span className="text-sm text-gray-500">-</span>;
      return (
        <span className="text-sm text-[#D2D2D5]">
          {new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    label: "Status",
    accessor: "status",
    width: "120px",
    formatter: (value) => (
      <span
        className={`capitalize px-2.5 py-1 rounded-full text-sm font-medium ${attendanceStatusColors[value?.toUpperCase()] || "bg-[#2b2d40] text-[#6774FF]"}`}
      >
        {value || "N/A"}
      </span>
    ),
  },
  {
    label: "Attendance By",
    accessor: "attendance_by",
    width: "140px",
    formatter: (value) => (
      <span className="capitalize text-sm text-white font-medium">
        {value || "-"}
      </span>
    ),
  },
  {
    label: "Change Attendence",
    accessor: "status",
    width: "170px",
    formatter: (_, row) => (
      <ChangeAttendenceSelect
        initialStatus={row.status}
        studentId={row.student.id}
        classId={row.class_id}
        onUpdate={onUpdate}
      />
    ),
  },
];
