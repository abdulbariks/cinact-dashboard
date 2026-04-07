import React from 'react'
import BreadCrumpRightArrow from '../icons/SuperAdmindashboard/BreadCrumpRightArrow'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { conversations } from './chat-data'

const students = conversations.filter((user) => user.type === 'student')
const teachers = conversations.filter((user) => user.type === 'teacher')

const getAvatarText = (name: string) => {
  return name.replace(/\s+/g, '').slice(0, 2).toUpperCase()
}

export default function NewMessage() {
  return (
    <div>
      <div className='flex items-center gap-2'>
        <Link href='/dashboard/chats' className='text-base text-[#5F6CA0] hover:text-[#8D9CDC]'>
          Chat
        </Link>
        <BreadCrumpRightArrow />
        <p className='text-base font-medium text-[#8D9CDC]'>New Message</p>
      </div>



      <div className=' p-8 bg-[#0a1726] rounded-[16px] max-w-[695px] h-[80vh]  mx-auto mt-10'>
        <h2 className=' text-2xl text-white font-semibold pb-4 border-b border-[#141B34]'>New Message</h2>

        <div className="relative mt-4 mb-5">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#3D4566] ">
            To:
          </span>
          <input className="pl-10  pr-4 py-3.5 w-full border border-[#3D4566] rounded-full placeholder:text-[#8C9196] placeholder:text-sm text-white" type="text" name="" id="" placeholder="Type a user name" />
        </div>

        <Link href='/dashboard/create-group' className='block w-full text-center text-sm text-white font-medium rounded-[12px] bg-[#E9201D] py-4 px-8 cursor-pointer'>Create Group Chat</Link>

        <p className=' text-sm text-[#B2B5B8] my-4'>Suggested</p>

        <Tabs defaultValue='students'  >
          <TabsList className='grid h-auto   grid-cols-2 bg-transparent p-1 gap-1.5'>
            <TabsTrigger
              value='students'
              className='text-sm font-normal text-[#B2B5B8] data-[state=active]:font-medium data-[state=active]:text-white data-[state=active]:bg-[#3d4566] cursor-pointer rounded-full py-1.5 px-4 border border-[#1F283D]'
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value='teachers'
              className='text-sm font-normal text-[#B2B5B8] data-[state=active]:font-medium data-[state=active]:text-white data-[state=active]:bg-[#3d4566] cursor-pointer rounded-full py-1.5 px-4 border border-[#1F283D]'
            >
              Teachers
            </TabsTrigger>
          </TabsList>

          <div className='mt-4 max-h-[40vh] overflow-y-auto pr-1'>
            <TabsContent value='students' className='mt-0'>
              <div className='space-y-4'>
                {students.map((student) => (
                  <button
                    key={student.id}
                    type='button'
                    className='w-full  flex items-center gap-2.5 text-left      py-2 text-sm text-[#E6E7E8] hover:text-white hover:border-[#3d4566] transition-colors cursor-pointer'
                  >
                    <span className='size-9 rounded-full bg-[#1a2336] text-white text-xs font-semibold grid place-items-center'>
                      {getAvatarText(student.name)}
                    </span>
                    <span>{student.name}</span>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='teachers' className='mt-0'>
              <div className='space-y-4'>
                {teachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    type='button'
                    className='w-full  flex items-center gap-2.5 text-left      py-2 text-sm text-[#E6E7E8] hover:text-white hover:border-[#3d4566] transition-colors cursor-pointer'
                  >
                    <span className='size-9 rounded-full bg-[#1a2336] text-white text-xs font-semibold grid place-items-center'>
                      {getAvatarText(teacher.name)}
                    </span>
                    <span>{teacher.name}</span>
                  </button>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

      </div>
    </div>
  )
}
