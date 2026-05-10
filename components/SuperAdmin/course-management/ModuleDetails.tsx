import React, { useState } from "react";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import RightArrowModuleIcon from "@/components/icons/course-management/RightArrowModuleIcon";
import AddClassModal from "./AddClassModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TModule } from "@/types/tutor.mycourse";
import { AdminCourseManagementService } from "@/service/user/user.service";
import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";

export const classes = [
  {
    id: "2200",
    classNo: "1",
    className: "Voice & Breath Control",
    status: "complete",
  },
];

type ModuleDetailsProps = {
  module: TModule;
  onClassAdded?: () => void;
};

export default function ModuleDetails({ module, onClassAdded }: ModuleDetailsProps) {
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [classData, setClassData] = useState({
    classTitle: "",
    className: "",
    classOverview: "",
    duration: "",
    date: "",
    time: "",
  });

  const path = usePathname();
  const courseId = path.split("/")[4];

  const handleAddClass = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const startDate =
        classData.date && classData.time
          ? new Date(`${classData.date}T${classData.time}:00`).toISOString()
          : classData.date;

      const response = await AdminCourseManagementService.createClass({
        moduleId: module.id,
        token,
        payload: {
          class_title: classData.classTitle,
          class_name: classData.className,
          class_overview: classData.classOverview,
          duration: classData.duration,
          start_date: startDate,
          class_time: classData.time,
        },
      });

      showSuccessToast(response?.data?.message || "Class added successfully");
      setClassData({
        classTitle: "",
        className: "",
        classOverview: "",
        duration: "",
        date: "",
        time: "",
      });
      setIsAddClassOpen(false);
      onClassAdded?.();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to add class");
    }
  };

  return (
    <div className="mt-3">
      <div className="rounded-[12px] border border-[#3D4566] bg-[#07121d] px-4 pb-8 pt-4">
        <h3 className="text-base font-medium text-white">Module Overview</h3>
        <p className="my-2.5 text-sm text-[#D2D2D5]">
          {module.module_overview || "No overview available."}
        </p>
      </div>

      <div>
        <h3 className="my-3 text-base font-medium text-white">All classes</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {module?.classes?.map((cls) => (
            <Link
              href={`/dashboard/course-management/course-details/${courseId}/${cls.id}`}
              key={cls.id}
              className={`flex items-center justify-between rounded-[12px] border-l-2 p-4 ${
                cls.status === "NEXT_CLASS"
                  ? "border-[#F9C80E] bg-[#12283d]"
                  : "border-[#0a1d2e] bg-[#0a1d2e]"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm text-[#8D9CDC]">{cls.class_title}</h3>
                  {cls.status && (
                    <p
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        cls.status === "NEXT_CLASS"
                          ? "bg-[#8D9CDC] text-[#030C15]"
                          : "bg-[#2a3d2e] text-[#18CC3F]"
                      }`}
                    >
                      {cls.status.replaceAll("_", " ").toLowerCase()}
                    </p>
                  )}
                </div>
                <h2 className="mt-1 text-base font-medium text-white">
                  {cls.class_name}
                </h2>
              </div>
              <RightArrowModuleIcon />
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setIsAddClassOpen(true)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#5F6CA0] px-4 py-6 font-medium text-[#8D9CDC] transition-colors hover:border-[#8D9CDC] hover:text-white"
          >
            <PlusIcon />
            Add Class
          </button>
        </div>
      </div>

      <AddClassModal
        open={isAddClassOpen}
        onOpenChange={setIsAddClassOpen}
        classData={classData}
        setClassData={setClassData}
        onAddClass={handleAddClass}
      />
    </div>
  );
}
