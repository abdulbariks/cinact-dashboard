import type { ReactNode } from "react";
import DownloadIcon from "../icons/others/DownloadIcon";

export interface EventMemberRow {
  user_id: string;
  user_name: string;
  event_name: string;
  event_amount: string;
  payment_id: string;
  event_date: string;
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
    label: "User ID",
    accessor: "user_id",
    width: "130px",
    // formatter: (value) => (
    //   <span className="text-sm text-white ">{value || "N/A"}</span>
    // ),
    formatter: (_: any, row: any) => (
      <span className="text-sm text-white">{row.user?.id || "N/A"}</span>
    ),
  },
  {
    label: "User Name",
    accessor: "user_name",
    width: "220px",
    // formatter: (value) => <span className="text-sm text-white  ">{value}</span>,
    formatter: (_: any, row: any) => (
      <span className="text-sm text-white">{row.user?.name || "N/A"}</span>
    ),
  },
  {
    label: "Event Name",
    accessor: "event_name",
    width: "240px",
    formatter: (value) => (
      <span className="text-sm text-white  ">{value || "N/A"}</span>
    ),
  },
  {
    label: "Amount",
    accessor: "event_amount",
    width: "120px",
    formatter: (value) => (
      <span className="text-sm text-white font-medium">{value || "N/A"}</span>
    ),
  },
  {
    label: "Transaction ID",
    accessor: "payment_id",
    width: "180px",
    formatter: (value) => (
      <span className="text-sm text-white">{value || "N/A"}</span>
    ),
  },
  {
    label: "Date",
    accessor: "event_date",
    width: "160px",
    formatter: (value) => {
      const parsedDate = new Date(String(value));
      return (
        <span className="text-sm text-white  ">
          {parsedDate.toLocaleDateString("en-US", {
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
