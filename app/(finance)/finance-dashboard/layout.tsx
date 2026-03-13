import AdminMenu from "@/components/reusable/AdminMenu";
import Loader from "@/components/reusable/Loader";
import React, { Suspense } from "react";

function FinanceDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loader />}>
      <AdminMenu>{children}</AdminMenu>
    </Suspense>
  );
}

export default FinanceDashboardLayout;
