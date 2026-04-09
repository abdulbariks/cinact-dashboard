"use client"

import CommentIcon from '@/components/icons/Community/CommentIcon'
import FlagIcon from '@/components/icons/Community/FlagIcon'
import LikeIcon from '@/components/icons/Community/LikeIcon'
import TrashIconRed from '@/components/icons/course-management/TrashIconRed'
import EyeIcon from '@/components/icons/SuperAdmindashboard/EyeIcon'
import PaginationPage from '@/components/reusable/PaginationPage'
import { Skeleton } from '@/components/ui/skeleton'
import { showErrorToast } from '@/lib/hotToast'
import { UserService } from '@/service/user/user.service'

import Image from 'next/image'
import Link from 'next/link'
import { parseCookies } from 'nookies'
import React, { useEffect, useState } from 'react'

type ApiRoleUser = {
  role?: {
    title?: string
    name?: string
  }
}

type ApiPostItem = {
  id: string
  content: string
  status: string
  createdAt: string
  author?: {
    name?: string
    avatar?: string
    role_users?: ApiRoleUser[]
  }
  comments: number
  likes: number
}

type PostCardItem = {
  id: string
  user_name: string
  avatar: string | null
  type: string
  status: string
  date: string
  likes: number
  comments: number
  content: string
}

const ALLOWED_AVATAR_HOSTS = new Set(['192.168.7.12', '192.168.7.14'])

const normalizeAvatarUrl = (avatar?: string) => {
  if (!avatar) return null

  const lastHttpIndex = Math.max(avatar.lastIndexOf('http://'), avatar.lastIndexOf('https://'))
  const candidateUrl = lastHttpIndex > 0 ? avatar.slice(lastHttpIndex) : avatar

  try {
    const parsedUrl = new URL(candidateUrl)

    if (!ALLOWED_AVATAR_HOSTS.has(parsedUrl.hostname)) {
      return null
    }

    return candidateUrl
  } catch {
    return null
  }
}

const formatPostDate = (dateString: string) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '-'

  const diffMs = Date.now() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)

  if (diffSeconds < 60) return 'just now'

  const minutes = Math.floor(diffSeconds / 60)
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`

  const years = Math.floor(months / 12)
  return `${years} year${years > 1 ? 's' : ''} ago`
}

const mapApiPostToCard = (post: ApiPostItem): PostCardItem => ({
  id: post.id,
  user_name: post.author?.name || 'Unknown User',
  avatar: normalizeAvatarUrl(post.author?.avatar),
  type:
    post.author?.role_users?.[0]?.role?.title ||
    post.author?.role_users?.[0]?.role?.name ||
    'Student',
  status: post.status || 'Approved',
  date: formatPostDate(post.createdAt),
  likes: Number(post.likes) || 0,
  comments: Number(post.comments) || 0,
  content: post.content || '-',
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
        <div key={index} className='p-4 border border-[#383e57] rounded-[8px] bg-[#030C15] flex items-start justify-between'>
          <div className='flex items-start gap-3.5'>
            <Skeleton className='size-10 rounded-full bg-[#1b2736]' />

            <div>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-5 w-36 bg-[#1b2736]' />
                <Skeleton className='h-5 w-16 rounded-[4px] bg-[#1b2736]' />
                <Skeleton className='h-5 w-20 rounded-[4px] bg-[#1b2736]' />
                <Skeleton className='h-4 w-20 bg-[#1b2736]' />
              </div>

              <div className='mt-3 space-y-2'>
                <Skeleton className='h-4 w-[480px] max-w-[75vw] bg-[#1b2736]' />
                <Skeleton className='h-4 w-[420px] max-w-[70vw] bg-[#1b2736]' />
              </div>

              <div className='flex items-center gap-6 mt-3'>
                <Skeleton className='h-4 w-12 bg-[#1b2736]' />
                <Skeleton className='h-4 w-12 bg-[#1b2736]' />
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Skeleton className='size-8 rounded-[4px] bg-[#1b2736]' />
            <Skeleton className='size-8 rounded-[4px] bg-[#1b2736]' />
            <Skeleton className='size-8 rounded-[4px] bg-[#1b2736]' />
          </div>
        </div>
      ))}
    </>
  )
}


export default function AllPosts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [posts, setPosts] = useState<PostCardItem[]>([])
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)

      try {
        const cookies = parseCookies()
        const token = cookies.token || cookies.accessToken || ''

        const response = await UserService.getAllCommunityPosts({
          token,
          page: currentPage,
          limit: itemsPerPage,
        })

        const postsData = (response?.data?.data || []) as ApiPostItem[]
        const metaData = response?.data?.meta_data || {}
        const total = Number(metaData.total) || postsData.length

        setPosts(postsData.map(mapApiPostToCard))
        setFailedAvatars({})
        setTotalItems(total)
        setTotalPages(metaData.total_pages || Math.ceil(total / itemsPerPage))
      } catch (error: any) {
        setPosts([])
        setFailedAvatars({})
        setTotalItems(0)
        setTotalPages(0)
        showErrorToast(error?.response?.data?.message || error?.message || 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [currentPage, itemsPerPage])

  return (
    <div className=' space-y-3'>
      {loading ? (
        <PostListSkeleton count={Math.min(itemsPerPage, 5)} />
      ) : (
        <>
          {
            posts.map((post) => (
              <div key={post.id} className='p-4 border border-[#383e57] rounded-[8px] bg-[#030C15] flex items-start justify-between'>
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
                      <p className={` text-sm py-0.5 px-1.5 rounded-[4px] inline-block ${getTypeBadgeColors(post.type).bg} ${getTypeBadgeColors(post.type).text}`}>{post.type}</p>
                      <p className={` text-sm py-0.5 px-1.5 rounded-[4px] inline-block ${getStatusBadgeColors(post.status).bg} ${getStatusBadgeColors(post.status).text}`}>{post.status}</p>
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
                  <Link href={`/dashboard/community/${post.id}`} className=' cursor-pointer p-1.5 bg-[#0e1825] rounded-[4px]'>
                    <EyeIcon />
                  </Link>
                  <button className=' cursor-pointer p-2.5 bg-[#0e1825] rounded-[4px]'>
                    <FlagIcon />
                  </button>
                  <button className=' cursor-pointer p-1.5 bg-[#0e1825] rounded-[4px]'>
                    <TrashIconRed />
                  </button>
                </div>

              </div>
            ))
          }
        </>
      )}

      {!loading && (
        <PaginationPage
          totalPages={totalPages}
          dataLength={posts.length}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      )}
    </div>
  )
}
