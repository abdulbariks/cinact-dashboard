import EditIcon from "../icons/SuperAdmindashboard/EditIcon";
import EyeIcon from "../icons/SuperAdmindashboard/EyeIcon";
import Link from "next/link";

const teacherStatusColors: Record<string, string> = {
	active: "bg-[#2a3d2e] text-[#18CC3F]",
	inactive: "bg-[#402b2b] text-[#E9201D]",
};

export const teachersColumns = [
	{
		label: "Teacher Name",
		accessor: "teacher_name",
		width: "260px",
		formatter: (value: string, row: any) => (
			<div className="flex items-center gap-3">
				<div className="w-8 h-8 rounded-full bg-[#282e44] text-[#8D9CDC] flex items-center justify-center text-sm font-semibold uppercase">
					{value?.charAt(0)}
				</div>
				<div>
					<p className="text-sm text-white font-medium">{value}</p>
					<p className="text-xs text-[#A5A5AB]">{row.email}</p>
				</div>
			</div>
		),
	},
	{
		label: "Phone",
		accessor: "phone",
		width: "180px",
		formatter: (value: string) => (
			<span className="text-sm text-white font-medium">{value}</span>
		),
	},
	{
		label: "Classes",
		accessor: "classes",
		width: "120px",
		formatter: (value: number) => (
			<span className="text-sm text-white font-medium">{value}</span>
		),
	},
	{
		label: "Joined Date",
		accessor: "joined_date",
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
		label: "Status",
		accessor: "status",
		width: "120px",
		formatter: (value: string) => (
			<span
				className={`capitalize px-2.5 py-1 rounded-full text-sm font-medium ${
					teacherStatusColors[value] || "bg-[#443c29] text-[#ECAD11]"
				}`}
			>
				{value}
			</span>
		),
	},
	{
		label: "Actions",
		accessor: "action",
		width: "120px",
		formatter: (_: any, row: any) => (
			<div className="flex items-center gap-6">
				<Link href={`/dashboard/teacher-management/edit-teacher/${row.id}`} className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer">
					<EditIcon />
				</Link>
				<Link href={`/dashboard/teacher-management/teacher-details/${row.id}`} className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer">
					<EyeIcon />
				</Link>
			</div>
		),
	},
];
