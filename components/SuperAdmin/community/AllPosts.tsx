import CommentIcon from '@/components/icons/Community/CommentIcon'
import FlagIcon from '@/components/icons/Community/FlagIcon'
import LikeIcon from '@/components/icons/Community/LikeIcon'
import TrashIconRed from '@/components/icons/course-management/TrashIconRed'
import EyeIcon from '@/components/icons/SuperAdmindashboard/EyeIcon'
import { allPostsData } from '@/public/demoData/AllPostsData'
 
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


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

const CONTENT_WORD_LIMIT = 18

const truncateByWords = (text: string, limit: number): string => {
  const words = text.trim().split(/\s+/)

  if (words.length <= limit) {
    return text
  }

  return `${words.slice(0, limit).join(' ')}...`
}


export default function AllPosts() {
  return (
    <div className=' space-y-3'>
        {
            allPostsData.map((post,index)=>(
                <div key={post.id} className='p-4 border border-[#383e57] rounded-[8px] bg-[#030C15] flex items-start justify-between'>
                    <div className=' flex items-start gap-3.5'>
                    <div>
                        <Image src={post.avatar} alt="Avatar"  />
                    </div>

                    <div>
                        <div className=' flex items-center gap-2'>
                            <h3 className=' text-base text-[#A5A5AB] font-medium'>{post.user_name}</h3>
                            <p className={` text-sm py-0.5 px-1.5 rounded-[4px] inline-block ${getTypeBadgeColors(post.type).bg} ${getTypeBadgeColors(post.type).text}`}>{post.type}</p>
                            <p className={` text-sm py-0.5 px-1.5 rounded-[4px] inline-block ${getStatusBadgeColors(post.status).bg} ${getStatusBadgeColors(post.status).text}`}>{post.status}</p>
                            <p className=' text-sm text-[#777980] py-0.5 px-1.5   inline-block '>{post.date}</p>
                        </div>
                        <p className=' text-[#A5A5AB] text-sm mt-3'>{truncateByWords(post.content, CONTENT_WORD_LIMIT)}</p>
                        <div className=' flex items-center gap-6 mt-3'>
                            <div className=' flex items-center gap-1'>
                                <LikeIcon/>
                                <p className=' text-xs text-[#B2B5B8] font-medium'>{post.likes}</p>
                            </div>
                            <div className=' flex items-center gap-1'>
                                <CommentIcon/>
                                <p className=' text-xs text-[#B2B5B8] font-medium'>{post.comments}</p>
                            </div>
                        </div>
                    </div>

                    </div>

                    <div className=' flex items-center gap-2'>
                        <Link href={`/dashboard/community/${post.id}`} className=' cursor-pointer p-1.5 bg-[#0e1825] rounded-[4px]'>
                            <EyeIcon/>
                        </Link>
                        <button className=' cursor-pointer p-2.5 bg-[#0e1825] rounded-[4px]'>
                            <FlagIcon/>
                        </button>
                        <button className=' cursor-pointer p-1.5 bg-[#0e1825] rounded-[4px]'>
                            <TrashIconRed/>
                        </button>
                    </div>

                </div>
            ))
        }
    </div>
  )
}
