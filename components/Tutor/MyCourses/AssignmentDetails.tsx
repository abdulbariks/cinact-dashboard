"use client";
import React, { useEffect, useState } from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import { useParams } from "next/navigation";
// import { classes } from "./ModuleDetails";
import TeacherIcon from "@/components/icons/course-management/TeacherIcon";
import SubmissionIcon from "@/components/icons/course-management/SubmissionIcon";
import StarIcon from "@/components/icons/course-management/StarIcon";
import CalenderIcon2 from "@/components/icons/others/CalenderIcon2";
import SubmissionIconSecondary from "@/components/icons/course-management/SubmissionIconSecondary";
import Image from "next/image";
import { RemarkAssignmentModal } from "./modal/RemarkAssignmentModal";
import { Download, FileText, Video } from "lucide-react";
import { UpdateRemarkAssignmentModal } from "./modal/UpdateRemarkAssignmentModal";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";
import { TutorService } from "@/service/tutor/tutor.service";
import {
  TGetAllSubmittedAssignmentsResponse,
  TGetAssignmentDetailsByIdResponse,
} from "@/types/tutor.mycourse";

// const submissions = [
//   { id: 1, type: "video", status: "pending" },
//   { id: 2, type: "pdf", status: "pending" },
//   { id: 3, type: "video", status: "pending" },
//   {
//     id: 4,
//     type: "video",
//     status: "graded",
//     grade: "A Grade",
//     score: "48/50",
//     gradeColor: "#109334",
//   },
//   {
//     id: 5,
//     type: "pdf",
//     status: "graded",
//     grade: "B Grade",
//     score: "38/50",
//     gradeColor: "#007AFF",
//   },
//   {
//     id: 6,
//     type: "pdf",
//     status: "graded",
//     grade: "F Grade",
//     score: "18/50",
//     gradeColor: "#F23030",
//   },
// ];

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

  const [assignmentDetails, setAssignmentDetails] =
    useState<TGetAssignmentDetailsByIdResponse | null>(null);
  const [allSubmittedAssignment, setAllSubmittedAssignment] =
    useState<TGetAllSubmittedAssignmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignmentDetails = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";

        const response = await TutorService.getAssignmentDetailsById({
          assignmentId: assignmentId as string,
          token,
        });

        setAssignmentDetails(response?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load assignment details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      loadAssignmentDetails();
    }
  }, [assignmentId]);

  // console.log("assignmentDetails==========", assignmentDetails);

  useEffect(() => {
    const loadAllSubmittedAssignments = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";

        const response = await TutorService.getAllSubmittedAssignments({
          assignmentId: assignmentId as string,
          token,
        });

        setAllSubmittedAssignment(response?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load assignment details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      loadAllSubmittedAssignments();
    }
  }, [assignmentId]);

  console.log("allSubmittedAssignment=========", allSubmittedAssignment?.data);

  // const classNo =
  //   classes.find((cls) => cls.id === classId)?.classNo || "Class Details";
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
          href={`/tutor-dashboard/my-courses/my-courses-details/${courseId}`}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Course Details
        </Link>
        <BreadCrumpRightArrow />
        <Link
          href={`/tutor-dashboard/my-courses/my-courses-details/${courseId}/${classId}`}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          {/* class -{classNo} Details */}
          {assignmentDetails?.data?.title} Details
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
            {/* Introduction to Personal Development */}
            {assignmentDetails?.data?.title}
          </h3>
          <div className=" p-4 rounded-[10px] bg-[#07121D] mt-4">
            <div className=" flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className=" flex items-center gap-1">
                  <TeacherIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Teacher</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {/* Wade Warren */}
                  {assignmentDetails?.data?.instructor?.name}
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <SubmissionIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Submission</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {/* 22 submitted */}
                  {assignmentDetails?.data?.submissions} submitted
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <StarIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Average Score</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {/* 42.5/50 */}
                  {assignmentDetails?.data?.average_score}/
                  {assignmentDetails?.data?.total_marks}
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <CalenderIcon2 />
                  <p className=" text-xs text-[#A5A5AB] ">Date</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {/* 2024-08-01 */}
                  {assignmentDetails?.data?.submission_Date
                    ? new Date(
                        assignmentDetails.data.submission_Date,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No Date"}
                </h3>
              </div>
            </div>

            <div className=" mt-4">
              <h3 className=" text-xl text-white font-medium">
                Assignment Description
              </h3>
              <p className=" mt-2.5 text-sm text-[#D2D2D5]">
                {/* Write a comprehensive 500-word reflection essay on pur current
                confidence level, identffying specific areas for 'np«ovement and
                outlining actionable steps for personal development in your
                acting Journey. */}
                {assignmentDetails?.data?.description}
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
              {/* Student Assignment Submissions (22) */} Student Assignment
              Submissions ({allSubmittedAssignment?.data?.length || 0})
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#0A1D2E] p-5 rounded-[15px] border border-[#1C2632]"
                >
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
                  <div className="border border-dashed bg-[#0A1A29] border-[#1C2632] rounded-lg p-3">
                    <h4 className="text-white text-xs font-medium mb-1">
                      Description
                    </h4>
                    <p className="text-[#A1AAB3] text-xs">
                      This is assignment.
                    </p>
                  </div>
                </div>
              ))} */}

              {allSubmittedAssignment?.data?.map((sub) => {
                // Determine if the assignment is graded
                const isGraded = sub.grade && Object.keys(sub.grade).length > 0;

                // Format the date
                const dateObj = new Date(sub.submitted_at);
                const formattedDate = `${dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })} | ${dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

                // Extract filename
                const fileName = sub.file_url
                  ? sub.file_url.split("/").pop()
                  : "Attachment";
                const isVideo =
                  fileName.toLowerCase().endsWith(".mp4") ||
                  fileName.toLowerCase().endsWith(".mov");

                return (
                  <div
                    key={sub?.id}
                    className="bg-[#0A1D2E] p-5 rounded-[15px] border border-[#1C2632]"
                  >
                    {/* Header: Profile & Action Button */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 bg-gray-800">
                          <Image
                            src={sub.student?.avatar || "/profile.png"}
                            alt="avatar"
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-sm">
                            {sub.student?.name || "Unknown Student"}
                          </h3>
                          <p className="text-[#8D9CDC] text-xs">
                            ID-{sub.student?.id?.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Modal Logic */}
                      {!isGraded ? (
                        <RemarkAssignmentModal
                          open={isRemarkAssignmentModalOpen}
                          onOpenChange={setIsRemarkAssignmentModalOpen}
                          submissionId={sub.id}
                          studentName={sub.student?.name}
                        />
                      ) : (
                        <UpdateRemarkAssignmentModal
                          open={isUpdateRemarkAssignmentModalOpen}
                          onOpenChange={setIsUpdateRemarkAssignmentModalOpen}
                          submissionId={sub?.id}
                          studentName={sub?.student?.name}
                          grade_number={sub?.grade?.grade_number}
                          grade={sub?.grade?.grade}
                          feedback={sub?.grade?.feedback}
                        />
                      )}
                    </div>

                    {/* Submission Time & Grade Badges */}
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[#8D9CDC] font-medium">
                        Submitted:{" "}
                        <span className="text-white">{formattedDate}</span>
                      </p>

                      {isGraded && (
                        <div className="flex gap-2">
                          <span
                            className="text-[10px] px-2 py-1 rounded bg-opacity-10 font-bold"
                            // style={{
                            //   color:
                            //     sub?.grade?.score === "A+" ? "#10B981" : "",
                            // }}
                            style={{
                              color: "#10B981", // You can map colors dynamically based on grade
                              backgroundColor: "#10B98122",
                            }}
                          >
                            {sub?.grade?.grade}
                          </span>
                          <span className="text-[10px] px-2 py-1 rounded bg-[#1C2632] text-[#8D9CDC] font-bold">
                            {sub.grade.grade_number}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Attachment Box */}
                    <div className="bg-[#0A1D2E] border border-[#1C2632] rounded-lg overflow-hidden mb-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-[#1C2632] p-4 text-[#8D9CDC]">
                          {isVideo ? (
                            <Video size={18} />
                          ) : (
                            <FileText size={18} />
                          )}
                        </div>
                        <span className="ml-4 text-[#A1AAB3] text-xs truncate max-w-37.5">
                          {decodeURIComponent(fileName)}
                        </span>
                      </div>
                      <a
                        href={sub.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download
                          size={16}
                          className="mr-4 text-[#F23030] cursor-pointer"
                        />
                      </a>
                    </div>

                    {/* Description Area */}
                    <div className="border border-dashed bg-[#0A1A29] border-[#1C2632] rounded-lg p-3">
                      <h4 className="text-white text-xs font-medium mb-1">
                        Description
                      </h4>
                      <p className="text-[#A1AAB3] text-xs">
                        {sub.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
