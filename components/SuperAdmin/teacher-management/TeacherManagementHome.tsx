'use client'

import React, { useState } from 'react'
import { teachersColumns } from '@/components/columns/teachersColumn'
import PlusIcon from '@/components/icons/SuperAdmindashboard/PlusIcon'
import SearchIcon from '@/components/icons/SuperAdmindashboard/SearchIcon'
import { AllStatus } from '@/components/reusable/AllStatus'
import DynamicTable from '@/components/reusable/DynamicTable'
import { teachersData } from '@/public/demoData/TeachersData'
import Link from 'next/link'

export default function TeacherManagementHome() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalItems = teachersData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = teachersData.slice(startIndex, endIndex)

  return (
    <div>
      <div className=' flex items-center justify-between'>
        <h2 className=' text-2xl text-[#E6E7E8] font-semibold'>Teacher Management</h2>
        <Link
          href="/dashboard/teacher-management/add-teacher"
          className=' p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-[8px] cursor-pointer'>
          <PlusIcon />
          Add Teacher
        </Link>
      </div>

      <div className=' bg-[#0A1726] p-6 rounded-2xl mt-5'>
        <div className=' flex items-center justify-between'>
          <h3 className=' text-white text-xl font-semibold'>Teachers ({totalItems})</h3>
          <div className=' flex items-center gap-2'>
            <div className=' relative w-80'>
              <input
                type="text"
                name="search"
                // value={search}
                // onChange={handleChange}
                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                placeholder="Search Teacher..."
              />
              <button

                className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
              >
                <SearchIcon />
              </button>
            </div>

            <AllStatus />
          </div>
        </div>
        <div className=' mt-6'>
          <DynamicTable
            columns={teachersColumns}
            data={currentData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalpage={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            noDataMessage='No teachers found'
            loading={false}
          />
        </div>
      </div>
    </div>
  )
}
