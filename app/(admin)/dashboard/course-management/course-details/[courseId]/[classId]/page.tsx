'use client'
import ClassDetails from '@/components/SuperAdmin/course-management/ClassDetails'
import React, { useState } from 'react'
 

export default function page() {
  const [classDetails, setClassDetails] = useState(null)
  
  return (
 <ClassDetails/>
  )
}
