'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { parseCookies } from 'nookies';

import { studentManagementColumns } from '@/components/columns/studentManagementColumns';
import PlusIcon from '@/components/icons/SuperAdmindashboard/PlusIcon';
import SearchIcon from '@/components/icons/SuperAdmindashboard/SearchIcon';
import DynamicTable from '@/components/reusable/DynamicTable'
import { PaymentTypeFilter } from './PaymentTypeFilter';
import { StudentStatusFilter } from './StudentStatusFilter';
import { UserService } from '@/service/user/user.service';
import { showErrorToast } from '@/lib/hotToast';
import { Skeleton } from '@/components/ui/skeleton';

type StudentApiItem = {
  id: string;
  full_name: string;
  email: string;
  status?: string | null;
  created_at?: string;
  joined_at?: string | null;
  avatar?: string | null;
  user?: {
    avatar?: string | null;
  };
  course?: {
    title?: string | null;
  };
  payment_status?: string | null;
  payment_type?: string | null;
};

type StudentRow = {
  id: string;
  name: string;
  email: string;
  status: string;
  course_name: string;
  join_date: string;
  payment_status: string;
  payment_type: string;
  avatar: string | null;
};

const mapStudentRow = (student: StudentApiItem): StudentRow => ({
  id: student.id,
  name: student.full_name || '-',
  email: student.email || '-',
  status: (student.status || '').toLowerCase(),
  course_name: student.course?.title || '-',
  join_date: student.joined_at || student.created_at || '',
  payment_status: (student.payment_status || '').toLowerCase(),
  payment_type: student.payment_type || '-',
  avatar: student.avatar || student.user?.avatar || null,
});

const StudentManagementSkeleton = () => {
  return (
    <div>
      <div className=' flex items-center justify-between'>
        <Skeleton className='h-8 w-56 bg-[#1d2a3e]' />
        <Skeleton className='h-12 w-36 rounded-xl bg-[#1d2a3e]' />
      </div>

      <div className=' mt-5 p-6  bg-[#0A1726] rounded-2xl'>
        <div className=' flex items-center justify-between mb-6'>
          <Skeleton className='h-6 w-40 bg-[#1d2a3e]' />
          <div className=' flex items-center gap-2'>
            <Skeleton className='h-10 w-80 rounded-xl bg-[#1d2a3e]' />
            <Skeleton className='h-10 w-48 rounded-xl bg-[#1d2a3e]' />
            <Skeleton className='h-10 w-48 rounded-xl bg-[#1d2a3e]' />
          </div>
        </div>

        <div className=' mt-6 space-y-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='bg-[#07121d] p-4 rounded-[10px] min-h-14.5'>
              <div className='grid grid-cols-7 gap-4 items-center'>
                <Skeleton className='h-10 w-full rounded-lg bg-[#1d2a3e]' />
                <Skeleton className='h-6 w-20 rounded-full bg-[#1d2a3e]' />
                <Skeleton className='h-4 w-full bg-[#1d2a3e]' />
                <Skeleton className='h-4 w-24 bg-[#1d2a3e]' />
                <Skeleton className='h-6 w-24 rounded-full bg-[#1d2a3e]' />
                <Skeleton className='h-4 w-20 bg-[#1d2a3e]' />
                <Skeleton className='h-6 w-20 bg-[#1d2a3e]' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function StudentManagementHome() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, search, status, paymentStatus]);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError('');

      try {
        const cookies = parseCookies();
        const token = cookies.token || cookies.accessToken || '';
        const response = await UserService.getAllStudentManagement({
          token,
          search,
          status: status === 'all' ? '' : status,
          paymentStatus: paymentStatus === 'all' ? '' : paymentStatus,
          page: currentPage,
          limit: itemsPerPage,
        });

        const studentsData = response?.data?.data || [];
        const pagination = response?.data?.pagination || {};

        setStudents(studentsData.map(mapStudentRow));
        setTotalItems(pagination.total ?? studentsData.length);
        setTotalPages(pagination.totalPages ?? Math.ceil((pagination.total ?? studentsData.length) / itemsPerPage));
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load students';
        setStudents([]);
        setTotalItems(0);
        setTotalPages(0);
        setError(message);
        showErrorToast(message);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [currentPage, itemsPerPage, search, status, paymentStatus]);

  if (loading) {
    return <StudentManagementSkeleton />;
  }

  return (
    <div>

    <div className=' flex items-center justify-between'>
      <h2 className=' text-2xl text-[#E6E7E8] font-semibold'>Student Management</h2>
      <Link 
        href="/dashboard/student-management/add-student"
        className=' p-3 bg-[#E9201D] hover:bg-[#e9201d]/90 flex text-white items-center gap-3 rounded-xl cursor-pointer'>
        <PlusIcon/>
        Add Student
      </Link>
    </div>
    
<div className=' mt-5 p-6  bg-[#0A1726] rounded-2xl'>
  <div className=' flex items-center justify-between mb-6'>
    <h3 className=' text-white text-xl font-semibold'>All Students ({totalItems})</h3>
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
       
        className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
      >
    <SearchIcon/>
      </button>
      </div>
      <PaymentTypeFilter value={paymentStatus} onValueChange={setPaymentStatus} />
      <StudentStatusFilter value={status} onValueChange={setStatus} />
 
    </div>
  </div>
      <DynamicTable
        columns={studentManagementColumns}
        data={students}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalpage={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        noDataMessage="No students found"
        loading={false}
        error={error}
        
      />

</div>
    </div>
  )
}