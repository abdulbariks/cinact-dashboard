"use client";
import React, { useState } from "react";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import RightArrowModuleIcon from "@/components/icons/course-management/RightArrowModuleIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddClassModal from "./modal/AddClassModal";
import { TModule } from "@/types/tutor.mycourse";
import { TutorService } from "@/service/tutor/tutor.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";

// Define the Props interface
interface ModuleDetailsProps {
  module: TModule;
  onClassAdded?: () => void;
}
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
  const courseId = path.split("/")[4]; // Extract courseId from the URL

  // console.log("module================", module?.id);

  // console.log(classData);
  // Submission handler
  const handleAddClass = async () => {
    try {
      // 1. Format the date into ISO string "YYYY-MM-DDTHH:mm:ss.000Z"
      const combinedDateTime = new Date(
        `${classData.date}T${classData.time}:00`,
      ).toISOString();

      // Prepare payload
      const payload = {
        class_title: classData.classTitle,
        class_name: classData.className,
        class_overview: classData.classOverview,
        duration: classData.duration,
        class_date: combinedDateTime,
        class_time: classData.time,
      };

      //  Call API
      const response = await TutorService.createTutorClass({
        moduleId: module.id,
        payload: payload,
      });
      // console.log("response===============", response);
      // Close modal and handle success
      setIsAddClassOpen(false);
      setClassData({
        classTitle: "",
        className: "",
        classOverview: "",
        duration: "",
        date: "",
        time: "",
      });
      showSuccessToast(response?.data?.message || "Class added successfully!");
      if (onClassAdded) {
        onClassAdded();
      }
    } catch (error) {
      // console.error("Error creating class:", error);
      // alert("Failed to create class.");
      showErrorToast(error?.data?.message || "Failed to create class.");
    }
  };

  return (
    <div className="mt-3">
      {/* <div className=" px-4 pt-4 pb-8 border  border-[#3D4566] rounded-[12px] bg-[#07121d]">
        <h3 className=" text-base text-white font-medium ">Module Overview</h3>
        <p className=" text-sm text-[#D2D2D5] my-2.5">
          {module?.module_overview}
        </p>
        <h3 className=" text-sm text-white   mt-4">Key Learning Outcomes</h3>
        <ul className=" mt-2.5">
          <li className=" text-sm text-[#D2D2D5] ">
            {" "}
            <span className=" text-[#E9201D]">⊹</span> Gain self-awareness and
            confidence
          </li>
          <li className=" text-sm text-[#D2D2D5] ">
            {" "}
            <span className=" text-[#E9201D]">⊹</span> Boost creativity and
            focus
          </li>
          <li className=" text-sm text-[#D2D2D5] ">
            {" "}
            <span className=" text-[#E9201D]">⊹</span> Improve communication
            skills
          </li>
        </ul>
      </div> */}

      <div>
        <h3 className=" text-base text-white font-medium my-3">All classes</h3>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {module?.classes?.map((cls) => (
            <Link
              href={`/tutor-dashboard/my-courses/my-courses-details/${courseId}/${cls.id}`}
              key={cls.id}
              className={`p-4 border-l-2 rounded-[12px] flex items-center justify-between ${
                cls.status === "NEXT_CLASS"
                  ? "bg-[#12283d] border-[#F9C80E]"
                  : "bg-[#0a1d2e] border-[#0a1d2e] "
              }`}
            >
              <div>
                <div className=" flex items-center gap-2">
                  <h3 className=" text-sm text-[#8D9CDC] ">
                    {/* Class-{cls.classNo} */}
                    {cls.class_title}
                  </h3>
                  {cls.status && (
                    <p
                      className={`text-xs font-medium py-1 px-2 rounded-full inline-block ${
                        cls.status === "NEXT_CLASS"
                          ? "text-[#030C15] bg-[#8D9CDC] "
                          : "text-[#18CC3F] bg-[#2a3d2e]"
                      }`}
                    >
                      {cls.status}
                    </p>
                  )}
                </div>
                <h2 className=" text-base text-white font-medium mt-1">
                  {/* {cls.className} */}
                  {cls.class_name}
                </h2>
              </div>
              <div>
                <RightArrowModuleIcon />
              </div>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setIsAddClassOpen(true)}
            className="py-6 px-4 border border-dashed border-[#5F6CA0] rounded-[12px] flex items-center justify-center gap-2 text-[#8D9CDC] font-medium hover:text-white hover:border-[#8D9CDC] transition-colors cursor-pointer"
          >
            <PlusIcon />
            Add Class
          </button>
        </div>
      </div>

      <AddClassModal
        open={isAddClassOpen}
        onOpenChange={(open) => {
          setIsAddClassOpen(open);
          if (!open) {
            setClassData({
              classTitle: "",
              className: "",
              classOverview: "",
              duration: "",
              date: "",
              time: "",
            });
          }
        }}
        classData={classData}
        setClassData={setClassData}
        onAddClass={handleAddClass}
      />
    </div>
  );
}
