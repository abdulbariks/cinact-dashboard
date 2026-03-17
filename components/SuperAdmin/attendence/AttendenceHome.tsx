"use client";

import React, { useState } from 'react'
import MonthStatus from './MonthStatus'
import Image from 'next/image'
import statsImg from '@/public/admin-dashboard/stats-bg.png'
import SearchIcon from '@/components/icons/SuperAdmindashboard/SearchIcon'
import { AllStatus } from '@/components/reusable/AllStatus'
import DynamicTable from '@/components/reusable/DynamicTable'
import attendenceListData from '@/public/demoData/AttendenceListData'
import { attendenceListColumns } from '@/components/columns/AttendenceListColumn'


const statsData = [
    {
        title: 'Class Participation Rate',
        value: '87%',
    },
    {
        title: 'Missed Classes',
        value: '13%'
    },
    {
        title: 'Active Students',
        value: '92%'
    },
    {
        title: 'Attendance Rate',
        value: '82%'
    }
]

export default function AttendenceHome() {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalItems = attendenceListData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = attendenceListData.slice(startIndex, endIndex);

    return (
        <div>
            <div className=' flex items-center justify-between'>
                <h2 className=' text-2xl text-[#E6E7E8] font-semibold'>Attendance Overview</h2>
                <MonthStatus />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4'>
                {statsData.map((card) => (
                    <div key={card.title} className='bg-[#09131d] p-6 rounded-2xl relative overflow-hidden'>
                        <Image src={statsImg} alt={card.title} className=' absolute top-0 right-0' />
                        <p className='text-base text-white  '>{card.title}</p>
                        <h3 className='text-[24px] text-white font-semibold mt-6'>{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className=' p-6 bg-[#0a1726] rounded-2xl mt-8'>
                <div className=' flex items-center justify-between'>
                    <h3 className=' text-white text-xl font-semibold'>Attendance List</h3>
                    <div className=' flex items-center gap-2'>
                        <div className=' relative w-80'>
                            <input
                                type="text"
                                name="search"
                                // value={search}
                                // onChange={handleChange}
                                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                                placeholder="Search Transaction ID"
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

                <div className=' mt-6 w-3/4'>
                    <DynamicTable
                        columns={attendenceListColumns}
                        data={attendenceListData}
                        // currentPage={currentPage}
                        // itemsPerPage={itemsPerPage}
                        // totalpage={totalPages}
                        // totalItems={totalItems}
                        // onPageChange={setCurrentPage}
                        // setItemsPerPage={setItemsPerPage}
                        noDataMessage='No attendance found'
                        loading={false}
                    />
                </div>
            </div>
        </div>
    )
}
