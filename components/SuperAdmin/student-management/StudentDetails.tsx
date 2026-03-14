import BreadCrumpRightArrow from '@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow'
import Link from 'next/link'
import React from 'react'

export default function StudentDetails() {
  return (
    <div>
          <div className='flex items-center gap-2'>
        <Link href='/dashboard/student-management' className='text-base text-[#5F6CA0] hover:text-[#8D9CDC]'>
          Student Management
        </Link>
        <BreadCrumpRightArrow />
        <p className='text-base font-medium text-[#8D9CDC]'>Student Details</p>
      </div>
    </div>
  )
}
