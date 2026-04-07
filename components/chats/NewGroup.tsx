 
import React from 'react'
import BreadCrumpRightArrow from '../icons/SuperAdmindashboard/BreadCrumpRightArrow'
import Link from 'next/link'

export default function NewGroup() {
  return (
    <div>
         <div className='flex items-center gap-2'>
        <Link href='/dashboard/chats' className='text-base text-[#5F6CA0] hover:text-[#8D9CDC]'>
          Chat
        </Link>
        <BreadCrumpRightArrow />
        <p className='text-base font-medium text-[#8D9CDC]'>New Group</p>
      </div>
    </div>
  )
}
