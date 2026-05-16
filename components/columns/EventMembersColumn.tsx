import type { ReactNode } from "react";
import DownloadIcon from "../icons/others/DownloadIcon";

export interface EventMemberRow {
  id: string;
  created_at: string;
  user_name: string;
  user_email: string;
  paid_amount: number;
  transaction_ref: string;
  action?: "download";
}

type EventMemberAccessor = keyof EventMemberRow;

interface EventMemberColumn {
  label: string;
  accessor: EventMemberAccessor;
  width: string;
  formatter?: (
    value: EventMemberRow[EventMemberAccessor],
    row: EventMemberRow,
  ) => ReactNode;
}

export const eventMembersColumns: EventMemberColumn[] = [
  {
    label: "Member ID",
    accessor: "id",
    width: "220px",
    formatter: (value) => (
      <span className="text-sm text-white">{value || "N/A"}</span>
    ),
  },
  {
    label: "User Name",
    accessor: "user_name",
    width: "180px",
    formatter: (value) => (
      <span className="text-sm text-white">{value || "N/A"}</span>
    ),
  },
  {
    label: "Email",
    accessor: "user_email",
    width: "240px",
    formatter: (value) => (
      <span className="text-sm text-white  ">{value || "N/A"}</span>
    ),
  },
  {
    label: "Paid Amount",
    accessor: "paid_amount",
    width: "120px",
    formatter: (value) => {
      const amount = Number(value);
      return (
        <span className="text-sm text-white font-medium">
          {Number.isFinite(amount) ? `$ ${amount}` : "N/A"}
        </span>
      );
    },
  },
  {
    label: "Transaction ID",
    accessor: "transaction_ref",
    width: "180px",
    formatter: (value) => (
      <span className="text-sm text-white">{value || "N/A"}</span>
    ),
  },
  {
    label: "Date",
    accessor: "created_at",
    width: "160px",
    formatter: (value) => {
      const parsedDate = new Date(String(value));
      return (
        <span className="text-sm text-white  ">
          {Number.isNaN(parsedDate.getTime())
            ? "N/A"
            : parsedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
        </span>
      );
    },
  },
  {
    label: "Action",
    accessor: "action",
    width: "60px",
    formatter: () => <DownloadIcon />,
  },
];
