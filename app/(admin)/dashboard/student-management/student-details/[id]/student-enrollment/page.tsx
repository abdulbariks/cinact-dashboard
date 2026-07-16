import StudentEnrollmentForm from "@/components/SuperAdmin/student-management/StudentEnrollmentMuiltiForm";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentEnrollmentForm studentId={id} />;
}
