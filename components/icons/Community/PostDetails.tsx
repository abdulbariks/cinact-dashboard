import Link from 'next/link'
import React from 'react'
import BreadCrumpRightArrow from '../SuperAdmindashboard/BreadCrumpRightArrow'
import Image, { StaticImageData } from 'next/image'
import LikeIcon from './LikeIcon'
import CommentIcon from './CommentIcon'

type PostDetailsProps = {
  post: {
    id: string
    user_name: string
    avatar: StaticImageData
    type: string
    status: string
    date: string
    likes: number
    comments: number
    content: string
  }
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
          <Image src={post.avatar} alt='Avatar' />

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
                <div className=' flex-1 bg-white rounded-[12px] border '>1</div>
                <div className=' flex-1 bg-white rounded-[12px] border '>1</div>
              
           
                 
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
