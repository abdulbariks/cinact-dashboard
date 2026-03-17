import React from 'react'
import BreadCrumpRightArrow from '@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow'
import Image from 'next/image'
import Link from 'next/link'
import teacherImg from '@/public/admin-dashboard/teacher-profile.png'
import EmailIcon from '@/components/icons/others/EmailIcon'
import PhoneIcon from '@/components/icons/others/PhoneIcon'
import CalenderIcon3 from '@/components/icons/others/CalenderIcon3'
import UserIcon from '@/components/icons/others/UserIcon'
 
import UsersWhiteIcon from '@/components/icons/others/UsersWhiteIcon'
 
import ClockWhiteIcon from '@/components/icons/others/ClockWhiteIcon'
 

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

      <h2 className=' text-2xl text-[#E6E7E8] font-semibold mt-[30px] mb-5'>Teacher Details</h2>

      <div  className=' bg-[#0a1929] p-4 rounded-2xl'>
        <h3 className=' text-lg text-white font-medium'>Personal Information</h3>

        <div className=' bg-[#07121d] p-4 mt-4 rounded-[10px] '>
          <div className=' flex items-center justify-between'>
          <div className=' flex items-center gap-3'>
            <Image src={teacherImg} alt='Teacher Image' />
            <div>
              <h3 className=' text-lg text-white font-medium'>Sophie Lambert <span className=' text-xs text-[#18CC3F] bg-[#2a3d2e] py-2 px-2.5 rounded-full'>Active</span> </h3>
              <div className=' flex items-center gap-1.5 mt-1'>
                <EmailIcon/>
                <p className=' text-sm text-[#A5A5AB] '>emma.witson@email.cam</p>
              </div>
            </div>
          </div>

          <div className=' space-y-2'>
            <div className=' flex items-center gap-1.5'>
              <PhoneIcon/>
              <p className=' text-sm text-[#A5A5AB] '>+1 (555) 123-4567</p>
            </div>
            <div className=' flex items-center gap-1.5'>
              <CalenderIcon3/>
              <p className=' text-sm text-[#A5A5AB] '>2024-08-01 </p>
            </div>
            <div className=' flex items-center gap-1.5'>
              <CalenderIcon3/>
              <p className=' text-sm text-[#A5A5AB] '>6 years</p>
            </div>
          </div>

          </div>

          <div className=' mt-4'>
            <p className=' text-xs text-[#585E66] font-medium mb-1.5 '>course</p>
            <h3 className=' text-sm text-[#DFE1E7]'>1 year program ( adult)</h3>

          </div>

        </div>
      </div>


      <div className=' p-4 bg-[#0a1929] rounded-2xl mt-4.5'>

        <h1 className=' text-white text-xl font-medium'>1 year program ( adult)</h1>
        <div className=' bg-[#07121d] p-4 rounded-[10px] mt-4 space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:flex lg:justify-between lg:gap-0'>
            <div>
            <div className=' flex items-center  gap-1'>
              <UserIcon/>
              <p className=' text-[#A5A5AB] text-xs  font-medium'>Teacher</p>
            </div>
            <h4 className=' text-sm text-white font-medium mt-1.5'>Wade Warren</h4>

            </div>
            <div>
            <div className=' flex items-center  gap-1'>
              <UsersWhiteIcon/>
              <p className=' text-[#A5A5AB] text-xs  font-medium'>Students</p>
            </div>
            <h4 className=' text-sm text-white font-medium mt-1.5'>45 students</h4>

            </div>
            <div>
            <div className=' flex items-center  gap-1'>
              <ClockWhiteIcon/>
              <p className=' text-[#A5A5AB] text-xs  font-medium'>Duration</p>
            </div>
            <h4 className=' text-sm text-white font-medium mt-1.5'>45 Min</h4>

            </div>
            <div>
            <div className=' flex items-center  gap-1'>
              <CalenderIcon3/>
              <p className=' text-[#A5A5AB] text-xs  font-medium'>Date</p>
            </div>
            <h4 className=' text-sm text-white font-medium mt-1.5'>2024-08-01</h4>

            </div>
          </div>

          <div  >
            <h3 className=' text-lg text-white font-medium'>Course Overview</h3>
            <p className=' text-sm text-[#D2D2D5] mt-2.5'>This course consists of a 2-year period trajectory that runs 1 day a week on Sunday takes place.</p>

          </div>

          <div>
            <div className=' flex items-center justify-between'>
              <h3 className=' text-lg text-white font-medium'>Course Progress</h3>
              <p className=' text-sm text-white'>65%</p>
            </div>
       {/* progress bar  */}
              <div className=' w-full bg-[#343847] h-2 rounded-full mt-2'>
                <div className=' bg-[#FFC943] h-2 rounded-full' style={{ width: '65%' }}></div>
              </div>
          </div>

        </div>

      </div>


    </div>
  )
}
