import React from 'react'
import PostDetails from '@/components/icons/Community/PostDetails'
import { allPostsData } from '@/public/demoData/AllPostsData'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{
    postId: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { postId } = await params
  const post = allPostsData.find((item) => item.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <PostDetails post={post} />
  )
}
