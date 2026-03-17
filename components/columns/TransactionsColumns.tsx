import { DownloadIcon } from "lucide-react";
import Link from "next/link";

export const transactionsColumns = [
  {
    label: "User ID",
    accessor: "user_id",
    width: "120px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value}</span>
    ),
  },

  {
    label: "User Name",
    accessor: "user_name",
    width: "200px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value}</span>
    ),
  },
  {
    label: "Transaction ID",
    accessor: "transaction_id",
    width: "160px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value}</span>
    ),
  },
  {
    label: "Payment Type",
    accessor: "payment_type",
    width: "150px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium capitalize">{value}</span>
    ),
  },
  {
    label: "Amount",
    accessor: "amount",
    width: "120px",
    formatter: (value: number) => (
      <span className="text-sm text-[#18CC3F] font-semibold">${value}</span>
    ),
  },
  {
    label: "Date",
    accessor: "date",
    width: "150px",
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
    label: "Payment Plan",
    accessor: "payment_plan",
    width: "180px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value}</span>
    ),
  },
  {
    label: "Actions",
    accessor: "action",
    width: "100px",
    formatter: () => (
      <div className="flex items-center">
        <Link
          href="#"
          className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
        >
          <DownloadIcon />
        </Link>
      </div>
    ),
  },
];
