"use client"

import DropDownIcon from '@/components/icons/others/DropDownIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'

type StudentInformationData = {
  course: string
  studentName: string
  email: string
  address: string
  dateOfBirth: string
  experienceLevel: string
  actingGoalsInterests: string
}

type StudentInformationErrors = Partial<Record<keyof StudentInformationData, string>>

type StudentInformationFormProps = {
  formData: StudentInformationData
  errors: StudentInformationErrors
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleCourseChange: (value: string) => void
  handleExperienceLevelChange: (value: string) => void
  inputClassName: string
  labelClassName: string
  courseOptions: string[]
  experienceOptions: string[]
}

export default function StudentInformationForm({
  formData,
  errors,
  handleInputChange,
  handleCourseChange,
  handleExperienceLevelChange,
  inputClassName,
  labelClassName,
  courseOptions,
  experienceOptions,
}: StudentInformationFormProps) {
  return (
    <div className='mt-6 flex flex-col gap-5'>
      <div>
        <label className={labelClassName}>Select Course</label>
        <Select value={formData.course} onValueChange={handleCourseChange}>
          <SelectTrigger
            icon={<DropDownIcon className='h-4 w-4' />}
            className='w-full rounded-2xl border-[#3D4566] p-6 text-[#3D4566]'
          >
            <SelectValue placeholder='Choose a course' className='placeholder:text-[#3D4566] text-[#3D4566]' />
          </SelectTrigger>
          <SelectContent className='border-[#3D4566] bg-[#07121d] text-white'>
            {courseOptions.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.course && <p className='mt-1 text-xs text-[#ff7a7a]'>{errors.course}</p>}
      </div>

      <div>
        <label htmlFor='studentName' className={labelClassName}>
          Student Name
        </label>
        <input
          id='studentName'
          name='studentName'
          value={formData.studentName}
          onChange={handleInputChange}
          placeholder='Enter student name'
          className={inputClassName}
        />
        {errors.studentName && <p className='mt-1 text-xs text-[#ff7a7a]'>{errors.studentName}</p>}
      </div>

      <div>
        <label htmlFor='email' className={labelClassName}>
          Email
        </label>
        <input
          id='email'
          type='email'
          name='email'
          value={formData.email}
          onChange={handleInputChange}
          placeholder='Enter email'
          className={inputClassName}
        />
        {errors.email && <p className='mt-1 text-xs text-[#ff7a7a]'>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor='address' className={labelClassName}>
          Address
        </label>
        <input
          id='address'
          name='address'
          value={formData.address}
          onChange={handleInputChange}
          placeholder='Enter address'
          className={inputClassName}
        />
        {errors.address && <p className='mt-1 text-xs text-[#ff7a7a]'>{errors.address}</p>}
      </div>

      <div>
        <label htmlFor='dateOfBirth' className={labelClassName}>
          Date of Birth
        </label>
        <input
          id='dateOfBirth'
          type='date'
          name='dateOfBirth'
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          className={inputClassName}
        />
        {errors.dateOfBirth && <p className='mt-1 text-xs text-[#ff7a7a]'>{errors.dateOfBirth}</p>}
      </div>

      <div>
        <label className={labelClassName}>Experience Level</label>
        <Select value={formData.experienceLevel} onValueChange={handleExperienceLevelChange}>
          <SelectTrigger
            icon={<DropDownIcon className='h-4 w-4' />}
            className='w-full rounded-2xl border-[#3D4566] p-6 text-white'
          >
            <SelectValue placeholder='Select experience level' />
          </SelectTrigger>
          <SelectContent className='border-[#3D4566] bg-[#07121d] text-white'>
            {experienceOptions.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.experienceLevel && <p className='mt-1 text-xs text-[#ff7a7a]'>{errors.experienceLevel}</p>}
      </div>

      <div>
        <label htmlFor='actingGoalsInterests' className={labelClassName}>
          Acting Goals / Interests
        </label>
        <textarea
          id='actingGoalsInterests'
          name='actingGoalsInterests'
          value={formData.actingGoalsInterests}
          onChange={handleInputChange}
          rows={4}
          placeholder='Write acting goals or interests'
          className={inputClassName}
        />
        {errors.actingGoalsInterests && (
          <p className='mt-1 text-xs text-[#ff7a7a]'>{errors.actingGoalsInterests}</p>
        )}
      </div>
    </div>
  )
}
