"use client";

import React from "react";
import ClockIcon from "@/components/icons/course-management/ClockIcon";
import CalenderIcon2 from "@/components/icons/others/CalenderIcon2";
import DropDownIcon from "@/components/icons/others/DropDownIcon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EditCourseData = {
	courseTitle: string
	instructor: string
	startDate: string
	classTime: string
	assignInstructor: string
	students: string
}

type EditCourseModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	editCourseData: EditCourseData
	setEditCourseData: React.Dispatch<React.SetStateAction<EditCourseData>>
	instructorOptions: string[]
}

export default function EditCourseModal({
	open,
	onOpenChange,
	editCourseData,
	setEditCourseData,
	instructorOptions,
}: EditCourseModalProps) {
	const inputClassName =
		"w-full rounded-2xl border border-[#3D4566] bg-transparent px-4 py-3 text-white placeholder:text-[#3D4566] outline-none focus:border-[#5F6CA0]"
	const labelClassName = "mb-2 block text-sm text-[#B2B5B8]"

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-170 max-w-[95vw] rounded-2xl border-none bg-[#0A1726] p-6 text-white">
				<DialogHeader className="mb-2 border-b border-[#141B34] pb-4">
					<DialogTitle className="text-xl font-semibold text-white">Edit Course</DialogTitle>
				</DialogHeader>

				<div className="mt-4 flex flex-col gap-5">
					<div>
						<label className={labelClassName}>Course Title</label>
						<input
							name="courseTitle"
							value={editCourseData.courseTitle}
							onChange={(e) =>
								setEditCourseData((prev) => ({ ...prev, courseTitle: e.target.value }))
							}
							placeholder="Enter course title"
							className={inputClassName}
						/>
					</div>

					<div>
						<label className={labelClassName}>Assign Instructor</label>
						<Select
							value={editCourseData.instructor}
							onValueChange={(value) =>
								setEditCourseData((prev) => ({ ...prev, instructor: value }))
							}
						>
							<SelectTrigger
								icon={<DropDownIcon className="h-4 w-4" />}
								className="w-full rounded-2xl border-[#3D4566] px-4 py-6 text-white"
							>
								<SelectValue placeholder="Select instructor" />
							</SelectTrigger>
							<SelectContent className="border-[#3D4566] bg-[#07121d] text-white">
								{instructorOptions.map((instructor) => (
									<SelectItem key={instructor} value={instructor}>
										{instructor}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className={labelClassName}>Start Date</label>
							<div className="relative">
								<input
									type="date"
									value={editCourseData.startDate}
									onChange={(e) =>
										setEditCourseData((prev) => ({ ...prev, startDate: e.target.value }))
									}
									onClick={(e) => {
										const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void }
										input.showPicker?.()
									}}
									onFocus={(e) => {
										const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void }
										input.showPicker?.()
									}}
									className={`${inputClassName} pr-12 scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
								/>
								<CalenderIcon2 className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
							</div>
						</div>
						<div>
							<label className={labelClassName}>Class Time</label>
							<div className="relative">
								<input
									type="time"
									value={editCourseData.classTime}
									onChange={(e) =>
										setEditCourseData((prev) => ({ ...prev, classTime: e.target.value }))
									}
									onClick={(e) => {
										const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void }
										input.showPicker?.()
									}}
									onFocus={(e) => {
										const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void }
										input.showPicker?.()
									}}
									className={`${inputClassName} pr-12 scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
								/>
								<span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
									<ClockIcon />
								</span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className={labelClassName}>Assign Instructor</label>
							<input
								value={editCourseData.assignInstructor}
								onChange={(e) =>
									setEditCourseData((prev) => ({ ...prev, assignInstructor: e.target.value }))
								}
								placeholder="Assign instructor"
								className={inputClassName}
							/>
						</div>
						<div>
							<label className={labelClassName}>Students</label>
							<input
								value={editCourseData.students}
								onChange={(e) =>
									setEditCourseData((prev) => ({ ...prev, students: e.target.value }))
								}
								placeholder="Enter students"
								className={inputClassName}
							/>
						</div>
					</div>

					<div className="mt-2 flex items-center justify-end gap-3">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className=" rounded-[16px] bg-[#3D4566] py-4 px-11 text-base text-white font-medium hover:bg-[#5F6CA0] transition-colors cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className=" bg-[#E9201D] rounded-[16px] py-4 px-11 text-base text-white font-medium hover:bg-[#ff3b1f] transition-colors cursor-pointer flex items-center gap-2"
						>
							Edit Course
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
