import React from 'react'

type ChatsLayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: ChatsLayoutProps) {
  return (
    <div>
        <h1 className=' text-white'>common</h1>
        {children}
        </div>
  )
}
