import Image from "next/image";
import avatar1 from "@/public/admin-dashboard/avatar-1.png";
import EditIcon from "../icons/SuperAdmindashboard/EditIcon";
import EyeIcon from "../icons/SuperAdmindashboard/EyeIcon";
import RestrictIcon from "../icons/SuperAdmindashboard/RestrictIcon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import Link from "next/link";
import warnigImg from "@/public/admin-dashboard/warning-img.png";
import CrossIcon from "../icons/others/CrossIcon";
import RestrictUserIcon from "../icons/SuperAdmindashboard/RestrictUserIcon";
import { FinanceService } from "@/service/finance/finance.service"; // Ensure this is imported
import { showSuccessToast, showErrorToast } from "@/lib/hotToast"; // Ensure this is imported
import { EditStudentDialog } from "../Finance/StudentManagement/EditStudentDialog";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-[#2a3d2e] text-[#18CC3F]",
  ALUMNI: "bg-[#2b2d40] text-[#6774FF]",
  RESTRICTED: "bg-[#402b2b] text-[#E9201D]",
  PENDING: "bg-[#443c29] text-[#ECAD11]",
};

const paymentStatusColors: Record<string, string> = {
  paid: "bg-[#2a3d2e] text-[#18CC3F]",
  COMPLETED: "bg-[#2a3d2e] text-[#18CC3F]",
  overdue: "bg-[#402b2b] text-[#E9201D]",
  due: "bg-[#443c29] text-[#ECAD11]",
  PENDING: "bg-[#443c29] text-[#ECAD11]",
};

// FACTORY FUNCTION
export const getFinanceStudentManagementColumns = (onRefresh: () => void) => [
  {
    label: "Student",
    accessor: "name",
    width: "250px",
    formatter: (value: string, row: any) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={row.avatar || avatar1}
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
    ),
  },
  {
    label: "Status",
    accessor: "status",
    width: "100px",
    formatter: (value: string) => (
      <span
        className={`capitalize px-2.5 py-1 rounded-full text-sm font-medium ${statusColors[value]}`}
      >
        {value}
      </span>
    ),
  },
  {
    label: "Course Name",
    accessor: "course",
    width: "200px",
    formatter: (_: any, row: any) => (
      <span className="text-sm text-white font-medium">
        {row.course?.title || "N/A"}
      </span>
    ),
  },
  {
    label: "Join Date",
    accessor: "joined_at",
    width: "120px",
    formatter: (value: string) => {
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
    label: "Payment Status",
    accessor: "payment_status",
    width: "140px",
    formatter: (value: string) => (
      <span
        className={`capitalize px-2.5 py-1 rounded-full text-sm ${paymentStatusColors[value]}`}
      >
        {value}
      </span>
    ),
  },
  {
    label: "Payment Type",
    accessor: "payment_type",
    width: "120px",
    formatter: (value: string) => (
      <span className="capitalize text-sm text-white font-medium">
        {value || "N/A"}
      </span>
    ),
  },
  {
    label: "Actions",
    accessor: "action",
    width: "120px",
    formatter: (_: any, row: any) => (
      <div className="flex items-center gap-6">
        {/* EDIT USER */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
              type="button"
            >
              <EditIcon />
            </button>
          </DialogTrigger>
          {/* Use the new component here */}
          <EditStudentDialog row={row} onRefresh={onRefresh} />
        </Dialog>

        {/* VIEW */}
        <Link
          href={`/finance-dashboard/student-management/student-details/${row?.user?.id}`}
          className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
        >
          <EyeIcon />
        </Link>

        {/* RESTRICT */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
              type="button"
            >
              <RestrictIcon />
            </button>
          </DialogTrigger>
          <DialogContent className="border-none py-14 px-8 rounded-2xl bg-[#0A1726] text-white [&>button]:hidden">
            <div className="flex items-center justify-center">
              <Image src={warnigImg} alt="Warning" />
            </div>
            <h2 className="text-white text-xl font-semibold text-center mt-4">
              Restrict User
            </h2>
            <div className="mt-10 flex items-center justify-center gap-3">
              <DialogClose asChild>
                <button className="border border-[#3D4566] py-4 px-14 rounded-2xl">
                  Cancel
                </button>
              </DialogClose>
              <DialogClose asChild>
                <button
                  onClick={async () => {
                    try {
                      await FinanceService.restrictStudent({
                        id: row.id,
                      });
                      showSuccessToast("User restricted");
                      onRefresh(); // Refresh table
                    } catch (error) {
                      showErrorToast("Failed to restrict user");
                    }
                  }}
                  className="bg-[#e9201d] py-4 px-14 rounded-2xl"
                >
                  Yes, Restrict
                </button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
];
