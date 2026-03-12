import CalenderIcon from '@/components/icons/SuperAdmindashboard/CalenderIcon'
import ClockIcon from '@/components/icons/SuperAdmindashboard/ClockIcon'
import { upcomingClassesData } from '@/public/demoData/UpcomingClassesData'
import React from 'react'

export default function UpcomingClasses() {
  return (
    <div className=' bg-[#0a1929] p-4 rounded-2xl'>
               <h2 className=' text-lg text-white font-medium'>Upcoming Classes</h2>
               <div className=' space-y-3 mt-4'>
                {
                  upcomingClassesData.map((item,index)=>(
                    <div key={index} className=' bg-[#07121d] p-4 rounded-[10px]'>
                      <h2 className=' text-white text-base font-medium'>{item.module}</h2>
                      <p className=' text-sm text-[#D2D2D5] mt-1'>{item.inst_name}</p>

                      <div className=' flex items-center gap-3 mt-3'>
                        <div className=' flex items-center gap-1'>
                          <CalenderIcon/>
                          <p className=' text-white text-sm'>{item.date}</p>
                        </div>
                        <div className=' flex items-center gap-1'>
                          <ClockIcon/>
                          <p className=' text-white text-sm'>{item.time}</p>
                        </div>
                      </div>

                    </div>
                  ))
                }
               </div>
           </div>
  )
}
