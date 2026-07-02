"use client";
import React, { useEffect, useState } from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import { useParams } from "next/navigation";
import TeacherIcon from "@/components/icons/course-management/TeacherIcon";
import SubmissionIcon from "@/components/icons/course-management/SubmissionIcon";
import StarIcon from "@/components/icons/course-management/StarIcon";
import CalenderIcon2 from "@/components/icons/others/CalenderIcon2";
import SubmissionIconSecondary from "@/components/icons/course-management/SubmissionIconSecondary";
import Image from "next/image";
import { Download, FileText, Video } from "lucide-react";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";
import { AdminCourseManagementService } from "@/service/user/user.service";
import {
  TGetAllSubmittedAssignmentsResponse,
  TGetAssignmentDetailsByIdResponse,
} from "@/types/tutor.mycourse";

export default function AssignmentDetails2() {
  const params = useParams<{
    courseId: string;
    classId: string;
    assignmentId: string;
  }>();
  const courseId = params?.courseId;
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

        const response =
          await AdminCourseManagementService.getAssignmentDetailsById({
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

  useEffect(() => {
    const loadAllSubmittedAssignments = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";

        const response =
          await AdminCourseManagementService.getAllSubmittedAssignments({
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

  const handleDownload = async (url: string | undefined, fileName: string) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      showErrorToast("Failed to download file. Please try again.");
    }
  };

  return (
    <div>
      {/* breadcrump */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/course-management"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Course Management
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
          href={`/dashboard/course-management/course-details/${courseId}/${classId}`}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
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
                  {assignmentDetails?.data?.instructor?.name}
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <SubmissionIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Submission</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {assignmentDetails?.data?.submissions} submitted
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <SubmissionIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Total Marks</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
                  {assignmentDetails?.data?.total_marks}
                </h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <StarIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Average Score</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">
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
                  {assignmentDetails?.data?.submission_date
                    ? new Date(
                        assignmentDetails.data.submission_date,
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
              Student Assignment Submissions (
              {allSubmittedAssignment?.data?.length || 0})
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allSubmittedAssignment?.data?.map((sub) => {
                const isGraded = sub.grade && Object.keys(sub.grade).length > 0;

                const dateObj = new Date(sub.submitted_at);
                const formattedDate = `${dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })} | ${dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

                const attachment = sub.attachments?.[0];
                const fileName = attachment?.file_name || "Attachment";
                const isVideo =
                  attachment?.mime_type?.startsWith("video/") ||
                  fileName.toLowerCase().endsWith(".mp4") ||
                  fileName.toLowerCase().endsWith(".mov");

                return (
                  <div
                    key={sub?.id}
                    className="bg-[#0A1D2E] p-5 rounded-[15px] border border-[#1C2632]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 bg-gray-800">
                          <Image
                            src={sub.student?.avatar || "/profile.png"}
                            alt="avatar"
                            width={40}
                            height={40}
                            className="object-cover"
                            unoptimized
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
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[#8D9CDC] font-medium">
                        Submitted:{" "}
                        <span className="text-white">{formattedDate}</span>
                      </p>

                      {isGraded && (
                        <div className="flex gap-2">
                          <span
                            className="text-[10px] px-2 py-1 rounded bg-opacity-10 font-bold"
                            style={{
                              color: "#10B981",
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
                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(attachment?.file_path, fileName)
                        }
                        className="text-[#F23030] cursor-pointer flex items-center"
                      >
                        <Download size={16} className="mr-4" />
                      </button>
                    </div>

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
