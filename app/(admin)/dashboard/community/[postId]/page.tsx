import React from 'react'
import { notFound } from 'next/navigation'
import PostDetails from '@/components/icons/Community/PostDetails'
import { allPostsData } from '@/public/demoData/AllPostsData'

type PageProps = {
  params: Promise<{
    postId: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { postId } = await params
  const post = allPostsData.find((item) => item.id === postId) || allPostsData[0]

  if (!post) {
    notFound()
  }

  return <PostDetails post={post} />
}


// import React from 'react'

// export default function page() {
//   return (
//     <div>page</div>
//   )
// }

