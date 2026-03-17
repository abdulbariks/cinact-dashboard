"use client";
import React from "react";
import BreadCrumpRightArrow from "@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import StripeIcon from "@/components/icons/SuperAdmindashboard/StripeIcon";

export default function AddPayment() {
  const { register, handleSubmit, reset, setValue, control } = useForm();

  const onSubmit = async (data: any) => {
    console.log("Submitted Data:", data);

    reset();
  };
  return (
    <div>
           <div className='flex items-center gap-2'>
                <Link href='/dashboard/finance-payments' className='text-base text-[#5F6CA0] hover:text-[#8D9CDC]'>
                    Finance & Payments
                </Link>
                <BreadCrumpRightArrow />
                <p className='text-base font-medium text-[#8D9CDC]'>Add Payment</p>
            </div>


             <div className="flex justify-center">
        <div className="mt-6 w-174 rounded-2xl bg-[#0A1726] p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="bg-[#0A1726 text-white border-none">
              <CardHeader className="px-0 pt-0">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  {" "}
                  <CardTitle className="font-semibold text-2xl">
                    Add New Payment
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <p>Payment Method (Only)</p>

                    <button className="bg-[#FFFFFF] p-1 rounded-md">
                      <StripeIcon />
                    </button>
                  </div>
                </div>
                <hr className="border-[#243b55] mt-3" />
              </CardHeader>

              <CardContent className="px-0">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Transaction ID */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Transaction ID
                      </label>
                      <Input
                        {...register("transactionId")}
                        type="text"
                        placeholder="Enter Transaction ID"
                        className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                      />
                    </div>

                    {/* Student ID */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Student ID
                      </label>
                      <Input
                        {...register("studentId")}
                        type="text"
                        placeholder="Enter Student ID"
                        className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Course */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Course
                      </label>
                      <Select
                        onValueChange={(value) => setValue("course", value)}
                      >
                        <SelectTrigger className="w-full bg-transparent border border-[#243b55] rounded-xl h-11 text-white py-5">
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-year-adult">
                            1 Year Program (Adult)
                          </SelectItem>
                          <SelectItem value="2-year-adult">
                            2 Year Program (Adult)
                          </SelectItem>
                          <SelectItem value="6-month-program">
                            6 Month Program
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Status
                      </label>
                      <Select
                        onValueChange={(value) => setValue("status", value)}
                      >
                        <SelectTrigger className="w-full bg-transparent border border-[#243b55] rounded-xl h-11 text-white py-5">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Amount */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Amount
                      </label>
                      <Input
                        {...register("amount")}
                        type="text"
                        placeholder="Enter Amount"
                        className="bg-transparent border border-[#243b55] rounded-xl h-11 pr-10"
                      />
                    </div>

                    {/* Payment Type */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Payment Type
                      </label>
                      <Select
                        onValueChange={(value) =>
                          setValue("paymentType", value)
                        }
                      >
                        <SelectTrigger className="w-full bg-transparent border border-[#243b55] rounded-xl h-11 text-white py-5">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/*  Payment Date */}
                  <Controller
                    control={control} // from useForm()
                    name="paymentDate"
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">
                          Payment Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full flex items-center justify-between gap-2 bg-transparent border border-[#243b55] rounded-xl h-11 text-white hover:bg-[#243b55]/20"
                            >
                              <span>
                                {field.value
                                  ? format(field.value, "MM/dd/yyyy")
                                  : "mm/dd/yyyy"}
                              </span>
                              <CalendarIcon className="w-5 h-5 text-gray-400" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => field.onChange(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                {/* Cancel Button */}
                <Button className="bg-[#3D4566] hover:bg-[#3D4566]/70 cursor-pointer text-white px-8 h-11 rounded-xl">
                  Cancel
                </Button>
                {/* Save Button */}
                <Button
                  type="submit"
                  className="bg-[#E9201D] hover:bg-[#E9201D] cursor-pointer text-white px-8 h-11 rounded-xl"
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
            
    </div>
  )
}
