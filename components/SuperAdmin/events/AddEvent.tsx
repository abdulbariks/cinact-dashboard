import BreadCrumpRightArrow from '@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow'
import Link from 'next/link'
import React from 'react'

export default function AddEvent() {
  return (
    <div>
           <div className='flex items-center gap-2'>
                <Link href='/dashboard/events' className='text-base text-[#5F6CA0] hover:text-[#8D9CDC]'>
                    Event Management
                </Link>
                <BreadCrumpRightArrow />
                <p className='text-base font-medium text-[#8D9CDC]'>Add Event</p>
            </div>
    </div>
  )
}
