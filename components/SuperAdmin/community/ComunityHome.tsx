"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import PlusIcon from '../../icons/SuperAdmindashboard/PlusIcon'
import SearchIcon from '../../icons/SuperAdmindashboard/SearchIcon'
import CommunityType from './CommunityType'
import CommunityStatus from './CommunityStatus'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import AllPosts from './AllPosts'
import ModaretionRequest from './ModaretionRequest'

export default function ComunityHome() {
  const [activeTab, setActiveTab] = useState('all-posts')
  const [search, setSearch] = useState('')
  const [communityRole, setCommunityRole] = useState('all-role')
  const [communityStatus, setCommunityStatus] = useState('all-status')

  return (
    <div>

      <div className=' flex items-center justify-between '>
        <h2 className=' text-2xl text-[#E6E7E8] font-semibold'>Community Management</h2>
        <div className=' flex items-center gap-5'>
          <Link
            href="/dashboard/community/view-announcements"
            className=' p-3 bg-[#3d4566] hover:bg-[#3d4566]/90 flex text-white items-center gap-3 rounded-xl cursor-pointer'>


            View Announcements
          </Link>
          <Link
            href="#"
            className=' p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-xl cursor-pointer'>
            <PlusIcon />
            Create Announcement
          </Link>

        </div>
      </div>

      <div className=' bg-[#0a1726] p-6 rounded-2xl mt-5'>
        <Tabs defaultValue='all-posts' value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <div className=' flex items-center justify-between'>
            <TabsList className='inline-flex items-center h-auto rounded-[6px] bg-[#31333e] p-1'>
              <TabsTrigger
                value='all-posts'
                className='px-4 py-2 border-0 shadow-none text-sm font-medium text-[#8D9CDC] data-[state=active]:text-white data-[state=active]:bg-[#505B86] rounded-[6px] cursor-pointer'
              >
                All posts
              </TabsTrigger>
              <TabsTrigger
                value='modaration-request'
                className='px-4 py-2 border-0 shadow-none rounded-[6px] text-sm font-medium text-[#8D9CDC] data-[state=active]:text-white data-[state=active]:bg-[#505B86] cursor-pointer'
              >
                Modaration Request
              </TabsTrigger>
            </TabsList>
            <div className=' flex items-center gap-2'>
              <div className=' relative w-80'>
                <input
                  type="text"
                  name="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className=" w-full  py-2 px-4   rounded-[12px] bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                  placeholder="Search User"
                />
                <button
                  type="button"

                  className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
                >
                  <SearchIcon />
                </button>
              </div>

              <CommunityType value={communityRole} onChange={setCommunityRole} />
              <CommunityStatus value={communityStatus} onChange={setCommunityStatus} />
            </div>
          </div>

          <TabsContent value='all-posts' className='mt-4' >
            <AllPosts
              search={search}
              selectedRole={communityRole}
              selectedStatus={communityStatus}
            />
          </TabsContent>
          <TabsContent value='modaration-request' className='mt-4' >
           <ModaretionRequest />
          </TabsContent>
        </Tabs>
      </div>


    </div>
  )
}
