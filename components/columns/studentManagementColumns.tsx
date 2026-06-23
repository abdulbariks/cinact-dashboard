import Image from "next/image";
import React, { useState } from "react";
import avatar1 from "@/public/admin-dashboard/avatar-1.png";
import EditIcon from "../icons/SuperAdmindashboard/EditIcon";
import EyeIcon from "../icons/SuperAdmindashboard/EyeIcon";
import TrashIcon from "../icons/others/TrashIcon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Link from "next/link";
import warnigImg from "@/public/admin-dashboard/warning-img.png";
import CrossIcon from "../icons/others/CrossIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import DropDownIcon from "../icons/others/DropDownIcon";
import { UserService } from "@/service/user/user.service";
import { showSuccessToast, showErrorToast } from "@/lib/hotToast";

const statusColors: Record<string, string> = {
  active: "bg-[#2a3d2e] text-[#18CC3F]",
  inactive: "bg-[#2a3d2e] text-[#18CC3F]",
  alumni: "bg-[#2b2d40] text-[#6774FF]",
  restricted: "bg-[#402b2b] text-[#E9201D]",
  pending: "bg-[#443c29] text-[#ECAD11]",
  ACTIVE: "bg-[#2a3d2e] text-[#18CC3F]",
  DEACTIVATED: "bg-[#402b2b] text-[#E9201D]",
  BLOCKED: "bg-[#402b2b] text-[#E9201D]",
  REJECTED: "bg-[#402b2b] text-[#E9201D]",
};

const statusOptions = ["ACTIVE", "DEACTIVATED", "BLOCKED", "REJECTED"];

interface ActionsCellProps {
  row: any;
  onRefresh: () => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row, onRefresh }) => {
  const [name, setName] = useState(row.name || "");
  const [phone, setPhone] = useState(row.phone_number || "");
  const [status, setStatus] = useState(row.status || "ACTIVE");

  const handleUpdateStudent = async () => {
    try {
      await UserService.updateUser({
        userId: row.id,
        payload: {
          full_name: name,
          phone_number: phone,
          status: status,
        },
      });
      showSuccessToast("Student updated successfully");
      onRefresh();
    } catch (error) {
      showErrorToast("Failed to update student");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await UserService.deleteUser({
        userId: row.id,
      });
      showSuccessToast("User deleted successfully");
      onRefresh();
    } catch (error) {
      showErrorToast("Failed to delete user");
    }
  };

  return (
    <div className="flex items-center gap-6">
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
            type="button"
          >
            <EditIcon />
          </button>
        </DialogTrigger>
        <DialogContent className="border-none py-8 px-6 rounded-2xl bg-[#0A1726] text-white [&>button]:hidden max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold">
              Edit Student
            </DialogTitle>
            <DialogDescription className="text-[#A5A5AB]">
              Update student information.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs text-[#B2B5B8]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#3D4566] bg-transparent p-3 text-sm text-white outline-none"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="text-xs text-[#B2B5B8]">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#3D4566] bg-transparent p-3 text-sm text-white outline-none"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="text-xs text-[#B2B5B8]">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger
                  icon={<DropDownIcon className="h-4 w-4" />}
                  className="w-full rounded-2xl border-[#3D4566] p-6 text-[#3D4566]"
                >
                  <SelectValue
                    placeholder="Select Status"
                    className="placeholder:text-[#3D4566] text-[#3D4566]"
                  />
                </SelectTrigger>
                <SelectContent className="border-[#3D4566] bg-[#07121d] text-white">
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-xl border border-[#3D4566] px-5 py-2.5 text-sm font-medium text-white cursor-pointer"
              >
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                type="button"
                onClick={handleUpdateStudent}
                className="rounded-xl bg-[#6774FF] px-5 py-2.5 text-sm font-medium text-white cursor-pointer"
              >
                Save Changes
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Link
        href={`/dashboard/student-management/student-details/${row?.id}`}
        className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
      >
        <EyeIcon />
      </Link>

      <Dialog>
        <DialogTrigger asChild>
          <button
            className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
            type="button"
          >
            <TrashIcon />
          </button>
        </DialogTrigger>
        <DialogContent className="border-none py-14 px-8 rounded-2xl bg-[#0A1726] text-white [&>button]:hidden">
          <div className="flex items-center justify-center">
            <Image src={warnigImg} alt="Warning" />
          </div>
          <h2 className="text-white text-xl font-semibold text-center mt-4">
            Delete User
          </h2>
          <p className="text-center text-[#A5A5AB] text-sm">
            Are you sure to Delete the User?
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <DialogClose asChild>
              <button className="text-white text-base font-medium flex items-center gap-2.5 border border-[#3D4566] py-4 px-14 rounded-2xl cursor-pointer">
                <CrossIcon /> Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                onClick={handleDeleteUser}
                className="text-white text-base font-medium flex items-center gap-2.5 bg-[#e9201d] py-4 px-14 rounded-2xl cursor-pointer"
              >
                <TrashIcon /> Yes, Delete
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const getStudentManagementColumns = (onRefresh: () => void) => [
  {
    label: "Student",
    accessor: "name",
    width: "250px",
    formatter: (value: string, row: any) => {
      const getAvatarSrc = () => {
        if (row.avatar) return row.avatar;
        if (row.avatar_url) return row.avatar_url;
        return avatar1;
      };
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={getAvatarSrc()}
              alt={value}
              width={32}
              height={32}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          <div>
            <p className="font-medium text-white">{value}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    label: "Phone Number",
    accessor: "phone_number",
    width: "200px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value || "-"}</span>
    ),
  },
  {
    label: "Status",
    accessor: "status",
    width: "100px",
    formatter: (value: string) => (
      <span
        className={`capitalize px-2.5 py-1 rounded-full text-sm font-medium ${
          statusColors[value] || statusColors.inactive
        }`}
      >
        {value || "inactive"}
      </span>
    ),
  },
  {
    label: "Total Enrolled",
    accessor: "total_enrolled",
    width: "200px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value || "-"}</span>
    ),
  },
  {
    label: "Join Date",
    accessor: "joined_at",
    width: "120px",
    formatter: (value: string) => {
      if (!value)
        return <span className="text-sm text-white font-medium">-</span>;
      const date = new Date(value);
      return (
        <span className="text-sm text-white font-medium">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    label: "Actions",
    accessor: "action",
    width: "120px",
    formatter: (_: any, row: any) => (
      <ActionsCell row={row} onRefresh={onRefresh} />
    ),
  },
];
