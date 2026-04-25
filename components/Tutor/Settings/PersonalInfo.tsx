"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { parseCookies } from "nookies";
import { z } from "zod";
import { TutorSystemSettingService } from "@/service/tutor/tutor.service";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import type { PersonalInfo } from "@/types/tutor.system.setting";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(6, "Password must be at least 6 characters"),
    new_password_confirmation: z
      .string()
      .min(6, "Confirm password is required"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords do not match",
    path: ["new_password_confirmation"], // Error points to this field
  });
export default function PersonalInfo() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: any) => {
    // console.log("Submitted Data:", data);
    // reset();
    try {
      const payload = {
        old_password: data?.current_password,
        new_password: data?.new_password,
      };
      const response = await TutorSystemSettingService.changePassword({
        payload,
      });
      showSuccessToast(
        response?.data?.message || "Password Changed Successfully",
      );
      reset();
    } catch (error) {
      showErrorToast(error?.data?.message || "Failed to Password Changed.");
      reset();
    }
  };
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || "";
        const response = await TutorSystemSettingService.getPersonalInfo({
          token,
        });
        setPersonalInfo(response?.data || null);
      } catch (error: any) {
        showErrorToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load Personal info",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPersonalInfo();
  }, []);

  console.log("personalInfo=========", personalInfo);

  return (
    <div className="flex flex-col gap-8 px-5 w-full">
      <Card className="bg-[#0a1929] p-6 rounded-2xl text-white border-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Personal Info</CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          {/* Profile Image */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-14 h-14">
              <Image
                src={personalInfo?.avatar || "/admin-dashboard/avatar-1.png"}
                alt="profile"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />

              {/* Upload Icon */}
              <button className="absolute -bottom-1 -right-1 bg-blue-500 w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#0a1929]">
                <span className="text-white text-sm font-bold">+</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Full Name
                </label>
                <Input
                  className="bg-transparent border border-[#243b55] rounded-xl h-11"
                  placeholder={personalInfo?.fullName}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Phone Number
                </label>
                <Input
                  className="bg-transparent border border-[#243b55] rounded-xl h-11"
                  placeholder={personalInfo?.phone}
                  disabled
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <Input
                className="bg-transparent border border-[#243b55] rounded-xl h-11"
                placeholder={personalInfo?.email}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="bg-[#0a1929] p-6 rounded-2xl text-white border-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold">
              Change Password
            </CardTitle>
          </CardHeader>

          <CardContent className="px-0">
            <div className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Current Password
                </label>

                <div className="relative">
                  <Input
                    {...register("current_password")}
                    type={showCurrent ? "text" : "password"}
                    className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.current_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {String(errors.current_password.message)}
                  </p>
                )}
              </div>

              {/* Confirm + New Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    New Password
                  </label>

                  <div className="relative">
                    <Input
                      {...register("new_password")}
                      type={showNew ? "text" : "password"}
                      className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.new_password.message)}
                    </p>
                  )}
                </div>
                {/* Confirm Password */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <Input
                      {...register("new_password_confirmation")}
                      type={showConfirm ? "text" : "password"}
                      className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.new_password_confirmation && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.new_password_confirmation.message)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          {/* Update Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#E9201D] hover:bg-[#E9201D] cursor-pointer text-white px-8 h-11 rounded-xl"
            >
              Update Password
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
