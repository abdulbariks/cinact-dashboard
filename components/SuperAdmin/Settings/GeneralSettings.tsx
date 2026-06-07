"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showSuccessToast, showErrorToast } from "@/lib/hotToast";
import { AdminSystemSettingService } from "@/service/user/user.service";

export default function GeneralSettings() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // 1. Fetch initial data to pre-fill the form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminSystemSettingService.getPersonalInfo();
        if (response?.data) {
          reset(response?.data); // Automatically fills form fields
        }
        // console.log("response===========", response);
      } catch (error) {
        showErrorToast("Failed to load profile information");
      }
    };
    fetchData();
  }, [reset]);

  // 2. Handle form submission
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await AdminSystemSettingService.updatePersonalInfo({ data });
      showSuccessToast("Academy information updated successfully!");
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message || "Failed to update information",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="bg-[#0a1929] p-6 rounded-2xl text-white border-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold">
              Academy Information
            </CardTitle>
            <hr className="border-[#243b55] mt-3" />
          </CardHeader>

          <CardContent className="px-0">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Academy Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Academy Name
                  </label>
                  <Input
                    {...register("fullName")}
                    type="text"
                    placeholder="CINACT"
                    className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="your@email.com"
                    className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Phone
                  </label>
                  <Input
                    {...register("phone")}
                    type="text"
                    placeholder="(225) 555-0118"
                    className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Website
                  </label>
                  <Input
                    {...register("website")}
                    placeholder="www.cinact@gmail.com"
                    type="text"
                    className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Address
                </label>
                <Input
                  {...register("address")}
                  type="text"
                  placeholder="1901 Thornridge Cir. Shiloh, Hawaii 81063"
                  className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Description
                </label>
                <Textarea
                  {...register("actingGoals")}
                  placeholder="Leading online education platform..."
                  className="bg-transparent border border-[#243b55] rounded-xl h-24 p-3"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end px-0">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#E9201D] hover:bg-[#E9201D] cursor-pointer text-white px-8 h-11 rounded-xl"
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
