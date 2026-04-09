"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import BreadCrumpRightArrow from '../SuperAdmindashboard/BreadCrumpRightArrow'
import Image, { StaticImageData } from 'next/image'
import LikeIcon from './LikeIcon'
import CommentIcon from './CommentIcon'

type PostDetailsProps = {
  post: {
    id: string
    user_name: string
    avatar: StaticImageData | string | null
    type: string
    status: string
    date: string
    likes: number
    comments: number
    content: string
  }
}

const getNameInitials = (name: string) => {
  const trimmedName = name.trim()

  if (!trimmedName) return 'NA'

  const words = trimmedName.split(/\s+/)

  if (words.length >= 2) {
    return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase()
  }

  return trimmedName.slice(0, 2).toUpperCase()
}

const getTypeBadgeColors = (type: string): { bg: string; text: string } => {
  switch (type.toLowerCase()) {
    case 'student':
      return { bg: 'bg-[#171c15]', text: 'text-[#CC8718]' }
    case 'almuni':
      return { bg: 'bg-[#06102a]', text: 'text-[#6774FF]' }
    case 'admin':
      return { bg: 'bg-[#1c0b13]', text: 'text-[#E9201D]' }
    default:
      return { bg: 'bg-[#3d3d3d]', text: 'text-[#a5a5ab]' }
  }
}

const getStatusBadgeColors = (status: string): { bg: string; text: string } => {
  switch (status.toLowerCase()) {
    case 'approved':
      return { bg: 'bg-[#051f19]', text: 'text-[#18cc3f]' }
    case 'request':
      return { bg: 'bg-[#5a4a1a]', text: 'text-[#fbbf24]' }
    case 'flag':
      return { bg: 'bg-[#1c2213]', text: 'text-[#FFE205]' }
    case 'announcement':
      return { bg: 'bg-[#051f19]', text: 'text-[#18cc3f]' }
    default:
      return { bg: 'bg-[#3d3d3d]', text: 'text-[#a5a5ab]' }
  }
}

export default function PostDetails({ post }: PostDetailsProps) {
  const [avatarError, setAvatarError] = useState(false)

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Link href='/dashboard/community' className='text-base text-[#5F6CA0] hover:text-[#8D9CDC]'>
          Community Management
        </Link>
        <BreadCrumpRightArrow />
        <p className='text-base font-medium text-[#8D9CDC]'>Post Details</p>
      </div>

      <div className='p-4 border border-[#383e57] rounded-xl bg-[#030C15]'>
        <div className='flex items-start gap-3.5'>
          {!post.avatar || avatarError ? (
            <div className='size-10 rounded-full bg-[#1a2432] flex items-center justify-center text-xs text-[#E6E7E8] font-semibold'>
              {getNameInitials(post.user_name)}
            </div>
          ) : (
            <Image
              src={post.avatar}
              alt={post.user_name}
              width={40}
              height={40}
              className='rounded-full object-cover size-10'
              onError={() => setAvatarError(true)}
            />
          )}

          <div className='flex-1'>
            
              <h3 className='text-base text-[#A5A5AB] font-medium'>{post.user_name}</h3>

              <div className=' flex items-center gap-2 flex-wrap mt-2'>
                 <p className={`text-sm py-0.5 px-1.5 rounded-lg inline-block ${getTypeBadgeColors(post.type).bg} ${getTypeBadgeColors(post.type).text}`}>
                {post.type}
              </p>
              <p className={`text-sm py-0.5 px-1.5 rounded-lg inline-block ${getStatusBadgeColors(post.status).bg} ${getStatusBadgeColors(post.status).text}`}>
                {post.status}
              </p>
              <p className='text-sm text-[#777980] py-0.5 px-1.5 inline-block'>{post.date}</p>

              </div>
             
           

            <p className='text-[#A5A5AB] text-sm mt-3'>{post.content}</p>


            <div className=' flex items-center gap-6 mt-6'>
                <div className=' flex-1 bg-white rounded-[12px] border '>1</div>
                <div className=' flex-1 bg-white rounded-[12px] border '>2</div>
                <div className=' flex-1 bg-white rounded-[12px] border '>3</div>
              
           
                 
            </div>

            <div className='flex items-center gap-6 mt-6'>
              <div className='flex items-center gap-1'>
                <LikeIcon />
                <p className='text-xs text-[#B2B5B8] font-medium'>{post.likes}</p>
              </div>
              <div className='flex items-center gap-1'>
                <CommentIcon />
                <p className='text-xs text-[#B2B5B8] font-medium'>{post.comments}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
