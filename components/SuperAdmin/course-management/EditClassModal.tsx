"use client";

import React from "react";
import ClockIcon from "@/components/icons/course-management/ClockIcon";
import CalenderIcon2 from "@/components/icons/others/CalenderIcon2";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type EditClassData = {
	classTitle: string
	className: string
	classOverview: string
	duration: string
	date: string
	time: string
}

type EditClassModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	classData: EditClassData
	setClassData: React.Dispatch<React.SetStateAction<EditClassData>>
}

export default function EditClassModal({
	open,
	onOpenChange,
	classData,
	setClassData,
}: EditClassModalProps) {
	const inputClassName =
		"w-full rounded-2xl border border-[#3D4566] bg-transparent px-4 py-3 text-white placeholder:text-[#3D4566] outline-none focus:border-[#5F6CA0]"
	const labelClassName = "mb-2 block text-sm text-[#B2B5B8]"

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-170 max-w-[95vw] rounded-2xl border-none bg-[#0A1726] p-6 text-white">
				<DialogHeader className="mb-2 border-b border-[#141B34] pb-4">
					<DialogTitle className="text-xl font-semibold text-white">Edit Class</DialogTitle>
				</DialogHeader>

				<div className="mt-4 flex flex-col gap-5">
					<div>
						<label className={labelClassName}>Class Title</label>
						<input
							name="classTitle"
							value={classData.classTitle}
							onChange={(e) =>
								setClassData((prev) => ({ ...prev, classTitle: e.target.value }))
							}
							placeholder="Enter class title"
							className={inputClassName}
						/>
					</div>

					<div>
						<label className={labelClassName}>Class Name</label>
						<input
							name="className"
							value={classData.className}
							onChange={(e) =>
								setClassData((prev) => ({ ...prev, className: e.target.value }))
							}
							placeholder="Enter class name"
							className={inputClassName}
						/>
					</div>

					<div>
						<label className={labelClassName}>Class Overview</label>
						<textarea
							name="classOverview"
							value={classData.classOverview}
							onChange={(e) =>
								setClassData((prev) => ({ ...prev, classOverview: e.target.value }))
							}
							rows={4}
							placeholder="Describe the Class overview..."
							className={`${inputClassName} resize-none py-4`}
						/>
					</div>

					<div>
						<label className={labelClassName}>Duration</label>
						<input
							name="duration"
							value={classData.duration}
							onChange={(e) =>
								setClassData((prev) => ({ ...prev, duration: e.target.value }))
							}
							placeholder="Enter duration"
							className={inputClassName}
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className={labelClassName}>Date</label>
							<div className="relative">
								<input
									type="date"
									value={classData.date}
									onChange={(e) =>
										setClassData((prev) => ({ ...prev, date: e.target.value }))
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
							<label className={labelClassName}>Time</label>
							<div className="relative">
								<input
									type="time"
									value={classData.time}
									onChange={(e) =>
										setClassData((prev) => ({ ...prev, time: e.target.value }))
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

					<div className="mt-2 flex items-center justify-end gap-3">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="rounded-2xl bg-[#3D4566] px-11 py-4 text-base font-medium text-white transition-colors cursor-pointer hover:bg-[#5F6CA0]"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="flex cursor-pointer items-center gap-2 rounded-2xl bg-[#E9201D] px-11 py-4 text-base font-medium text-white transition-colors hover:bg-[#ff3b1f]"
						>
							Edit Class
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
