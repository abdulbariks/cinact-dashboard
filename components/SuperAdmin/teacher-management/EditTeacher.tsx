"use client"

import React, { useState } from 'react'
import BreadCrumpRightArrow from '@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow'
import DropDownIcon from '@/components/icons/others/DropDownIcon'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CalenderIcon2 from '@/components/icons/others/CalenderIcon2'

const courseOptions = ['Beginner Piano Basics', 'Advanced Guitar Performance', 'Kids Violin Essentials', 'Music Theory Foundations']
const experienceOptions = ['Beginner', 'Intermediate', 'Advanced']
const teacherTypeOptions = ['Full Time', 'Part Time', 'Guest Faculty']
const classOptions = ['1', '2', '3', '4', '5', '6', '7', '8']

export default function EditTeacher() {
  const [formData, setFormData] = useState({
    teacherName: 'Albert Flores',
    email: 'albert.flores@musicacademy.com',
    phone: '+1 202-555-0101',
    course: 'Beginner Piano Basics',
    experienceLevel: 'Advanced',
    joinDate: '2025-08-19',
    teacherType: 'Full Time',
    classes: '4',
  })

  const inputClassName = 'w-full rounded-2xl border border-[#3D4566]   px-4 py-3.5 text-white outline-none placeholder:text-[#3D4566] focus:border-[#5F6CA0]'
  const labelClassName = 'mb-2 block text-xs   text-[#B2B5B8]'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div>
      <div className='flex items-center gap-2'>
        <Link href='/dashboard/teacher-management' className='text-base text-[#5F6CA0] hover:text-[#8D9CDC]'>
          Teacher Management
        </Link>
        <BreadCrumpRightArrow />
        <p className='text-base font-medium text-[#8D9CDC]'>Edit Teacher</p>
      </div>

      <div className=' bg-[#0a1726] p-8 rounded-2xl max-w-175 mx-auto mt-25'>
        <h2 className=' text-white text-2xl font-semibold  '>Edit Teacher</h2>

        <form onSubmit={handleSubmit} className='mt-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label htmlFor='teacherName' className={labelClassName}>Teacher Name</label>
              <input
                id='teacherName'
                name='teacherName'
                value={formData.teacherName}
                onChange={handleInputChange}
                placeholder='Enter teacher name'
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor='email' className={labelClassName}>Email</label>
              <input
                id='email'
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Enter email address'
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor='phone' className={labelClassName}>Phone</label>
              <input
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handleInputChange}
                placeholder='Enter phone number'
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>Course</label>
              <Select value={formData.course} onValueChange={handleSelectChange('course')}>
                <SelectTrigger icon={<DropDownIcon className='h-4 w-4' />} className='w-full rounded-2xl border-[#3D4566]  px-4 py-7 text-white'>
                  <SelectValue placeholder='Select course' />
                </SelectTrigger>
                <SelectContent className='border-[#3D4566] bg-[#07121d] text-white'>
                  {courseOptions.map((course) => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={labelClassName}>Experience Level</label>
              <Select value={formData.experienceLevel} onValueChange={handleSelectChange('experienceLevel')}>
                <SelectTrigger icon={<DropDownIcon className='h-4 w-4' />} className='w-full rounded-2xl border-[#3D4566]   px-4 py-7 text-white'>
                  <SelectValue placeholder='Select experience level' />
                </SelectTrigger>
                <SelectContent className='border-[#3D4566] bg-[#07121d] text-white'>
                  {experienceOptions.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor='joinDate' className={labelClassName}>Join Date</label>
              <div className='relative'>
                <input
                  id='joinDate'
                  type='date'
                  name='joinDate'
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className={`${inputClassName} pr-12 appearance-none scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                />
                <CalenderIcon2 className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2' />
              </div>
            </div>

            <div>
              <label className={labelClassName}>Teacher Type</label>
              <Select value={formData.teacherType} onValueChange={handleSelectChange('teacherType')}>
                <SelectTrigger icon={<DropDownIcon className='h-4 w-4' />} className='w-full rounded-2xl border-[#3D4566]   px-4 py-7 text-white'>
                  <SelectValue placeholder='Select teacher type' />
                </SelectTrigger>
                <SelectContent className='border-[#3D4566] bg-[#07121d] text-white'>
                  {teacherTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={labelClassName}>Classes</label>
              <Select value={formData.classes} onValueChange={handleSelectChange('classes')}>
                <SelectTrigger icon={<DropDownIcon className='h-4 w-4' />} className='w-full rounded-2xl border-[#3D4566]   px-4 py-7 text-white'>
                  <SelectValue placeholder='Select classes' />
                </SelectTrigger>
                <SelectContent className='border-[#3D4566] bg-[#07121d] text-white'>
                  {classOptions.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='mt-10 flex items-center justify-end gap-3'>
            <Link href='/dashboard/teacher-management' className='rounded-2xl   px-8 py-3.5 text-white transition-colors hover:bg-[#111f31] bg-[#3D4566]'>
              Cancel
            </Link>
            <button type='submit' className='rounded-2xl bg-[#E9201D] px-8 py-3.5 text-white transition-colors hover:bg-[#d11e1b] cursor-pointer'>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
