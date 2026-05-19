import EditIcon from "../icons/SuperAdmindashboard/EditIcon";
import EyeIcon from "../icons/SuperAdmindashboard/EyeIcon";
import TrashIconRed from "../icons/course-management/TrashIconRed";
import Link from "next/link";

const teacherStatusColors: Record<string, string> = {
	active: "bg-[#2a3d2e] text-[#18CC3F]",
	inactive: "bg-[#402b2b] text-[#E9201D]",
};

const formatUserType = (value?: string) => {
	if (!value) return "-";
	return value.replaceAll("_", " ");
};

export const getTeachersColumns = (onDelete?: (id: string) => void) => [
	{
		label: "User Name",
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
		label: "User Type",
		accessor: "user_type",
		width: "120px",
		formatter: (value: string) => (
			<span className="text-sm text-white font-medium capitalize">
				{formatUserType(value)}
			</span>
		),
	},
	{
		label: "Joined Date",
		accessor: "joined_date",
		width: "150px",
		formatter: (value: string) => {
			if (!value) {
				return <span className="text-sm text-white font-medium">-</span>;
			}

			const date = new Date(value);

			if (Number.isNaN(date.getTime())) {
				return <span className="text-sm text-white font-medium">-</span>;
			}

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
					teacherStatusColors[value?.toLowerCase?.() || value] || "bg-[#443c29] text-[#ECAD11]"
				}`}
			>
				{value || '-'}
			</span>
		),
	},
	{
		label: "Actions",
		accessor: "action",
		width: "150px",
		formatter: (_: any, row: any) => (
			<div className="flex items-center gap-4">
				<Link href={`/dashboard/teacher-management/edit-teacher/${row.id}`} className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer">
					<EditIcon />
				</Link>
				<Link href={`/dashboard/teacher-management/teacher-details/${row.id}`} className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer">
					<EyeIcon />
				</Link>
				<button
					type="button"
					onClick={() => onDelete?.(row.id)}
					className="hover:bg-[#282e44] p-1.5 rounded-lg cursor-pointer"
				>
					<TrashIconRed />
				</button>
			</div>
		),
	},
];

export const teachersColumns = getTeachersColumns();
