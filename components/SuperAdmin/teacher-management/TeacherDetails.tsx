import BreadCrumpRightArrow from '@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow'
import Link from 'next/link'
import React from 'react'

export default function TeacherDetails() {
  return (
    <div>
          <div className='flex items-center gap-2'>
        <Link href='/dashboard/teacher-management' className='text-base text-[#5F6CA0] hover:text-[#8D9CDC]'>
          Teacher Management
        </Link>
        <BreadCrumpRightArrow />
        <p className='text-base font-medium text-[#8D9CDC]'>Teacher Details</p>
      </div>
    </div>
  )
}
