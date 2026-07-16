import StudentEnrollmentMuiltiForm from "@/components/Finance/StudentManagement/StudentEnrollmentMuiltiForm";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentEnrollmentMuiltiForm studentId={id} />;
}
