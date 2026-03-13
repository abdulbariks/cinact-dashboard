"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import Image from "next/image";
export default function ProfileAccount() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    console.log("Submitted Data:", data);

    reset();
  };
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div className="flex flex-col gap-8 px-5 w-full">
      <Card className="bg-[#0a1929] p-6 rounded-2xl text-white border-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">
            Profile Information
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          {/* Profile Image */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-14 h-14">
              <Image
                src="/admin-dashboard/avatar-1.png"
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
                  First Name
                </label>
                <Input
                  className="bg-transparent border border-[#243b55] rounded-xl h-11"
                  placeholder="CINACT"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Last Name
                </label>
                <Input
                  className="bg-transparent border border-[#243b55] rounded-xl h-11"
                  placeholder="CINACT"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <Input
                className="bg-transparent border border-[#243b55] rounded-xl h-11"
                placeholder="your@email.com"
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
              </div>

              {/* Confirm + New Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

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
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Button */}
        <div className="flex justify-end mt-6">
          <Button className="bg-[#E9201D] hover:bg-[#E9201D] cursor-pointer text-white px-8 h-11 rounded-xl">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
