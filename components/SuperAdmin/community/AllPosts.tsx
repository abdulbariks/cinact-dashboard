"use client"

import CommentIcon from '@/components/icons/Community/CommentIcon'
import FlagIcon from '@/components/icons/Community/FlagIcon'
import LikeIcon from '@/components/icons/Community/LikeIcon'
import TrashIconRed from '@/components/icons/course-management/TrashIconRed'
import EyeIcon from '@/components/icons/SuperAdmindashboard/EyeIcon'
import PaginationPage from '@/components/reusable/PaginationPage'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { allPostsData } from '@/public/demoData/AllPostsData'

type AllPostsProps = {
  search?: string
  selectedRole?: string
  selectedStatus?: string
}

type PostCardItem = {
  id: string
  user_name: string
  avatar: any
  type: string
  status: string
  date: string
  likes: number
  comments: number
  content: string
}
const mapDemoPost = (post: any): PostCardItem => ({
  id: post.id,
  user_name: post.user_name,
  avatar: post.avatar,
  type: String(post.type || 'Student'),
  status: String(post.status || 'Approved'),
  date: String(post.date || '-'),
  likes: Number(post.likes) || 0,
  comments: Number(post.comments) || 0,
  content: String(post.content || '-'),
})


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
    case 'flagged':
      return {
        bg: 'bg-[#1c2213]', // Red background
        text: 'text-[#FFE205]' // Light red text
      }
    case 'rejected':
      return {
        bg: 'bg-[#1c0b13]',
        text: 'text-[#E9201D]'
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

const getNameInitials = (name: string) => {
  const trimmedName = name.trim()
  if (!trimmedName) return 'NA'

  const words = trimmedName.split(/\s+/)

  if (words.length >= 2) {
    return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase()
  }

  return trimmedName.slice(0, 2).toUpperCase()
}

const PostListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className='p-4 border border-[#383e57] rounded-xl bg-[#030C15] flex items-start justify-between animate-pulse'>
          <div className='flex items-start gap-3.5'>
            <div className='size-10 rounded-full bg-[#1b2736]' />

            <div>
              <div className='flex items-center gap-2'>
                <div className='h-5 w-36 rounded bg-[#1b2736]' />
                <div className='h-5 w-16 rounded bg-[#1b2736]' />
                <div className='h-5 w-20 rounded bg-[#1b2736]' />
                <div className='h-4 w-20 rounded bg-[#1b2736]' />
              </div>

              <div className='mt-3 space-y-2'>
                <div className='h-4 w-30 max-w-[75vw] rounded bg-[#1b2736]' />
                <div className='h-4 w-26.25 max-w-[70vw] rounded bg-[#1b2736]' />
              </div>

              <div className='flex items-center gap-6 mt-3'>
                <div className='h-4 w-12 rounded bg-[#1b2736]' />
                <div className='h-4 w-12 rounded bg-[#1b2736]' />
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='size-8 rounded bg-[#1b2736]' />
            <div className='size-8 rounded bg-[#1b2736]' />
            <div className='size-8 rounded bg-[#1b2736]' />
          </div>
        </div>
      ))}
    </>
  )
}


export default function AllPosts({ search = '', selectedRole = 'all-role', selectedStatus = 'all-status' }: AllPostsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({})

  const posts = useMemo(() => allPostsData.map(mapDemoPost), [])

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage, search, selectedRole, selectedStatus])

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const normalizedRole = selectedRole.toLowerCase()
    const normalizedStatus = selectedStatus.toLowerCase()

    return posts.filter((post) => {
      const postType = post.type.toLowerCase()
      const postStatus = post.status.toLowerCase()
      const searchMatch =
        normalizedSearch.length === 0 ||
        post.user_name.toLowerCase().includes(normalizedSearch) ||
        post.content.toLowerCase().includes(normalizedSearch)

      const roleMatch =
        normalizedRole === 'all-role' ||
        (normalizedRole === 'finance' && postType === 'finance') ||
        (normalizedRole === 'student' && postType === 'student') ||
        (normalizedRole === 'admin' && postType === 'admin')

      const statusMatch =
        normalizedStatus === 'all-status' ||
        postStatus === normalizedStatus

      return searchMatch && roleMatch && statusMatch
    })
  }, [posts, search, selectedRole, selectedStatus])

  const totalItems = filteredPosts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  const visiblePosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPosts, currentPage, itemsPerPage])

  return (
    <div className=' space-y-3'>
      <>
        {
          visiblePosts.length > 0 ? visiblePosts.map((post) => (
              <div key={post.id} className='p-4 border border-[#383e57] rounded-xl bg-[#030C15] flex items-start justify-between'>
                <div className=' flex items-start gap-3.5'>
                  <div>
                    {!post.avatar || failedAvatars[post.id] ? (
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
                        onError={() => {
                          setFailedAvatars((prev) => ({ ...prev, [post.id]: true }))
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <div className=' flex items-center gap-2'>
                      <h3 className=' text-base text-[#A5A5AB] font-medium'>{post.user_name}</h3>
                      <p className={` text-sm py-0.5 px-1.5 rounded-lg inline-block ${getTypeBadgeColors(post.type).bg} ${getTypeBadgeColors(post.type).text}`}>{post.type}</p>
                      <p className={` text-sm py-0.5 px-1.5 rounded-lg inline-block ${getStatusBadgeColors(post.status).bg} ${getStatusBadgeColors(post.status).text}`}>{post.status}</p>
                      <p className=' text-sm text-[#777980] py-0.5 px-1.5   inline-block '>{post.date}</p>
                    </div>
                    <p className=' text-[#A5A5AB] text-sm mt-3'>{truncateByWords(post.content, CONTENT_WORD_LIMIT)}</p>
                    <div className=' flex items-center gap-6 mt-3'>
                      <div className=' flex items-center gap-1'>
                        <LikeIcon />
                        <p className=' text-xs text-[#B2B5B8] font-medium'>{post.likes}</p>
                      </div>
                      <div className=' flex items-center gap-1'>
                        <CommentIcon />
                        <p className=' text-xs text-[#B2B5B8] font-medium'>{post.comments}</p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className=' flex items-center gap-2'>
                  <Link href={`/dashboard/community/${post.id}`} className=' cursor-pointer p-1.5 bg-[#0e1825] rounded-lg'>
                    <EyeIcon />
                  </Link>
                  <button className=' cursor-pointer p-2.5 bg-[#0e1825] rounded-lg'>
                    <FlagIcon />
                  </button>
                  <button className=' cursor-pointer p-1.5 bg-[#0e1825] rounded-lg'>
                    <TrashIconRed />
                  </button>
                </div>

              </div>
            )) : (
            <div className='p-4 border border-[#383e57] rounded-xl bg-[#030C15] text-[#A5A5AB]'>No posts found</div>
          )
        }
      </>

      <PaginationPage
        totalPages={totalPages}
        dataLength={totalItems}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  )
}
