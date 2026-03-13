import Loader from "@/components/reusable/Loader";
import React, { Suspense } from "react";

function FinanceDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loader />}>
      <>{children}</>
    </Suspense>
  );
}

export default FinanceDashboardLayout;
