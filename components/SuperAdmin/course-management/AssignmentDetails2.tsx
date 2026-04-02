'use client'
import BreadCrumpRightArrow from '@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { classes } from './ModuleDetails';

export default function AssignmentDetails2() {

  const path = usePathname();
  const courseId = path.split('/')[4];
  const assignmentId = path.split('/')[6];
  console.log(assignmentId)
  const classNo = classes.find(cls => cls.id === path.split('/')[5])?.classNo || 'Class Details';

  return (
    <div>
              <div className="flex items-center gap-2">
        <Link
          href="/dashboard/course-management"
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Course Management
        </Link>
        <BreadCrumpRightArrow />
        <Link
          href={`/dashboard/course-management/course-details/${courseId}`}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          Course Details
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]"> </p>
          <Link
          href={`/dashboard/course-management/course-details/${courseId}/${classNo}`}
        //   /dashboard/course-management/course-details/1/2200
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
        class -{classNo} Details
        </Link>
         <BreadCrumpRightArrow />
      </div>
    </div>
  )
}
