"use client"

import React from 'react'
import SearchIcon from '@/components/icons/SuperAdmindashboard/SearchIcon'
import { AllStatus } from '@/components/reusable/AllStatus'
import DynamicTable from '@/components/reusable/DynamicTable'
import { classAttendenceColumns } from '@/components/columns/ClassAttendenceColumn'
import { classAttendenceData } from '@/public/demoData/ClassAttendenceData'

export default function ClassAttendence() {
  return (
    <div className=' '>

<h3 className=' text-xl text-white font-medium mb-4'>All Attendence</h3>
     

      <div  >
        <DynamicTable
          columns={classAttendenceColumns}
          data={classAttendenceData}
          noDataMessage='No attendance found'
          loading={false}
        />
      </div>
    </div>
  )
}
