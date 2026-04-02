import React from 'react'
import RightArrowIcon from '@/components/icons/others/RightArrowIcon'
import { PaymentIcon, TeacherIcon, UsersIcon } from '@/components/icons/sidebar.tsx/SidebarIcons'
import CalenderIcon from '@/components/icons/SuperAdmindashboard/CalenderIcon'
import ClockIcon from '@/components/icons/SuperAdmindashboard/ClockIcon'
import SearchIcon from '@/components/icons/SuperAdmindashboard/SearchIcon'
import { AllStatus } from '@/components/reusable/AllStatus'
import { coursesData } from '@/public/demoData/CoursesData'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function CourseManagementHome() {
    return (
        <div>
            <h2 className=' text-2xl text-[#E6E7E8] font-semibold'>Course Management</h2>
            <div className=' bg-[#0a1726] p-6 rounded-2xl mt-5'>
                <div className=' flex items-center justify-between'>
                    <h3 className=' text-white text-xl font-semibold'>All Courses</h3>
                    <div className=' flex items-center gap-2'>
                        <div className=' relative w-80'>
                            <input
                                type="text"
                                name="search"
                                // value={search}
                                // onChange={handleChange}
                                className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                                placeholder="Search Course`"
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

                <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
                    {
                        coursesData.map((course, index) => (
                             

                            <div key={index} className=' bg-[#07121d] p-4 rounded-[12px] border-t-[0.5px] border-b-[0.5px] border-r-[0.5px] border-l-3 border-[#8D9CDC]'  >
                                <h2 className=' text-white text-lg font-medium'>
                                    {course.course_name}
                                    <span className=' py-1 px-2.5 rounded-full text-sm text-[#18CC3F] bg-[#2a3d2e]  ml-2'>{course.status}</span>

                                </h2>
                                <div className=' mt-3 flex items-center gap-3'>
                                    <div className=' border border-[#434656] bg-[#0A1A29] inline-block p-2 rounded-full'>
                                        <TeacherIcon />
                                    </div>
                                    <div>
                                        <p className=' text-sm text-[#E6E7E8] '>{course.ins_name}</p>
                                        <p className=' text-xs text-[#A5A5AB] '>{course.ins_specification}</p>
                                    </div>

                                </div>

                                <div className=' my-9   flex items-center justify-between'>

                                    <div>
                                        <div className=' flex items-center gap-1'>
                                           <CalenderIcon/>
                                           <p className=' text-xs text-[#B2B5B8] '>
                                           Start Date
                                           </p>
                                        </div>
                                        <p className=' text-sm text-white font-medium mt-1.5'>{course.start_date}</p>
                                    </div>
                                    <div>
                                        <div className=' flex items-center gap-1'>
                                           <ClockIcon/>
                                           <p className=' text-xs text-[#B2B5B8] '>
                                         Duration
                                           </p>
                                        </div>
                                        <p className=' text-sm text-white font-medium mt-1.5'>{course.duration}</p>
                                    </div>
                                    <div>
                                        <div className=' flex items-center gap-1'>
                                           <UsersIcon/>
                                           <p className=' text-xs text-[#B2B5B8] '>
                                           Students
                                           </p>
                                        </div>
                                        <p className=' text-sm text-white font-medium mt-1.5'>{course.students}</p>
                                    </div>



                                </div>

                                <div className=' flex items-center justify-between'>
                                <div >
                                   <div className=' flex items-center gap-1'>
                                           <PaymentIcon/>
                                           <p className=' text-xs text-[#B2B5B8] '>
                                         Course Fee
                                           </p>
                                        </div>
                                        <p className=' text-sm text-white font-medium mt-1.5'>${course.course_fee} <span className=' text-sm text-[#d1d1d1] '>( ${course.per_month_fee}/month )</span> </p>
                                </div>
                               <Link href={`/dashboard/course-management/course-details/${course.id}`}  className=' text-white inline-flex items-center gap-3 bg-[#5F6CA0] py-3 pl-3 pr-1.5  rounded-[8px]'>
                               View Course
                               <RightArrowIcon/>
                               </Link>

                                </div>



                            </div>
                            
                            
                        ))
                    }
                    <Dialog>
                        <DialogTrigger asChild>
                            <button
                                type='button'
                                className=' bg-[#07121d] p-4 rounded-[12px] border border-dashed border-[#505B86] min-h-[260px] flex  items-center gap-2 justify-center text-center text-white hover:bg-[#0b1b2b] transition-colors cursor-pointer'
                            >
                                <span className=' text-3xl leading-none'>+</span>
                                <span className=' mt-2 text-lg font-medium'>Add Course</span>
                            </button>
                        </DialogTrigger>

                        <DialogContent className='border-none rounded-2xl bg-[#0A1726] text-white max-w-[520px]'>
                            <DialogHeader>
                                <DialogTitle className='text-xl font-semibold text-white'>Add Course</DialogTitle>
                             
                            </DialogHeader>
                            
                        </DialogContent>
                    </Dialog>
                </div>

            </div>
        </div>
    )
}
