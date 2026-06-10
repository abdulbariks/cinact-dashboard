"use client";
import RecentEnrollments from "@/components/SuperAdmin/Home/RecentEnrollments";
import StatsCard from "@/components/SuperAdmin/Home/StatssCard";
import React, { useEffect, useState } from "react";
import RecentTransactions from "./RecentTransactions";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";
import { FinanceService } from "@/service/finance/finance.service";

export type FinanceDashboardOverviewResponse = {
  role: string;
  total_students: number;
  total_teachers: number;
  ongoing_courses: number;
  monthly_revenue: number;
  recent_enrollments: {
    id: string;
    status: string;
    user_name: string | null;
    user_avatar: string | null;
    course_title: string;
    created_at: string;
  }[];
  recent_transactions: {
    id: string;
    user_id: string;
    user_name: string | null;
    user_avatar: string | null;
    amount: number;
    status: string;
    paid_at: string;
  }[];
};

export default function FinanceDashboard() {
  const [overview, setOverview] =
    useState<FinanceDashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await FinanceService.getFinanceDashboardOverview({
          token,
        });
        setOverview(response?.data?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load dashboard overview",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);
  return (
    <div>
      {" "}
      <StatsCard data={overview} loading={loading} />
      <div className=" mt-4.5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentEnrollments
          items={overview?.recent_enrollments || []}
          loading={loading}
        />
<RecentTransactions
           items={overview?.recent_transactions || []}
           loading={loading}
         />
      </div>
    </div>
  );
}
