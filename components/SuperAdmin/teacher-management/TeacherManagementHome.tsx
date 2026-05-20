'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getTeachersColumns } from '@/components/columns/teachersColumn'
import PlusIcon from '@/components/icons/SuperAdmindashboard/PlusIcon'
import SearchIcon from '@/components/icons/SuperAdmindashboard/SearchIcon'
import DynamicTable from '@/components/reusable/DynamicTable'
import Link from 'next/link'
import Image from 'next/image'
import TrashIcon from '@/components/icons/others/TrashIcon'
import CrossIcon from '@/components/icons/others/CrossIcon'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import warnigImg from '@/public/admin-dashboard/warning-img.png'
import { parseCookies } from 'nookies'
import { UserService } from '@/service/user/user.service'
import { showErrorToast, showSuccessToast } from '@/lib/hotToast'
import { Skeleton } from '@/components/ui/skeleton'
import { TeacherStatus } from './TeacherStatus'
import { TeacherType } from './TeacherType'

type TeacherApiItem = {
  id: string
  name: string
  email: string
  phone_number: string | null
  experience_level: string | null
  status: string | null
  type: string | null
  joined_at: string | null
  created_at: string
  avatar_url?: string | null
}

type TeacherRow = {
  id: string
  teacher_name: string
  email: string
  phone: string
  user_type: string
  joined_date: string
  status: string
  avatar_url?: string | null
}

type SelectedTeacher = {
  id: string
  name: string
}

const mapTeacherRow = (teacher: TeacherApiItem): TeacherRow => ({
  id: teacher.id,
  teacher_name: teacher.name || '-',
  email: teacher.email || '-',
  phone: teacher.phone_number || '-',
  user_type: teacher.type || '-',
  joined_date: teacher.joined_at || teacher.created_at || '',
  status: (teacher.status || '').toLowerCase(),
  avatar_url: teacher.avatar_url || null,
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
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [teachers, setTeachers] = useState<TeacherRow[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<SelectedTeacher | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage, debouncedSearch, status, type])

  const loadTeachers = useCallback(async () => {
      setLoading(true)
      setError('')

      try {
        const cookies = parseCookies()
        const token = cookies.token || cookies.accessToken || ''
        const response = await UserService.getAllInstructors({
          token,
          search: debouncedSearch,
          status: status === 'all' ? '' : status,
          type: type === 'all' ? '' : type,
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
    }, [currentPage, itemsPerPage, debouncedSearch, status, type])

  useEffect(() => {
    loadTeachers()
  }, [loadTeachers])

  const openWarningModal = (teacher: SelectedTeacher) => {
    setSelectedTeacher(teacher)
    setIsWarningOpen(true)
  }

  const handleDeleteUser = useCallback(async () => {
    if (!selectedTeacher?.id) return

    // console.log("selectedTeacher?.id",selectedTeacher?.id);
    

    try {
      const cookies = parseCookies()
      const token = cookies.token || cookies.accessToken || ''
      const response = await UserService.deleteUser({ userId: selectedTeacher.id, token })
    //  console.log("response==========",response);
     
      showSuccessToast(response?.data?.message || 'User deleted successfully')
      setIsWarningOpen(false)
      setSelectedTeacher(null)
      await loadTeachers()
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || err?.message || 'Failed to delete user')
      setIsWarningOpen(false)
      setSelectedTeacher(null)
    }
  }, [selectedTeacher, loadTeachers])

  const onDelete = useCallback((id: string) => {
    const teacher = teachers.find((t) => t.id === id)
    if (teacher) {
      openWarningModal({ id: teacher.id, name: teacher.teacher_name })
    }
  }, [teachers])

  const columns = useMemo(() => getTeachersColumns(onDelete), [onDelete])

  if (loading && teachers.length === 0 && !error) {
    return <TeacherManagementSkeleton />
  }

  return (
    <div>
      <div className=' flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className=' text-2xl text-[#E6E7E8] font-semibold'>Teacher Management</h2>
        <Link
          href="/dashboard/teacher-management/add-teacher"
          className=' p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-xl cursor-pointer'>
          <PlusIcon />
          Add Teacher
        </Link>
      </div>

      <div className=' bg-[#0A1726] p-4 rounded-2xl mt-5 sm:p-6'>
        <div className=' flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <h3 className=' text-white text-xl font-semibold'>Teachers ({totalItems})</h3>
          <div className=' grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:items-center'>
            <div className=' relative w-full sm:col-span-2 lg:w-80'>
              <input
                type="text"
                name="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className=" w-full  py-2 px-4   rounded-xl bg-[#07121d] border border-[#3D4566] placeholder:text-[#4A4C56] text-white"
                placeholder="Search Teacher..."
              />
              <button
                type="button"

                className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
              >
                <SearchIcon />
              </button>
            </div>

            <TeacherStatus value={status} onValueChange={setStatus} />
            <TeacherType value={type} onValueChange={setType} />
          </div>
        </div>
        <div className=' mt-6'>
          <DynamicTable
            columns={columns}
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

      <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
        <DialogContent
          hideCloseButton
          className="w-120 max-w-[95vw] rounded-2xl border-none bg-[#0A1726] p-8 text-white"
        >
          <div className="flex flex-col items-center text-center">
            <Image src={warnigImg} alt="Warning" />
            <h3 className="mt-4 text-xl font-semibold text-white">Delete User?</h3>
            <p className="mt-2 text-sm text-[#B2B5B8]">
              Are you sure you want to delete
              <span className="text-white"> {selectedTeacher?.name}</span>?
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsWarningOpen(false)}
                className="flex items-center gap-2.5 rounded-2xl border border-[#3D4566] px-11 py-4 text-sm font-medium text-white hover:bg-[#5F6CA0]"
              >
                <CrossIcon />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="flex items-center gap-2.5 rounded-2xl bg-[#E9201D] px-11 py-4 text-sm font-medium text-white hover:bg-[#ff3b1f]"
              >
                <TrashIcon />
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
