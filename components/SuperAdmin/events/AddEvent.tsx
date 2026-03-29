"use client"

import React, { useState } from 'react'
import BreadCrumpRightArrow from '@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow'
import CalenderIcon2 from '@/components/icons/others/CalenderIcon2'
import Link from 'next/link'

export default function AddEvent() {

  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    time: '',
    location: '',
    amount: '',
    description: '',
  })

  const inputClassName = 'w-full rounded-2xl border border-[#3D4566] px-4 py-3.5 text-white outline-none placeholder:text-[#3D4566] focus:border-[#5F6CA0]'
  const labelClassName = 'mb-2 block text-xs text-[#B2B5B8]'

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div>
      <div className='flex items-center gap-2'>
        <Link href='/dashboard/events' className='text-base text-[#5F6CA0] hover:text-[#8D9CDC]'>
          Event Management
        </Link>
        <BreadCrumpRightArrow />
        <p className='text-base font-medium text-[#8D9CDC]'>Add Event</p>
      </div>

      <div className='bg-[#0a1726] p-8 rounded-2xl max-w-[700px] mx-auto mt-15'>
        <h2 className='text-white text-2xl font-semibold'>Add New Event</h2>

        <form onSubmit={handleSubmit} className='mt-8'>
          <div className='space-y-5'>
            <div>
              <label htmlFor='eventName' className={labelClassName}>Event Name</label>
              <input
                id='eventName'
                name='eventName'
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder='Enter event name'
                className={inputClassName}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <label htmlFor='date' className={labelClassName}>Date</label>
                <div className='relative'>
                  <input
                    id='date'
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`${inputClassName} pr-12 appearance-none scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                  />
                  <CalenderIcon2 className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2' />
                </div>
              </div>

              <div>
                <label htmlFor='time' className={labelClassName}>Time</label>
                <input
                  id='time'
                  type='time'
                  name='time'
                  value={formData.time}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <label htmlFor='location' className={labelClassName}>Location</label>
                <input
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder='Enter location'
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor='amount' className={labelClassName}>Amount</label>
                <input
                  id='amount'
                  type='number'
                  name='amount'
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder='Enter amount'
                  className={inputClassName}
                />
              </div>
            </div>

            <div>
              <label htmlFor='description' className={labelClassName}>Description</label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Write event details'
                rows={5}
                className={`${inputClassName} resize-none`}
              />
            </div>
          </div>

          <div className='mt-10 flex items-center justify-end gap-3'>
            <Link href='/dashboard/events' className='rounded-2xl px-8 py-3.5 text-white transition-colors hover:bg-[#111f31] bg-[#3D4566]'>
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
