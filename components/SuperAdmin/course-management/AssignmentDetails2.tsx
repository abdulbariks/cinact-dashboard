'use client'
import React from 'react'
import BreadCrumpRightArrow from '@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { classes } from './ModuleDetails';
import TeacherIcon from '@/components/icons/course-management/TeacherIcon'

import SubmissionIcon from '@/components/icons/course-management/SubmissionIcon'
import StarIcon from '@/components/icons/course-management/StarIcon'

import CalenderIcon2 from '@/components/icons/others/CalenderIcon2'

import SubmissionIconSecondary from '@/components/icons/course-management/SubmissionIconSecondary'
import { assignmentSubmissionData } from '@/public/demoData/AssignmentSubmissionData'
 
import AssignmentSubmissionCard from './AssignmentSubmissionCard'

export default function AssignmentDetails2() {

  const params = useParams<{ courseId: string; classId: string; assignmentId: string }>()
  const courseId = params?.courseId
  const classId = params?.classId
  const assignmentId = params?.assignmentId

  const classNo = classes.find((cls) => cls.id === classId)?.classNo || 'Class Details'

  return (
    <div>
      {/* breadcrump */}
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
        <Link
          href={`/dashboard/course-management/course-details/${courseId}/${classId}`}
          className="text-base text-[#5F6CA0] hover:text-[#8D9CDC]"
        >
          class -{classNo} Details
        </Link>
        <BreadCrumpRightArrow />
        <p className="text-base font-medium text-[#8D9CDC]">Assignment  Details</p>
      </div>

      <div className=' mt-8'>
        <h2 className=' text-2xl text-[#E6E7E8] font-semibold'>Assignment Details</h2>
        <div className=' p-4 rounded-[16px] bg-[#0A1929] mt-4.5'>
          <h3 className=' text-xl text-white font-medium'>Introduction to Personal Development</h3>
          <div className=' p-4 rounded-[10px] bg-[#07121D] mt-4'>

            <div className=" flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className=" flex items-center gap-1">
                  <TeacherIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Teacher</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">Wade Warren</h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <SubmissionIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Submission</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">22 submitted</h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <StarIcon />
                  <p className=" text-xs text-[#A5A5AB] ">Average Score</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">42.5/50</h3>
              </div>
              <div>
                <div className=" flex items-center gap-1">
                  <CalenderIcon2 />
                  <p className=" text-xs text-[#A5A5AB] ">Date</p>
                </div>
                <h3 className=" text-sm text-white font-medium mt-1.5">2024-08-01</h3>
              </div>
            </div>

            <div className=' mt-4'>
              <h3 className=" text-xl text-white font-medium">
                Assignment Description
              </h3>
              <p className=" mt-2.5 text-sm text-[#D2D2D5]">Write a comprehensive 500-word reflection essay on pur current confidence level, identffying specific areas for 'np«ovement and outlining actionable steps for personal development in your acting Journey.</p>
            </div>

          </div>

        </div>
      </div>

      <div className=' p-4 bg-[#0a1929] rounded-[12px] mt-6'>
        <div className=' border-b  border-[#3D4566]'>
          <div className=' inline-flex items-center gap-2 border-b-2 border-[#E9201D] p-5'>
            <SubmissionIconSecondary />
            <h3 className=' text-base text-white font-medium'>Assignments Submision</h3>
          </div>

        </div>
        <div className=' p-4 bg-[#07121d]  rounded-[12px] mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5'>

          {
            assignmentSubmissionData.map((submission)=>(
              <div key={submission.id}  >
               <AssignmentSubmissionCard submission={submission}/>

              </div>
            ))
          }

        </div>

      </div>
    </div>
  )
}
