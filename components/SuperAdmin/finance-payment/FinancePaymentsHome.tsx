'use client'
import React, { useState } from 'react'
import PlusIcon from '@/components/icons/SuperAdmindashboard/PlusIcon'
import Link from 'next/link'
import RedUsers from '@/components/icons/SuperAdmindashboard/RedUsers';
import RedGradHat from '@/components/icons/SuperAdmindashboard/RedGradHat';
import RedTeacherIcon from '@/components/icons/SuperAdmindashboard/RedTeacherIcon';
import RedRevenueIcon from '@/components/icons/SuperAdmindashboard/RedRevenueIcon';
import RedCardIcon from '@/components/icons/SuperAdmindashboard/RedCardIcon';
import RedUsersIcon from '@/components/icons/SuperAdmindashboard/RedUsersIcon';
import Image from 'next/image';
import statBg from '@/public/admin-dashboard/stats-bg.png'
import { transactionsData } from '@/public/demoData/transactionsData';
import DynamicTable from '@/components/reusable/DynamicTable';
import { transactionsColumns } from '@/components/columns/TransactionsColumns';
import SearchIcon from '@/components/icons/SuperAdmindashboard/SearchIcon';
import { DatePickerButton } from '@/components/reusable/DatePickerButton';
import { AllPaymentPlan } from '@/components/reusable/AllPaymentPlan';

type StatItem = {
  title: string;
  value: number | string;
  percentage: string;
  icon: React.ComponentType<{ className?: string }>;
};

// interface StatItemInterface {
//   title: string
//   value: number | string
//   percentage: string
//   icon: React.ComponentType<{ className?: string }>
// }

const statsData: StatItem[] = [
  {
    title: "Total Revenue",
    value: '$348',
    percentage: "+12.5%",
    icon: RedRevenueIcon,
  },
  {
    title: "Course Revenue",
    value: '$399',
    percentage: "+5%",
    icon: RedCardIcon,
  },
  {
    title: "Events Revenue",
    value: "$399",
    percentage: "+18.2%",
    icon: RedUsersIcon,
  },
  {
    title: "Total Teachers",
    value: "$127",
    percentage: "+12.5%",
    icon: RedRevenueIcon,
  },
];

export default function FinancePaymentsHome() {


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Use studentManagementData instead of demoData
  const totalItems = transactionsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = transactionsData.slice(startIndex, endIndex);

  return (
    <div>
      <div className=' flex items-center justify-between'>
        <h2 className=' text-2xl text-[#E6E7E8] font-semibold'>Finance & Payments</h2>
        <Link
          href="/dashboard/finance-payments/add-payment"
          className=' p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-[8px] cursor-pointer'>
          <PlusIcon />
          Add Payment
        </Link>
      </div>
      <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
        {
          statsData.map((stat, index) => (
            <div key={index} className=' p-6 bg-[#0A1A29] rounded-2xl relative overflow-hidden'>
              <Image src={statBg} alt='Stat Background' className=' absolute top-0 right-0  ' />
              <div className=' flex items-center justify-between'>
                <p className=' text-white text-base'>{stat.title}</p>
                <stat.icon />
              </div>
              <div className=' mt-6 '>
                <h2 className=' text-[32px] text-white font-semibold'>{stat.value}</h2>
              </div>
              <div className=' mt-1 flex items-center gap-2'>
                <p className=' text-xs text-[#E9201D] font-semibold py-1 px-2.5 rounded-full bg-[#1c273b] inline-block'>{stat.percentage}</p>

                <p className=' text-base text-[#8D9CDC]'>vs last month</p>
              </div>
            </div>
          ))
        }
      </div>

      <div className=" mt-5 p-6  bg-[#0A1726] rounded-2xl">
        <div className=" flex flex-col lg:flex-row items-center justify-between mb-6">
          <h3 className=" text-white text-xl font-semibold">
            Transactions (44)
          </h3>
          <div className=" flex flex-col md:flex-row items-center gap-2">
            <div className=" relative w-80">
              <input
                type="text"
                name="search"
                // value={search}
                // onChange={handleChange}
                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56]"
                placeholder="Search Transaction ID"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
                <SearchIcon />
              </button>
            </div>
            <DatePickerButton />
            <AllPaymentPlan />
          </div>
        </div>
        <DynamicTable
          columns={transactionsColumns}
          data={currentData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalpage={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          noDataMessage="No students found"
          loading={false}
        />
      </div>
    </div>
  )
}
