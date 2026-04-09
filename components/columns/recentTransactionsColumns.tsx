import Link from "next/link";

export const recentTransactionsColumns = [
  {
    label: "User ID",
    accessor: "userId",
    width: "120px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value}</span>
    ),
  },
  {
    label: "User Name",
    accessor: "userName",
    width: "220px",
    formatter: (value: string) => (
      <span className="text-sm text-white font-medium">{value}</span>
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
    accessor: "paymentDate",
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
];
