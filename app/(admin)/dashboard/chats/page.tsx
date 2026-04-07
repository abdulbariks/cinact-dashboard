import React from 'react'

export default function page() {
  return (
    <section className='hidden min-h-[70vh] items-center justify-center rounded-xl border bg-card p-6 text-center text-card-foreground lg:flex'>
      <div className='max-w-sm'>
        <h2 className='text-lg font-semibold'>Select a conversation</h2>
        <p className='mt-2 text-sm text-muted-foreground'>Choose a user from the list to open the chat area.</p>
      </div>
    </section>
  )
}
