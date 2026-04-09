"use client"

import React, { useMemo } from 'react'
import EyeIcon from '@/components/icons/SuperAdmindashboard/EyeIcon'
import Image from 'next/image'
import GreenTikIcon from '@/components/icons/Community/GreenTikIcon'
import RedCross from '@/components/icons/Community/RedCross'
import { moderationRequestData } from '@/public/demoData/modaretionRequestData'

type ModaretionRequestProps = {
  search?: string
  enabled?: boolean
  selectedRole?: string
  selectedStatus?: string
}


// Type badge colors
  const getTypeBadgeColors = (type: string): { bg: string; text: string } => {
  switch (type.toLowerCase()) {
    case 'student':
      return {
        bg: 'bg-[#171c15]', 
        text: 'text-[#CC8718]'  
      }
    case 'almuni':
      return {
        bg: 'bg-[#06102a]',  
        text: 'text-[#6774FF]'  
      }
    case 'admin':
      return {
        bg: 'bg-[#1c0b13]', // Red background
        text: 'text-[#E9201D]' // Light red text
      }
    default:
      return {
        bg: 'bg-[#3d3d3d]',
        text: 'text-[#a5a5ab]'
      }
  }
}

// Status badge colors
  const getStatusBadgeColors = (status: string): { bg: string; text: string } => {
  switch (status.toLowerCase()) {
    case 'approved':
      return {
        bg: 'bg-[#051f19]',  
        text: 'text-[#18cc3f]'  
      }
    case 'request':
      return {
        bg: 'bg-[#5a4a1a]', // Yellow background
        text: 'text-[#fbbf24]' // Light yellow text
      }
    case 'flag':
      return {
        bg: 'bg-[#1c2213]', // Red background
        text: 'text-[#FFE205]' // Light red text
      }
    case 'announcement':
      return {
        bg: 'bg-[#051f19]',  
        text: 'text-[#18cc3f]'  
      }
    default:
      return {
        bg: 'bg-[#3d3d3d]',
        text: 'text-[#a5a5ab]'
      }
  }
}


export default function ModaretionRequest({
  search = '',
  selectedRole = 'all-role',
  selectedStatus = 'all-status',
}: ModaretionRequestProps) {
  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const normalizedRole = selectedRole.toLowerCase()
    const normalizedStatus = selectedStatus.toLowerCase()

    return moderationRequestData.filter((post) => {
      const postType = post.type.toLowerCase()
      const postStatus = post.status.toLowerCase()
      const searchMatch =
        normalizedSearch.length === 0 ||
        post.user_name.toLowerCase().includes(normalizedSearch) ||
        post.content.toLowerCase().includes(normalizedSearch)

      const typeMatch =
        normalizedRole === 'all-role' ||
        (normalizedRole === 'finance' && postType === 'finance') ||
        (normalizedRole === 'student' && postType === 'student') ||
        (normalizedRole === 'admin' && postType === 'admin') ||
        (normalizedRole === 'alumni' && (postType === 'alumni' || postType === 'almuni'))

      const statusMatch =
        normalizedStatus === 'all-status' ||
        postStatus === normalizedStatus

      return searchMatch && typeMatch && statusMatch
    })
  }, [search, selectedRole, selectedStatus])

  return (
    <div className=' space-y-3'>
        {
            filteredPosts.map((post)=>(
                <div key={post.id} className='p-4 border border-[#383e57] rounded-xl bg-[#030C15] flex items-start justify-between'>
                    <div className=' flex items-start gap-3.5'>
                    <div>
                        <Image src={post.avatar} alt="Avatar"  />
                    </div>

                    <div>
                        <div className=' flex items-center gap-2'>
                            <h3 className=' text-base text-[#A5A5AB] font-medium'>{post.user_name}</h3>
                            <p className={` text-sm py-0.5 px-1.5 rounded-lg inline-block ${getTypeBadgeColors(post.type).bg} ${getTypeBadgeColors(post.type).text}`}>{post.type}</p>
                            <p className={` text-sm py-0.5 px-1.5 rounded-lg inline-block ${getStatusBadgeColors(post.status).bg} ${getStatusBadgeColors(post.status).text}`}>{post.status}</p>
                            <p className=' text-sm text-[#777980] py-0.5 px-1.5   inline-block '>{post.date}</p>
                        </div>
                        <p className=' text-[#A5A5AB] text-sm mt-3'>{post.content}</p>
                         
                    </div>

                    </div>

                    <div className=' flex items-center gap-2'>
                        <button className=' cursor-pointer p-1.5 bg-[#0e1825] rounded-lg'>
                            <EyeIcon/>
                        </button>
                        <button className=' cursor-pointer p-1.75 bg-[#0e1825] rounded-lg'>
                            <GreenTikIcon/>
                        </button>
                        <button className=' cursor-pointer p-3 bg-[#0e1825] rounded-lg'>
                            <RedCross/>
                        </button>
                    </div>

                </div>
            ))
        }
    </div>
  )
}
