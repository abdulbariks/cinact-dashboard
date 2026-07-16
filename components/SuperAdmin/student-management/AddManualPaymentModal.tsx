"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserService } from "@/service/user/user.service";
import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";

type AddManualPaymentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollmentId: string;
  onSuccess: () => void;
};

const inputClassName =
  "w-full rounded-[16px] border border-[#3D4566] p-4 text-white outline-none placeholder:text-[#3D4566] focus:border-[#8D9CDC]";

const labelClassName = "mb-2 block text-xs text-[#B2B5B8]";

export default function AddManualPaymentModal({
  open,
  onOpenChange,
  enrollmentId,
  onSuccess,
}: AddManualPaymentModalProps) {
  const [payment_method, setPaymentMethod] = useState("");
  const [transaction_ref, setTransactionRef] = useState("");
  const [payment_date, setPaymentDate] = useState("");
  const [receipt_url, setReceiptUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setPaymentMethod("");
    setTransactionRef("");
    setPaymentDate("");
    setReceiptUrl("");
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payment_method.trim() || !transaction_ref.trim()) {
      showErrorToast("Payment method and transaction reference are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      const response = await UserService.AddManualPayment({
        token,
        enrollment_id: enrollmentId,
        payment_method: payment_method.trim(),
        transaction_ref: transaction_ref.trim(),
        payment_date: payment_date
          ? new Date(payment_date).toISOString()
          : new Date().toISOString(),
        receipt_url: receipt_url.trim(),
        notes: notes.trim(),
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to add payment");
      }

      showSuccessToast(response?.data?.message || "Payment added successfully");
      resetForm();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add payment",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 z-50 w-129.25 max-h-[90vh] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border-none bg-[#0A1726] p-6 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Add Manual Payment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div>
            <label htmlFor="payment_method" className={labelClassName}>
              Payment Method
            </label>
            <input
              id="payment_method"
              name="payment_method"
              value={payment_method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="Enter payment method"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="transaction_ref" className={labelClassName}>
              Transaction Reference
            </label>
            <input
              id="transaction_ref"
              name="transaction_ref"
              value={transaction_ref}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="Enter transaction reference"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="payment_date" className={labelClassName}>
              Payment Date
            </label>
            <input
              id="payment_date"
              type="date"
              name="payment_date"
              value={payment_date}
              onChange={(e) => setPaymentDate(e.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="receipt_url" className={labelClassName}>
              Receipt URL
            </label>
            <input
              id="receipt_url"
              name="receipt_url"
              value={receipt_url}
              onChange={(e) => setReceiptUrl(e.target.value)}
              placeholder="https://..."
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="notes" className={labelClassName}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Enter notes"
              className={inputClassName}
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl bg-[#3d4566] px-10 py-4 text-sm font-medium text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-[#E9201D] px-10 py-4 text-sm font-medium text-white hover:bg-[#e9201d]/90 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Payment"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
