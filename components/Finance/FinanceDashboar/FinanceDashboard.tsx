"use client";
import RecentEnrollments from "@/components/SuperAdmin/Home/RecentEnrollments";
import StatsCard from "@/components/SuperAdmin/Home/StatssCard";
import React, { useEffect, useState } from "react";
import RecentTransactions from "./RecentTransactions";
import { parseCookies } from "nookies";
import { showErrorToast } from "@/lib/hotToast";
import { FinanceService } from "@/service/finance/finance.service";

type FinanceDashboardOverviewResponse = {
  role: string;
  total_students: number;
  total_teachers: number;
  ongoing_courses: number;
  monthly_revenue: number;
  recent_enrollments: {
    id: string;
    status: string;
    user_name: string;
    user_avatar: string | null;
    course_title: string;
    created_at: string;
  }[];
  getRecentTransactions: {
    id: string;
    userId: string | null;
    userName: string | null;
    amount: string | null;
    paymentDate: string;
  }[];
};

export default function FinanceDashboard() {
  const [overview, setOverview] =
    useState<FinanceDashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(overview);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await FinanceService.getFinanceDashboardOverview({
          token,
        });
        setOverview(response?.data || null);
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
          items={overview?.getRecentTransactions || []}
          loading={loading}
        />
      </div>
    </div>
  );
}
