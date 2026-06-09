import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";

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
    accessor: "name",
    width: "200px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value}</span>
    ),
  },
  {
    label: "Transaction ID",
    accessor: "transaction_ref",
    width: "160px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value}</span>
    ),
  },
  {
    label: "Payment Plan",
    accessor: "payment_plan",
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
    accessor: "paid_at",
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
    label: "Payment Status",
    accessor: "status",
    width: "180px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value}</span>
    ),
  },
  {
    label: "Actions",
    accessor: "action",
    width: "100px",
    formatter: (value: unknown, row: Record<string, unknown>) => (
      <div className="flex items-center">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDownloadPDF(row);
          }}
          className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
        >
          <DownloadIcon />
        </Link>
      </div>
    ),
  },
];

const handleDownloadPDF = (row: Record<string, unknown>) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Transaction Details", 14, 20);

  doc.setFontSize(12);
  const lines = [
    `User ID: ${row.user_id || ""}`,
    `Name: ${row.name || ""}`,
    `Transaction Ref: ${row.transaction_ref || ""}`,
    `Amount: ${row.currency || ""} ${row.amount || 0}`,
    `Status: ${row.status || ""}`,
    `Paid At: ${row.paid_at ? new Date(row.paid_at as string).toLocaleString() : ""}`,
    `Payment Plan: ${row.payment_plan || ""}`,
    `Source: ${(row as any).source || ""}`,
    `Order Number: ${(row.order as any)?.order_number || ""}`,
    `Item Type: ${(row.order as any)?.item_type || ""}`,
    `Course: ${(row.order as any)?.course?.title || ""}`,
    `Event: ${(row.order as any)?.event ? (row.order as any).event.title || "" : "None"}`,
  ];

  let y = 30;
  lines.forEach((line) => {
    doc.text(line, 14, y);
    y += 8;
  });

  doc.save(`name-${(row.name as string) || "download"}.pdf`);
};
