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
import { parseCookies } from "nookies";
import { AdminCourseManagementService } from "@/service/user/user.service";
import { showErrorToast } from "@/lib/hotToast";
import { TGetAssignmentsResponse } from "@/types/tutor.mycourse";

export default function AllAssignments() {
  const [openItem, setOpenItem] = useState<string>("class-1");
  const [assignments, setAssignments] = useState<TGetAssignmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ courseId: string; classId: string }>();
  const courseId = params?.courseId;
  const classId = params?.classId;

  useEffect(() => {
    const loadAssignments = async () => {
      if (!classId) return;

      setLoading(true);
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await AdminCourseManagementService.getAllAssignmentsByClass({
          classId,
          token,
        });

        setAssignments(response?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load assignments",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [classId]);

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
              <p className="text-sm text-[#8D9CDC]">Class Assignments</p>
              <h3 className="text-base font-medium text-white">
                {assignments?.data?.length || 0} assignments
              </h3>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 text-[#A5A5AB]">
            {loading ? (
              <p className="p-4 text-sm text-[#A5A5AB]">Loading assignments...</p>
            ) : assignments?.data?.length ? (
              <div className="mt-3 grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
              {assignments.data.map((assignment, index) => (
                <Link
                  href={
                    courseId && classId
                      ? `/dashboard/course-management/course-details/${courseId}/${classId}/${assignment.id}`
                      : "#"
                  }
                  key={assignment.id}
                  className=" p-4 rounded-[12px] bg-[#0a1d2e] hover:bg-[#12283d] transition-colors duration-200 border-l border-[#5F6CA0]"
                >
                  <div className=" flex items-center justify-between">
                    <div className=" flex items-center gap-2.5">
                      <h3 className=" text-base text-white font-medium">
                        {assignment.title || `Assignment ${index + 1}`}
                      </h3>
                      <p className=" py-1 px-2.5 rounded-full bg-[#f9c80e] text-xs text-[#030C15] font-medium ">
                        Due {assignment.due_days ?? "-"} days
                      </p>
                    </div>
                    <WhiteRightArrowIcon />
                  </div>

                  <p className=" text-sm text-[#D2D2D5] mt-1">
                    {assignment.description || "No description available."}
                  </p>
                  <h4 className=" text-base text-[#18CC3F] mt-2">
                    Submissions: {assignment.submissions ?? 0} | Graded:{" "}
                    {assignment.grades ?? 0}
                  </h4>
                </Link>
              ))}
              </div>
            ) : (
              <p className="p-4 text-sm text-[#A5A5AB]">No assignments found.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
