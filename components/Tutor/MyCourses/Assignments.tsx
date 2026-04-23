"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import WhiteRightArrowIcon from "@/components/icons/course-management/WhiteRightArrowIcon";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { parseCookies } from "nookies";
import { TutorService } from "@/service/tutor/tutor.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { TGetAssignmentsResponse } from "@/types/tutor.mycourse";
import AddAssignmentModal from "./modal/AddAssignmentModal";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";

// export const assignments = [
//   {
//     id: "3300",
//     assignmentNo: "1",
//     due: "2 days",
//     details:
//       "Write a 500-word reflection on your current confidence level and areas for improvement.",
//     submissionCount: 22,
//     gradedCount: 18,
//   },
//   {
//     id: "3301",
//     assignmentNo: "2",
//     due: "4 days",
//     details:
//       "Record and submit a 3-minute monologue focusing on breath support and vocal clarity.",
//     submissionCount: 19,
//     gradedCount: 12,
//   },
//   {
//     id: "3302",
//     assignmentNo: "3",
//     due: "1 week",
//     details:
//       "Perform a partner exercise and submit feedback on listening and response timing.",
//     submissionCount: 17,
//     gradedCount: 10,
//   },
//   {
//     id: "3303",
//     assignmentNo: "4",
//     due: "10 days",
//     details:
//       "Prepare a short scene presentation and attach your rehearsal notes with objectives.",
//     submissionCount: 14,
//     gradedCount: 6,
//   },
// ];

interface AssignmentsProps {
  classTitle: string | undefined;
  subjectName: string | undefined;
}
export default function Assignments({
  classTitle,
  subjectName,
}: AssignmentsProps) {
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    description: "",
    date: "",
    totalMarks: "",
    file: null as File | null,
  });
  const [openItem, setOpenItem] = useState<string>("class-1");
  const params = useParams<{ id: string; classId: string }>();
  const courseId = params?.id;
  const classId = params?.classId;

  // console.log("classId==========", classId);

  const [assignments, setAssignments] =
    useState<TGetAssignmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await TutorService.getAllAssignmentsByClass({
          classId: classId as string,
          token,
        });

        setAssignments(response?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load assignments details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      loadAssignments();
    }
  }, [classId]);

  // console.log("assignments============", assignments);

  const handleAddAssignment = async () => {
    const formData = new FormData();

    // Append your form fields
    formData.append("title", classTitle);
    formData.append("description", assignmentData.description);
    formData.append("submission_date", assignmentData.date);
    formData.append("total_marks", assignmentData.totalMarks);
    // Append the file if it exists
    if (assignmentData.file) {
      formData.append("media", assignmentData.file);
    }

    try {
      const response = await TutorService.createClassAssignment({
        classId: classId,
        payload: formData,
      });
      console.log("Assignment created:", response);
      setIsAddAssignmentOpen(false);
      showSuccessToast(response?.data?.message || "Class added successfully!");
    } catch (error) {
      // console.error("Error creating assignment:", error);
      showErrorToast(error?.data?.message || "Error creating assignment.");
    }
  };

  if (loading) {
    return <>Loading............</>;
  }
  return (
    <div>
      <h2 className="text-xl font-medium text-white mb-4">All Assignments</h2>

      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={(v) => setOpenItem(v)}
        className="flex w-full flex-col gap-3"
      >
        <AccordionItem
          value="class-1"
          className="rounded-2xl border border-[#3D4566] [&_[data-slot=accordion-trigger]>svg]:hidden"
        >
          <AccordionTrigger className="flex cursor-pointer items-center justify-between rounded-t-2xl rounded-b-none px-4 text-left text-white hover:no-underline data-[state=open]:bg-[#262b40]">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-[#8D9CDC]">
                {/* Class-1 */}
                {classTitle}
              </p>
              <h3 className="text-base font-medium text-white">
                {/* Voice & Breath Control */}
                {subjectName}
              </h3>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 text-[#A5A5AB]">
            <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 mt-3">
              {assignments?.data?.map((assignment) => (
                <Link
                  href={
                    courseId && classId
                      ? `/tutor-dashboard/my-courses/my-courses-details/${courseId}/${classId}/${assignment.id}`
                      : "#"
                  }
                  key={assignment.id}
                  className=" p-4 rounded-[12px] bg-[#0a1d2e] hover:bg-[#12283d] transition-colors duration-200 border-l border-[#5F6CA0]"
                >
                  <div className=" flex items-center justify-between">
                    <div className=" flex items-center gap-2.5">
                      <h3 className=" text-base text-white font-medium">
                        {/* Assignment {assignment.assignmentNo} */}
                        {assignment?.title}
                      </h3>
                      <p className=" py-1 px-2.5 rounded-full bg-[#f9c80e] text-xs text-[#030C15] font-medium ">
                        {/* Due {assignment.due} */}
                        Due{" "}
                        {assignment?.due_date
                          ? new Date(assignment.due_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </p>
                    </div>

                    <WhiteRightArrowIcon />
                  </div>

                  <p className=" text-sm text-[#D2D2D5] mt-1">
                    {assignment?.description}
                  </p>
                  <h4 className=" text-base text-[#18CC3F] mt-2">
                    Submissions: {assignment?.submissions} | Graded:{" "}
                    {assignment?.grades}
                  </h4>
                </Link>
              ))}
              {/* Add Assignment Dotted Button */}
              <button
                type="button"
                onClick={() => setIsAddAssignmentOpen(true)}
                className="py-6 px-4 border border-dashed border-[#5F6CA0] rounded-[12px] flex items-center justify-center gap-2 text-[#8D9CDC] font-medium hover:text-white hover:border-[#8D9CDC] transition-colors cursor-pointer"
              >
                <PlusIcon />
                Add Assignment
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <AddAssignmentModal
        open={isAddAssignmentOpen}
        onOpenChange={setIsAddAssignmentOpen}
        assignmentData={assignmentData}
        setAssignmentData={setAssignmentData}
        onAddAssignment={handleAddAssignment}
      />
    </div>
  );
}
