import Image from "next/image";
import avatar1 from "@/public/admin-dashboard/avatar-1.png";
import avatar2 from "@/public/admin-dashboard/avatar-2.png";
import avatar3 from "@/public/admin-dashboard/avatar-3.png";
import EditIcon from "../icons/SuperAdmindashboard/EditIcon";
import EyeIcon from "../icons/SuperAdmindashboard/EyeIcon";
import RestrictIcon from "../icons/SuperAdmindashboard/RestrictIcon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Link from "next/link";
import warnigImg from "@/public/admin-dashboard/warning-img.png";
import CrossIcon from "../icons/others/CrossIcon";
import RestrictUserIcon from "../icons/SuperAdmindashboard/RestrictUserIcon";

// Status color mapping
const statusColors: Record<string, string> = {
  active: "bg-[#2a3d2e] text-[#18CC3F]",

  alumni: "bg-[#2b2d40] text-[#6774FF]",
  restricted: "bg-[#402b2b] text-[#E9201D]",
  pending: "bg-[#443c29] text-[#ECAD11]",
};

const paymentStatusColors: Record<string, string> = {
  paid: "bg-[#2a3d2e] text-[#18CC3F]",
  overdue: "bg-[#402b2b] text-[#E9201D]",
  due: "bg-[#443c29] text-[#ECAD11]",
};

export const financeStudentManagementColumns = [
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
        className={`capitalize px-2.5 py-1 rounded-full text-sm font-medium ${
          statusColors[value]
        }`}
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
    accessor: "join_date",
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
        className={`capitalize px-2.5 py-1 rounded-full text-sm   ${
          paymentStatusColors[value]
        }`}
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
      <span className={`capitalize   text-sm text-white font-medium `}>
        {value}
      </span>
    ),
  },
  {
    label: "Actions",
    accessor: "action",
    width: "120px",
    formatter: (_: any, row: any) => (
      <div className=" flex items-center gap-6">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
              type="button"
            >
              <RestrictIcon />
            </button>
          </DialogTrigger>

          <DialogContent className="border-none p-6 rounded-2xl bg-[#0A1726] text-white max-w-md [&>button]:hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">User Info</h2>
              <DialogClose asChild>
                <button className="bg-[#1E293B] hover:bg-[#2c3650] p-2 rounded-md">
                  ✕
                </button>
              </DialogClose>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Student Type */}
              <div>
                <label className="text-sm text-[#A5A5AB]">Student Type</label>
                <select className="w-full mt-1 bg-[#0A1726] border border-[#2E3A59] rounded-xl px-4 py-3 text-sm focus:outline-none">
                  <option>Choose a Type</option>
                  <option>Free</option>
                  <option>Premium</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="text-sm text-[#A5A5AB]">Payment Status</label>
                <select className="w-full mt-1 bg-[#0A1726] border border-[#2E3A59] rounded-xl px-4 py-3 text-sm focus:outline-none">
                  <option>Choose a Status</option>
                  <option>Paid</option>
                  <option>Unpaid</option>
                </select>
              </div>

              {/* Payment Type */}
              <div>
                <label className="text-sm text-[#A5A5AB]">Payment Type</label>
                <select className="w-full mt-1 bg-[#0A1726] border border-[#2E3A59] rounded-xl px-4 py-3 text-sm focus:outline-none">
                  <option>Choose a Type</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4 mt-6">
              <DialogClose asChild>
                <button className="w-full border border-[#2E3A59] py-3 rounded-xl text-white hover:bg-[#1c253a]">
                  Cancel
                </button>
              </DialogClose>

              <button className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl text-white font-medium">
                Save
              </button>
            </div>
          </DialogContent>
        </Dialog>
        <Link
          href={`/finance-dashboard/student-management/student-details/${row.id}`}
          className=" hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
        >
          <EyeIcon />
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <button
              className=" hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
              type="button"
            >
              <RestrictIcon />
            </button>
          </DialogTrigger>
          <DialogContent className=" border-none py-14 px-8 rounded-2xl bg-[#0A1726] text-white [&>button]:hidden">
            <div className=" flex items-center justify-center">
              <Image src={warnigImg} alt="Warning" />
            </div>
            <h2 className=" text-white text-xl font-semibold text-center mt-4 ">
              Restrict User
            </h2>
            <p className=" text-center text-[#A5A5AB] text-sm ">
              Are you sure to Restrict the User?
            </p>
            <div className=" mt-10 flex items-center justify-center gap-3">
              <DialogClose asChild>
                <button className=" text-white text-base font-medium flex items-center gap-2.5 border border-[#3D4566] py-4 px-14 rounded-2xl cursor-pointer">
                  <CrossIcon /> Cancel
                </button>
              </DialogClose>
              <DialogClose asChild>
                <button className=" text-white text-base font-medium flex items-center gap-2.5 bg-[#e9201d] py-4 px-14 rounded-2xl cursor-pointer">
                  <RestrictUserIcon /> Yes, Restrict
                </button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
];
