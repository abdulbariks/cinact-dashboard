import type { ReactNode } from "react";
import DownloadIcon from "../icons/others/DownloadIcon";

export interface EventMemberRow {
	user_id: string;
	user_name: string;
	event_name: string;
	amount: string;
	transaction_id: string;
	date: string;
	action?: "download";
}

type EventMemberAccessor = keyof EventMemberRow;

interface EventMemberColumn {
	label: string;
	accessor: EventMemberAccessor;
	width: string;
	formatter?: (value: EventMemberRow[EventMemberAccessor], row: EventMemberRow) => ReactNode;
}

export const eventMembersColumns: EventMemberColumn[] = [
	{
		label: "User ID",
		accessor: "user_id",
		width: "130px",
		formatter: (value) => (
			<span className="text-sm text-white ">{value}</span>
		),
	},
	{
		label: "User Name",
		accessor: "user_name",
		width: "220px",
		formatter: (value) => (
			<span className="text-sm text-white  ">{value}</span>
		),
	},
	{
		label: "Event Name",
		accessor: "event_name",
		width: "240px",
		formatter: (value) => (
			<span className="text-sm text-white  ">{value}</span>
		),
	},
	{
		label: "Amount",
		accessor: "amount",
		width: "120px",
		formatter: (value) => (
			<span className="text-sm text-white font-medium">{value}</span>
		),
	},
	{
		label: "Transaction ID",
		accessor: "transaction_id",
		width: "180px",
		formatter: (value) => (
			<span className="text-sm text-white">{value}</span>
		),
	},
	{
		label: "Date",
		accessor: "date",
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
