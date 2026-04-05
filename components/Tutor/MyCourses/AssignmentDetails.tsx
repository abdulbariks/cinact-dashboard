"use client";
import React, { useState } from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import { useParams } from "next/navigation";
import { classes } from "./ModuleDetails";
import TeacherIcon from "@/components/icons/course-management/TeacherIcon";
import SubmissionIcon from "@/components/icons/course-management/SubmissionIcon";
import StarIcon from "@/components/icons/course-management/StarIcon";
import CalenderIcon2 from "@/components/icons/others/CalenderIcon2";
import SubmissionIconSecondary from "@/components/icons/course-management/SubmissionIconSecondary";
import Image from "next/image";
import { RemarkAssignmentModal } from "./modal/RemarkAssignmentModal";
import { Download, FileText, Video } from "lucide-react";
import { UpdateRemarkAssignmentModal } from "./modal/UpdateRemarkAssignmentModal";

const submissions = [
  { id: 1, type: "video", status: "pending" },
  { id: 2, type: "pdf", status: "pending" },
  { id: 3, type: "video", status: "pending" },
  {
    id: 4,
    type: "video",
    status: "graded",
    grade: "A Grade",
    score: "48/50",
    gradeColor: "#109334",
  },
  {
    id: 5,
    type: "pdf",
    status: "graded",
    grade: "B Grade",
    score: "38/50",
    gradeColor: "#007AFF",
  },
  {
    id: 6,
    type: "pdf",
    status: "graded",
    grade: "F Grade",
    score: "18/50",
    gradeColor: "#F23030",
  },
];

export default function AssignmentDetails() {
  const [isRemarkAssignmentModalOpen, setIsRemarkAssignmentModalOpen] =
    useState(false);
  const [
    isUpdateRemarkAssignmentModalOpen,
    setIsUpdateRemarkAssignmentModalOpen,
  ] = useState(false);
  const params = useParams<{
    id: string;
    classId: string;
    assignmentId: string;
  }>();
  const courseId = params?.id;
  const classId = params?.classId;
  const assignmentId = params?.assignmentId;

  const classNo =
    classes.find((cls) => cls.id === classId)?.classNo || "Class Details";
  // const assignmentNo = assignments.find((assignment) => assignment.id === assignmentId)?.assignmentNo || 'Assignment Details'

  return (
    <div>
      {/* breadcrump */}
      <div className="flex items-center gap-2">
        <Link
          href="/tutor-dashboard/my-courses"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          My Courses
        </Link>
        <BreadCrumpRightArrow />
        <Link
          href={`/dashboard/course-management/course-details/${courseId}`}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Course Details
        </Link>
        <BreadCrumpRightArrow />
        <Link
          href={`/tutor-dashboard/my-courses/my-courses-details/${courseId}/${classId}`}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          class -{classNo} Details
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">
          Assignment Details
        </p>
      </div>

      <div className=" mt-8">
        <h2 className=" text-2xl text-[#E6E7E8] font-semibold">
          Assignment Details
        </h2>
        <div className=" p-4 rounded-2xl bg-[#0A1929] mt-4.5">
          <h3 className=" text-xl text-white font-medium">
            Introduction to Personal Development
          </h3>
          <div className=" p-4 rounded-[10px] bg-[#07121D] mt-4">
            <div className=" flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className=" flex items-center gap-1">
                  <TeacherIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Teacher</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  Wade Warren
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <SubmissionIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Submission</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  22 submitted
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <StarIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Average Score</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  42.5/50
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <CalenderIcon2 />
                  <p className=" text-xs text-[#A5A5AB] ">Date</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  2024-08-01
                </h3>
              </div>
            </div>

            <div className=" mt-4">
              <h3 className=" text-xl text-white font-medium">
                Assignment Description
              </h3>
              <p className=" mt-2.5 text-sm text-[#D2D2D5]">
                Write a comprehensive 500-word reflection essay on pur current
                confidence level, identffying specific areas for 'np«ovement and
                outlining actionable steps for personal development in your
                acting Journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=" p-4 bg-[#0a1929] rounded-[12px] mt-6">
        <div className=" border-b  border-[#3D4566]">
          <div className=" inline-flex items-center gap-2 border-b-2 border-[#E9201D] p-5">
            <SubmissionIconSecondary />
            <h3 className=" text-base text-white font-medium">
              Assignments Submision
            </h3>
          </div>
        </div>
        <div className="mt-5 bg-[#0A1929] rounded-2xl p-6 border border-[#0f1f35]">
          <div className="w-full bg-[#040D16] rounded-2xl p-6">
            <h2 className="text-white text-xl font-semibold mb-6">
              Student Assignment Submissions (22)
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#0A1D2E] p-5 rounded-[15px] border border-[#1C2632]"
                >
                  {/* Header: Profile & Action Button */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700">
                        <Image
                          src="/profile.png"
                          alt="avatar"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm">
                          Sophie Lambert
                        </h3>
                        <p className="text-[#8D9CDC] text-xs">ID-SP1420</p>
                      </div>
                    </div>

                    {sub.status === "pending" ? (
                      // <button className="bg-[#F23030] text-white text-xs px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer">
                      //   Remark Assignment
                      // </button>
                      <RemarkAssignmentModal
                        open={isRemarkAssignmentModalOpen}
                        onOpenChange={setIsRemarkAssignmentModalOpen}
                      />
                    ) : (
                      <UpdateRemarkAssignmentModal
                        open={isUpdateRemarkAssignmentModalOpen}
                        onOpenChange={setIsUpdateRemarkAssignmentModalOpen}
                      />
                    )}
                  </div>

                  {/* Submission Time & Grade Badges */}
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[#8D9CDC] font-medium">
                      Submitted:{" "}
                      <span className="text-white">20-8-25 | 09 : 30 AM</span>
                    </p>
                    {sub.status === "graded" && (
                      <div className="flex gap-2">
                        <span
                          className="text-[10px] px-2 py-1 rounded bg-opacity-10 font-bold"
                          style={{
                            color: sub.gradeColor,
                            backgroundColor: sub.gradeColor + "22",
                          }}
                        >
                          {sub.grade}
                        </span>
                        <span className="text-[10px] px-2 py-1 rounded bg-[#1C2632] text-[#8D9CDC] font-bold">
                          {sub.score}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Attachment Box */}
                  <div className="bg-[#0A1D2E] border border-[#1C2632] rounded-lg overflow-hidden mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-[#1C2632] p-4 text-[#8D9CDC]">
                        {sub.type === "video" ? (
                          <Video size={18} />
                        ) : (
                          <FileText size={18} />
                        )}
                      </div>
                      <span className="ml-4 text-[#A1AAB3] text-xs">
                        {sub.type === "video"
                          ? "Attachment-006.mp4"
                          : "Attachment-006.pdf"}
                      </span>
                    </div>
                    <Download
                      size={16}
                      className="mr-4 text-[#F23030] cursor-pointer"
                    />
                  </div>

                  {/* Description Area */}
                  <div className="border border-dashed bg-[#0A1A29] border-[#1C2632] rounded-lg p-3">
                    <h4 className="text-white text-xs font-medium mb-1">
                      Description
                    </h4>
                    <p className="text-[#A1AAB3] text-xs">
                      This is assignment.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
