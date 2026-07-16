import EnrollmentDetails from "@/components/Finance/StudentManagement/EnrollmentDetails";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string; "enrollment-id": string }>;
}) {
  const { id, "enrollment-id": enrollmentId } = await params;
  return (
    <EnrollmentDetails studentId={id} enrollmentId={enrollmentId} />
  );
}
