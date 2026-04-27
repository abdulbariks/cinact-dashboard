import { useState } from "react";
import { DialogClose, DialogContent } from "@/components/ui/dialog";
import { FinanceService } from "@/service/finance/finance.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";

export const EditStudentDialog = ({
  row,
  onRefresh,
}: {
  row: any;
  onRefresh: () => void;
}) => {
  const [studentType, setStudentType] = useState(row.studentType || "");
  const [paymentStatus, setPaymentStatus] = useState(row.payment_status || "");
  const [paymentType, setPaymentType] = useState(row.payment_type || "");

  const handleSave = async () => {
    try {
      const response = await FinanceService.updateEnrollment({
        id: row.id,
        data: {
          status: studentType,
          payment_status: paymentStatus,
          payment_type: paymentType,
        },
      });

      //   console.log("response============", response);

      showSuccessToast("Student updated successfully");
      onRefresh(); // Trigger table refresh
    } catch (error) {
      showErrorToast("Failed to update student");
    }
  };

  return (
    <DialogContent className="border-none p-6 rounded-2xl bg-[#0A1726] text-white max-w-md [&>button]:hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Edit User Info</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-[#A5A5AB]">Student Type</label>
          <select
            value={studentType}
            onChange={(e) => setStudentType(e.target.value)}
            className="w-full mt-1 bg-[#0A1726] border border-[#2E3A59] rounded-xl px-4 py-3 text-sm focus:outline-none"
          >
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="ALUMNI">Alumni</option>
            <option value="RESTRICTED">Restricted</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-[#A5A5AB]">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full mt-1 bg-[#0A1726] border border-[#2E3A59] rounded-xl px-4 py-3 text-sm focus:outline-none"
          >
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-[#A5A5AB]">Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="w-full mt-1 bg-[#0A1726] border border-[#2E3A59] rounded-xl px-4 py-3 text-sm focus:outline-none"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <DialogClose asChild>
          <button className="w-full border border-[#2E3A59] py-3 rounded-xl">
            Cancel
          </button>
        </DialogClose>
        <DialogClose asChild>
          <button
            onClick={handleSave}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-medium"
          >
            Save
          </button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};
