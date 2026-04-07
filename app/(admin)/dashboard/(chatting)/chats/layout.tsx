import React from 'react'

import ChatsLayoutShell from '@/components/chats/ChatsLayoutShell'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ChatsLayoutShell>{children}</ChatsLayoutShell>
  )
}
