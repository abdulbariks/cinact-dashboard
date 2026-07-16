"use client";
import React, { useEffect, useState } from "react";

import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import ContractDocumentForm from "@/components/SuperAdmin/student-management/ContractDocumentForm";
import PaymentInformationForm from "@/components/SuperAdmin/student-management/PaymentInformationForm";
import StudentInformationForm from "@/components/SuperAdmin/student-management/StudentInformationForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confirmImg from "@/public/admin-dashboard/confirm-img.png";
import BackIcon from "@/components/icons/others/BackIcon";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { parseCookies } from "nookies";
import { FinanceService } from "@/service/finance/finance.service";
import { UserService } from "@/service/user/user.service";

type FormData = {
  course: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  enrollmentType: string;
  installmentCount: string;
  transactionId: string;
  paymentDate: string;
  paymentAmount: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  course: "",
  studentId: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  enrollmentType: "",
  installmentCount: "",
  transactionId: "",
  paymentDate: "",
  paymentAmount: "",
};

export default function StudentEnrollmentMuiltiForm({
  studentId,
}: {
  studentId: string;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    studentId,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [rulesAndRegulationFile, setRulesAndRegulationFile] =
    useState<File | null>(null);
  const [digitalContractFile, setDigitalContractFile] = useState<File | null>(
    null,
  );
  const [activeDropZone, setActiveDropZone] = useState<
    "rules" | "contract" | null
  >(null);
  const [fileErrors, setFileErrors] = useState<{
    rulesAndRegulationFile?: string;
    digitalContractFile?: string;
  }>({});
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!studentId) return;
      try {
        const response = await UserService.getStudentDetails({
          id: studentId,
        });
        const data = response?.data?.data || response?.data;
        if (data) {
          setFormData((prev) => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            phone: data.phone_number || data.phone || prev.phone,
            address: data.address || prev.address,
            dateOfBirth: data.date_of_birth || prev.dateOfBirth,
          }));
        }
      } catch (error) {
        // Prefill is best-effort; ignore errors
      }
    };
    fetchDetails();
  }, [studentId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: number) => {
    const nextErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.course.trim()) nextErrors.course = "Course is required";
      if (!formData.name.trim()) nextErrors.name = "Name is required";
      if (!formData.email.trim()) nextErrors.email = "Email is required";
      if (!formData.phone.trim()) nextErrors.phone = "Phone is required";
      if (!formData.address.trim()) nextErrors.address = "Address is required";
      if (!formData.dateOfBirth.trim())
        nextErrors.dateOfBirth = "Date of birth is required";
      if (!formData.enrollmentType.trim())
        nextErrors.enrollmentType = "Enrollment type is required";
      if (
        formData.enrollmentType === "INSTALLMENT" &&
        !formData.installmentCount.trim()
      )
        nextErrors.installmentCount = "Installment count is required";
    }

    if (step === 2) {
      if (!formData.transactionId.trim())
        nextErrors.transactionId = "Transaction ID is required";
      if (!formData.paymentDate.trim())
        nextErrors.paymentDate = "Payment date is required";
      if (!formData.paymentAmount.trim())
        nextErrors.paymentAmount = "Payment amount is required";
    }

    const nextFileErrors: {
      rulesAndRegulationFile?: string;
      digitalContractFile?: string;
    } = {};

    if (step === 3) {
      if (!rulesAndRegulationFile)
        nextFileErrors.rulesAndRegulationFile =
          "Rules and regulation signing file is required";
      if (!digitalContractFile)
        nextFileErrors.digitalContractFile =
          "Digital contract signing file is required";
    }

    setErrors(nextErrors);
    setFileErrors(nextFileErrors);
    return (
      Object.keys(nextErrors).length === 0 &&
      Object.keys(nextFileErrors).length === 0
    );
  };

  const handleNext = () => {
    const isStepValid = validateStep(currentStep);
    if (!isStepValid) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isStepValid = validateStep(3);
    if (!isStepValid) return;

    if (!rulesAndRegulationFile || !digitalContractFile) return;

    try {
      setIsSubmitting(true);
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      const response = await FinanceService.createManualStudentEnrollment({
        token,
        courseId: formData.course,
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.dateOfBirth,
        experience_level: formData.enrollmentType.toUpperCase(),
        acting_goals: formData.installmentCount,
        transaction_id: formData.transactionId,
        currncy: "usd",
        amount: formData.paymentAmount,
        payment_date: formData.paymentDate,
        rules_signing: rulesAndRegulationFile,
        contract_signing: digitalContractFile,
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to enroll student");
      }

      showSuccessToast(
        response?.data?.message || "Student enrolled successfully",
      );
      setIsSuccessDialogOpen(true);
      setFormData({ ...initialFormData, studentId });
      setRulesAndRegulationFile(null);
      setDigitalContractFile(null);
      setErrors({});
      setFileErrors({});
      setCurrentStep(1);
      router.push(
        `/finance-dashboard/student-management/student-details/${studentId}`,
      );
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to enroll student",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (field: "rules" | "contract", file: File | null) => {
    if (field === "rules") {
      setRulesAndRegulationFile(file);
      if (fileErrors.rulesAndRegulationFile) {
        setFileErrors((prev) => ({
          ...prev,
          rulesAndRegulationFile: undefined,
        }));
      }
      return;
    }

    setDigitalContractFile(file);
    if (fileErrors.digitalContractFile) {
      setFileErrors((prev) => ({ ...prev, digitalContractFile: undefined }));
    }
  };

  const handleDrop = (
    field: "rules" | "contract",
    e: React.DragEvent<HTMLLabelElement>,
  ) => {
    e.preventDefault();
    setActiveDropZone(null);
    handleFileSelect(field, e.dataTransfer.files?.[0] ?? null);
  };

  const inputClassName =
    "w-full rounded-[16px] border border-[#3D4566]   p-4 text-white outline-none placeholder:text-[#3D4566] focus:border-[#8D9CDC]";

  const labelClassName = "mb-2 block text-xs  text-[#B2B5B8]";

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
        <p className="text-base font-medium text-[#8D9CDC]">
          Manual Student Enrollment
        </p>
      </div>
      <div className="flex justify-center">
        <div className="mt-6 w-174 rounded-2xl bg-[#0A1726] p-6">
          <h2 className="text-2xl font-semibold text-white">
            Manual Student Enrollment
          </h2>
          <div className="mt-3 flex items-center  gap-3">
            <p className="text-xl font-medium text-[#8D9CDC]">
              {currentStep === 1
                ? "Student Information"
                : currentStep === 2
                  ? "Payment Information"
                  : "Contract Document"}
            </p>
            <p className="text-base font-medium text-[#8D9CDC]">
              ({currentStep}/3)
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <StudentInformationForm
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleCourseChange={(value) => {
                  setFormData((prev) => ({ ...prev, course: value }));
                  if (errors.course)
                    setErrors((prev) => ({ ...prev, course: "" }));
                }}
                handleEnrollmentTypeChange={(value) => {
                  setFormData((prev) => ({ ...prev, enrollmentType: value }));
                  if (errors.enrollmentType)
                    setErrors((prev) => ({ ...prev, enrollmentType: "" }));
                }}
                inputClassName={inputClassName}
                labelClassName={labelClassName}
              />
            )}

            {currentStep === 2 && (
              <PaymentInformationForm
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                inputClassName={inputClassName}
                labelClassName={labelClassName}
              />
            )}

            {currentStep === 3 && (
              <ContractDocumentForm
                labelClassName={labelClassName}
                activeDropZone={activeDropZone}
                rulesAndRegulationFile={rulesAndRegulationFile}
                digitalContractFile={digitalContractFile}
                fileErrors={fileErrors}
                handleRulesDragOver={(e) => {
                  e.preventDefault();
                  setActiveDropZone("rules");
                }}
                handleContractDragOver={(e) => {
                  e.preventDefault();
                  setActiveDropZone("contract");
                }}
                handleRulesDragLeave={() =>
                  setActiveDropZone((prev) => (prev === "rules" ? null : prev))
                }
                handleContractDragLeave={() =>
                  setActiveDropZone((prev) =>
                    prev === "contract" ? null : prev,
                  )
                }
                handleRulesDrop={(e) => handleDrop("rules", e)}
                handleContractDrop={(e) => handleDrop("contract", e)}
                handleRulesFileChange={(e) =>
                  handleFileSelect("rules", e.target.files?.[0] ?? null)
                }
                handleContractFileChange={(e) =>
                  handleFileSelect("contract", e.target.files?.[0] ?? null)
                }
              />
            )}

            <div className="mt-8 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="rounded-2xl bg-[#3d4566] px-10 py-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-2xl bg-[#E9201D] px-10 py-4 text-sm font-medium text-white hover:bg-[#e9201d]/90 cursor-pointer"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-[#E9201D] px-10 py-4 text-sm font-medium text-white hover:bg-[#e9201d]/90 cursor-pointer"
                >
                  {isSubmitting ? "Enrolling..." : "Enroll Student"}
                </button>
              )}
            </div>
          </form>

          <Dialog
            open={isSuccessDialogOpen}
            onOpenChange={setIsSuccessDialogOpen}
          >
            <DialogContent className=" border-none bg-[#0A1726] text-white rounded-4xl p-8 w-[500px]">
              <div className=" flex items-center justify-center">
                <div>
                  <div className=" flex items-center justify-center">
                    <Image src={confirmImg} alt="Confirm" />
                  </div>
                  <h2 className=" text-white text-xl font-semibold py-6 text-center">
                    Manual Enrollment Complete
                  </h2>

                  <Link
                    href="/finance-dashboard"
                    className="flex items-center justify-center gap-2.5 text-base text-[#8D9CDC] font-medium cursor-pointer"
                  >
                    <BackIcon />
                    Back to Home
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
