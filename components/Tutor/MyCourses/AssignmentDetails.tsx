import TeacherIcon from "@/components/icons/course-management/TeacherIcon";
import CameraIcon from "@/components/icons/others/CameraIcon";
import { UsersIcon } from "@/components/icons/sidebar.tsx/SidebarIcons";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import CalenderIcon from "@/components/icons/SuperAdmindashboard/CalenderIcon";
import ClockIcon from "@/components/icons/SuperAdmindashboard/ClockIcon";
import Link from "next/link";
import { Download, Video, FileText } from "lucide-react";
import Image from "next/image";
import { RemarkAssignmentModal } from "./modal/RemarkAssignmentModal";

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

export default function AssignmentDetails({
  classDetails,
  setClassDetails,
  assignmentDetails,
  setAssignmentDetails,
}) {
  return (
    <div>
      {" "}
      <div className="flex items-center gap-2">
        <Link
          href={"/tutor-dashboard/my-courses"}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          My Courses
        </Link>
        <BreadCrumpRightArrow />
        <div
          onClick={() => setClassDetails(classDetails)}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC] cursor-pointer"
        >
          Course Details
        </div>

        <BreadCrumpRightArrow />
        <div
          onClick={() => setAssignmentDetails(null)}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC] cursor-pointer"
        >
          {classDetails} Details
        </div>

        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">
          Assignment Details
        </p>
      </div>
      <div className="flex justify-between  items-center">
        {" "}
        {/* Title */}
        <h2 className="text-2xl text-[#E6E7E8] font-semibold mt-5">
          Assignment Details
        </h2>
      </div>
      {/* Card */}
      <div className="mt-5 bg-[#0A1929] rounded-2xl p-6 border border-[#0f1f35]">
        {/* Info Row */}
        <h3 className="text-2xl text-[#FFFFFF] mb-4">
          Introduction to Personal Development
        </h3>
        <div className="bg-[#07121D] rounded-2xl p-6 border border-[#0f1f35]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Teacher */}
            <div className="flex items-start gap-2">
              <TeacherIcon />
              <div>
                <p className="text-xs text-[#A5A5AB]">Teacher</p>
                <p className="text-sm text-white font-medium">
                  {/* {course.ins_name} */}
                  Wade Warren
                </p>
              </div>
            </div>
            {/* Enrollment */}
            <div className="flex items-start gap-2">
              <UsersIcon />
              <div>
                <p className="text-xs text-[#A5A5AB]">Enrollment</p>
                <p className="text-sm text-white font-medium">
                  {/* {course.students} students */}
                  45 students
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-2">
              <ClockIcon />
              <div>
                <p className="text-xs text-[#A5A5AB]">Duration</p>
                <p className="text-sm text-white font-medium">
                  {/* {course.duration} */}
                  45 Min
                </p>
              </div>
            </div>

            {/* Period */}
            <div className="flex items-start gap-2">
              <CalenderIcon />
              <div>
                <p className="text-xs text-[#A5A5AB]">Date & Time</p>
                <p className="text-sm text-white font-medium">
                  {/* {course.start_date} - 2024-10-24 */}
                  2024-08-01 ,1:30 PM
                </p>
              </div>
            </div>
          </div>
          {/* Overview */}
          <div className="mt-6">
            <h4 className="text-white font-medium">Assignment Task</h4>
            <p className="text-sm text-[#A5A5AB] mt-2">
              Write a comprehensive 500-word reflection essay on pur current
              confidence level, identffying specific areas for 'np«ovement and
              outlining actionable steps for personal development in your acting
              Journey.
            </p>
          </div>
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
                className="bg-[#07121D] p-5 rounded-[15px] border border-[#1C2632]"
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
                    <RemarkAssignmentModal />
                  ) : (
                    <button className="bg-[#414B6F] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#505B86] transition-colors cursor-pointer">
                      Update Remark
                    </button>
                  )}
                </div>

                {/* Submission Time & Grade Badges */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[#8D9CDC] text-xs font-medium">
                    Submitted: 20-8-25 | 09 : 30 AM
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
                <div className="bg-[#0A121E] border border-[#1C2632] rounded-lg overflow-hidden mb-4 flex items-center justify-between">
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
                <div className="border border-dashed border-[#1C2632] rounded-lg p-3">
                  <h4 className="text-white text-xs font-medium mb-1">
                    Description
                  </h4>
                  <p className="text-[#A1AAB3] text-xs">This is assignment.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
