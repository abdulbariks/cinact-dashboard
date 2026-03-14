import Image from "next/image";
import avatar1 from '@/public/admin-dashboard/avatar-1.png'
import avatar2 from '@/public/admin-dashboard/avatar-2.png'
import avatar3 from '@/public/admin-dashboard/avatar-3.png'
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

export const studentManagementColumns = [
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
        className={`capitalize px-2.5 py-1 rounded-full text-sm font-medium ${statusColors[value] 
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    label: "Course Name",
    accessor: "course_name",
    width: "200px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value}</span>
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
      <span
        className={`capitalize   text-sm text-white font-medium `}
      >
        {value}
      </span>
    ),
  },
  {
    label: "Actions",
    accessor: "action",
    width: "120px",
    formatter: ( ) => (
      <div className=" flex items-center gap-6">
         <Link href='#' className=" hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer">
            <EditIcon/>
         </Link>
         <Link href='/dashboard/student-management/student-details' className=" hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer">
            <EyeIcon/>
         </Link>
         <Dialog>
           <DialogTrigger asChild>
             <button className=" hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer" type="button">
               <RestrictIcon/>
             </button>
           </DialogTrigger>
           <DialogContent className=" border-none bg-[#0A1726] text-white [&>button]:hidden">
             <DialogHeader>
               <DialogTitle>Restrict Student</DialogTitle>
               <DialogDescription className="text-[#B6C2ED]">
                 Are you sure you want to restrict this student account?
               </DialogDescription>
             </DialogHeader>
             <DialogFooter>
               <DialogClose asChild>
                 <button
                   type="button"
                   className="rounded-xl border border-[#3D4566] px-4 py-2 text-sm text-white"
                 >
                   Cancel
                 </button>
               </DialogClose>
               <DialogClose asChild>
                 <button
                   type="button"
                   className="rounded-xl bg-[#E9201D] px-4 py-2 text-sm font-medium text-white hover:bg-[#e9201d]/90"
                 >
                   Restrict
                 </button>
               </DialogClose>
             </DialogFooter>
           </DialogContent>
         </Dialog>
        
      </div>
    ),
  },
];