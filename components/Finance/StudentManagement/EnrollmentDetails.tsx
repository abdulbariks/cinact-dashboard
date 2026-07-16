"use client";
import React, { useEffect, useState } from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { UserService } from "@/service/user/user.service";
import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import PdfIcon from "@/components/icons/student-management/PdfIcon";
import RedDownloadIcon from "@/components/icons/student-management/RedDownloadIcon";
import BackIcon from "@/components/icons/others/BackIcon";
import AddManualPaymentModal from "@/components/SuperAdmin/student-management/AddManualPaymentModal";
import CrossIcon from "@/components/icons/others/CrossIcon";
import TrashIcon from "@/components/icons/others/TrashIcon";
import warnigImg from "@/public/admin-dashboard/warning-img.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusBadge = (status?: string | null) => {
  const isActive =
    status === "ACTIVE" || status === "PAID" || status === "SUCCESS";
  const isPending = status === "PENDING" || status === "PARTIALLY_PAID";
  return `${isActive ? "text-[#18CC3F] bg-[#2a3d2e]" : isPending ? "text-[#FFC943] bg-[#423c2f]" : "text-[#A5A5AB] bg-[#1c2533]"} py-1 px-2.5 rounded-full text-sm`;
};

export default function EnrollmentDetails({
  studentId,
  enrollmentId,
}: {
  studentId: string;
  enrollmentId: string;
}) {
  const { id: paramId } = useParams();
  const router = useRouter();
  const resolvedStudentId = studentId || (paramId as string) || "";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await UserService.getEnrollmentDetail({
        enrollmentId,
        token,
      });
      setData(response?.data?.data || null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch enrollment details";
      setError(message);
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enrollmentId) fetchDetails();
  }, [enrollmentId]);

  const EnrollmentDelete = async () => {
    try {
      setIsDeleting(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await UserService.DeleteEnrollment({
        enrollmentId,
        token,
      });
      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Failed to delete enrollment",
        );
      }
      showSuccessToast(
        response?.data?.message || "Enrollment deleted successfully",
      );
      setIsWarningOpen(false);
      router.push(
        `/finance-dashboard/student-management/student-details/${resolvedStudentId}`,
      );
    } catch (err: any) {
      showErrorToast(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete enrollment",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading enrollment details...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-6 text-white">{error || "Enrollment not found."}</div>
    );
  }

  const order = data.order || {};
  const installmentPlan = order.installment_plan || null;
  const installments = installmentPlan?.installments || [];
  const transactions = order.transactions || [];
  const attachments = data.attachments || [];

  const rulesDoc = attachments.find((a: any) => a.type === "RULES_REGULATIONS");
  const contractDoc = attachments.find(
    (a: any) => a.type === "DIGITAL_CONTRACT",
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          href="/finance-dashboard/student-management"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Student Management
        </Link>
        <BreadCrumpRightArrow />
        <Link
          href={`/finance-dashboard/student-management/student-details/${resolvedStudentId}`}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Student Details
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">
          Enrollment Details
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-white">
          Enrollment Details
        </h2>
        <button
          type="button"
          onClick={() => setIsWarningOpen(true)}
          className="flex items-center gap-2.5 text-base bg-[#E9201D] p-3 rounded-md text-white font-medium cursor-pointer"
        >
          Delete Enrollment
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {/* Student & Course */}
        <div className="bg-[#0A1726] p-6 rounded-2xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-[#585E66]">Name</p>
              <p className="text-sm text-[#DFE1E7]">{data.name}</p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Email</p>
              <p className="text-sm text-[#DFE1E7]">{data.email}</p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Phone</p>
              <p className="text-sm text-[#DFE1E7]">{data.phone}</p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Date of Birth</p>
              <p className="text-sm text-[#DFE1E7]">
                {formatDate(data.date_of_birth)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Address</p>
              <p className="text-sm text-[#DFE1E7]">{data.address}</p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Enrollment Type</p>
              <p className="text-sm text-[#DFE1E7]">{data.enrollment_type}</p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Status</p>
              <p className={`${statusBadge(data.status)} mt-1 inline-block`}>
                {data.status}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Step</p>
              <p className="text-sm text-[#DFE1E7]">{data.step}</p>
            </div>
            {data.course && (
              <div>
                <p className="text-xs text-[#585E66]">Course</p>
                <p className="text-sm text-[#DFE1E7]">
                  {data.course.title}{" "}
                  <span
                    className={`${statusBadge(data.course.status)} ml-1 inline-block`}
                  >
                    {data.course.status}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order / Payment summary */}
        <div className="bg-[#0A1726] p-6 rounded-2xl">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-medium text-white">Payment Summary</h3>
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-2.5 text-base text-white font-medium bg-[#5F6CA0] rounded-md p-3 cursor-pointer"
            >
              Add Manual Payment
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-[#585E66]">Order Number</p>
              <p className="text-sm text-[#DFE1E7]">
                {order.order_number || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Order Status</p>
              <p className={`${statusBadge(order.status)} mt-1 inline-block`}>
                {order.status}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Total Amount</p>
              <p className="text-sm text-[#DFE1E7]">
                ${order.total_amount || "0"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Paid Amount</p>
              <p className="text-sm text-[#18CC3F]">
                ${order.paid_amount || "0"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#585E66]">Due Amount</p>
              <p className="text-sm text-[#FFC943]">
                ${order.due_amount || "0"}
              </p>
            </div>
          </div>

          {installmentPlan && (
            <div className="mt-6">
              <h4 className="text-base font-medium text-white">
                Installment Plan ({installmentPlan.installment_count}{" "}
                installments)
              </h4>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[#585E66]">
                      <th className="py-2 pr-4">#</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Due Date</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Paid At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((inst: any) => (
                      <tr key={inst.id} className="border-t border-[#141B34]">
                        <td className="py-2 pr-4 text-[#DFE1E7]">
                          {inst.installment_no}
                        </td>
                        <td className="py-2 pr-4 text-[#DFE1E7]">
                          ${inst.amount}
                        </td>
                        <td className="py-2 pr-4 text-[#A5A5AB]">
                          {formatDate(inst.due_date)}
                        </td>
                        <td className="py-2 pr-4">
                          <span
                            className={`${statusBadge(inst.status)} inline-block`}
                          >
                            {inst.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-[#A5A5AB]">
                          {formatDateTime(inst.paid_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="bg-[#0A1726] p-6 rounded-2xl">
          <h3 className="text-lg font-medium text-white">Transactions</h3>
          {transactions.length > 0 ? (
            <div className="mt-4 space-y-3">
              {transactions.map((txn: any) => (
                <div key={txn.id} className="rounded-[10px] bg-[#07121d] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white">
                        {txn.transaction_ref}
                      </p>
                      <p className="text-xs text-[#A5A5AB]">
                        {txn.gateway} · {txn.payment_method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#18CC3F]">
                        ${txn.amount} {txn.currency}
                      </p>
                      <span
                        className={`${statusBadge(txn.status)} mt-1 inline-block`}
                      >
                        {txn.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-[#A5A5AB]">
                    Paid At: {formatDateTime(txn.paid_at)}
                  </div>
                  {txn.receipt_url && (
                    <a
                      href={txn.receipt_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-sm text-[#8D9CDC] hover:text-white"
                    >
                      <RedDownloadIcon />
                      View Receipt
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#A5A5AB]">
              No transactions found.
            </p>
          )}
        </div>

        {/* Attachments */}
        <div className="bg-[#0A1726] p-6 rounded-2xl">
          <h3 className="text-lg font-medium text-white">Contract Documents</h3>
          <div className="mt-4 space-y-3">
            {rulesDoc && (
              <div className="flex items-center justify-between rounded-[10px] bg-[#101923] border-l border-[#5F6CA0] p-3">
                <div className="flex items-center gap-2.5">
                  <PdfIcon />
                  <p className="text-sm text-white">Rules & Regulations</p>
                </div>
                <a href={rulesDoc.file_path} target="_blank" rel="noreferrer">
                  <RedDownloadIcon />
                </a>
              </div>
            )}
            {contractDoc && (
              <div className="flex items-center justify-between rounded-[10px] bg-[#101923] border-l border-[#5F6CA0] p-3">
                <div className="flex items-center gap-2.5">
                  <PdfIcon />
                  <p className="text-sm text-white">Digital Contract</p>
                </div>
                <a
                  href={contractDoc.file_path}
                  target="_blank"
                  rel="noreferrer"
                >
                  <RedDownloadIcon />
                </a>
              </div>
            )}
            {attachments.length === 0 && (
              <p className="text-sm text-[#A5A5AB]">No documents attached.</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
        <DialogContent
          hideCloseButton
          className="w-120 max-w-[95vw] rounded-2xl border-none bg-[#0A1726] p-6 sm:p-8 text-white"
        >
          <div className="flex flex-col items-center text-center">
            <Image src={warnigImg} alt="Warning" />
            <h3 className="mt-4 text-lg sm:text-xl font-semibold text-white">
              Delete Enrollment?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#B2B5B8]">
              Are you sure you want to delete this enrollment?
            </p>

            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsWarningOpen(false)}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl border border-[#3D4566] px-8 sm:px-11 py-3 sm:py-4 text-xs sm:text-sm font-medium text-white hover:bg-[#5F6CA0]"
              >
                <CrossIcon />
                Cancel
              </button>
              <button
                type="button"
                onClick={EnrollmentDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-[#E9201D] px-8 sm:px-11 py-3 sm:py-4 text-xs sm:text-sm font-medium text-white hover:bg-[#ff3b1f] disabled:opacity-50"
              >
                <TrashIcon />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddManualPaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        enrollmentId={enrollmentId}
        onSuccess={fetchDetails}
      />
    </div>
  );
}
