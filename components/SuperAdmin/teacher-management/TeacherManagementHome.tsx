'use client'

import React, { useEffect, useState } from 'react'
import { teachersColumns } from '@/components/columns/teachersColumn'
import PlusIcon from '@/components/icons/SuperAdmindashboard/PlusIcon'
import SearchIcon from '@/components/icons/SuperAdmindashboard/SearchIcon'
import { AllStatus } from '@/components/reusable/AllStatus'
import DynamicTable from '@/components/reusable/DynamicTable'
import Link from 'next/link'
import { parseCookies } from 'nookies'
import { UserService } from '@/service/user/user.service'
import { showErrorToast } from '@/lib/hotToast'
import { Skeleton } from '@/components/ui/skeleton'

type TeacherApiItem = {
  id: string
  name: string
  email: string
  phone_number: string | null
  experience_level: string | null
  status: string | null
  joined_at: string | null
  created_at: string
}

type TeacherRow = {
  id: string
  teacher_name: string
  email: string
  phone: string
  classes: number
  joined_date: string
  status: string
}

const mapTeacherRow = (teacher: TeacherApiItem): TeacherRow => ({
  id: teacher.id,
  teacher_name: teacher.name || '-',
  email: teacher.email || '-',
  phone: teacher.phone_number || '-',
  classes: 0,
  joined_date: teacher.joined_at || teacher.created_at || '',
  status: (teacher.status || '').toLowerCase(),
})

const TeacherManagementSkeleton = () => {
  return (
    <div>
      <div className=' flex items-center justify-between'>
        <Skeleton className='h-8 w-56 bg-[#1d2a3e]' />
        <Skeleton className='h-12 w-36 rounded-xl bg-[#1d2a3e]' />
      </div>

      <div className=' bg-[#0A1726] p-6 rounded-2xl mt-5'>
        <div className=' flex items-center justify-between gap-4'>
          <Skeleton className='h-6 w-40 bg-[#1d2a3e]' />
          <div className=' flex items-center gap-2'>
            <Skeleton className='h-10 w-80 rounded-xl bg-[#1d2a3e]' />
            <Skeleton className='h-10 w-24 rounded-full bg-[#1d2a3e]' />
          </div>
        </div>

        <div className=' mt-6 space-y-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='bg-[#07121d] p-4 rounded-[10px] min-h-14.5'>
              <div className='grid grid-cols-6 gap-4 items-center'>
                <Skeleton className='h-10 w-full rounded-lg bg-[#1d2a3e]' />
                <Skeleton className='h-4 w-full bg-[#1d2a3e]' />
                <Skeleton className='h-4 w-16 bg-[#1d2a3e]' />
                <Skeleton className='h-4 w-24 bg-[#1d2a3e]' />
                <Skeleton className='h-6 w-20 rounded-full bg-[#1d2a3e]' />
                <Skeleton className='h-4 w-20 bg-[#1d2a3e]' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TeacherManagementHome() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [teachers, setTeachers] = useState<TeacherRow[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  useEffect(() => {
    const loadTeachers = async () => {
      setLoading(true)
      setError('')

      try {
        const cookies = parseCookies()
        const token = cookies.token || cookies.accessToken || ''
        const response = await UserService.getAllInstructors({
          token,
          page: currentPage,
          limit: itemsPerPage,
        })

        const teachersData = response?.data?.data || []
        const metaData = response?.data?.meta_data || {}

        setTeachers(teachersData.map(mapTeacherRow))
        setTotalItems(metaData.total ?? teachersData.length)
        setTotalPages(metaData.total_pages ?? Math.ceil((metaData.total ?? teachersData.length) / itemsPerPage))
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load teachers'
        setTeachers([])
        setTotalItems(0)
        setTotalPages(0)
        setError(message)
        showErrorToast(message)
      } finally {
        setLoading(false)
      }
    }

    loadTeachers()
  }, [currentPage, itemsPerPage])

  if (loading) {
    return <TeacherManagementSkeleton />
  }

  return (
    <div>
      <div className=' flex items-center justify-between'>
        <h2 className=' text-2xl text-[#E6E7E8] font-semibold'>Teacher Management</h2>
        <Link
          href="/dashboard/teacher-management/add-teacher"
          className=' p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-xl cursor-pointer'>
          <PlusIcon />
          Add Teacher
        </Link>
      </div>

      <div className=' bg-[#0A1726] p-6 rounded-2xl mt-5'>
        <div className=' flex items-center justify-between'>
          <h3 className=' text-white text-xl font-semibold'>Teachers ({totalItems})</h3>
          <div className=' flex items-center gap-2'>
            <div className=' relative w-80'>
              <input
                type="text"
                name="search"
                // value={search}
                // onChange={handleChange}
                className=" w-full  py-2 px-4   rounded-xl bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                placeholder="Search Teacher..."
              />
              <button

                className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
              >
                <SearchIcon />
              </button>
            </div>

            <AllStatus />
          </div>
        </div>
        <div className=' mt-6'>
          <DynamicTable
            columns={teachersColumns}
            data={teachers}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalpage={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            noDataMessage='No teachers found'
            loading={false}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}
